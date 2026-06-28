"use client";
import React from 'react';
import useAuth from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, loading } = useAuth(true);
  const router = useRouter();

  // Design Tokens matching existing theme
  const bg = 'var(--bg)';
  const textPrimary = 'var(--text-primary)';
  const textSub = 'var(--text-sub)';
  const cardBg = 'var(--card-bg)';
  const cardBorder = 'var(--card-border)';
  const inputBg = 'var(--input-bg)';
  const inputBorder = 'var(--input-border)';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textPrimary, fontFamily: "'Inter', sans-serif" }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textPrimary, padding: '96px 6vw 60px', fontFamily: "'Inter', sans-serif", transition: 'background 0.3s, color 0.3s' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', color: textPrimary, marginBottom: 32 }}>My Profile</h1>

        <div style={{ display: 'grid', gap: 32 }}>
          {/* Personal Info Card */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: textPrimary, marginBottom: 4 }}>Naveen Singh</h2>
                <p style={{ color: textSub, fontSize: 15 }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>University</label>
                <div style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 15 }}>
                  B.Tech Computer Science
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Target Role</label>
                <div style={{ background: inputBg, border: `1px solid ${inputBorder}`, borderRadius: 10, padding: '12px 16px', fontSize: 15 }}>
                  Software Development Engineer 1
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: textPrimary, marginBottom: 24 }}>Interview Preferences</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${cardBorder}` }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Hard Mode (Proctoring)</div>
                  <div style={{ fontSize: 13, color: textSub }}>Strict eye-tracking and posture detection during mock interviews.</div>
                </div>
                <div style={{ width: 44, height: 24, background: '#10b981', borderRadius: 100, position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, right: 3 }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Weekly Email Reports</div>
                  <div style={{ fontSize: 13, color: textSub }}>Get your interview performance analytics sent to your inbox.</div>
                </div>
                <div style={{ width: 44, height: 24, background: '#10b981', borderRadius: 100, position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, right: 3 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 20, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Account Settings</h2>
            <p style={{ fontSize: 14, color: textSub, marginBottom: 24 }}>Manage your account session and data.</p>
            
            <button 
              onClick={handleSignOut}
              style={{ padding: '12px 24px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
