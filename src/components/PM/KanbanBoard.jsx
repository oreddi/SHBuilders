"use client";

import { motion } from 'framer-motion';
import { MoreVertical, Plus, Clock, AlertCircle } from 'lucide-react';

const statusColumns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'completed', title: 'Completed' },
];

export default function KanbanBoard({ initialTasks }) {
  // In a real app, we'd use state and update the database via server actions
  const tasksByStatus = statusColumns.map(col => ({
    ...col,
    tasks: initialTasks.filter(t => t.status === col.id)
  }));

  return (
    <div className="kanban-board">
      {tasksByStatus.map(column => (
        <div key={column.id} className="kanban-column">
          <div className="column-header">
            <h4 className="column-title">{column.title}</h4>
            <span style={{ fontSize: '12px', opacity: 0.5 }}>{column.tasks.length}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {column.tasks.map((task, idx) => (
              <motion.div 
                key={task.id} 
                className="task-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h5 className="task-title">{task.title}</h5>
                  <MoreVertical size={14} style={{ cursor: 'pointer', opacity: 0.4 }} />
                </div>
                
                {task.description && (
                  <p style={{ fontSize: '12px', color: 'var(--grey)', lineHeight: 1.4 }}>
                    {task.description}
                  </p>
                )}

                <div className="task-meta">
                  <span className={`priority-tag ${task.priority}`}>
                    {task.priority}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6 }}>
                    <Clock size={12} />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <button style={{ 
              background: 'transparent', 
              border: '1px dashed var(--border)', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--grey)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
