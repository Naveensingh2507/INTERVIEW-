"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const loadingTexts = ["Selecting your questions...", "Preparing your interviewer...", "Almost ready..."];

export default function InterviewSetup() {
  const router = useRouter();
  const { dark, toggle } = useTheme();

  // CSS variables — controlled by data-theme on <html>
  const bg = 'var(--bg)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const textMuted = 'var(--text-muted)';
  const pillInactive = 'var(--pill-inactive)';
  const pillBorderInactive = 'var(--pill-border)';
  const pillColorInactive = 'var(--pill-color)';
  const divider = 'var(--divider)';
  
  const [form, setForm] = useState({ company: 'Google', role: 'SDE-1', roundType: 'DSA & Problem Solving', difficulty: 'Medium', timeLimit: '45 minutes' });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    if (isLoading) interval = setInterval(() => setLoadingTextIndex(p => (p + 1) % loadingTexts.length), 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleStart = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ company_name: form.company, round_type: form.roundType, difficulty: form.difficulty });
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/questions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch questions. Check backend connection.");
      const questions = await res.json();
      await new Promise(r => setTimeout(r, 2500));
      sessionStorage.setItem('interviewConfig', JSON.stringify({ ...form, questions }));
      router.push('/interview/room');
    } catch (err) { setError(err.message); setIsLoading(false); }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <p style={{ fontSize: 22, fontWeight: 800, color: textPrimary, marginBottom: 8, letterSpacing: '-0.02em' }}>{loadingTexts[loadingTextIndex]}</p>
        <p style={{ fontSize: 15, color: textSub }}>Setting up your AI interviewer...</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 0.2, 0.4].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: `pulse 1.4s ease ${d}s infinite` }} />)}
        </div>
      </div>
    );
  }

  const pillBtn = (value, current, onClick, label) => (
    <button type="button" onClick={() => onClick(value)}
      style={{
        padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500,
        cursor: 'pointer', border: '1px solid',
        borderColor: current === value ? '#10b981' : pillBorderInactive,
        background: current === value ? 'rgba(16,185,129,0.1)' : pillInactive,
        color: current === value ? '#10b981' : pillColorInactive,
        transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
      }}
    >{label || value}</button>
  );

  const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: textMuted, display: 'block', marginBottom: 12 };

  const COMPANIES = [{ name: 'Google' }, { name: 'Amazon' }, { name: 'TCS' }, { name: 'Microsoft' }, { name: 'Zomato' }];
  const ROUND_TYPES = ['HR / Behavioral', 'DSA & Problem Solving', 'Machine Coding', 'Core CS Fundamentals'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed'];
  const TIME_LIMITS = ['30 minutes', '45 minutes', '60 minutes'];

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', sans-serif", color: textPrimary, transition: 'background 0.3s, color 0.3s' }}>
      <style>{`option { background: ${cardBg}; color: ${textPrimary}; }`}</style>

      <div style={{ position: 'fixed', top: '10%', right: '10%', width: '35vw', height: '60vh', background: 'radial-gradient(circle, var(--glow-bg) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ width: '100%', padding: '96px 6vw 60px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Mock Interview</span>
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.1, color: textPrimary }}>
            Configure Your <span style={{ color: '#10b981' }}>Session</span>
          </h1>
          <p style={{ fontSize: 17, color: textSub, lineHeight: 1.7 }}>
            Set up your mock interview parameters. The AI will adapt questions to your exact configuration.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '12px 16px', borderRadius: 10, marginBottom: 24, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 860, margin: '0 auto 24px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            {error}
          </div>
        )}

        {/* Form card */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: '48px', boxShadow: 'var(--shadow-form)', maxWidth: 900, margin: '0 auto', transition: 'background 0.3s' }}>
          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>

            {/* Company */}
            <div>
              <label style={labelStyle}>Target Company</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {COMPANIES.map(({ name }) => pillBtn(name, form.company, v => setForm({ ...form, company: v }), name))}
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Role</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['SDE-1', 'SDE-2', 'Data Analyst', 'Product Manager'].map(r => pillBtn(r, form.role, v => setForm({ ...form, role: v }), r))}
              </div>
            </div>

            {/* Round Type */}
            <div>
              <label style={labelStyle}>Round Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {ROUND_TYPES.map(rt => pillBtn(rt, form.roundType, v => setForm({ ...form, roundType: v }), rt))}
              </div>
            </div>

            {/* Difficulty + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={labelStyle}>Difficulty</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {DIFFICULTIES.map(d => pillBtn(d, form.difficulty, v => setForm({ ...form, difficulty: v }), d))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Time Limit</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TIME_LIMITS.map(tl => pillBtn(tl, form.timeLimit, v => setForm({ ...form, timeLimit: v }), tl))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: divider }} />

            {/* Config summary */}
            <div style={{ background: 'var(--glow-bg)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: textSub, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>Session:</span>
              {[form.company, form.role, form.roundType, form.difficulty, form.timeLimit].map((v, i) => (
                <React.Fragment key={v}>
                  <span>{v}</span>
                  {i < 4 && <span style={{ color: '#10b981' }}>·</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Submit */}
            <button type="submit"
              style={{ padding: '17px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 0 30px rgba(16,185,129,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 44px rgba(16,185,129,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(16,185,129,0.35)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 4a3 3 0 016 0v7a3 3 0 11-6 0V4z" /></svg>
              Start AI Interview
            </button>
          </form>
        </div>

        {/* Info strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 28 }}>
          {[['Voice-powered'], ['Real-time scoring'], ['Full report after']].map(([text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: textMuted }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
