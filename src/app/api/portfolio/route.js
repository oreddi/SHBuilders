import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

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
        gallery
      }`
    );

    if (properties && properties.length > 0) {
      // Sort properties so that those with images inside their gallery appear first
      const sortedProperties = [...properties].sort((a, b) => {
        const aHasGallery = (a.gallery && a.gallery.filter(g => g && g.asset).length > 0) ? 1 : 0;
        const bHasGallery = (b.gallery && b.gallery.filter(g => g && g.asset).length > 0) ? 1 : 0;
        return bHasGallery - aHasGallery;
      });

      const formatted = sortedProperties.map(p => ({
        id: p.slug || p._id,
        name: p.name,
        img: p.mainImage && p.mainImage.asset ? urlFor(p.mainImage).width(800).quality(80).url() : '/images/placeholder.jpg',
        cat: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Custom Home',
        description: p.description,
        specs: p.specs,
        status: p.status,
        gallery: p.gallery ? p.gallery.filter(g => g && g.asset).map(g => ({
          img: urlFor(g).width(1600).quality(85).url(),
          name: p.name,
        })) : [],
        source: 'sanity',
      }));

      return NextResponse.json(formatted);
    }

    // Fallback: if Sanity has no properties, return local images
    const AVAILABLE_IMAGES = [
      "/images/PherinWoodExteriors.jpg",
      "/images/IsabelWayWOutside (1).jpg",
      "/images/Wildwood Ave.jpg",
      "/images/Alydar Loop inside.jpg",
      "/images/WildwoodAveraInside.jpg",
      "/images/PersimmonDr.jpg",
      "/images/RidgeField PI Exteriors.jpg",
      "/images/JOHNSONRDW.jpg",
      "/images/IsabelWay.jpg",
      "/images/WildWoodAveraInside2.jpg",
      "/images/8095Vane Ct,Theodore.jpg",
      "/images/PersimmonDrKitchen.jpg",
      "/images/8095Vane,Inside.jpg",
      "/images/8095VaneInside.jpg"
    ];

    const NAMES = [
      "Pherin Wood Estate", "Isabel Way Residence", "Wildwood Avenue",
      "Alydar Loop", "Wildwood Interior", "Persimmon Drive",
      "Ridgefield Place", "Johnson Road West", "Isabel Way Interior",
      "Wildwood Kitchen", "8095 Vane Court", "Persimmon Kitchen",
      "8095 Vane Living Room", "8095 Vane Master Suite"
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
