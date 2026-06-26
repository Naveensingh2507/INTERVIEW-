"use client";
import React, { useCallback } from 'react';

export default function ResumeUploader({ file, setFile }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  }, [setFile]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div 
      onDrop={handleDrop} 
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center w-full h-full min-h-[300px] p-6 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-500 transition-all cursor-pointer"
      onClick={() => document.getElementById('file-upload').click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        accept=".pdf" 
        className="hidden" 
        onChange={handleChange} 
      />
      {file ? (
        <div className="flex flex-col items-center">
          <svg className="w-12 h-12 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-zinc-200 font-medium">{file.name}</span>
          <span className="text-zinc-500 text-sm mt-2">Click or drag to change file</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-zinc-400">
          <svg className="w-12 h-12 mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="font-medium text-zinc-300">Upload your Resume (PDF)</p>
          <p className="text-sm mt-1">Drag and drop, or click to browse</p>
        </div>
      )}
    </div>
  );
}
