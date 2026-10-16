"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { CheckSquare, Layout, Plus, Search, Building2, Users, LogOut, Inbox } from 'lucide-react';
import NewProjectModal from '@/components/PM/NewProjectModal';

export default function PMDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/pm/projects');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="pm-container">
      <div className="inner">
        {/* Header */}
        <div className="pm-header">
          <div>
            <span className="tag">Construction Dashboard</span>
            <h1 className="h2" style={{ marginBottom: '10px' }}>Active Builds</h1>
            <p className="body-p" style={{ margin: 0 }}>Tracking craftsmanship across the project lifecycle.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link
              href="/pm/leads"
              className="btn-outline"
              style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Inbox size={16} /> Leads
            </Link>
            <Link
              href="/pm/team"
              className="btn-outline"
              style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Users size={16} /> Team
            </Link>
            <button
              className="btn-outline"
              style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut size={16} /> Log out
            </button>
            <button
              className="btn-outline"
              style={{ padding: '12px 30px', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '30px',
          padding: '20px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Building2 size={16} color="var(--gold)" />
            <strong>{projects.length}</strong> Total Projects
          </div>
          <div style={{ fontSize: '13px', color: 'var(--grey)' }}>
            <strong style={{ color: '#3B82F6' }}>{activeCount}</strong> Active
          </div>
          <div style={{ fontSize: '13px', color: 'var(--grey)' }}>
            <strong style={{ color: '#22C55E' }}>{completedCount}</strong> Completed
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--grey)' }} />
            <input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          {['all', 'active', 'completed', 'archived'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 18px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: filter === f ? 'var(--navy)' : '#fff',
                color: filter === f ? '#fff' : 'var(--grey)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'var(--serif)', fontSize: '20px', color: 'var(--grey)' }}>
            Loading projects...
          </div>
        ) : (
          <div className="pm-grid">
            {filteredProjects.map((project, idx) => {
              const totalTasks = project.phases?.reduce((acc, phase) => acc + (phase.tasks?.length || 0), 0) || 0;
              const completedTasks = project.phases?.reduce((acc, phase) =>
                acc + (phase.tasks?.filter(t => t.status === 'completed').length || 0), 0) || 0;
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/pm/${project.id}`} className="pm-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="pm-project-name">{project.name}</h3>
                      <span className={`status-badge ${project.status}`}>{project.status}</span>
                    </div>
                    <p className="pm-project-desc">{project.description}</p>
                    {project.address && (
                      <p style={{ fontSize: '12px', color: 'var(--grey)', margin: 0 }}>📍 {project.address}</p>
                    )}
                    <div className="pm-stats">
                      <div className="pm-stat">
                        <CheckSquare size={16} />
                        <span>{completedTasks}/{totalTasks} Tasks</span>
                      </div>
                      <div className="pm-stat">
                        <Layout size={16} />
                        <span>{project.phases?.length || 0} Phases</span>
                      </div>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="progress-text">{progress}% Complete</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {filteredProjects.length === 0 && !loading && (
              <p className="body-p" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
                {search ? 'No projects match your search.' : 'No projects found. Create one to get started.'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {showModal && (
          <NewProjectModal
            onClose={() => setShowModal(false)}
            onCreated={(newProject) => {
              setProjects(prev => [newProject, ...prev]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
