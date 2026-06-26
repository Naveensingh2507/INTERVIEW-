"use client";
import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import ATSScoreDashboard from '@/components/ATSScoreDashboard';
import CorrectionCard from '@/components/CorrectionCard';

export default function AuditResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('auditResults');
    if (stored) {
      try {
        setResults(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse results", e);
        router.push('/audit');
      }
    } else {
      router.push('/audit');
    }
  }, [router]);

  if (!results) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8 pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl mt-8">
        
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Audit Results</h1>
            <p className="text-zinc-400 text-sm">Review your ATS compatibility and line-by-line feedback.</p>
          </div>
          <button 
            onClick={() => router.push('/audit')}
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Audit Another Resume
          </button>
        </div>

        <ATSScoreDashboard score={results.ats_score} breakdown={results.score_breakdown} />

        {results.missing_keywords && results.missing_keywords.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {results.missing_keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-6">Line-by-Line Corrections</h2>
          {results.corrections && results.corrections.length > 0 ? (
            <div className="flex flex-col">
              {results.corrections.map((corr, idx) => (
                <CorrectionCard key={idx} correction={corr} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
              <p className="text-zinc-400">Great job! No major corrections found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
