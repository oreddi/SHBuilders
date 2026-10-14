import { NextResponse } from 'next/server';
import { getTestimonials } from '@/lib/content';

export const revalidate = 300;

// GET /api/testimonials — published testimonials
export async function GET() {
  return NextResponse.json(await getTestimonials());
}
