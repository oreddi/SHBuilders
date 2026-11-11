"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, FileText, Image as ImageIcon, Trash2, Upload } from 'lucide-react';

const formatSize = (bytes) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// Files on a task: drawings, RFIs, site photos. Upload is direct to storage via a signed URL.
export default function TaskAttachments({ taskId, labelStyle }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    fetch(`/api/pm/tasks/${taskId}/attachments`)
      .then(res => (res.ok ? res.json() : []))
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [taskId]);

  const uploadOne = async (file) => {
    const meta = { fileName: file.name, size: file.size, contentType: file.type || null };
    const api = (body) => fetch(`/api/pm/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      return data;
    });

    const { uploadUrl, path } = await api({ step: 'start', ...meta });
    const put = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!put.ok) throw new Error(`Upload of ${file.name} failed`);
    return api({ step: 'finish', path, ...meta });
  };

  const handleFiles = async (e) => {
    const picked = [...(e.target.files || [])];
    e.target.value = '';
    if (!picked.length) return;
    setError('');
    for (const [i, file] of picked.entries()) {
      setUploading(picked.length > 1 ? `Uploading ${i + 1} of ${picked.length}...` : `Uploading ${file.name}...`);
      try {
        const saved = await uploadOne(file);
        setFiles(prev => [saved, ...prev]);
      } catch (err) {
        setError(err.message);
        break;
      }
    }
    setUploading('');
  };

  const remove = async (file) => {
    if (!confirm(`Delete "${file.fileName}"?`)) return;
    const res = await fetch(`/api/pm/attachments/${file.id}`, { method: 'DELETE' });
    if (res.status === 403) return setError('Only admins can delete files.');
    if (!res.ok) return setError('Could not delete file.');
    setFiles(prev => prev.filter(f => f.id !== file.id));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ ...labelStyle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Paperclip size={12} /> Attachments
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={Boolean(uploading)}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--navy)' }}
        >
          <Upload size={12} /> Add Files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFiles}
          aria-label="Add files to this task"
          style={{ display: 'none' }}
        />
      </div>

      {uploading && <p style={{ fontSize: '13px', color: 'var(--grey)', margin: '0 0 8px' }}>{uploading}</p>}
      {error && <p role="alert" style={{ fontSize: '13px', color: '#DC2626', margin: '0 0 8px' }}>{error}</p>}

      {loading ? (
        <p style={{ fontSize: '13px', color: 'var(--grey)', margin: 0 }}>Loading files...</p>
      ) : files.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--grey)', margin: 0 }}>No files yet. Add drawings, RFIs or site photos.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--border)', borderRadius: '6px' }}>
          {files.map((f, idx) => (
            <li key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderTop: idx ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--grey)', display: 'flex' }}>
                {f.contentType?.startsWith('image/') ? <ImageIcon size={14} /> : <FileText size={14} />}
              </span>
              <a href={`/api/pm/attachments/${f.id}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 0, fontSize: '13px', color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {f.fileName}
              </a>
              <span style={{ fontSize: '12px', color: 'var(--grey)', whiteSpace: 'nowrap' }}>{formatSize(f.size)}</span>
              <button type="button" onClick={() => remove(f)} aria-label={`Delete ${f.fileName}`} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
