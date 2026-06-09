import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/pm/materials/[id] — Update material (quantity, status, etc.)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name, quantityNeeded, quantityOrdered, quantityOnSite, quantityInstalled,
      status, supplier, expectedDelivery, unitCost, notes
    } = body;

    const oldMaterial = await prisma.material.findUnique({ where: { id } });
    if (!oldMaterial) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (quantityNeeded !== undefined) data.quantityNeeded = parseFloat(quantityNeeded);
    if (quantityOrdered !== undefined) data.quantityOrdered = parseFloat(quantityOrdered);
    if (quantityOnSite !== undefined) data.quantityOnSite = parseFloat(quantityOnSite);
    if (quantityInstalled !== undefined) data.quantityInstalled = parseFloat(quantityInstalled);
    if (status !== undefined) data.status = status;
    if (supplier !== undefined) data.supplier = supplier;
    if (expectedDelivery !== undefined) data.expectedDelivery = expectedDelivery ? new Date(expectedDelivery) : null;
    if (unitCost !== undefined) data.unitCost = unitCost ? parseFloat(unitCost) : null;
    if (notes !== undefined) data.notes = notes;

    const material = await prisma.material.update({
      where: { id },
      data,
    });

    // Log activity if status changed
    if (status && status !== oldMaterial.status) {
      await prisma.activity.create({
        data: {
          type: 'material_update',
          message: `Material "${oldMaterial.name}" status changed: ${oldMaterial.status} → ${status}`,
          author: 'System',
          projectId: oldMaterial.projectId,
        },
      });
    }

    return NextResponse.json(material);
  } catch (err) {
    console.error('Material PATCH Error:', err);
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// DELETE /api/pm/materials/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const material = await prisma.material.findUnique({ where: { id } });
    if (!material) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    await prisma.material.delete({ where: { id } });

    await prisma.activity.create({
      data: {
        type: 'material_update',
        message: `Material "${material.name}" was removed`,
        author: 'System',
        projectId: material.projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Material DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete material' }, { status: 500 });
  }
}
