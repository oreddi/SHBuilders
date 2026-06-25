require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const https = require('https');

const client = createClient({
  projectId: 'qncbl47a',
  dataset: 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function fetchFromBox(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        downloadFile(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  console.log("Fetching Unbridled Loop folder from Box...");
  
  // Get main folder to find Unbridled Loop subfolder
  const mainFolderUrl = 'https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/136585239866';
  const mainData = await fetchFromBox(mainFolderUrl);
  const match = mainData.match(/Box\.postStreamData = (\{.*?\});/s);
  const payload = JSON.parse(match[1]);
  const folders = payload['/app-api/enduserapp/shared-folder']?.items.filter(i => i.type === 'folder') || [];
  
  const unbridledFolder = folders.find(f => f.name.toLowerCase().includes('unbridled'));
  if (!unbridledFolder) {
    console.error("Could not find Unbridled Loop folder.");
    return;
  }
  
  console.log(`Found folder: ${unbridledFolder.name} (ID: ${unbridledFolder.id})`);
  
  const subFolderUrl = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/${unbridledFolder.id}`;
  const subData = await fetchFromBox(subFolderUrl);
  const subMatch = subData.match(/Box\.postStreamData = (\{.*?\});/s);
  const subPayload = JSON.parse(subMatch[1]);
  const files = subPayload['/app-api/enduserapp/shared-folder']?.items.filter(f => f.type === 'file') || [];
  
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name));
  console.log(`Found ${imageFiles.length} images. We will upload all of them without the 20 limit and without compression.`);
  
  // Find property in Sanity
  const properties = await client.fetch(`*[_type == "property" && slug.current == "23964-unbridled-loop"]`);
  if (properties.length === 0) {
    console.error("Property not found in Sanity");
    return;
  }
  const property = properties[0];
  console.log(`Matched Sanity property: ${property.name}`);
  
  const finalImageRefs = [];
  const concurrency = 3;
  
  for (let i = 0; i < imageFiles.length; i += concurrency) {
    const chunk = imageFiles.slice(i, i + concurrency);
    await Promise.all(chunk.map(async (file, idx) => {
      const index = i + idx;
      const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_${file.id}`;
      try {
        console.log(`[${index+1}/${imageFiles.length}] Downloading: ${file.name}...`);
        const buffer = await downloadFile(downloadUrl);
        
        // NO SHARP COMPRESSION - Uploading original file to keep high clarity as requested
        const asset = await client.assets.upload('image', buffer, {
          filename: file.name,
          contentType: 'image/jpeg',
        });
        
        finalImageRefs[index] = {
          _key: `img_${file.id}_${Date.now()}_${index}`,
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          }
        };
        console.log(`[${index+1}/${imageFiles.length}] ✅ Uploaded original quality: ${file.name}`);
      } catch (err) {
        console.error(`[${index+1}/${imageFiles.length}] ❌ Failed: ${file.name}`, err.message);
      }
    }));
  }
  
  const validRefs = finalImageRefs.filter(Boolean);
  console.log(`Successfully uploaded ${validRefs.length} images. Patching Sanity document...`);
  
  // We keep the mainImage (cover photo) exactly as it is since we already set it to the high-res one
  // We just replace the gallery with all the high-res images
  await client.patch(property._id).set({
    gallery: validRefs
  }).commit();
  
  console.log("✅ Gallery successfully updated with all high-res photos!");
}

run().catch(console.error);
