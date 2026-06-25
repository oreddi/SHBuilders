import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await client.fetch(
      `*[_type == "heroSlide" && active == true] | order(order asc) {
        _id,
        title,
        image,
        order
      }`
    );

    const formatted = slides.map(slide => ({
      id: slide._id,
      title: slide.title,
      imageUrl: urlFor(slide.image).width(2400).height(1350).quality(95).format('webp').url(),
      order: slide.order,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error fetching hero slides:', err);
    return NextResponse.json([], { status: 200 });
  }
}
