import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Your Tasks',
  robots: { index: false, follow: false },
};

const STATUS = {
  not_started: { label: 'Not Started', color: '#94A3B8' },
  todo: { label: 'To Do', color: '#64748B' },
  in_progress: { label: 'In Progress', color: '#3B82F6' },
  blocked: { label: 'Blocked', color: '#DC2626' },
  completed: { label: 'Completed', color: '#059669' },
};

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

// Read-only view for a subcontractor: only their tasks on one project, no login.
// The link is the key, so nothing here can be edited and nothing else is shown.
export default async function SubcontractorTasksPage({ params }) {
  const { token } = await params;

  const link = await prisma.subLink.findUnique({
    where: { token },
    include: {
      project: {
        select: {
          name: true,
          address: true,
          phases: {
            orderBy: { order: 'asc' },
            select: {
              name: true,
              tasks: {
                orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
                select: { id: true, title: true, description: true, status: true, priority: true, dueDate: true, assignee: true },
              },
            },
          },
        },
      },
    },
  });

  if (!link || link.revoked) notFound();

  const name = link.assignee.trim().toLowerCase();
  const phases = link.project.phases
    .map(p => ({ ...p, tasks: p.tasks.filter(t => (t.assignee || '').trim().toLowerCase() === name) }))
    .filter(p => p.tasks.length);
  const open = phases.flatMap(p => p.tasks).filter(t => t.status !== 'completed').length;
  const now = new Date();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--stone)', padding: '40px 16px 60px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '20px', letterSpacing: '4px', color: 'var(--navy)', marginBottom: '28px' }}>SHBUILDERS</p>

        <span className="tag" style={{ marginBottom: '8px' }}>Tasks for {link.assignee}</span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 400, color: 'var(--navy)', margin: '0 0 6px' }}>
          {link.project.name}
        </h1>
        {link.project.address && <p style={{ fontSize: '14px', color: 'var(--grey)', margin: 0 }}>📍 {link.project.address}</p>}
        <p style={{ fontSize: '14px', color: 'var(--grey)', margin: '14px 0 28px' }}>
          {open} open task{open === 1 ? '' : 's'} · read-only · ask the SH Builders office for changes
        </p>

        {phases.length === 0 && (
          <p style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', fontSize: '14px', color: 'var(--grey)' }}>
            No tasks are assigned to you on this project yet.
          </p>
        )}

        {phases.map(phase => (
          <section key={phase.name} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--grey)', fontWeight: 700, margin: '0 0 10px' }}>
              {phase.name}
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {phase.tasks.map(t => {
                const s = STATUS[t.status] || STATUS.todo;
                const overdue = t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < now;
                return (
                  <div key={t.id} style={{ background: '#fff', border: '1px solid var(--border)', borderLeft: `3px solid ${s.color}`, borderRadius: '6px', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{t.title}</h3>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: s.color }}>{s.label}</span>
                    </div>
                    {t.description && <p style={{ fontSize: '14px', color: 'var(--grey)', lineHeight: 1.6, margin: '8px 0 0' }}>{t.description}</p>}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '13px', color: 'var(--grey)', flexWrap: 'wrap' }}>
                      {t.dueDate && (
                        <span style={{ color: overdue ? '#DC2626' : undefined, fontWeight: overdue ? 600 : 400 }}>
                          Due {formatDate(t.dueDate)}{overdue ? ' (overdue)' : ''}
                        </span>
                      )}
                      <span style={{ textTransform: 'capitalize' }}>{t.priority} priority</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
