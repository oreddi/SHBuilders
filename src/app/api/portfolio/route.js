import { NextResponse } from 'next/server';
import { getPortfolio } from '@/lib/content';

export const revalidate = 300;

// GET /api/portfolio — all portfolio properties (grid data)
export async function GET() {
  return NextResponse.json(await getPortfolio());
}
