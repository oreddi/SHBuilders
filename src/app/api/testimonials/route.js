import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET() {
  try {
    const query = `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(_createdAt desc)`;
    const testimonials = await client.fetch(query);
    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("Sanity Testimonials Error:", err);
    return NextResponse.json({ error: 'Error fetching testimonials' }, { status: 500 });
  }
}
