"use client";

import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, XCircle } from 'lucide-react';

// Office view for read-only subcontractor links: one link per assignee per project.
export default function SubLinksPanel({ projectId, tasks }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const assignees = [...new Set(tasks.map(t => (t.assignee || '').trim()).filter(Boolean))].sort();

  useEffect(() => {
    fetch(`/api/pm/projects/${projectId}/sub-links`)
      .then(async res => {
        if (res.status === 403) throw new Error('Only admins can manage subcontractor links.');
        if (!res.ok) throw new Error('Could not load links.');
        setLinks(await res.json());
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  const linkUrl = (link) => `${window.location.origin}/sub/${link.token}`;

  const createLink = async (e) => {
    e.preventDefault();
    if (!assignee.trim()) return;
    setError('');
    const res = await fetch(`/api/pm/projects/${projectId}/sub-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignee }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || 'Could not create link.');
    setLinks(prev => [data, ...prev]);
    setAssignee('');
  };

  const revoke = async (link) => {
    if (!confirm(`Revoke the link for ${link.assignee}? It will stop working immediately.`)) return;
    const res = await fetch(`/api/pm/sub-links/${link.id}`, { method: 'DELETE' });
    if (!res.ok) return setError('Could not revoke link.');
    setLinks(prev => prev.filter(l => l.id !== link.id));
  };

  const copy = async (link) => {
    try {
      await navigator.clipboard.writeText(linkUrl(link));
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      prompt('Copy this link:', linkUrl(link));
    }
  };

  const inputStyle = { padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', background: '#fff' };

  return (
    <div style={{ marginTop: '30px' }}>
      <p className="body-p" style={{ margin: '0 0 20px', maxWidth: '640px' }}>
        Give a subcontractor a private link that shows only the tasks assigned to them on this project. They can view but not change anything, and no login is needed. Revoke a link to switch it off.
      </p>

      <form onSubmit={createLink} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input
          list="sub-link-assignees"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Assignee name (as used on tasks)"
          aria-label="Assignee name"
          style={{ ...inputStyle, flex: '1 1 260px' }}
        />
        <datalist id="sub-link-assignees">
          {assignees.map(a => <option key={a} value={a} />)}
        </datalist>
        <button type="submit" className="btn-outline" disabled={!assignee.trim()} style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px', opacity: assignee.trim() ? 1 : 0.6 }}>
          <Link2 size={14} /> Create Link
        </button>
      </form>

      {error && <p role="alert" style={{ color: '#DC2626', fontSize: '13px', margin: '0 0 16px' }}>{error}</p>}

      {loading ? (
        <p style={{ fontSize: '14px', color: 'var(--grey)' }}>Loading links...</p>
      ) : links.length === 0 ? (
        <p style={{ fontSize: '14px', color: 'var(--grey)', background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
          No active links for this project.
        </p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          {links.map((link, idx) => {
            const count = tasks.filter(t => (t.assignee || '').trim().toLowerCase() === link.assignee.trim().toLowerCase()).length;
            return (
              <div key={link.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderTop: idx ? '1px solid var(--border)' : 'none', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{link.assignee}</p>
                  <p style={{ fontSize: '12px', color: 'var(--grey)', margin: '2px 0 0' }}>
                    {count} task{count === 1 ? '' : 's'} · created {new Date(link.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button type="button" onClick={() => copy(link)} className="btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {copiedId === link.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
                </button>
                <button type="button" onClick={() => revoke(link)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <XCircle size={14} /> Revoke
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
