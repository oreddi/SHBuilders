import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/pm/projects/[id]/activity — Add a comment to the project's activity log.
// Any signed-in team member can comment (field crews included), not just admins.
export async function POST(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const message = String(body?.message || '').trim().slice(0, 2000);

    if (!message) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        type: 'comment',
        message,
        author: session.user.name || session.user.email || 'Team member',
        projectId: id,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (err) {
    console.error('Activity POST Error:', err);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
