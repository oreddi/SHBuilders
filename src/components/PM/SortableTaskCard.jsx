"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GripVertical, User } from 'lucide-react';

export default function SortableTaskCard({ task, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      onClick={onEdit}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h5 className="task-title">{task.title}</h5>
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', padding: '2px', opacity: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>
      </div>

      {task.description && (
        <p style={{ fontSize: '12px', color: 'var(--grey)', lineHeight: 1.4 }}>
          {task.description.length > 80
            ? task.description.substring(0, 80) + '...'
            : task.description}
        </p>
      )}

      <div className="task-meta">
        <span className={`priority-tag ${task.priority}`}>
          {task.priority}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {task.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6 }}>
              <User size={11} />
              <span style={{ fontSize: '11px' }}>{task.assignee}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6 }}>
            <Clock size={11} />
            <span style={{ fontSize: '11px' }}>
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'No date'}
            </span>
          </div>
        </div>
      </div>

      {task.tags && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {task.tags.split(',').map((tag, i) => (
            <span key={i} style={{
              fontSize: '10px',
              padding: '2px 8px',
              background: 'var(--stone)',
              borderRadius: '4px',
              color: 'var(--grey)',
              fontWeight: 500,
            }}>
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
