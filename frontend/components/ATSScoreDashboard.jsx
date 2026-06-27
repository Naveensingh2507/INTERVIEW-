"use client";
import React, { useEffect, useState } from 'react';

export default function ATSScoreDashboard({ score, breakdown }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = score / 50; 
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48, width: '100%', position: 'relative', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: 40, width: 250, height: 250, background: 'var(--glow-bg)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.6, pointerEvents: 'none' }} />
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48 }}>
        <svg width="192" height="192" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.3))' }}>
          <circle cx="96" cy="96" r={radius} stroke="var(--border-subtle)" strokeWidth="10" fill="transparent" />
          <circle 
            cx="96" 
            cy="96" 
            r={radius} 
            stroke="#10b981" 
            strokeWidth="10" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            style={{ transition: 'stroke-dashoffset 0.3s ease-out', filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: textPrimary, letterSpacing: '-0.02em', lineHeight: 1 }}>{animatedScore}</span>
          <span style={{ fontSize: 11, color: textSub, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, marginTop: 4 }}>ATS Score</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, width: '100%', maxWidth: 900 }}>
        {[
          { label: 'Keyword Match', val: breakdown.keyword_match, max: 40 },
          { label: 'Impact & Metrics', val: breakdown.impact_and_metrics, max: 30 },
          { label: 'Formatting', val: breakdown.formatting, max: 20 },
          { label: 'Core Fundamentals', val: breakdown.core_fundamentals, max: 10 }
        ].map((item, i) => (
          <div key={i} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: textPrimary, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {item.val} <span style={{ fontSize: 14, color: textSub, fontWeight: 500 }}>/ {item.max}</span>
            </span>
            <span style={{ fontSize: 11, color: textSub, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, textAlign: 'center' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
