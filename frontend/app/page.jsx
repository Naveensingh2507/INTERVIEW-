"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

const TYPING_WORDS = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Frontend Dev', 'ML Engineer'];

function SunIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [typedText, setTypedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [score, setScore] = useState(72);

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex];
    let timeout;
    if (!deleting && charIndex < word.length) timeout = setTimeout(() => setCharIndex(c => c + 1), 80);
    else if (!deleting && charIndex === word.length) timeout = setTimeout(() => setDeleting(true), 1800);
    else if (deleting && charIndex > 0) timeout = setTimeout(() => setCharIndex(c => c - 1), 45);
    else if (deleting && charIndex === 0) { setDeleting(false); setWordIndex(i => (i + 1) % TYPING_WORDS.length); }
    setTypedText(word.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex]);

  useEffect(() => {
    const interval = setInterval(() => setScore(s => s < 87 ? s + 1 : s), 30);
    return () => clearInterval(interval);
  }, []);

  const C = {
    bg: 'var(--bg)',
    card: 'var(--card-bg)',
    border: 'var(--card-border)',
    text: 'var(--text-primary)',
    sub: 'var(--text-sub)',
    muted: 'var(--text-muted)',
    navBg: 'var(--nav-bg)',
    navBorder: 'var(--nav-border)',
    ghost: 'var(--btn-ghost)',
    ghostBorder: 'var(--btn-ghost-border)',
    divider: 'var(--divider)',
    shadow: 'var(--shadow-card)',
    inputBg: 'var(--input-bg)',
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: C.navBg, borderBottom: `1px solid ${C.navBorder}`, backdropFilter: 'blur(20px)', height: 70, padding: '0 6vw', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: '#fff' }}>H</div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.4px', color: C.text }}>HireVault</span>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          {[['Dashboard', '/dashboard'], ['Practice', '/interview/setup'], ['Resume Audit', '/audit']].map(([label, href]) => (
            <button key={href} onClick={() => router.push(href)}
              style={{ background: 'none', border: 'none', color: C.sub, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => e.target.style.color = C.text}
              onMouseLeave={e => e.target.style.color = C.sub}
            >{label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={toggle} title={dark ? 'Light mode' : 'Dark mode'}
            style={{ width: 38, height: 38, borderRadius: 8, background: C.ghost, border: `1px solid ${C.ghostBorder}`, color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.sub; }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: C.sub, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Sign In</button>
          <button onClick={() => router.push('/audit')}
            style={{ padding: '10px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(16,185,129,0.3)', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
            onMouseEnter={e => { e.target.style.background = '#059669'; e.target.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.target.style.background = '#10b981'; e.target.style.transform = 'translateY(0)'; }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '90px 6vw 60px', gap: '6vw', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '5%', left: '2%', width: '40vw', height: '70vh', background: 'radial-gradient(ellipse, var(--glow-bg) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '0%', width: '50vw', height: '80vh', background: 'radial-gradient(ellipse, var(--glow-bg) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* LEFT */}
        <div style={{ flex: '1 1 50%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '7px 16px', marginBottom: 36 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'glow 2s ease infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981', letterSpacing: '0.04em' }}>HireVault AI — Interview Intelligence</span>
          </div>

          <h1 style={{ fontSize: 'clamp(52px, 6vw, 88px)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.04em', marginBottom: 28, color: C.text }}>
            Crack Interviews.<br />
            Build Skills.<br />
            <span style={{ color: '#10b981' }}>Get Hired.</span>
          </h1>

          <p style={{ fontSize: 'clamp(17px, 1.4vw, 21px)', lineHeight: 1.85, color: C.sub, maxWidth: '42vw', marginBottom: 14 }}>
            HireVault unifies AI Mock Interviews and Resume Intelligence into one powerful platform — built for students targeting{' '}
            <span style={{ color: '#10b981', fontWeight: 600 }}>Google, Amazon, TCS</span> and beyond.
          </p>
          <p style={{ fontSize: 'clamp(15px, 1.2vw, 18px)', color: C.muted, marginBottom: 44 }}>
            Currently preparing for{' '}
            <span style={{ color: '#10b981', fontWeight: 700 }}>
              {typedText}<span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
            </span>
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
            <button onClick={() => router.push('/interview/setup')}
              style={{ padding: '16px 32px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 40px rgba(16,185,129,0.4)', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 50px rgba(16,185,129,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.4)'; }}
            >Start Free AI Interview</button>

            <button onClick={() => router.push('/audit')}
              style={{ padding: '16px 28px', background: C.ghost, color: C.text, border: `1px solid ${C.ghostBorder}`, borderRadius: 12, fontSize: 17, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >Audit My Resume</button>
          </div>

          <div style={{ display: 'flex', gap: 28 }}>
            {['No credit card', 'Privacy-safe', '1,00,000+ trained'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, color: C.muted }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Floating mockup */}
        <div style={{ flex: '1 1 45%', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, width: '100%', maxWidth: 600, boxShadow: C.shadow, overflow: 'hidden' }}>
            {/* Browser bar */}
            <div style={{ background: C.inputBg, padding: '12px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 7 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
              </div>
              <div style={{ flex: 1, background: C.ghost, borderRadius: 7, padding: '5px 14px', fontSize: 13, color: C.muted, display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#10b981"><circle cx="12" cy="12" r="10" /></svg>
                hirevault.app/interview
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '0 24px' }}>
              {['Interview', 'Analysis', 'Report'].map((tab, i) => (
                <div key={tab} style={{ padding: '14px 18px', fontSize: 14, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? '#10b981' : C.muted, borderBottom: i === 2 ? '2px solid #10b981' : '2px solid transparent', cursor: 'pointer' }}>{tab}</div>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
                {/* Score ring */}
                <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                  <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="55" cy="55" r="46" fill="none" stroke={C.border} strokeWidth="7" />
                    <circle cx="55" cy="55" r="46" fill="none" stroke="#10b981" strokeWidth="7" strokeDasharray={`${(score / 100) * 289} 289`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.05s' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1 }}>{score}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>/100</span>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, marginBottom: 18, textTransform: 'uppercase' }}>Performance Summary</p>
                  {[
                    { label: 'Communication', sub: 'Clear & structured', grade: 'A', color: '#10b981' },
                    { label: 'Problem Solving', sub: 'Strong analytical approach', grade: 'A−', color: '#10b981' },
                    { label: 'Technical Skills', sub: 'Good fundamentals', grade: 'B+', color: '#f59e0b' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.label}</span>
                        <span style={{ fontSize: 13, color: C.muted, marginLeft: 10 }}>— {item.sub}</span>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.grade}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 22, padding: '12px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981"><path d="M12 3C6.48 3 2 6.48 2 10c0 2.48 1.4 4.64 3.49 5.85L4 20l4.57-2.29C9.66 17.93 10.82 18 12 18c5.52 0 10-3.13 10-7s-4.48-7-10-7z" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>HireVault AI</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Analyzing your performance...</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                  {[0, 0.15, 0.3].map((d, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', animation: `blink 1.2s ease ${d}s infinite` }} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Confidence badge */}
          <div style={{ position: 'absolute', top: -20, right: -20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 22px', minWidth: 150, boxShadow: C.shadow }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Confidence Score</div>
            <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, color: C.text }}>{score} <span style={{ fontSize: 16, color: C.muted, fontWeight: 400 }}>/100</span></div>
            <div style={{ height: 4, background: C.border, borderRadius: 99, marginTop: 12 }}>
              <div style={{ height: '100%', width: `${score}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 99, transition: 'width 0.05s' }} />
            </div>
          </div>

          {/* Ready badge */}
          <div style={{ position: 'absolute', bottom: -20, right: 30, background: C.card, border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: C.shadow }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>HireVault Score</div>
              <div style={{ fontSize: 13, color: '#10b981', fontWeight: 500 }}>Interview Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ padding: '100px 6vw', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.ghost, border: `1px solid ${C.border}`, borderRadius: 100, padding: '7px 18px', marginBottom: 22 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: '0.1em' }}>THE PROBLEM AND OUR FIX</span>
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: C.text }}>
            Students Struggle.<br /><span style={{ color: '#10b981' }}>We Solve It.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            { problem: 'Resume gets rejected by ATS before a human even reads it', solution: 'AI Resume Auditor', route: '/audit', points: ['ATS score out of 100', 'Missing keyword detection', 'Line-by-line rewrite suggestions'] },
            { problem: 'No real interview practice — only textbook theory, zero feedback', solution: 'AI Mock Interviewer', route: '/interview/setup', points: ['Live voice interview with AI', 'Technical whiteboard for coding', 'HireReady score and full report'] },
          ].map(card => (
            <div key={card.solution} onClick={() => router.push(card.route)}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '40px', cursor: 'pointer', transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.45)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 70px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', gap: 12, marginBottom: 26 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <p style={{ fontSize: 18, color: C.sub, lineHeight: 1.7 }}>{card.problem}</p>
              </div>
              <div style={{ height: 1, background: C.divider, marginBottom: 26 }} />
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase', marginBottom: 14 }}>HireVault Solution</div>
              <span style={{ fontSize: 28, fontWeight: 800, color: C.text, display: 'block', marginBottom: 22 }}>{card.solution}</span>
              {card.points.map(pt => (
                <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span style={{ fontSize: 18, color: C.sub }}>{pt}</span>
                </div>
              ))}
              <div style={{ marginTop: 28, color: '#10b981', fontSize: 15, fontWeight: 700 }}>Try it free</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '100px 6vw', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 100, padding: '7px 18px', marginBottom: 22 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981', letterSpacing: '0.1em' }}>THE CAREER JOURNEY</span>
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, color: C.text }}>
            From Resume to <span style={{ color: '#10b981' }}>Offer Letter</span>
          </h2>
          <p style={{ fontSize: 'clamp(16px, 1.3vw, 19px)', color: C.sub, marginTop: 16, maxWidth: 540, margin: '20px auto 0' }}>
            Four intelligent steps — each designed to make you offer-ready.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { num: '01', title: 'Upload Resume', desc: 'Drop your PDF. AI extracts every bullet and scores it against your target job description using ATS heuristics.' },
            { num: '02', title: 'Configure Session', desc: 'Pick your target company, round type (HR, DSA, or Core CS), difficulty level, and time limit.' },
            { num: '03', title: 'Interview Live', desc: 'Speak your answers. The AI listens, adapts, asks follow-ups, and opens the whiteboard for coding rounds.' },
            { num: '04', title: 'Get Your Report', desc: 'Full score breakdown, behavioral timeline, STAR gap analysis, and a personalized practice roadmap.' },
          ].map(step => (
            <div key={step.num}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '32px 28px', transition: 'border-color 0.25s, transform 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.35)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(16,185,129,0.5)', letterSpacing: '0.12em', marginBottom: 20 }}>{step.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#10b981">
                  {step.num === '01' && <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />}
                  {step.num === '02' && <path d="M12 15a3 3 0 100-6 3 3 0 000 6zm7.94-2.06a7.94 7.94 0 00.06-1 7.5 7.5 0 00-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96a7.44 7.44 0 00-1.62-.94l-.36-2.54A.488.488 0 0015 3h-3.84c-.24 0-.44.17-.47.41l-.36 2.54a7.63 7.63 0 00-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.8 9.47c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.08.64-.08.94s.02.63.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41H15c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.29-1.58z" />}
                  {step.num === '03' && <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />}
                  {step.num === '04' && <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />}
                </svg>
              </div>
              <h4 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 14 }}>{step.title}</h4>
              <p style={{ fontSize: 17, lineHeight: 1.75, color: C.sub }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 6vw 100px' }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: '60px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { value: '1,00,000+', label: 'Students Trained' },
            { value: '94%', label: 'Interview Pass Rate' },
            { value: '340+', label: 'Companies Covered' },
            { value: '4.9/5', label: 'Student Rating' },
          ].map((stat, i) => (
            <div key={stat.label} style={{ textAlign: 'center', borderRight: i < 3 ? `1px solid ${C.divider}` : 'none', padding: '0 20px' }}>
              <div style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', fontWeight: 900, color: '#10b981', letterSpacing: '-0.03em', marginBottom: 10 }}>{stat.value}</div>
              <div style={{ fontSize: 16, color: C.sub, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPANIES ── */}
      <section style={{ padding: '0 6vw 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', color: C.muted, textTransform: 'uppercase', marginBottom: 36 }}>
          Preparing students for roles at
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6vw', flexWrap: 'wrap', alignItems: 'center' }}>
          {['Google', 'Amazon', 'TCS', 'Microsoft', 'Zomato'].map(name => (
            <span key={name}
              style={{ fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 800, color: C.muted, transition: 'color 0.2s, transform 0.2s', display: 'inline-block', cursor: 'default', letterSpacing: '-0.02em' }}
              onMouseEnter={e => { e.target.style.color = C.text; e.target.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.transform = 'scale(1)'; }}
            >{name}</span>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '0 6vw 120px' }}>
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 28, padding: '80px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -10%, rgba(16,185,129,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 18, lineHeight: 1.1, color: C.text }}>
              Ready to get <span style={{ color: '#10b981' }}>Offer-Ready?</span>
            </h2>
            <p style={{ fontSize: 'clamp(16px, 1.3vw, 19px)', color: C.sub, maxWidth: 520, margin: '0 auto 44px', lineHeight: 1.8 }}>
              Join thousands of students who cracked interviews at top companies using HireVault.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/interview/setup')}
                style={{ padding: '17px 36px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontSize: 17, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 50px rgba(16,185,129,0.45)', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >Start Free AI Interview</button>
              <button onClick={() => router.push('/audit')}
                style={{ padding: '17px 32px', background: C.ghost, color: C.text, border: `1px solid ${C.ghostBorder}`, borderRadius: 12, fontSize: 17, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >Audit My Resume</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.divider}`, padding: '36px 6vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#fff' }}>H</div>
          <span style={{ fontWeight: 800, color: C.text, fontSize: 17 }}>HireVault</span>
          <span style={{ color: C.muted, fontSize: 14, marginLeft: 10 }}>© 2024. All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Privacy', 'Terms', 'Support'].map(link => (
            <button key={link} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = C.text}
              onMouseLeave={e => e.target.style.color = C.muted}
            >{link}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
