import Link from 'next/link';
import { Layout, Calendar, CheckSquare } from 'lucide-react';

export default function ProjectCard({ project }) {
  const totalTasks = project.phases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = project.phases.reduce((acc, phase) => 
    acc + phase.tasks.filter(t => t.status === 'completed').length, 0);
  
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Link href={`/pm/${project.id}`} className="pm-card">
      <div className="pm-card-header">
        <h3 className="pm-project-name">{project.name}</h3>
        <span className={`status-badge ${project.status}`}>{project.status}</span>
      </div>
      
      <p className="pm-project-desc">{project.description}</p>
      
      <div className="pm-stats">
        <div className="pm-stat">
          <CheckSquare size={16} />
          <span>{completedTasks}/{totalTasks} Tasks</span>
        </div>
        <div className="pm-stat">
          <Layout size={16} />
          <span>{project.phases.length} Phases</span>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-text">{progress}% Complete</span>
      </div>
    </Link>
  );
}
