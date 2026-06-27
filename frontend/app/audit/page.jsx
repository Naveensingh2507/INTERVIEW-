"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUploader from '@/components/ResumeUploader';

export default function AuditInputPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // CSS variables — theme applied via data-theme on <html>
  const bg = 'var(--bg)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const textMuted = 'var(--text-muted)';
  const inputBg = 'var(--input-bg)';
  const inputBorder = 'var(--input-border)';

  const handleGenerateAudit = async () => {
    if (!file || !jobDescription.trim()) { setError("Please upload a resume and provide a job description."); return; }
    setIsLoading(true); setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/audit`, { method: 'POST', body: formData });
      if (!res.ok) { const errData = await res.json(); throw new Error(errData.detail || "Failed to generate audit"); }
      const data = await res.json();
      sessionStorage.setItem('auditResults', JSON.stringify(data));
      router.push('/audit/results');
    } catch (err) { setError(err.message); setIsLoading(false); }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: textPrimary, marginBottom: 8, letterSpacing: '-0.02em' }}>Auditing your resume...</p>
        <p style={{ fontSize: 16, color: textSub }}>Running multi-pass ATS analysis. This may take a few seconds.</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 0.2, 0.4].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: `pulse 1.4s ease ${d}s infinite` }} />)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', sans-serif", color: textPrimary, transition: 'background 0.3s, color 0.3s' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ position: 'fixed', top: '5%', right: '10%', width: '35vw', height: '60vh', background: 'radial-gradient(circle, var(--glow-bg) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ width: '100%', padding: '96px 6vw 60px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Resume Auditor</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14, color: textPrimary }}>
            Resume <span style={{ color: '#10b981' }}>Audit</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: textSub, maxWidth: '45vw' }}>
            Upload your resume and paste the target job description. Our AI will run a 3-stage ATS analysis to surface keyword gaps, formatting issues, and actionable rewrites.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            {error}
          </div>
        )}

        {/* Two-column inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Resume Upload */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={textMuted}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" /></svg>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted }}>Resume Source (PDF)</span>
            </div>
            <ResumeUploader file={file} setFile={setFile} />
          </div>

          {/* Job Description */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={textMuted}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted }}>Target Job Description</span>
            </div>
            <textarea
              style={{ flex: 1, width: '100%', minHeight: 380, padding: '18px', background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 12, color: textPrimary, fontSize: 14, lineHeight: 1.7, resize: 'none', outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s, background 0.3s, color 0.3s' }}
              placeholder="Paste the full job description here, including responsibilities and requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
              onBlur={e => e.target.style.borderColor = inputBorder}
            />
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, marginBottom: 32, transition: 'background 0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: file && jobDescription.trim() ? '#10b981' : textMuted, boxShadow: file && jobDescription.trim() ? '0 0 8px #10b981' : 'none', transition: 'all 0.3s' }} />
            <span style={{ fontSize: 13, color: textSub }}>
              {file && jobDescription.trim() ? 'AI engine ready — click to begin multi-pass analysis' : 'Upload your resume and paste a job description to begin'}
            </span>
          </div>

          <button onClick={handleGenerateAudit}
            style={{ padding: '14px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 24px rgba(16,185,129,0.3)', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(16,185,129,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(16,185,129,0.3)'; }}
          >
            Generate ATS Audit
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { label: 'AUDIT PASS', value: '3-STAGE', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg> },
            { label: 'LATENCY', value: '~4.2s', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
            { label: 'ANALYSIS', value: 'NLP-DRIVEN', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><path d="M12 3C6.48 3 2 6.48 2 10c0 2.48 1.4 4.64 3.49 5.85L4 20l4.57-2.29C9.66 17.93 10.82 18 12 18c5.52 0 10-3.13 10-7s-4.48-7-10-7z" /></svg> },
            { label: 'ACCURACY', value: '99.8%', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><path strokeLinecap="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg> },
          ].map(item => (
            <div key={item.label}
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '20px 22px', transition: 'border-color 0.2s, transform 0.2s, background 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                {item.icon}
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted }}>{item.label}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
