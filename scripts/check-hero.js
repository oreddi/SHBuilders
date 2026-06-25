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
  const slides = await client.fetch('*[_type == "heroSlide"]');
  console.log('Hero Slides:', slides);
}
run();
