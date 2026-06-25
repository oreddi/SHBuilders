require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qncbl47a',
  dataset: 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  console.log('🧹 Starting Sanity Cleanup...');

  // 1. Delete all properties
  console.log('Fetching properties...');
  const properties = await client.fetch(`*[_type == "property"]._id`);
  console.log(`Found ${properties.length} properties to delete.`);
  
  for (const id of properties) {
    await client.delete(id);
    console.log(`Deleted property: ${id}`);
  }

  // 2. Delete all image assets
  console.log('\nFetching image assets...');
  const images = await client.fetch(`*[_type == "sanity.imageAsset"]._id`);
  console.log(`Found ${images.length} images to delete.`);
  
  // Delete in chunks to avoid rate limits
  const concurrency = 10;
  for (let i = 0; i < images.length; i += concurrency) {
    const chunk = images.slice(i, i + concurrency);
    await Promise.all(chunk.map(id => client.delete(id).then(() => {
        console.log(`Deleted image: ${id}`);
    }).catch(err => {
        console.log(`Failed to delete ${id}: ${err.message}`);
    })));
  }

  console.log('✅ Cleanup complete! Sanity is now fresh and ready for high-quality upload.');
}

run().catch(console.error);
