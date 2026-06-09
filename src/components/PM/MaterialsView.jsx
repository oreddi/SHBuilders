"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const STATUS_CONFIG = {
  not_ordered: { label: 'Not Ordered', color: '#94A3B8', bg: '#F1F5F9' },
  quote_requested: { label: 'Quote Requested', color: '#8B5CF6', bg: '#F5F3FF' },
  ordered: { label: 'Ordered', color: '#3B82F6', bg: '#EFF6FF' },
  partially_delivered: { label: 'Partial Delivery', color: '#F59E0B', bg: '#FFFBEB' },
  delivered: { label: 'Delivered', color: '#22C55E', bg: '#F0FDF4' },
  installed: { label: 'Installed', color: '#059669', bg: '#ECFDF5' },
  returned: { label: 'Returned', color: '#EF4444', bg: '#FEF2F2' },
};

export default function MaterialsView({ materials: initialMaterials, projectId }) {
  const [materials, setMaterials] = useState(initialMaterials || []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', quantityNeeded: '', unit: 'pieces', supplier: '', notes: '',
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pm/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectId }),
      });
      if (res.ok) {
        const newMaterial = await res.json();
        setMaterials(prev => [newMaterial, ...prev]);
        setForm({ name: '', quantityNeeded: '', unit: 'pieces', supplier: '', notes: '' });
        setShowForm(false);
      }
    } catch (err) {
      console.error('Failed to create material:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/pm/materials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMaterials(prev => prev.map(m => m.id === id ? { ...updated, createdAt: updated.createdAt, updatedAt: updated.updatedAt } : m));
      }
    } catch (err) {
      console.error('Failed to update material:', err);
    }
  };

  // Summary stats
  const totalItems = materials.length;
  const deliveredCount = materials.filter(m => ['delivered', 'installed'].includes(m.status)).length;
  const pendingCount = materials.filter(m => ['ordered', 'quote_requested'].includes(m.status)).length;

  const inputStyle = {
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Summary Bar */}
      <div style={{
        display: 'flex',
        gap: '30px',
        padding: '20px 24px',
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="var(--navy)" />
          <span style={{ fontSize: '13px' }}><strong>{totalItems}</strong> Items</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} color="#22C55E" />
          <span style={{ fontSize: '13px' }}><strong>{deliveredCount}</strong> Delivered/Installed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} color="#F59E0B" />
          <span style={{ fontSize: '13px' }}><strong>{pendingCount}</strong> Pending</span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-outline"
            style={{ padding: '8px 20px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> Add Material
          </button>
        </div>
      </div>

      {/* Add Material Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              marginBottom: '24px',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '14px', marginBottom: '14px' }}>
              <input
                style={inputStyle}
                placeholder="Material name (e.g., 2x6 SPF Lumber)"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                type="number"
                style={inputStyle}
                placeholder="Quantity"
                value={form.quantityNeeded}
                onChange={(e) => setForm(f => ({ ...f, quantityNeeded: e.target.value }))}
              />
              <select
                style={inputStyle}
                value={form.unit}
                onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
              >
                <option value="pieces">Pieces</option>
                <option value="sqft">Sq Ft</option>
                <option value="linear_ft">Linear Ft</option>
                <option value="cubic_yd">Cubic Yd</option>
                <option value="gallons">Gallons</option>
                <option value="tons">Tons</option>
                <option value="rolls">Rolls</option>
                <option value="boxes">Boxes</option>
              </select>
              <input
                style={inputStyle}
                placeholder="Supplier"
                value={form.supplier}
                onChange={(e) => setForm(f => ({ ...f, supplier: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', background: '#fff' }}>
                Cancel
              </button>
              <button type="submit" style={{
                padding: '10px 24px',
                background: 'var(--navy)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}>
                Add Material
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Materials Table */}
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--stone)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Material</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Needed</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Ordered</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>On Site</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Installed</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Supplier</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--grey)', fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => {
              const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.not_ordered;
              return (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--navy)' }}>{m.name}</td>
                  <td style={{ padding: '14px 16px' }}>{m.quantityNeeded} {m.unit}</td>
                  <td style={{ padding: '14px 16px' }}>{m.quantityOrdered}</td>
                  <td style={{ padding: '14px 16px' }}>{m.quantityOnSite}</td>
                  <td style={{ padding: '14px 16px' }}>{m.quantityInstalled}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--grey)' }}>{m.supplier || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusUpdate(m.id, e.target.value)}
                      style={{
                        background: cfg.bg,
                        color: cfg.color,
                        border: 'none',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {materials.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'var(--grey)' }}>
                  No materials tracked yet. Click "Add Material" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
