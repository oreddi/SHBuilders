import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const ROLES = ['ADMIN', 'VIEWER'];
const userSelect = { id: true, name: true, email: true, role: true };

// PATCH /api/pm/users/[id] — Change role, name, or reset password
export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const data = {};

    if (body.name !== undefined) data.name = String(body.name).trim() || null;
    if (body.role !== undefined) {
      if (!ROLES.includes(body.role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      if (id === session.user.id && body.role !== 'ADMIN') {
        return NextResponse.json({ error: "You can't remove your own admin access" }, { status: 400 });
      }
      data.role = body.role;
    }
    if (body.password !== undefined) {
      if (String(body.password).length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      data.password = await bcrypt.hash(String(body.password), 12);
    }

    const user = await prisma.user.update({ where: { id }, data, select: userSelect });
    return NextResponse.json(user);
  } catch (err) {
    console.error('User PATCH Error:', err);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/pm/users/[id] — Remove a team member
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json({ error: "You can't delete your own account" }, { status: 400 });
    }
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('User DELETE Error:', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
