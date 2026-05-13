import { prisma } from '@/lib/prisma';
import KanbanBoard from '@/components/PM/KanbanBoard';
import Link from 'next/link';
import { ArrowLeft, Settings, Download, Filter } from 'lucide-react';

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      phases: {
        include: {
          tasks: true
        }
      }
    }
  });

  if (!project) return <div>Project not found</div>;

  const allTasks = project.phases.flatMap(p => p.tasks);

  return (
    <div className="pm-container">
      <div className="inner">
        <div style={{ marginBottom: '30px' }}>
          <Link href="/pm" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--grey)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div className="pm-header">
          <div>
            <h1 className="h2" style={{ marginBottom: '5px' }}>{project.name}</h1>
            <p className="body-p">{project.description}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-outline" style={{ padding: '10px 20px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={14} /> Export Report
            </button>
            <button className="btn-outline" style={{ padding: '10px 20px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={14} /> Project Settings
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
          <span style={{ color: 'var(--gold)', fontWeight: 600, borderBottom: '2px solid var(--gold)', paddingBottom: '10px', fontSize: '13px', cursor: 'pointer' }}>Kanban Board</span>
          <span style={{ color: 'var(--grey)', fontSize: '13px', cursor: 'pointer' }}>Schedule (Gantt)</span>
          <span style={{ color: 'var(--grey)', fontSize: '13px', cursor: 'pointer' }}>Materials & Inventory</span>
          <span style={{ color: 'var(--grey)', fontSize: '13px', cursor: 'pointer' }}>Media & Site Photos</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
             <select style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', background: '#fff' }}>
                <option>All Phases</option>
                {project.phases.map(p => <option key={p.id}>{p.name}</option>)}
             </select>
             <button style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '12px', background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={12} /> More Filters
             </button>
          </div>
        </div>

        <KanbanBoard initialTasks={allTasks} />
      </div>
    </div>
  );
}
