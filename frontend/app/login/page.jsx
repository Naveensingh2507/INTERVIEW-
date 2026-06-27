"use client";
import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Safely read redirectTo from URL
  const getRedirect = () => {
    try {
      return new URLSearchParams(window.location.search).get('redirectTo') || '/dashboard';
    } catch {
      return '/dashboard';
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const redirectTo = getRedirect();

    // If Supabase is not configured, skip auth and go to dashboard
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_project')) {
      setTimeout(() => router.push(redirectTo), 400);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('✅ Check your email to confirm your account!');
        setLoading(false);
        return;
      }
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 10,
    padding: '13px 16px',
    fontSize: 15,
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px 40px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '50vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 20,
        padding: '44px 40px',
        boxShadow: 'var(--shadow-form)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17, color: '#fff' }}>H</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>HireVault</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-sub)', marginBottom: 32 }}>
          {isLogin ? 'Sign in to access your HireVault dashboard.' : 'Start your AI interview prep journey.'}
        </p>

        {/* Error / success */}
        {error && (
          <div style={{
            background: error.startsWith('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${error.startsWith('✅') ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: error.startsWith('✅') ? '#10b981' : '#ef4444',
            padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '15px',
              background: loading ? 'rgba(16,185,129,0.5)' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 30px rgba(16,185,129,0.35)',
              transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background = loading ? 'rgba(16,185,129,0.5)' : '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ height: 1, background: 'var(--divider)', margin: '28px 0' }} />

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: "'Inter', sans-serif" }}
          >
            {isLogin ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
