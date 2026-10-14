import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const ROLES = ['ADMIN', 'VIEWER'];
const userSelect = { id: true, name: true, email: true, role: true };

// GET /api/pm/users — List team members (admins only)
export async function GET() {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const users = await prisma.user.findMany({ select: userSelect, orderBy: { email: 'asc' } });
    return NextResponse.json(users);
  } catch (err) {
    console.error('Users GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/pm/users — Add a team member
export async function POST(request) {
  const session = await auth();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  if (session.user.role !== 'ADMIN') return new NextResponse("Forbidden: Admins only", { status: 403 });

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = ROLES.includes(body.role) ? body.role : 'VIEWER';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { name: name || null, email, role, password: await bcrypt.hash(password, 12) },
      select: userSelect,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error('Users POST Error:', err);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
