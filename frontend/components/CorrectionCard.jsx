"use client";
import React, { useState } from 'react';

export default function CorrectionCard({ correction }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(correction.suggested_fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: cardBg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${cardBorder}`, fontFamily: "'Inter', sans-serif" }}>
      
      {/* Issue Section */}
      <div style={{ padding: 20, borderLeft: '4px solid #ef4444', background: 'rgba(239,68,68,0.03)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            Issue
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{correction.issue}</span>
        </div>
        <p style={{ color: textSub, fontFamily: 'monospace', fontSize: 13, textDecoration: 'line-through', opacity: 0.8, marginLeft: 2, wordBreak: 'break-word' }}>
          "{correction.original_line}"
        </p>
      </div>
      
      {/* Suggested Fix Section */}
      <div style={{ padding: 20, borderLeft: '4px solid #10b981', background: 'rgba(16,185,129,0.03)', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            Suggested Fix
          </span>
        </div>
        <p style={{ color: textPrimary, fontSize: 14, lineHeight: 1.6, marginLeft: 2, paddingRight: 40, wordBreak: 'break-word' }}>
          "{correction.suggested_fix}"
        </p>
        
        <button 
          onClick={handleCopy}
          style={{ position: 'absolute', top: 20, right: 20, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'var(--btn-ghost)', border: `1px solid var(--btn-ghost-border)`, color: copied ? '#10b981' : textSub, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--btn-ghost-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-ghost)'; }}
          title="Copy to clipboard"
        >
          {copied ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}
