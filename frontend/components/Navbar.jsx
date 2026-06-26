"use client";
import React from 'react';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800 h-16 flex items-center justify-between px-8">
      <Link href="/" className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
        HIREVAULT
      </Link>
      
      <div className="flex items-center gap-6">
        <Link href="/audit" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Resume Audit
        </Link>
        <Link href="/interview/setup" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          Mock Interview
        </Link>
        
        <div className="w-px h-6 bg-zinc-800 mx-2"></div>
        
        {!loading && (
          user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-zinc-800 text-white rounded-md text-sm font-bold hover:bg-zinc-700 transition-colors">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
