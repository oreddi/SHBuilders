import { NextResponse } from 'next/server';
import { getHeroSlides } from '@/lib/content';

export const revalidate = 300;

// GET /api/hero-slides — active hero wallpapers, in order
export async function GET() {
  return NextResponse.json(await getHeroSlides());
}
