"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const { user } = useAuth(false);

  // Landing page has its own built-in navbar
  if (pathname === '/') return null;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--nav-border)',
      backdropFilter: 'blur(20px)',
      height: 64, padding: '0 6vw',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>H</div>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>HireVault</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Practice', href: '/interview/setup' },
          { label: 'Resume Audit', href: '/audit' },
        ].map(({ label, href }) => (
          <Link key={href} href={href} style={{
            color: pathname === href ? '#10b981' : 'var(--text-sub)',
            fontSize: 15, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s',
          }}>{label}</Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Theme toggle */}
        <button onClick={toggle} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'var(--btn-ghost)',
            border: '1px solid var(--btn-ghost-border)',
            color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user ? (
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '6px 16px 6px 6px', borderRadius: 100, transition: 'all 0.2s' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Profile</span>
          </Link>
        ) : (
          <>
            <Link href="/login" style={{ color: 'var(--text-sub)', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>Sign In</Link>
            <button onClick={() => router.push('/interview/setup')}
              style={{ padding: '8px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}
