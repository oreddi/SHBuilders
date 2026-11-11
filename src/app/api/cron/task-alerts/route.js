import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DUE_SOON_DAYS = 2;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sh-builders.vercel.app';

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

function taskRows(tasks) {
  return tasks.map((t) => `
    <tr>
      <td style="padding: 10px 12px; border-top: 1px solid #E2E8F0; color: #0F172A;">
        <a href="${SITE_URL}/pm/${t.phase.project.id}" style="color: #0F172A; font-weight: 600; text-decoration: none;">${escapeHtml(t.title)}</a><br />
        <span style="font-size: 12px; color: #64748B;">${escapeHtml(t.phase.project.name)} · ${escapeHtml(t.phase.name)}</span>
      </td>
      <td style="padding: 10px 12px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 13px;">${escapeHtml(t.assignee || 'Unassigned')}</td>
      <td style="padding: 10px 12px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 13px; white-space: nowrap;">${formatDate(t.dueDate)}</td>
    </tr>`).join('');
}

function section(title, color, tasks) {
  if (!tasks.length) return '';
  return `
    <h2 style="font-size: 16px; color: ${color}; margin: 28px 0 8px;">${title} (${tasks.length})</h2>
    <table style="width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #E2E8F0; border-radius: 6px;">
      ${taskRows(tasks)}
    </table>`;
}

// GET /api/cron/task-alerts — daily email of overdue and due-soon tasks.
// Run by Vercel Cron (see vercel.json) with "Authorization: Bearer $CRON_SECRET",
// or by a signed-in admin to test it.
export async function GET(request) {
  const cronOk = process.env.CRON_SECRET && request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;
  if (!cronOk) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    const soon = new Date(now.getTime() + DUE_SOON_DAYS * 86400000);

    const tasks = await prisma.task.findMany({
      where: {
        status: { not: 'completed' },
        dueDate: { not: null, lte: soon },
        phase: { project: { status: 'active' } },
      },
      include: { phase: { select: { name: true, project: { select: { id: true, name: true } } } } },
      orderBy: { dueDate: 'asc' },
    });

    const overdue = tasks.filter((t) => t.dueDate < now);
    const dueSoon = tasks.filter((t) => t.dueDate >= now);

    if (!tasks.length) {
      return NextResponse.json({ sent: false, overdue: 0, dueSoon: 0, reason: 'Nothing due' });
    }

    const recipients = (process.env.ALERT_EMAILS || process.env.CONTACT_EMAIL || 'shbuilderstn@gmail.com')
      .split(',').map((s) => s.trim()).filter(Boolean);

    if (!process.env.RESEND_API_KEY) {
      console.log('Task alerts (RESEND_API_KEY not set):', { overdue: overdue.length, dueSoon: dueSoon.length, recipients });
      return NextResponse.json({ sent: false, overdue: overdue.length, dueSoon: dueSoon.length, reason: 'RESEND_API_KEY not set' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject = [
      overdue.length && `${overdue.length} overdue`,
      dueSoon.length && `${dueSoon.length} due soon`,
    ].filter(Boolean).join(', ');

    const { error } = await resend.emails.send({
      from: 'SH Builders PM <onboarding@resend.dev>',
      to: recipients,
      subject: `Task alerts: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 30px; background: #F8F9FA; border-radius: 8px;">
          <h1 style="color: #0F172A; font-size: 22px; margin: 0 0 6px;">Task alerts</h1>
          <p style="color: #64748B; font-size: 14px; margin: 0;">Open tasks on active builds that are overdue or due in the next ${DUE_SOON_DAYS} days.</p>
          ${section('Overdue', '#DC2626', overdue)}
          ${section('Due soon', '#B45309', dueSoon)}
          <p style="margin-top: 24px;"><a href="${SITE_URL}/pm" style="color: #C5A059;">Open the PM dashboard</a></p>
        </div>
      `,
    });
    if (error) throw new Error(error.message);

    return NextResponse.json({ sent: true, overdue: overdue.length, dueSoon: dueSoon.length, recipients: recipients.length });
  } catch (err) {
    console.error('Task alerts error:', err);
    return NextResponse.json({ error: 'Failed to send task alerts' }, { status: 500 });
  }
}
