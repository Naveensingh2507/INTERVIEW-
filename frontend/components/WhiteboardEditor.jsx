"use client";
import React from 'react';

export default function WhiteboardEditor({ code, setCode }) {
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', borderLeft: `1px solid ${cardBorder}` }}>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${cardBorder}`, background: cardBg }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, letterSpacing: '0.02em', marginBottom: 4 }}>Technical Whiteboard</h2>
        <p style={{ fontSize: 12, color: textSub }}>Type your code or pseudocode here</p>
      </div>
      <textarea
        style={{ flex: 1, width: '100%', padding: 24, background: 'transparent', color: textPrimary, fontFamily: 'monospace', fontSize: 14, lineHeight: 1.6, border: 'none', outline: 'none', resize: 'none' }}
        placeholder="// Start typing your solution..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}
