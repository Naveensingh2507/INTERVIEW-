"use client";
import React, { useEffect, useState } from 'react';

export default function ATSScoreDashboard({ score, breakdown }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = score / 50; 
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center mb-12 w-full relative">
      <div className="absolute top-10 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="relative flex items-center justify-center mb-12">
        <svg className="transform -rotate-90 w-48 h-48 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-zinc-800/80" />
          <circle 
            cx="96" 
            cy="96" 
            r={radius} 
            stroke="url(#scoreGradient)" 
            strokeWidth="10" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className="transition-all duration-300 ease-out drop-shadow-xl" 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-md">{animatedScore}</span>
          <span className="text-xs text-zinc-400 uppercase tracking-widest mt-1 font-medium">ATS Score</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {[
          { label: 'Keyword Match', val: breakdown.keyword_match, max: 40 },
          { label: 'Impact & Metrics', val: breakdown.impact_and_metrics, max: 30 },
          { label: 'Formatting', val: breakdown.formatting, max: 20 },
          { label: 'Core Fundamentals', val: breakdown.core_fundamentals, max: 10 }
        ].map((item, i) => (
          <div key={i} className="bg-zinc-900/80 backdrop-blur border border-zinc-800/80 hover:border-violet-500/30 transition-colors rounded-xl p-5 flex flex-col items-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-3xl font-bold text-white mb-1 relative z-10">{item.val} <span className="text-sm text-zinc-500 font-normal">/ {item.max}</span></span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider text-center relative z-10 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
