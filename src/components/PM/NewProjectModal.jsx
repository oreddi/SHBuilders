"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function NewProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      const res = await fetch('/api/pm/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          address: address.trim() || null,
          clientName: clientName.trim() || null,
        }),
      });

      if (res.ok) {
        const project = await res.json();
        onCreated?.(project);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }

    setSaving(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: '#fff',
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
          maxWidth: '480px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px 0',
        }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '22px', color: 'var(--navy)', fontWeight: 400 }}>
            New Build Project
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="var(--grey)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Project Name *</label>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 123 Hillcrest Dr Custom Build"
                required
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the build..."
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Client Name</label>
                <input
                  style={inputStyle}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. John Smith"
                />
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <input
                  style={inputStyle}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Chattanooga, TN"
                />
              </div>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--grey)', margin: '4px 0 0' }}>
              12 standard construction phases will be created automatically.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 24px', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                Cancel
              </button>
              <button type="submit" disabled={saving || !name.trim()} style={{
                padding: '10px 28px', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
