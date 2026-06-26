"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const loadingTexts = ["Selecting your questions...", "Preparing your interviewer...", "Almost ready..."];

export default function InterviewSetup() {
  const router = useRouter();
  const [form, setForm] = useState({
    company: 'Google',
    role: 'SDE-1',
    roundType: 'DSA & Problem Solving',
    difficulty: 'Medium',
    timeLimit: '45 minutes'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleStart = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        company_name: form.company,
        round_type: form.roundType,
        difficulty: form.difficulty
      });

      const res = await fetch(`http://localhost:8000/api/questions?${params}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch questions. Check backend connection.");
      }
      
      const questions = await res.json();
      
      // Artificial delay for setup sequence
      await new Promise(r => setTimeout(r, 2500));
      
      sessionStorage.setItem('interviewConfig', JSON.stringify({ ...form, questions }));
      router.push('/interview/room');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 animate-pulse">
          {loadingTexts[loadingTextIndex]}
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <h1 className="text-3xl font-bold text-white mb-2 text-center relative z-10">Prepare Your Interview</h1>
      <p className="text-zinc-400 text-center mb-8 relative z-10">Configure your mock session parameters.</p>

      {error && <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-6 text-sm text-center relative z-10">{error}</div>}

      <form onSubmit={handleStart} className="flex flex-col gap-5 relative z-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Company</label>
          <select name="company" value={form.company} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
            <option>Google</option>
            <option>Amazon</option>
            <option>TCS</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
            <option>SDE-1</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Round Type</label>
          <select name="roundType" value={form.roundType} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
            <option>HR / Behavioral</option>
            <option>DSA & Problem Solving</option>
            <option>Machine Coding</option>
            <option>Core CS Fundamentals</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Difficulty</label>
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
            <option>Mixed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Time Limit</label>
          <select name="timeLimit" value={form.timeLimit} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:ring-2 focus:ring-violet-500 outline-none transition-all">
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>60 minutes</option>
          </select>
        </div>

        <button type="submit" className="mt-4 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          Start Interview
        </button>
      </form>
    </div>
  );
}
