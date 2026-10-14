import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export const revalidate = 300; // cache Sanity content for 5 minutes

export async function GET() {
  try {
    // First try Sanity
    const properties = await client.fetch(
      `*[_type == "property"] | order(_createdAt desc) {
        _id,
        name,
        "slug": slug.current,
        category,
        mainImage,
        description,
        specs,
        status,
        "galleryCount": count(gallery[defined(asset)])
      }`
    );

    if (properties && properties.length > 0) {
      // Sort properties so that those with images inside their gallery appear first
      const sortedProperties = [...properties].sort((a, b) => {
        const aHasGallery = a.galleryCount > 0 ? 1 : 0;
        const bHasGallery = b.galleryCount > 0 ? 1 : 0;
        return bHasGallery - aHasGallery;
      });

      // Grid thumbnails only — full galleries are loaded per property from /api/portfolio/[slug]
      const formatted = sortedProperties.map(p => ({
        id: p.slug || p._id,
        name: p.name,
        img: p.mainImage && p.mainImage.asset ? urlFor(p.mainImage).width(1200).quality(75).auto('format').url() : '/images/PherinWoodExteriors.jpg',
        cat: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Custom Home',
        description: p.description,
        specs: p.specs,
        status: p.status,
        galleryCount: p.galleryCount || 0,
        source: 'sanity',
      }));

      return NextResponse.json(formatted);
    }

    // Fallback: if Sanity has no properties, return local images
    const AVAILABLE_IMAGES = [
      "/images/PherinWoodExteriors.jpg",
      "/images/Alydar Loop inside.jpg",
      "/images/RidgeField PI Exteriors.jpg",
      "/images/JOHNSONRDW.jpg",
      "/images/PersimmonDrKitchen.jpg"
    ];

    const NAMES = [
      "Pherin Wood Estate", "Alydar Loop", "Ridgefield Place",
      "Johnson Road West", "Persimmon Kitchen"
    ];

    const fallback = AVAILABLE_IMAGES.map((img, i) => ({
      id: `local-${i}`,
      name: NAMES[i] || `Project ${i + 1}`,
      img,
      cat: "Custom Home",
      source: 'local',
    }));

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Portfolio API error:', err);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}
