"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

const STATUSES = [
  { id: 'new', label: 'New', color: '#3B82F6' },
  { id: 'contacted', label: 'Contacted', color: '#F59E0B' },
  { id: 'qualified', label: 'Qualified', color: '#059669' },
  { id: 'closed', label: 'Closed', color: '#94A3B8' },
];

const formatDate = (d) =>
  new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadLeads = async () => {
    const res = await fetch('/api/pm/leads');
    if (res.status === 403) setForbidden(true);
    else if (res.ok) setLeads(await res.json());
    else setError('Could not load leads.');
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeads();
  }, []);

  const setStatus = async (lead, status) => {
    setError('');
    const res = await fetch(`/api/pm/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setLeads((all) => all.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    else setError('Could not update the lead. Please try again.');
  };

  const shown = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="pm-container">
      <div className="inner" style={{ maxWidth: '1000px' }}>
        <Link href="/pm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '20px', color: 'var(--grey)' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="pm-header">
          <div>
            <span className="tag">Website Inquiries</span>
            <h1 className="h2" style={{ marginBottom: '10px' }}>Leads</h1>
            <p className="body-p" style={{ margin: 0 }}>Every contact form and property inquiry from the website, saved even if the email goes to spam.</p>
          </div>
        </div>

        {loading ? (
          <p className="body-p">Loading leads...</p>
        ) : forbidden ? (
          <p className="body-p">Only admins can view leads.</p>
        ) : (
          <>
            {error && <p role="alert" style={{ color: '#DC2626', fontSize: '14px' }}>{error}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {[{ id: 'all', label: `All (${leads.length})` }, ...STATUSES.map((s) => ({ ...s, label: `${s.label} (${leads.filter((l) => l.status === s.id).length})` }))].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFilter(s.id)}
                  style={{
                    padding: '8px 14px', fontSize: '12px', borderRadius: '20px', cursor: 'pointer',
                    border: '1px solid var(--border)',
                    background: filter === s.id ? 'var(--navy)' : '#fff',
                    color: filter === s.id ? '#fff' : 'inherit',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {shown.length === 0 ? (
              <p className="body-p">No leads here yet. New website inquiries will appear automatically.</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {shown.map((lead) => {
                  const status = STATUSES.find((s) => s.id === lead.status) || STATUSES[0];
                  return (
                    <article key={lead.id} style={{ border: '1px solid var(--border)', borderLeft: `4px solid ${status.color}`, borderRadius: '8px', background: '#fff', padding: '20px 24px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '16px' }}>{lead.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--grey)' }}>
                            {formatDate(lead.createdAt)} · {lead.source === 'property_inquiry' ? 'Property inquiry' : 'Contact form'}
                            {lead.budget ? ` · Budget: ${lead.budget}` : ''}
                          </div>
                        </div>
                        <select
                          value={lead.status}
                          onChange={(e) => setStatus(lead, e.target.value)}
                          aria-label={`Status for ${lead.name}`}
                          style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', alignSelf: 'flex-start' }}
                        >
                          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                      <p style={{ fontSize: '14px', lineHeight: 1.6, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>{lead.message}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px' }}>
                        <a href={`mailto:${lead.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--navy)' }}><Mail size={14} /> {lead.email}</a>
                        {lead.phone && <a href={`tel:${lead.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--navy)' }}><Phone size={14} /> {lead.phone}</a>}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
