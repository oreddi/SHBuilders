import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const STATUSES = ['new', 'contacted', 'qualified', 'closed'];

// PATCH /api/pm/leads/[id] — update a lead's status
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    const lead = await prisma.lead.update({ where: { id }, data: { status } });
    return NextResponse.json(lead);
  } catch (err) {
    console.error('Lead PATCH Error:', err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
