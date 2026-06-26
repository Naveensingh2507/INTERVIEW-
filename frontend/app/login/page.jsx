"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Use a fallback for useSearchParams in case it's not wrapped in suspense properly
  // Or just use window.location if needed, but Next.js usually handles it.
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const redirectTo = searchParams?.get('redirectTo') || '/dashboard';
  
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_project_url_here') {
      setTimeout(() => {
        router.push(redirectTo);
      }, 500);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation!");
      }
      router.push(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative pt-16">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-zinc-400 mb-8">{isLogin ? 'Log in to access your HireReady reports.' : 'Sign up to track your interview prep.'}</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6">{error}</div>}
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">Email</label>
            <input 
              type="email" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-zinc-400 font-medium">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-lg mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
        
        <p className="text-center mt-6 text-zinc-500 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-violet-400 hover:text-violet-300 font-medium">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
