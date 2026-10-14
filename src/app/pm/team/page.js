"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, UserPlus, KeyRound } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  fontSize: '14px',
  fontFamily: 'inherit',
  background: '#fff',
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' };

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'VIEWER' });

  const loadUsers = async () => {
    const res = await fetch('/api/pm/users');
    if (res.status === 403) {
      setForbidden(true);
    } else if (res.ok) {
      setUsers(await res.json());
    } else {
      setError('Could not load team members.');
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  const request = async (url, options, successMessage) => {
    setError('');
    setNotice('');
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.');
      return false;
    }
    setNotice(successMessage);
    await loadUsers();
    return true;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await request('/api/pm/users', { method: 'POST', body: JSON.stringify(form) }, `${form.email} can now log in.`);
    if (ok) setForm({ name: '', email: '', password: '', role: 'VIEWER' });
    setSaving(false);
  };

  const changeRole = (user, role) =>
    request(`/api/pm/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ role }) }, `${user.email} is now ${role === 'ADMIN' ? 'an Admin' : 'a Viewer'}.`);

  const resetPassword = (user) => {
    const password = window.prompt(`New password for ${user.email} (at least 8 characters):`);
    if (!password) return;
    request(`/api/pm/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ password }) }, `Password updated for ${user.email}.`);
  };

  const removeUser = (user) => {
    if (!window.confirm(`Remove ${user.email}? They will no longer be able to log in.`)) return;
    request(`/api/pm/users/${user.id}`, { method: 'DELETE' }, `${user.email} was removed.`);
  };

  return (
    <div className="pm-container">
      <div className="inner" style={{ maxWidth: '900px' }}>
        <Link href="/pm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '20px', color: 'var(--grey)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="pm-header">
          <div>
            <span className="tag">Team Access</span>
            <h1 className="h2" style={{ marginBottom: '10px' }}>Team Members</h1>
            <p className="body-p" style={{ margin: 0 }}>
              Admins can create and edit everything. Viewers can see projects but not change them.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="body-p">Loading team...</p>
        ) : forbidden ? (
          <p className="body-p">Only admins can manage team members.</p>
        ) : (
          <>
            {(error || notice) && (
              <p role="alert" style={{ fontSize: '14px', color: error ? '#DC2626' : '#059669', margin: '0 0 20px' }}>
                {error || notice}
              </p>
            )}

            <form onSubmit={handleAdd} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '32px', background: '#fff' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} /> Add a team member
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@shbuilders.com" />
                </div>
                <div>
                  <label style={labelStyle}>Password * (8+ characters)</label>
                  <input style={inputStyle} type="text" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="VIEWER">Viewer (view only)</option>
                    <option value="ADMIN">Admin (full access)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-outline" disabled={saving} style={{ marginTop: '20px', padding: '10px 24px', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Adding...' : 'Add Member'}
              </button>
            </form>

            {users.length === 0 ? (
              <p className="body-p">No team members yet. Add the first one above.</p>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
                {users.map((user, idx) => (
                  <div key={user.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', padding: '16px 20px', borderTop: idx ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name || user.email}</div>
                      <div style={{ fontSize: '13px', color: 'var(--grey)', overflowWrap: 'anywhere' }}>{user.email}</div>
                    </div>
                    <select value={user.role} onChange={(e) => changeRole(user, e.target.value)} style={{ ...inputStyle, width: 'auto' }} aria-label={`Role for ${user.email}`}>
                      <option value="VIEWER">Viewer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button type="button" onClick={() => resetPassword(user)} title="Reset password" aria-label={`Reset password for ${user.email}`} style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '8px', cursor: 'pointer' }}>
                      <KeyRound size={16} />
                    </button>
                    <button type="button" onClick={() => removeUser(user)} title="Remove" aria-label={`Remove ${user.email}`} style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '6px', padding: '8px', cursor: 'pointer', color: '#DC2626' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
