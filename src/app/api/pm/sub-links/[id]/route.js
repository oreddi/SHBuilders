import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// DELETE /api/pm/sub-links/[id] — Revoke a subcontractor link (it stops working at once)
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const link = await prisma.subLink.update({
      where: { id },
      data: { revoked: true },
    });

    await prisma.activity.create({
      data: {
        type: 'assignment',
        message: `Read-only task link for ${link.assignee} was revoked`,
        author: session.user.name || session.user.email || 'System',
        projectId: link.projectId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SubLink DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to revoke link' }, { status: 500 });
  }
}
