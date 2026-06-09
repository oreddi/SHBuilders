import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export async function GET() {
  try {
    // The exact 5 properties the user wants featured on the homepage (ordered list of slugs)
    const featuredSlugs = [
      '23964-unbridled-loop',
      '24253-alydar-loop',
      '1011-wildwood-avenue',
      '30293-persimmon-drive',
      '6001-ridgefield-place-exteriors-and-video'
    ];

    const properties = await client.fetch(
      `*[_type == "property" && slug.current in $slugs] {
        _id,
        name,
        "slug": slug.current,
        category,
        mainImage
      }`,
      { slugs: featuredSlugs }
    );

    if (properties && properties.length > 0) {
      // Sort them in the exact order of the slugs array
      const sortedProperties = properties.sort((a, b) => {
        return featuredSlugs.indexOf(a.slug) - featuredSlugs.indexOf(b.slug);
      });

      const formatted = sortedProperties.map(p => ({
        id: p.slug || p._id,
        name: p.name,
        img: p.mainImage && p.mainImage.asset ? urlFor(p.mainImage).width(1600).quality(85).url() : '/images/placeholder.jpg',
        cat: p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Custom Home',
      }));

      return NextResponse.json(formatted);
    }

    // Fallback: If Sanity fails or is empty, return local images
    const AVAILABLE_IMAGES = [
      "/images/PherinWoodExteriors.jpg",
      "/images/IsabelWayWOutside (1).jpg",
      "/images/Wildwood Ave.jpg",
      "/images/Alydar Loop inside.jpg",
      "/images/WildwoodAveraInside.jpg"
    ];

    const NAMES = [
      "23964 Unbridled Loop", "24253 Alydar Loop", "1011 Wildwood Avenue",
      "30293 Persimmon Drive", "6001 Ridgefield Place"
    ];

    const SLUGS = [
      "23964-unbridled-loop", "24253-alydar-loop", "1011-wildwood-avenue",
      "30293-persimmon-drive", "6001-ridgefield-place-exteriors-and-video"
    ];

    const fallback = AVAILABLE_IMAGES.map((img, i) => ({
      id: SLUGS[i],
      name: NAMES[i],
      img,
      cat: "Custom Home",
    }));

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Projects API error:', err);
    return NextResponse.json({ error: 'Failed to fetch featured projects' }, { status: 500 });
  }
}
