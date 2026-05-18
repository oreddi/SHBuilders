import { prisma } from '@/lib/prisma';
import ProjectCard from '@/components/PM/ProjectCard';

export default async function PMDashboard() {
  const projects = await prisma.project.findMany({
    include: {
      phases: {
        include: {
          tasks: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return (
    <div className="pm-container">
      <div className="inner">
        <div className="pm-header">
          <div>
            <span className="tag">Construction Dashboard</span>
            <h1 className="h2" style={{ marginBottom: '10px' }}>Active Builds</h1>
            <p className="body-p">Tracking craftsmanship across the project lifecycle.</p>
          </div>
          <button className="btn-outline" style={{ padding: '12px 30px' }}>+ New Project</button>
        </div>

        <div className="pm-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}

          {projects.length === 0 && (
            <p className="body-p" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
              No active projects found. Create one to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
