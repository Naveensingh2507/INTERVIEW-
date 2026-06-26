"use client";
import React from 'react';

export default function WhiteboardEditor({ code, setCode }) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800">
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
        <h2 className="text-lg font-bold text-white tracking-wide">Technical Whiteboard</h2>
        <p className="text-xs text-zinc-500">Type your code or pseudocode here</p>
      </div>
      <textarea
        className="flex-1 w-full p-6 bg-transparent text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none resize-none"
        placeholder="// Start typing your solution..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />
    </div>
  );
}
