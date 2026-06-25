"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

export default function TaskModal({ task, phases, defaultPhaseId, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [phaseId, setPhaseId] = useState(task?.phaseId || defaultPhaseId || '');
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours || '');
  const [actualHours, setActualHours] = useState(task?.actualHours || '');
  const [tags, setTags] = useState(task?.tags || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
      assignee: assignee.trim() || null,
      dueDate: dueDate || null,
      phaseId,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
      actualHours: actualHours ? parseFloat(actualHours) : null,
      tags: tags.trim() || null,
    };

    if (task?.id) {
      data.id = task.id;
    }

    await onSave(data);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: '#fff',
    transition: 'border-color 0.2s',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--grey)',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: '#fff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px 0',
        }}>
          <h3 style={{
            fontFamily: 'var(--serif)',
            fontSize: '22px',
            color: 'var(--navy)',
            fontWeight: 400,
          }}>
            {task ? 'Edit Task' : 'New Task'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} color="var(--grey)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Task Title *</label>
              <input
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pour foundation footings"
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, notes, or specs..."
              />
            </div>

            {/* Phase + Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Phase</label>
                <select style={inputStyle} value={phaseId} onChange={(e) => setPhaseId(e.target.value)}>
                  {phases?.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="not_started">Not Started</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority + Assignee Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Priority</label>
                <select style={inputStyle} value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Assignee</label>
                <input
                  style={inputStyle}
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="e.g. John D."
                />
              </div>
            </div>

            {/* Due Date + Hours Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Est. Hours</label>
                <input
                  type="number"
                  step="0.5"
                  style={inputStyle}
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label style={labelStyle}>Actual Hours</label>
                <input
                  type="number"
                  step="0.5"
                  style={inputStyle}
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input
                style={inputStyle}
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. electrical, permit-required, critical-path"
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              {onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <Trash2 size={14} /> Delete Task
                </button>
              ) : (
                <div />
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 24px',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  style={{
                    padding: '10px 28px',
                    background: 'var(--navy)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
