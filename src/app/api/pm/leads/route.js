import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/pm/leads — website inquiries, newest first (admins only)
export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
    return NextResponse.json(leads);
  } catch (err) {
    console.error('Leads GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
