"use client";

import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import MaterialsView from './MaterialsView';
import ActivityLog from './ActivityLog';

const TABS = [
  { id: 'kanban', label: 'Kanban Board' },
  { id: 'materials', label: 'Materials & Inventory' },
  { id: 'activity', label: 'Activity Log' },
];

export default function ProjectTabsClient({ projectId, tasks, phases, materials, activities }) {
  const [activeTab, setActiveTab] = useState('kanban');

  return (
    <>
      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '24px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0',
        marginBottom: '0',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
              padding: '12px 4px',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--gold)' : 'var(--grey)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'kanban' && (
        <KanbanBoard
          initialTasks={tasks}
          phases={phases}
          projectId={projectId}
        />
      )}

      {activeTab === 'materials' && (
        <MaterialsView
          materials={materials}
          projectId={projectId}
        />
      )}

      {activeTab === 'activity' && (
        <ActivityLog activities={activities} />
      )}
    </>
  );
}
