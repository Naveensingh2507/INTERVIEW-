"use client";
import React from 'react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, loading } = useAuth(true);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 pt-24 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Welcome to your Dashboard</h1>
      <p className="text-zinc-400 mb-12">Logged in as {user?.email}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>
            Recent Resume Audits
          </h2>
          <div className="flex flex-col gap-3 text-sm text-zinc-400">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 flex justify-between items-center hover:border-violet-500/30 transition-colors cursor-pointer">
              <span>Frontend Engineer Resume</span>
              <span className="font-bold text-white px-3 py-1 bg-violet-500/20 rounded border border-violet-500/30">Score: 78</span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 flex justify-between items-center hover:border-violet-500/30 transition-colors cursor-pointer">
              <span>Fullstack Developer Resume</span>
              <span className="font-bold text-white px-3 py-1 bg-emerald-500/20 rounded border border-emerald-500/30">Score: 82</span>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]"></div>
            Recent Mock Interviews
          </h2>
          <div className="flex flex-col gap-3 text-sm text-zinc-400">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 flex justify-between items-center hover:border-fuchsia-500/30 transition-colors cursor-pointer">
              <span>Google - SDE-1 (DSA)</span>
              <span className="font-bold text-white px-3 py-1 bg-fuchsia-500/20 rounded border border-fuchsia-500/30">Score: 81</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
