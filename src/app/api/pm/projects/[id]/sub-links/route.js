import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/pm/projects/[id]/sub-links — List subcontractor links for a project
export async function GET(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const links = await prisma.subLink.findMany({
      where: { projectId: id, revoked: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(links);
  } catch (err) {
    console.error('SubLinks GET Error:', err);
    return NextResponse.json({ error: 'Failed to load links' }, { status: 500 });
  }
}

// POST /api/pm/projects/[id]/sub-links — Create a read-only link for one assignee
export async function POST(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const assignee = String(body?.assignee || '').trim().slice(0, 200);
    if (!assignee) {
      return NextResponse.json({ error: 'Choose who the link is for' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const link = await prisma.subLink.create({
      data: {
        token: randomBytes(24).toString('base64url'),
        assignee,
        projectId: id,
      },
    });

    await prisma.activity.create({
      data: {
        type: 'assignment',
        message: `Read-only task link created for ${assignee}`,
        author: session.user.name || session.user.email || 'System',
        projectId: id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error('SubLinks POST Error:', err);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
