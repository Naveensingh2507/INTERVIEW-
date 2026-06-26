"use client";
import React, { useState } from 'react';

export default function CorrectionCard({ correction }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(correction.suggested_fix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-[#111] rounded-xl overflow-hidden border border-zinc-800/50 mb-6 shadow-sm">
      <div className="p-5 border-l-4 border-red-500/80 bg-red-500/5 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-red-500/20 text-red-400">Issue</span>
          <span className="text-sm font-medium text-zinc-300">{correction.issue}</span>
        </div>
        <p className="text-zinc-400 font-mono text-sm pl-1 line-through opacity-70">"{correction.original_line}"</p>
      </div>
      
      <div className="p-5 border-l-4 border-emerald-500/80 bg-emerald-500/5 flex flex-col gap-2 relative group">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400">Suggested Fix</span>
        </div>
        <p className="text-zinc-200 text-sm pl-1 leading-relaxed">"{correction.suggested_fix}"</p>
        
        <button 
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-md bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-zinc-700"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
