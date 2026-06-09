"use client";

import React from 'react';
import { Clock, ArrowRight, User, Package, CheckCircle } from 'lucide-react';

const TYPE_ICONS = {
  status_change: <ArrowRight size={14} />,
  comment: <Clock size={14} />,
  assignment: <User size={14} />,
  material_update: <Package size={14} />,
  phase_update: <CheckCircle size={14} />,
};

const TYPE_COLORS = {
  status_change: '#3B82F6',
  comment: '#64748B',
  assignment: '#8B5CF6',
  material_update: '#F59E0B',
  phase_update: '#22C55E',
};

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '80px 0',
        color: 'var(--grey)',
        fontSize: '14px',
        marginTop: '30px',
      }}>
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {activities.map((activity, idx) => {
          const color = TYPE_COLORS[activity.type] || '#64748B';
          const icon = TYPE_ICONS[activity.type] || <Clock size={14} />;

          return (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px 20px',
                borderBottom: idx < activities.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'background 0.2s',
              }}
            >
              {/* Timeline dot */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                flexShrink: 0,
                marginTop: '2px',
              }}>
                {icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--navy)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {activity.message}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '4px',
                  fontSize: '12px',
                  color: 'var(--grey)',
                }}>
                  {activity.author && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={11} /> {activity.author}
                    </span>
                  )}
                  <span>{timeAgo(activity.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
