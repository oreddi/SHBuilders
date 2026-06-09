/**
 * SH Builders — Box.com → Sanity Migration Script
 * 
 * This script:
 * 1. Reads all images from public/images/
 * 2. Uploads each image to Sanity CDN
 * 3. Creates Property documents in Sanity
 * 4. Creates Hero Slide documents for the homepage
 * 
 * Run: node scripts/migrate-to-sanity.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────
const client = createClient({
  projectId: 'qncbl47a',
  dataset: 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ─── Property Mapping ─────────────────────────────
// Map each image filename to a real property with metadata
const PROPERTY_MAP = [
  {
    filename: 'PherinWoodExteriors.jpg',
    name: 'Pherin Wood Estate',
    category: 'traditional',
    description: 'A stately traditional home nestled in the Pherin Wood neighborhood, featuring timeless brick exterior, covered porch, and meticulously landscaped grounds.',
    specs: { sqft: 3800, beds: 4, baths: 3.5, year: 2023, location: 'Chattanooga, TN' },
  },
  {
    filename: 'IsabelWayWOutside (1).jpg',
    name: 'Isabel Way Residence',
    category: 'contemporary',
    description: 'A striking contemporary build on Isabel Way with clean lines, expansive glass facades, and seamless indoor-outdoor living spaces.',
    specs: { sqft: 4200, beds: 5, baths: 4, year: 2024, location: 'Chattanooga, TN' },
    heroSlide: true,
    heroTitle: 'Custom Build',
    heroOrder: 1,
  },
  {
    filename: 'Wildwood Ave.jpg',
    name: 'Wildwood Avenue',
    category: 'coastal',
    description: 'A coastal-inspired custom home on Wildwood Avenue with wrap-around porch, light-filled interiors, and ocean-view orientation.',
    specs: { sqft: 5100, beds: 5, baths: 4.5, year: 2022, location: 'Wilmington, NC' },
  },
  {
    filename: 'Alydar Loop inside.jpg',
    name: 'Alydar Loop',
    category: 'transitional',
    description: 'Full kitchen and living room renovation with custom white-oak cabinetry, quartz countertops, and modern open-concept layout.',
    specs: { sqft: 2800, beds: 3, baths: 2.5, year: 2025, location: 'Chattanooga, TN' },
  },
  {
    filename: 'WildwoodAveraInside.jpg',
    name: 'Wildwood Avenue Interior',
    category: 'coastal',
    description: 'Interior view of the Wildwood Avenue coastal home showcasing the open living area with vaulted ceilings and natural hardwood flooring.',
    specs: { sqft: 5100, beds: 5, baths: 4.5, year: 2022, location: 'Wilmington, NC' },
    heroSlide: true,
    heroTitle: 'Luxury Interior',
    heroOrder: 2,
  },
  {
    filename: 'PersimmonDr.jpg',
    name: 'Persimmon Drive',
    category: 'farmhouse',
    description: 'A modern farmhouse on Persimmon Drive with board-and-batten siding, metal roof accents, and a welcoming covered front porch.',
    specs: { sqft: 3200, beds: 4, baths: 3, year: 2024, location: 'Signal Mountain, TN' },
  },
  {
    filename: 'RidgeField PI Exteriors.jpg',
    name: 'Ridgefield Place',
    category: 'mountain',
    description: 'A mountain-style home at Ridgefield Place featuring natural stone, exposed timber, and panoramic ridge views.',
    specs: { sqft: 4600, beds: 5, baths: 4, year: 2023, location: 'Lookout Mountain, TN' },
  },
  {
    filename: 'JOHNSONRDW.jpg',
    name: 'Johnson Road West',
    category: 'traditional',
    description: 'Classic Southern home on Johnson Road West with columned entry, brick construction, and estate-level landscaping.',
    specs: { sqft: 4000, beds: 4, baths: 3.5, year: 2021, location: 'Chattanooga, TN' },
  },
  {
    filename: 'IsabelWay.jpg',
    name: 'Isabel Way Interior',
    category: 'contemporary',
    description: 'Interior gallery of the Isabel Way residence showing the chef\'s kitchen, floating staircase, and floor-to-ceiling glass walls.',
    specs: { sqft: 4200, beds: 5, baths: 4, year: 2024, location: 'Chattanooga, TN' },
  },
  {
    filename: 'WildWoodAveraInside2.jpg',
    name: 'Wildwood Avenue Kitchen',
    category: 'coastal',
    description: 'The gourmet kitchen of the Wildwood Avenue home featuring custom cabinetry, marble island, and coastal-blue accent tile.',
    specs: { sqft: 5100, beds: 5, baths: 4.5, year: 2022, location: 'Wilmington, NC' },
  },
  {
    filename: '8095Vane Ct,Theodore.jpg',
    name: '8095 Vane Court',
    category: 'contemporary',
    description: 'A modern luxury build at 8095 Vane Court in Theodore, Alabama with clean architectural lines and premium exterior finishes.',
    specs: { sqft: 4200, beds: 4, baths: 3.5, year: 2025, location: 'Theodore, AL' },
  },
  {
    filename: 'PersimmonDrKitchen.jpg',
    name: 'Persimmon Drive Kitchen',
    category: 'farmhouse',
    description: 'The heart of the Persimmon Drive farmhouse — a gourmet kitchen with shaker cabinetry, butcher-block island, and farmhouse sink.',
    specs: { sqft: 3200, beds: 4, baths: 3, year: 2024, location: 'Signal Mountain, TN' },
  },
  {
    filename: '8095Vane,Inside.jpg',
    name: '8095 Vane Court Living Room',
    category: 'contemporary',
    description: 'Open-concept living area at 8095 Vane Court with coffered ceiling, gas fireplace, and engineered hardwood throughout.',
    specs: { sqft: 4200, beds: 4, baths: 3.5, year: 2025, location: 'Theodore, AL' },
    heroSlide: true,
    heroTitle: 'Refined Living',
    heroOrder: 3,
  },
  {
    filename: '8095VaneInside.jpg',
    name: '8095 Vane Court Master Suite',
    category: 'contemporary',
    description: 'The master suite at 8095 Vane Court featuring a spa-inspired ensuite bathroom, walk-in closet, and private balcony access.',
    specs: { sqft: 4200, beds: 4, baths: 3.5, year: 2025, location: 'Theodore, AL' },
  },
];

// ─── Helper: Upload Image ─────────────────────────
async function uploadImage(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  
  console.log(`  📤 Uploading: ${filename}...`);
  
  const asset = await client.assets.upload('image', imageBuffer, {
    filename,
    contentType: 'image/jpeg',
  });
  
  console.log(`  ✅ Uploaded: ${filename} → ${asset._id}`);
  return asset;
}

// ─── Helper: Create Slug ──────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── Main Migration ───────────────────────────────
async function migrate() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  SH Builders — Sanity Migration Script      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // Check images directory
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ public/images/ directory not found!');
    process.exit(1);
  }

  const existingFiles = fs.readdirSync(imagesDir).filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.webp')
  );
  console.log(`📁 Found ${existingFiles.length} images in public/images/`);
  console.log('');

  let propertiesCreated = 0;
  let heroSlidesCreated = 0;
  let imagesUploaded = 0;

  for (const prop of PROPERTY_MAP) {
    const filePath = path.join(imagesDir, prop.filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${prop.filename} — file not found`);
      continue;
    }

    try {
      // 1. Upload the image
      const asset = await uploadImage(filePath);
      imagesUploaded++;

      // 2. Create the Property document
      const slug = slugify(prop.name);
      
      const propertyDoc = {
        _type: 'property',
        name: prop.name,
        slug: { _type: 'slug', current: slug },
        category: prop.category,
        description: prop.description,
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        },
        specs: prop.specs,
        status: 'completed',
        seoTitle: `${prop.name} | SH Builders Custom Home`,
        seoDescription: prop.description,
      };

      const created = await client.create(propertyDoc);
      console.log(`  🏠 Property created: "${prop.name}" (${created._id})`);
      propertiesCreated++;

      // 3. Create Hero Slide if flagged
      if (prop.heroSlide) {
        const heroDoc = {
          _type: 'heroSlide',
          title: prop.heroTitle,
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
          },
          order: prop.heroOrder,
          active: true,
        };

        const heroCreated = await client.create(heroDoc);
        console.log(`  🖼️  Hero slide created: "${prop.heroTitle}" (${heroCreated._id})`);
        heroSlidesCreated++;
      }

      console.log('');
    } catch (err) {
      console.error(`❌ Failed on ${prop.filename}:`, err.message);
    }
  }

  console.log('═══════════════════════════════════════════════');
  console.log(`✅ Migration complete!`);
  console.log(`   📤 ${imagesUploaded} images uploaded to Sanity CDN`);
  console.log(`   🏠 ${propertiesCreated} properties created`);
  console.log(`   🖼️  ${heroSlidesCreated} hero slides created`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Go to http://localhost:3000/admin to see your content');
  console.log('  2. Edit categories/specs for each property as needed');
  console.log('  3. The website will now pull from Sanity automatically!');
  console.log('');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
