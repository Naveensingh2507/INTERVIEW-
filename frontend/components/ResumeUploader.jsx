"use client";
import React, { useCallback } from 'react';

export default function ResumeUploader({ file, setFile }) {
  // CSS variables — theme controlled via data-theme on <html>
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textMuted = 'var(--text-muted)';
  const tagBg = 'var(--pill-inactive)';
  const tagBorder = 'var(--pill-border)';
  const cardBgHover = 'var(--bg)';
  const cardBorderHover = 'rgba(16,185,129,0.4)';
  const iconBg = 'rgba(16,185,129,0.06)';

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, [setFile]);

  const handleChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('file-upload').click()}
      style={{ minHeight: 380, width: '100%', border: `1px dashed ${cardBorder}`, borderRadius: 12, background: cardBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 24, transition: 'border-color 0.2s, background 0.2s', fontFamily: "'Inter', sans-serif" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = cardBorderHover; e.currentTarget.style.background = cardBgHover; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.background = cardBg; }}
    >
      <input id="file-upload" type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleChange} />

      {file ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#10b981"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zm3-4h6v2H9v-2zm0-4h6v2H9v-2z" /></svg>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '4px 12px', marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>READY</span>
          </div>

          <p style={{ fontSize: 15, fontWeight: 600, color: textPrimary, marginBottom: 6, maxWidth: 240, wordBreak: 'break-all' }}>{file.name}</p>
          <p style={{ fontSize: 12, color: textMuted, marginBottom: 16 }}>{file.size ? `${(file.size / 1024).toFixed(0)} KB` : ''}</p>
          <p style={{ fontSize: 12, color: '#10b981' }}>Click or drag to replace</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: iconBg, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>

          <p style={{ fontSize: 17, fontWeight: 700, color: textPrimary, marginBottom: 8 }}>Drop PDF here</p>
          <p style={{ fontSize: 13, color: textMuted, marginBottom: 24 }}>or click to browse your files</p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PDF Only', 'Max 5MB', 'Single File'].map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', padding: '4px 12px', background: tagBg, border: `1px solid ${tagBorder}`, borderRadius: 100, color: textMuted }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
