import { NextResponse } from 'next/server';
import { getProperty } from '@/lib/content';

// GET /api/portfolio/[slug] — one property with gallery, specs and video
export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const property = await getProperty(slug);
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    console.error('Property detail API error:', err);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
