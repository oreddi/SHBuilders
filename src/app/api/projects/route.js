import { NextResponse } from 'next/server';
import { getFeaturedProjects } from '@/lib/content';

export const revalidate = 300;

// GET /api/projects — the featured homepage projects
export async function GET() {
  return NextResponse.json(await getFeaturedProjects());
}
