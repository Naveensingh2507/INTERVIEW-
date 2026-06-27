"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function PostInterviewReport() {
  const [report, setReport] = useState(null);
  const router = useRouter();
  const { dark } = useTheme();

  useEffect(() => {
    const saved = sessionStorage.getItem('interviewReport');
    if (saved) {
      setReport(JSON.parse(saved));
    }
  }, []);

  // CSS variables for styling
  const bg = 'var(--bg)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const textMuted = 'var(--text-muted)';
  const ghost = 'var(--btn-ghost)';
  const ghostBorder = 'var(--btn-ghost-border)';

  if (!report) {
    return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textPrimary, fontFamily: "'Inter', sans-serif" }}>Loading report...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, padding: '96px 6vw 60px', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s, color 0.3s' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', color: textPrimary }}>
            Your <span style={{ color: '#10b981' }}>HireReady Report</span>
          </h1>
          <div style={{ display: 'flex', gap: 16 }}>
            <button 
              onClick={() => window.print()} 
              style={{ padding: '12px 24px', background: ghost, border: `1px solid ${ghostBorder}`, borderRadius: 10, color: textPrimary, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Download Report
            </button>
            <button 
              onClick={() => router.push('/interview/setup')} 
              style={{ padding: '12px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(16,185,129,0.3)', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(16,185,129,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(16,185,129,0.3)'; }}
            >
              Practice Again
            </button>
          </div>
        </div>

        {/* Section 1: Score Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 48 }}>
          {[
            { label: 'Technical Accuracy', val: report.scores?.technical_accuracy || 0 },
            { label: 'Communication', val: report.scores?.communication_structure || 0 },
            { label: 'Confidence', val: report.scores?.confidence_delivery || 0 },
            { label: 'Overall Score', val: report.scores?.overall || 0, highlight: true }
          ].map((score, i) => (
            <div key={i} style={{ 
              padding: 24, borderRadius: 16, background: score.highlight ? 'rgba(16,185,129,0.08)' : cardBg, 
              border: `1px solid ${score.highlight ? 'rgba(16,185,129,0.25)' : cardBorder}`, 
              position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' 
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: score.highlight ? '#10b981' : textMuted, marginBottom: 12 }}>
                {score.label}
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: score.highlight ? '#10b981' : textPrimary, letterSpacing: '-0.02em' }}>
                {score.val}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Behavioral Timeline */}
        {report.behavioral_timeline && report.behavioral_timeline.length > 0 && (
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32, marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, marginBottom: 24 }}>Behavioral Timeline</h2>
            <div style={{ position: 'relative', width: '100%', height: 6, background: ghost, borderRadius: 99, margin: '40px 0' }}>
              {report.behavioral_timeline?.map((event, i) => {
                const parts = event.timestamp.split(':');
                const totalSecs = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
                const pct = Math.min((totalSecs / 1800) * 100, 100);
                const color = event.severity === 'warning' ? '#ef4444' : '#10b981';
                
                return (
                  <div key={i} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: `${pct}%`, cursor: 'pointer' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: `2px solid ${cardBg}`, transition: 'transform 0.2s' }} />
                    <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 220, padding: 12, background: 'var(--nav-bg)', border: `1px solid ${cardBorder}`, borderRadius: 10, fontSize: 13, color: textSub, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s' }}>
                      <span style={{ fontFamily: 'monospace', color: color, fontWeight: 700, display: 'block', marginBottom: 4 }}>{event.timestamp}</span>
                      {event.event}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3 & 4 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32, marginBottom: 48 }}>
          
          {/* STAR Gaps */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, marginBottom: 24 }}>STAR Framework Gaps</h2>
            {!report.star_gaps || report.star_gaps.length === 0 ? (
              <p style={{ color: '#10b981', fontWeight: 600 }}>Perfect STAR answers detected. Great job!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {report.star_gaps?.map((gap, i) => (
                  <div key={i} style={{ padding: 20, background: ghost, border: `1px solid ${ghostBorder}`, borderRadius: 12 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 12 }}>Q: "{gap.question}"</p>
                    <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 6, fontSize: 12, fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', marginBottom: 10 }}>
                      Missing: {gap.missing_component}
                    </div>
                    <p style={{ fontSize: 14, color: textSub, lineHeight: 1.6 }}>{gap.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice Roadmap */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: textPrimary, marginBottom: 24 }}>Actionable Practice Roadmap</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {report.practice_roadmap?.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 15, color: textSub, paddingTop: 6, lineHeight: 1.6 }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
