import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pm/materials?projectId=xxx — List materials (optionally filtered by project)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const where = projectId ? { projectId } : {};

    const materials = await prisma.material.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(materials);
  } catch (err) {
    console.error('Materials GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST /api/pm/materials — Create a new material entry
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, projectId, quantityNeeded, unit, supplier,
      expectedDelivery, unitCost, notes
    } = body;

    if (!name || !projectId || !unit) {
      return NextResponse.json(
        { error: 'Name, projectId, and unit are required' },
        { status: 400 }
      );
    }

    const material = await prisma.material.create({
      data: {
        name,
        projectId,
        quantityNeeded: quantityNeeded ? parseFloat(quantityNeeded) : 0,
        unit,
        supplier: supplier || null,
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        unitCost: unitCost ? parseFloat(unitCost) : null,
        notes: notes || null,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'material_update',
        message: `Material "${name}" added (${quantityNeeded || 0} ${unit})`,
        author: 'System',
        projectId,
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (err) {
    console.error('Materials POST Error:', err);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}
