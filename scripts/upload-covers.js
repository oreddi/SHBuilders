require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'qncbl47a',
  dataset: 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  console.log('Uploading Hero Slides from local...');
  
  // Clean old hero slides first
  const oldSlides = await client.fetch('*[_type == "heroSlide"]._id');
  for (const id of oldSlides) {
    await client.delete(id);
    console.log('Deleted old hero slide:', id);
  }

  const covers = [
    { file: 'IsabelWayWOutside (1).jpg', title: 'Custom Build' },
    { file: 'WildwoodAveraInside.jpg', title: 'Luxury Interior' },
    { file: '8095Vane,Inside.jpg', title: 'Refined Living' }
  ];

  let order = 1;
  for (const cover of covers) {
    const filePath = path.join(__dirname, '../public/images', cover.file);
    if (!fs.existsSync(filePath)) {
      console.log('Could not find', filePath);
      continue;
    }
    const buffer = fs.readFileSync(filePath);
    
    // Upload image at full original resolution to Sanity
    console.log(`Uploading ${cover.file}...`);
    const asset = await client.assets.upload('image', buffer, {
      filename: cover.file,
      contentType: 'image/jpeg',
    });

    // Create heroSlide doc
    const newDoc = {
      _type: 'heroSlide',
      title: cover.title,
      order: order++,
      active: true,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        }
      }
    };

    const created = await client.create(newDoc);
    console.log(`Created Hero Slide: ${cover.title} (${created._id})`);
  }

  console.log('Hero slides created successfully!');
}

run().catch(console.error);
