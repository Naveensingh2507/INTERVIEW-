"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostInterviewReport() {
  const [report, setReport] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem('interviewReport');
    if (saved) {
      setReport(JSON.parse(saved));
    }
  }, []);

  if (!report) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading report...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-md">
            Your HireReady Report
          </h1>
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={() => window.print()} 
              className="px-6 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors text-sm font-bold"
            >
              Download Report
            </button>
            <button 
              onClick={() => router.push('/interview/setup')} 
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              Practice Again
            </button>
          </div>
        </div>

        {/* Section 1: Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Technical Accuracy', val: report.scores?.technical_accuracy || 0 },
            { label: 'Communication', val: report.scores?.communication_structure || 0 },
            { label: 'Confidence', val: report.scores?.confidence_delivery || 0 },
            { label: 'Overall Score', val: report.scores?.overall || 0, highlight: true }
          ].map((score, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${score.highlight ? 'bg-violet-900/20 border-violet-500/50 relative overflow-hidden group' : 'bg-zinc-900/50 border-zinc-800 hover:border-violet-500/30 transition-colors'}`}>
              {score.highlight && <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>}
              <div className="text-sm text-zinc-400 mb-2 relative z-10">{score.label}</div>
              <div className={`text-5xl font-bold relative z-10 ${score.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-md' : 'text-white'}`}>
                {score.val}
              </div>
            </div>
          ))}
        </div>

        {/* Section 2: Behavioral Timeline */}
        {report.behavioral_timeline && report.behavioral_timeline.length > 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-12 hover:border-violet-500/30 transition-colors">
            <h2 className="text-xl font-bold text-white mb-6">Behavioral Timeline</h2>
            <div className="relative w-full h-4 bg-zinc-800 rounded-full my-8">
              {report.behavioral_timeline?.map((event, i) => {
                const parts = event.timestamp.split(':');
                const m = parseInt(parts[0]) || 0;
                const s = parseInt(parts[1]) || 0;
                const totalSecs = (m * 60) + s;
                // Scale assuming 1800s (30 mins) max duration for timeline distribution
                const pct = Math.min((totalSecs / 1800) * 100, 100);
                const color = event.severity === 'warning' ? 'bg-red-500' : 'bg-emerald-500';
                
                return (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 group" style={{ left: `${pct}%` }}>
                    <div className={`w-4 h-4 rounded-full border-2 border-zinc-900 cursor-pointer ${color} hover:scale-150 transition-transform`}></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-zinc-800 border border-zinc-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-xs">
                      <span className="font-mono text-violet-400 block mb-1">{event.timestamp}</span>
                      {event.event}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3 & 4 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* STAR Gaps */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/30 transition-colors">
            <h2 className="text-xl font-bold text-white mb-6">STAR Framework Gaps</h2>
            {!report.star_gaps || report.star_gaps.length === 0 ? (
              <p className="text-zinc-500">Perfect STAR answers detected. Great job!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {report.star_gaps?.map((gap, i) => (
                  <div key={i} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                    <p className="text-sm font-medium text-zinc-300 mb-2">Q: "{gap.question}"</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded text-xs font-bold border border-violet-500/30">
                        Missing: {gap.missing_component}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{gap.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice Roadmap */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/30 transition-colors">
            <h2 className="text-xl font-bold text-white mb-6">Actionable Practice Roadmap</h2>
            <ul className="flex flex-col gap-4">
              {report.practice_roadmap?.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold border border-violet-500/30 shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-zinc-300 pt-1">{step}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Section 5: Cheating Flags */}
        {report.cheating_flags && report.cheating_flags.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-8 mb-12">
            <h2 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Proctoring Flags Detected
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.cheating_flags.map((flag, i) => (
                <div key={i} className="p-4 bg-zinc-950/50 rounded-xl border border-amber-500/20 flex flex-col gap-1">
                  <span className="font-mono text-amber-400 text-sm">{flag.timestamp} — {flag.type.replace('_', ' ')}</span>
                  <span className="text-zinc-400 text-sm">{flag.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
