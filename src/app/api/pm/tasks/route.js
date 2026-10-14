import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/pm/tasks — Create a new task
export async function POST(request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const body = await request.json();
    const { title, description, phaseId, priority, assignee, dueDate, estimatedHours, tags } = body;

    if (!title || !phaseId) {
      return NextResponse.json({ error: 'Title and phaseId are required' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        phaseId,
        priority: priority || 'medium',
        assignee: assignee || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
        tags: tags || null,
      },
    });

    // Log activity
    const phase = await prisma.phase.findUnique({
      where: { id: phaseId },
      select: { projectId: true, name: true },
    });
    if (phase) {
      await prisma.activity.create({
        data: {
          type: 'status_change',
          message: `Task "${title}" created in ${phase.name}`,
          author: assignee || 'System',
          projectId: phase.projectId,
        },
      });
    }

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error('Task POST Error:', err);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
