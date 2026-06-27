"use client";
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import ATSScoreDashboard from '@/components/ATSScoreDashboard';
import CorrectionCard from '@/components/CorrectionCard';

export default function AuditResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('auditResults');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse results", e);
        router.push('/audit');
      }
    } else {
      router.push('/audit');
    }
  }, [router]);

  // Design tokens
  const bg = 'var(--bg)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const ghost = 'var(--btn-ghost)';
  const ghostBorder = 'var(--btn-ghost-border)';

  if (!results) return null;

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, padding: '96px 6vw 60px', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s, color 0.3s' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', color: textPrimary, marginBottom: 8 }}>Audit Results</h1>
            <p style={{ fontSize: 14, color: textSub }}>Review your ATS compatibility and line-by-line feedback.</p>
          </div>
          <button 
            onClick={() => router.push('/audit')}
            style={{ padding: '10px 20px', fontSize: 14, fontWeight: 600, background: ghost, border: `1px solid ${ghostBorder}`, borderRadius: 8, color: textPrimary, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--btn-ghost-hover)'; e.currentTarget.style.borderColor = 'var(--btn-ghost-border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = ghost; e.currentTarget.style.borderColor = ghostBorder; }}
          >
            Audit Another Resume
          </button>
        </div>

        <ATSScoreDashboard score={results.ats_score} breakdown={results.score_breakdown} />

        {results.missing_keywords && results.missing_keywords.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Missing Keywords</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {results.missing_keywords.map((kw, i) => (
                <span key={i} style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Line-by-Line Corrections</h2>
          {results.corrections && results.corrections.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {results.corrections.map((corr, idx) => (
                <CorrectionCard key={idx} correction={corr} />
              ))}
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16 }}>
              <p style={{ color: textSub, fontWeight: 500 }}>Great job! No major corrections found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
