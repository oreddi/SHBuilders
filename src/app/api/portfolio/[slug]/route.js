import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    // Try Sanity first — match by slug or _id
    const property = await client.fetch(
      `*[_type == "property" && (slug.current == $slug || _id == $slug)][0] {
        _id,
        name,
        "slug": slug.current,
        category,
        mainImage,
        description,
        specs,
        status,
        seoTitle,
        seoDescription,
        gallery,
        "videoUrl": video.asset->url
      }`,
      { slug }
    );

    if (property) {
      // Build gallery images array (mainImage + gallery)
      const images = [];

      if (property.mainImage && property.mainImage.asset) {
        images.push({
          img: urlFor(property.mainImage).width(1600).quality(85).url(),
          name: property.name,
        });
      }

      if (property.gallery) {
        property.gallery.forEach((g, i) => {
          if (g && g.asset) {
            images.push({
              img: urlFor(g).width(1600).quality(85).url(),
              name: `${property.name} — View ${i + 2}`,
            });
          }
        });
      }

      return NextResponse.json({
        id: property.slug || property._id,
        name: property.name,
        category: property.category,
        description: property.description,
        specs: property.specs || {},
        status: property.status,
        seoTitle: property.seoTitle,
        seoDescription: property.seoDescription,
        images,
        videoUrl: property.videoUrl || null,
        source: 'sanity',
      });
    }

    // Fallback: not found
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  } catch (err) {
    console.error('Property detail API error:', err);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
