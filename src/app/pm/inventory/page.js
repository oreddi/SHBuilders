import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Same status buckets the per-project Materials tab uses
const GROUPS = [
  {
    id: 'needed',
    title: 'Still Needed',
    hint: 'Not ordered yet, or waiting on a quote',
    statuses: ['not_ordered', 'quote_requested'],
    icon: <Package size={16} />,
    color: '#8B5CF6',
  },
  {
    id: 'pending',
    title: 'Pending Delivery',
    hint: 'Ordered, not fully on site',
    statuses: ['ordered', 'partially_delivered'],
    icon: <Truck size={16} />,
    color: '#3B82F6',
  },
  {
    id: 'onsite',
    title: 'On Site',
    hint: 'Delivered, not installed yet',
    statuses: ['delivered'],
    icon: <CheckCircle size={16} />,
    color: '#22C55E',
  },
];

const STATUS_LABELS = {
  not_ordered: 'Not Ordered',
  quote_requested: 'Quote Requested',
  ordered: 'Ordered',
  partially_delivered: 'Partial Delivery',
  delivered: 'Delivered',
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—');

const th = { padding: '12px 16px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--grey)', fontWeight: 600, textAlign: 'left', whiteSpace: 'nowrap' };
const td = { padding: '12px 16px', fontSize: '14px', color: 'var(--navy)', borderTop: '1px solid var(--border)' };

export default async function InventoryPage() {
  let materials = [];
  try {
    materials = await prisma.material.findMany({
      where: {
        status: { in: GROUPS.flatMap(g => g.statuses) },
        project: { status: { not: 'archived' } },
      },
      include: { project: { select: { id: true, name: true } } },
      orderBy: [{ expectedDelivery: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (err) {
    console.error('Inventory load error:', err);
  }

  const now = new Date();

  return (
    <div className="pm-container">
      <div className="inner">
        <div style={{ marginBottom: '24px' }}>
          <Link href="/pm" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div className="pm-header">
          <div>
            <span className="tag">All Projects</span>
            <h1 className="h2" style={{ marginBottom: '10px' }}>Inventory</h1>
            <p className="body-p" style={{ margin: 0 }}>What is still needed, on its way, and already on site across every active build.</p>
          </div>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', padding: '20px 0', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
          {GROUPS.map(g => (
            <a key={g.id} href={`#${g.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--grey)' }}>
              <span style={{ color: g.color, display: 'flex' }}>{g.icon}</span>
              <strong style={{ color: g.color }}>{materials.filter(m => g.statuses.includes(m.status)).length}</strong> {g.title}
            </a>
          ))}
        </div>

        {GROUPS.map(g => {
          const items = materials.filter(m => g.statuses.includes(m.status));
          return (
            <section key={g.id} id={g.id} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 400, color: 'var(--navy)', margin: 0 }}>{g.title}</h2>
                <span style={{ fontSize: '13px', color: 'var(--grey)' }}>{g.hint}</span>
              </div>

              {items.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--grey)', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
                  Nothing here right now.
                </p>
              ) : (
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                    <thead>
                      <tr>
                        <th style={th}>Material</th>
                        <th style={th}>Project</th>
                        <th style={th}>Needed</th>
                        <th style={th}>Ordered</th>
                        <th style={th}>On Site</th>
                        <th style={th}>Supplier</th>
                        <th style={th}>Expected</th>
                        <th style={th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(m => {
                        const late = g.id === 'pending' && m.expectedDelivery && new Date(m.expectedDelivery) < now;
                        return (
                          <tr key={m.id}>
                            <td style={{ ...td, fontWeight: 600 }}>{m.name}</td>
                            <td style={td}>
                              <Link href={`/pm/${m.project.id}`} style={{ color: 'var(--gold)' }}>{m.project.name}</Link>
                            </td>
                            <td style={td}>{m.quantityNeeded} {m.unit}</td>
                            <td style={td}>{m.quantityOrdered}</td>
                            <td style={td}>{m.quantityOnSite}</td>
                            <td style={td}>{m.supplier || '—'}</td>
                            <td style={{ ...td, color: late ? '#DC2626' : td.color, fontWeight: late ? 600 : 400 }}>
                              {formatDate(m.expectedDelivery)}{late ? ' (late)' : ''}
                            </td>
                            <td style={td}>{STATUS_LABELS[m.status] || m.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
