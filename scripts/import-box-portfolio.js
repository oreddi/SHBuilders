/**
 * SH Builders — Box.com to Sanity Media Importer (Optimized + Parallel)
 * 
 * This script:
 * 1. Queries Sanity to fetch all existing Property documents.
 * 2. Scrapes the main Box shared folder to get all subfolders.
 * 3. Scrapes the files (images and videos) within each subfolder.
 * 4. Groups files by project (mapping multiple photo shoots to a single property).
 * 5. Downloads files from Box in parallel (concurrency of 5), resizes/compresses images using sharp, and uploads them to Sanity CDN.
 * 6. Creates new properties or updates existing properties with mainImage, gallery, and video reference.
 * 
 * Run: node --env-file=.env.local scripts/import-box-portfolio.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const sharp = require('sharp');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ─── Initialize Sanity Client ─────────────────────
const client = createClient({
  projectId: 'qncbl47a',
  dataset: 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ─── Box Scraper Helpers ──────────────────────────
function fetchFromBox(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (boxRes) => {
      let data = '';
      boxRes.on('data', (chunk) => { data += chunk; });
      boxRes.on('end', () => resolve(data));
    }).on('error', (err) => reject(err));
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
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

async function optimizeImage(buffer) {
  try {
    return await sharp(buffer)
      .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 95, progressive: true })
      .toBuffer();
  } catch (err) {
    console.log(` [Optimize error: ${err.message}, using original]`);
    return buffer;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatFolderTitle(folderName) {
  let name = folderName.trim();
  
  // Standardize abbreviations
  name = name
    .replace(/\bwildwood ave\b/gi, 'Wildwood Avenue')
    .replace(/\bpersimmon dr\b/gi, 'Persimmon Drive')
    .replace(/\bjohnson rd w\b/gi, 'Johnson Road West')
    .replace(/\bjohnson rd\b/gi, 'Johnson Road')
    .replace(/\bisabel way w\b/gi, 'Isabel Way Residence')
    .replace(/\bisabel way\b/gi, 'Isabel Way')
    .replace(/\bridgefield pl\b/gi, 'Ridgefield Place')
    .replace(/\bell creek ct e\b/gi, 'Bell Creek Court East')
    .replace(/\beastwood dr\b/gi, 'Eastwood Drive')
    .replace(/\bpark ave\b/gi, 'Park Avenue')
    .replace(/\bct\b/gi, 'Court')
    .replace(/\bblvd\b/gi, 'Boulevard');

  // Title case formatting
  return name
    .split(/\s+/)
    .map(word => {
      const lower = word.toLowerCase();
      if (lower === 'and' || lower === 'or' || lower === 'of' || lower === 'with') return lower;
      if (/^\d/.test(word)) return word; // Keep numeric prefixes intact (e.g. 8095)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function selectBestCover(imageFiles) {
  if (imageFiles.length === 0) return null;
  // Look for files containing exterior, outside, front, facade, aerial, ext, out in their name
  const keywords = ['exterior', 'outside', 'front', 'facade', 'aerial', 'ext', 'out', 'driveway'];
  for (const keyword of keywords) {
    const found = imageFiles.find(f => f.name.toLowerCase().includes(keyword));
    if (found) {
      console.log(`   ✨ Found candidate cover image by keyword "${keyword}": ${found.name}`);
      return found;
    }
  }
  return imageFiles[0];
}

async function run() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  Box.com → Sanity Portfolio Importer (Opt)   ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN is missing. Make sure .env.local is configured.');
    process.exit(1);
  }

  // 1. Fetch current Sanity properties
  console.log('🔍 Fetching current properties from Sanity...');
  const sanityProperties = await client.fetch(`*[_type == "property"] {
    _id,
    name,
    "slug": slug.current,
    mainImage,
    gallery
  }`);
  console.log(`   Found ${sanityProperties.length} existing properties in Sanity.\n`);

  // 2. Fetch main Box folders (Paginated)
  const folders = [];
  const regex = /Box\.postStreamData = (\{.*?\});/s;
  console.log('📦 Scraping Box main folder index across multiple pages...');
  
  for (let page = 1; page <= 5; page++) {
    const mainFolderUrl = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a?page=${page}`;
    const mainData = await fetchFromBox(mainFolderUrl);
    const match = mainData.match(regex);
    
    if (match) {
      const payload = JSON.parse(match[1]);
      const items = payload['/app-api/enduserapp/shared-folder']?.items || [];
      const pageFolders = items.filter(i => i.type === 'folder');
      if (pageFolders.length === 0) break;
      folders.push(...pageFolders);
      console.log(`   Page ${page}: Found ${pageFolders.length} folders.`);
    }
  }
  
  console.log(`   Total subfolders found across all pages: ${folders.length}\n`);

  // 3. Scrape and Group Files by Project
  const projectGroups = {};

  console.log('📂 Fetching file listings from subfolders (this may take a few seconds)...');
  for (const folder of folders) {
    process.stdout.write(`   - Listing files in: "${folder.name}"...`);
    const subFolderUrl = `https://app.box.com/s/9shlu6n0hhs5qnwq4gk767x6p25uzh0a/folder/${folder.id}`;
    
    try {
      const subData = await fetchFromBox(subFolderUrl);
      const subMatch = subData.match(regex);
      if (!subMatch) {
        console.log(' [Skip: Could not parse]');
        continue;
      }
      
      const subPayload = JSON.parse(subMatch[1]);
      const files = subPayload['/app-api/enduserapp/shared-folder']?.items || [];
      console.log(` [Found ${files.length} items]`);

      const groupKey = folder.id; // Treat each Box folder as its own project
      const cleanName = formatFolderTitle(folder.name);

      if (!projectGroups[groupKey]) {
        projectGroups[groupKey] = {
          targetName: cleanName,
          files: [],
        };
      }

      for (const f of files) {
        if (f.type === 'file') {
          projectGroups[groupKey].files.push(f);
        }
      }
    } catch (err) {
      console.log(` [Error: ${err.message}]`);
    }
  }

  console.log('\n🗂️  Grouping completed. Project structure:');
  for (const key in projectGroups) {
    const p = projectGroups[key];
    console.log(`   🏠 "${p.targetName}": ${p.files.length} files`);
  }
  console.log('');

  // 4. Migrate media and save properties
  for (const key in projectGroups) {
    const group = projectGroups[key];
    const cleanName = group.targetName;
    const files = group.files;

    console.log(`╔══════════════════════════════════════════════════`);
    console.log(`║ Processing Project: "${cleanName}"`);
    console.log(`╚══════════════════════════════════════════════════`);

    // Match with existing property by slug
    let matchedProperty = null;
    const slugStr = slugify(cleanName);
    
    for (const p of sanityProperties) {
      if (p.slug === slugStr) {
        matchedProperty = p;
        break;
      }
    }

    if (matchedProperty) {
      console.log(`   Matched existing Sanity property: "${matchedProperty.name}" (ID: ${matchedProperty._id})`);
      
      // If gallery is already populated (e.g. Unbridled Loop), skip to avoid duplicates unless empty
      if (matchedProperty.gallery && matchedProperty.gallery.length > 0) {
        console.log(`   ⏭️ Skipping: Gallery is already populated (${matchedProperty.gallery.length} images).\n`);
        continue;
      }
    } else {
      console.log(`   🆕 No match found. A new property document will be created.`);
    }

    if (files.length === 0) {
      console.log(`   ⚠️ No files in Box. Skipping.\n`);
      continue;
    }

    // Separate images and videos
    let imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name)); // No limit
    const videoFiles = files.filter(f => /\.(mov|mp4|m4v|avi)$/i.test(f.name));

    // Rearrange images to prioritize the best cover image at index 0
    const bestCoverFile = selectBestCover(imageFiles);
    if (bestCoverFile) {
      const bestIdx = imageFiles.indexOf(bestCoverFile);
      if (bestIdx > 0) {
        imageFiles.splice(bestIdx, 1);
        imageFiles.unshift(bestCoverFile);
      }
    }

    console.log(`   Found ${imageFiles.length} images and ${videoFiles.length} videos to upload.`);

    const uploadedImageRefs = new Array(imageFiles.length);
    let uploadedVideoRef = null;

    // 4a. Upload images in parallel chunks
    const concurrency = 5;
    const chunks = [];
    for (let i = 0; i < imageFiles.length; i += concurrency) {
      chunks.push(imageFiles.slice(i, i + concurrency));
    }

    for (let c = 0; c < chunks.length; c++) {
      const chunk = chunks[c];
      await Promise.all(chunk.map(async (file, idx) => {
        const index = c * concurrency + idx;
        const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_${file.id}`;
        
        try {
          console.log(`   📤 [${index+1}/${imageFiles.length}] Downloading: ${file.name}...`);
          let buffer = await downloadFile(downloadUrl);
          
          const beforeSize = (buffer.length / (1024 * 1024)).toFixed(2);
          buffer = await optimizeImage(buffer);
          const afterSize = (buffer.length / (1024 * 1024)).toFixed(2);
          
          const asset = await client.assets.upload('image', buffer, {
            filename: file.name,
            contentType: 'image/jpeg',
          });
          
          uploadedImageRefs[index] = {
            _key: `img_${file.id}_${Date.now()}_${index}`,
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            }
          };
          console.log(`   ✅ [${index+1}/${imageFiles.length}] Uploaded: ${file.name} (${beforeSize}MB -> ${afterSize}MB)`);
        } catch (err) {
          console.log(`   ❌ [${index+1}/${imageFiles.length}] Failed: ${file.name} - ${err.message}`);
        }
      }));
    }

    // Filter out failed uploads
    const finalImageRefs = uploadedImageRefs.filter(Boolean);

    // 4b. Upload video (take first video)
    if (videoFiles.length > 0) {
      const videoFile = videoFiles[0];
      const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=9shlu6n0hhs5qnwq4gk767x6p25uzh0a&file_id=f_${videoFile.id}`;
      
      try {
        console.log(`   📹 Downloading Walkthrough Video: ${videoFile.name}...`);
        const buffer = await downloadFile(downloadUrl);
        
        console.log(`   📤 Uploading Walkthrough Video: ${videoFile.name}...`);
        const asset = await client.assets.upload('file', buffer, {
          filename: videoFile.name,
          contentType: videoFile.name.endsWith('.mov') ? 'video/quicktime' : 'video/mp4',
        });
        
        uploadedVideoRef = {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          }
        };
        console.log(`   ✅ Video Uploaded: ${videoFile.name} (${asset._id})`);
      } catch (err) {
        console.log(`   ❌ Video Upload Failed: ${videoFile.name} - ${err.message}`);
      }
    }

    // 4c. Update/Create Property Document
    if (finalImageRefs.length === 0) {
      console.log(`   ❌ Failed to upload any images. Skipping document save.\n`);
      continue;
    }

    const mainImageRef = {
      _type: 'image',
      asset: finalImageRefs[0].asset
    };
    
    // Gallery is the rest of the uploaded images
    const galleryRefs = finalImageRefs.slice(1);

    try {
      if (matchedProperty) {
        // Update existing property
        const patches = {
          gallery: galleryRefs,
        };
        
        // Only overwrite/set mainImage if it is not already set in Sanity
        if (!matchedProperty.mainImage) {
          patches.mainImage = mainImageRef;
          console.log(`   📤 Setting mainImage (cover photo) for: "${matchedProperty.name}"`);
        } else {
          console.log(`   ℹ️ Preserving existing premium mainImage (cover photo) for: "${matchedProperty.name}"`);
        }

        if (uploadedVideoRef) {
          patches.video = uploadedVideoRef;
        }

        await client.patch(matchedProperty._id).set(patches).commit();
        console.log(`   🎉 Successfully updated Sanity property: "${matchedProperty.name}"\n`);
      } else {
        // Create new property
        const slugStr = slugify(cleanName);
        const newDoc = {
          _type: 'property',
          name: cleanName,
          slug: { _type: 'slug', current: slugStr },
          category: 'transitional', // default style
          status: 'completed',
          description: `A stunning custom home construction by SH Builders on ${cleanName}. Showcasing exceptional craftsmanship and attention to detail.`,
          specs: {
            sqft: 3500,
            beds: 4,
            baths: 3.5,
            year: 2025,
            location: 'Chattanooga, TN',
          },
          mainImage: mainImageRef,
          gallery: galleryRefs,
          seoTitle: `${cleanName} | SH Builders Custom Home`,
          seoDescription: `Take a digital walkthrough of the ${cleanName} custom residence constructed by SH Builders.`,
        };

        if (uploadedVideoRef) {
          newDoc.video = uploadedVideoRef;
        }

        const created = await client.create(newDoc);
        console.log(`   🎉 Successfully created new Sanity property: "${cleanName}" (${created._id})\n`);
      }
    } catch (err) {
      console.error(`   ❌ Error saving document: ${err.message}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════');
  console.log('🎉 Portfolio Import complete!');
}

run().catch(console.error);
