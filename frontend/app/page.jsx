"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-zinc-200">
      <div className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 mb-6 drop-shadow-lg">
          HIREVAULT
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          AI-powered interview prep and resume auditing. Get ready to land your dream job with confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Card 1 */}
        <div 
          onClick={() => router.push('/audit')}
          className="group relative bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 rounded-2xl cursor-pointer hover:border-indigo-500/50 transition-all shadow-xl overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">AI Resume Auditor</h2>
          <p className="text-zinc-400 mb-8 relative z-10">Upload your resume and a job description to get an actionable ATS score and line-by-line feedback.</p>
          <button className="px-6 py-3 bg-zinc-800 text-white rounded-full font-medium group-hover:bg-indigo-600 transition-colors relative z-10 w-full mt-auto">
            Try Auditor
          </button>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => router.push('/interview/setup')}
          className="group relative bg-zinc-900/80 backdrop-blur border border-zinc-800 p-8 rounded-2xl cursor-pointer hover:border-fuchsia-500/50 transition-all shadow-xl overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-fuchsia-500/10 rounded-full flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">AI Mock Interviewer</h2>
          <p className="text-zinc-400 mb-8 relative z-10">Practice with a real-time AI interviewer. Features voice chat, a technical whiteboard, and deep analysis.</p>
          <button className="px-6 py-3 bg-zinc-800 text-white rounded-full font-medium group-hover:bg-fuchsia-600 transition-colors relative z-10 w-full mt-auto">
            Start Mock Interview
          </button>
        </div>

      </div>
    </div>
  );
}
