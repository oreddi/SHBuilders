import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pm/projects/[id] — Get single project with all relations
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        materials: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error('PM Project GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PATCH /api/pm/projects/[id] — Update project details
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, status, address, clientName, startDate, targetEnd, budget } = body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;
    if (address !== undefined) data.address = address;
    if (clientName !== undefined) data.clientName = clientName;
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (targetEnd !== undefined) data.targetEnd = targetEnd ? new Date(targetEnd) : null;
    if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null;

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: { tasks: true },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'status_change',
        message: `Project updated: ${Object.keys(data).join(', ')}`,
        author: 'System',
        projectId: id,
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error('PM Project PATCH Error:', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/pm/projects/[id] — Delete project and all related data
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PM Project DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
