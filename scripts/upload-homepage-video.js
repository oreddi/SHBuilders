require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const https = require('https');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const videoUrl = "https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_1447495287754";
const tempFilePath = path.join(__dirname, 'temp-video.mp4');

async function downloadVideo(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadVideo(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function uploadToSanity() {
  try {
    console.log('Downloading video...');
    await downloadVideo(videoUrl, tempFilePath);
    console.log('Video downloaded successfully.');

    console.log('Uploading to Sanity...');
    const fileStream = fs.createReadStream(tempFilePath);
    const asset = await client.assets.upload('file', fileStream, {
      filename: 'homepage-video.mp4',
    });
    console.log('Asset uploaded:', asset._id);

    console.log('Creating Sanity document...');
    const doc = {
      _type: 'homepageVideo',
      title: 'Main Homepage Video',
      video: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    };

    const res = await client.create(doc);
    console.log('Document created:', res._id);

    // Clean up
    fs.unlinkSync(tempFilePath);
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

uploadToSanity();
