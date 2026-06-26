"use client";
import React, { useEffect, useState } from 'react';

export default function WaveVisualizer({ state, audioLevel = 0 }) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    let interval;
    if (state === 'THINKING' || state === 'SPEAKING' || state === 'IDLE') {
      interval = setInterval(() => {
        setPulse(prev => (prev + 1) % 100);
      }, state === 'SPEAKING' ? 50 : 100);
    }
    return () => clearInterval(interval);
  }, [state]);

  const renderWave = () => {
    if (state === 'IDLE') {
      return <div className="w-full h-1 bg-violet-500/50 rounded-full animate-pulse transition-all duration-1000" />;
    }
    
    if (state === 'LISTENING') {
      const height = Math.max(4, audioLevel * 150);
      return (
        <div className="flex items-center gap-2 h-32">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="w-3 bg-fuchsia-500 rounded-full transition-all duration-75"
              style={{ height: `${height * (Math.random() * 0.5 + 0.5)}px` }}
            />
          ))}
        </div>
      );
    }

    if (state === 'THINKING') {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 animate-spin drop-shadow-[0_0_20px_rgba(139,92,246,0.8)] opacity-80" />
        </div>
      );
    }

    if (state === 'SPEAKING') {
      return (
        <div className="flex items-center gap-2 h-32">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              className="w-3 bg-gradient-to-t from-violet-400 to-fuchsia-400 rounded-full transition-all duration-100 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]"
              style={{ height: `${Math.random() * 100 + 20}px` }}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="h-40 flex items-center justify-center w-full mb-8">
        {renderWave()}
      </div>
      <p className="text-zinc-400 font-medium tracking-wide animate-pulse">
        {state === 'IDLE' && "Interviewer is idle..."}
        {state === 'LISTENING' && "Interviewer is listening..."}
        {state === 'THINKING' && "Interviewer is thinking..."}
        {state === 'SPEAKING' && "Interviewer is speaking..."}
      </p>
    </div>
  );
}
