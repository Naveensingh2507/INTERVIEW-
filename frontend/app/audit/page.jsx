"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeUploader from '@/components/ResumeUploader';

export default function AuditInputPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateAudit = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);

      const res = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to generate audit");
      }

      const data = await res.json();
      sessionStorage.setItem('auditResults', JSON.stringify(data));
      router.push('/audit/results');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-zinc-200">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-medium">Auditing your resume...</h2>
        <p className="text-zinc-500 mt-2">This may take a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-200 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-2 text-white">AI Resume Auditor</h1>
        <p className="text-zinc-400 mb-8">Upload your resume and paste the job description to get an actionable ATS audit.</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">1. Your Resume</label>
            <div className="flex-1 min-h-[300px]">
              <ResumeUploader file={file} setFile={setFile} />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider">2. Job Description</label>
            <textarea 
              className="flex-1 w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none min-h-[300px]"
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={handleGenerateAudit}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-transform active:scale-95 shadow-lg flex items-center gap-2"
          >
            Generate ATS Audit
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
