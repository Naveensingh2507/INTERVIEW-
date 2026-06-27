"use client";
import React, { useEffect, useState } from 'react';

export default function WaveVisualizer({ state, audioLevel = 0 }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let interval;
    if (state === 'THINKING' || state === 'SPEAKING' || state === 'IDLE') {
      interval = setInterval(() => {
        setPulse(prev => (prev + 1) % 100);
      }, state === 'SPEAKING' ? 50 : 100);
    }
    return () => clearInterval(interval);
  }, [state]);

  const renderWave = () => {
    if (state === 'IDLE') {
      return (
        <div style={{ width: '100%', height: 4, background: 'rgba(16,185,129,0.3)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.8), transparent)', animation: 'idleSweep 2s infinite linear' }} />
          <style>{`@keyframes idleSweep { to { left: 100%; } }`}</style>
        </div>
      );
    }
    
    if (state === 'LISTENING') {
      const height = Math.max(8, audioLevel * 150);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 128 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              style={{
                width: 12,
                background: '#10b981',
                borderRadius: 12,
                transition: 'height 0.075s',
                height: `${height * (Math.random() * 0.5 + 0.5)}px`,
                boxShadow: '0 0 10px rgba(16,185,129,0.4)'
              }}
            />
          ))}
        </div>
      );
    }

    if (state === 'THINKING') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 128 }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, rgba(16,185,129,0.2), #10b981)',
            animation: 'spin 1.5s linear infinite',
            filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.5))',
            opacity: 0.9
          }} />
          <div style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--card-bg)'
          }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    if (state === 'SPEAKING') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 128 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              style={{
                width: 12,
                background: 'linear-gradient(to top, #059669, #34d399)',
                borderRadius: 12,
                transition: 'height 0.1s',
                height: `${Math.random() * 100 + 20}px`,
                boxShadow: '0 0 15px rgba(16,185,129,0.6)'
              }}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 32 }}>
        {renderWave()}
      </div>
      <p style={{ color: 'var(--text-sub)', fontWeight: 600, letterSpacing: '0.05em', animation: 'pulseText 2s infinite' }}>
        {state === 'IDLE' && "Interviewer is idle..."}
        {state === 'LISTENING' && "Interviewer is listening..."}
        {state === 'THINKING' && "Interviewer is thinking..."}
        {state === 'SPEAKING' && "Interviewer is speaking..."}
      </p>
      <style>{`@keyframes pulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
