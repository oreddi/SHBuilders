import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH /api/pm/tasks/[id] — Update a task (status, details, etc.)
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, priority, assignee, dueDate, estimatedHours, actualHours, tags } = body;

    // Get old task for activity logging
    const oldTask = await prisma.task.findUnique({
      where: { id },
      include: { phase: { select: { projectId: true } } },
    });

    if (!oldTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (assignee !== undefined) data.assignee = assignee;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (estimatedHours !== undefined) data.estimatedHours = estimatedHours ? parseFloat(estimatedHours) : null;
    if (actualHours !== undefined) data.actualHours = actualHours ? parseFloat(actualHours) : null;
    if (tags !== undefined) data.tags = tags;

    const task = await prisma.task.update({
      where: { id },
      data,
    });

    // Log status change activity
    if (status && status !== oldTask.status) {
      await prisma.activity.create({
        data: {
          type: 'status_change',
          message: `Task "${oldTask.title}" moved from ${oldTask.status} to ${status}`,
          author: assignee || oldTask.assignee || 'System',
          projectId: oldTask.phase.projectId,
        },
      });
    }

    // Log assignment change
    if (assignee && assignee !== oldTask.assignee) {
      await prisma.activity.create({
        data: {
          type: 'assignment',
          message: `Task "${oldTask.title}" assigned to ${assignee}`,
          author: 'System',
          projectId: oldTask.phase.projectId,
        },
      });
    }

    return NextResponse.json(task);
  } catch (err) {
    console.error('Task PATCH Error:', err);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/pm/tasks/[id] — Delete a task
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { phase: { select: { projectId: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'status_change',
        message: `Task "${task.title}" was deleted`,
        author: 'System',
        projectId: task.phase.projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Task DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
