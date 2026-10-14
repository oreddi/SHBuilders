import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/pm/projects — List all projects with phase/task summary
export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const projects = await prisma.project.findMany({
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            tasks: true,
          },
        },
        _count: {
          select: {
            materials: true,
            activities: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error('PM Projects GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/pm/projects — Create a new project with default phases
export async function POST(request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const body = await request.json();
    const { name, description, address, clientName, startDate, targetEnd, budget } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Default construction phases
    const defaultPhases = [
      'Site Preparation',
      'Foundation',
      'Framing',
      'Roofing',
      'MEP (Mechanical, Electrical, Plumbing)',
      'Insulation',
      'Drywall',
      'Finishes',
      'Fixtures',
      'Exterior',
      'Punch List',
      'Closeout',
    ];

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        address: address || null,
        clientName: clientName || null,
        startDate: startDate ? new Date(startDate) : null,
        targetEnd: targetEnd ? new Date(targetEnd) : null,
        budget: budget ? parseFloat(budget) : null,
        phases: {
          create: defaultPhases.map((phaseName, index) => ({
            name: phaseName,
            order: index + 1,
          })),
        },
      },
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
        message: `Project "${name}" was created`,
        author: 'System',
        projectId: project.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('PM Projects POST Error:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
