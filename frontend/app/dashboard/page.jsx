"use client";
import React from 'react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user, loading } = useAuth(true);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8 pt-24">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Dashboard</h1>
          <p className="text-zinc-400">Logged in as <span className="text-zinc-300">{user?.email}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Recent Resume Audits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              Recent Resume Audits
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex justify-between items-center hover:border-zinc-600 transition-colors">
                <span className="font-medium text-zinc-200">Frontend Engineer Resume</span>
                <span className="font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">78 / 100</span>
              </div>
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex justify-between items-center hover:border-zinc-600 transition-colors">
                <span className="font-medium text-zinc-200">Fullstack Developer Resume</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">82 / 100</span>
              </div>
            </div>
          </div>

          {/* Recent Mock Interviews */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></div>
              Recent Mock Interviews
            </h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex justify-between items-center hover:border-zinc-600 transition-colors">
                <div>
                  <span className="font-medium text-zinc-200 block">Google — SDE-1</span>
                  <span className="text-zinc-500 text-xs">DSA &amp; Problem Solving</span>
                </div>
                <span className="font-bold text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-lg border border-fuchsia-500/20">81 / 100</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
