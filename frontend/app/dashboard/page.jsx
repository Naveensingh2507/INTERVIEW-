"use client";
import React from 'react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, loading } = useAuth(true);

  // Design Tokens
  const bg = 'var(--bg)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const ghost = 'var(--btn-ghost)';
  const ghostBorder = 'var(--btn-ghost-border)';

  if (loading) {
    return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textPrimary, fontFamily: "'Inter', sans-serif" }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, padding: '96px 6vw 60px', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s, color 0.3s' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: textPrimary, marginBottom: 8 }}>Dashboard</h1>
            <p style={{ color: textSub, fontSize: 15 }}>Logged in as <span style={{ color: textPrimary, fontWeight: 600 }}>{user?.email}</span></p>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
          {[
            { label: 'Total Practice Hours', value: '14h 20m', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />, color: '#3b82f6' },
            { label: 'Average Interview Score', value: '81 / 100', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />, color: '#10b981' },
            { label: 'Resumes Audited', value: '5', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />, color: '#8b5cf6' }
          ].map(stat => (
            <div key={stat.label} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{stat.icon}</svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32 }}>

          {/* Recent Resume Audits */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
              Recent Resume Audits
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 20, background: ghost, borderRadius: 12, border: `1px solid ${ghostBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = ghostBorder}>
                <span style={{ fontWeight: 600, color: textPrimary, fontSize: 14 }}>Frontend Engineer Resume</span>
                <span style={{ fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', fontSize: 12 }}>78 / 100</span>
              </div>
              <div style={{ padding: 20, background: ghost, borderRadius: 12, border: `1px solid ${ghostBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = ghostBorder}>
                <span style={{ fontWeight: 600, color: textPrimary, fontSize: 14 }}>Fullstack Developer Resume</span>
                <span style={{ fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', fontSize: 12 }}>82 / 100</span>
              </div>
            </div>
          </div>

          {/* Recent Mock Interviews */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}></div>
              Recent Mock Interviews
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 20, background: ghost, borderRadius: 12, border: `1px solid ${ghostBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
                   onMouseLeave={e => e.currentTarget.style.borderColor = ghostBorder}>
                <div>
                  <span style={{ fontWeight: 600, color: textPrimary, fontSize: 14, display: 'block', marginBottom: 4 }}>Google — SDE-1</span>
                  <span style={{ color: textSub, fontSize: 12 }}>DSA & Problem Solving</span>
                </div>
                <span style={{ fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(59,130,246,0.2)', fontSize: 12 }}>81 / 100</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
