"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import WaveVisualizer from './WaveVisualizer';
import WhiteboardEditor from './WhiteboardEditor';
import { VADController } from '../lib/vadController';
import { MediaPipeController } from '../lib/mediapipeController';

export default function InterviewRoom() {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [isCodingActive, setIsCodingActive] = useState(false);
  const [code, setCode] = useState('');
  const [waveState, setWaveState] = useState('IDLE');
  const [audioLevel, setAudioLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const transcriptRef = useRef([]);
  const globalVisionLogRef = useRef([]);
  
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const vadRef = useRef(null);
  const mpRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('interviewConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      setConfig(parsed);
      const minutes = parseInt(parsed.timeLimit.split(' ')[0]) || 30;
      setTimeLeft(minutes * 60);
    }
  }, []);

  useEffect(() => {
    if (!config) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }).catch(err => console.error("Webcam error:", err));

    mpRef.current = new MediaPipeController();
    mpRef.current.initialize(videoRef.current);
    mpRef.current.startTracking();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    wsRef.current = new WebSocket(`${wsUrl}/ws/interview`);
    wsRef.current.onopen = () => {
      const timeLimitMinutes = parseInt(config.timeLimit?.split(' ')[0]) || 45;
      const enrichedConfig = {
        ...config,
        time_limit_minutes: timeLimitMinutes,
        student_name: config.student_name || 'there',
        round_type: config.roundType || config.round_type || '',
      };
      wsRef.current.send(JSON.stringify({ type: "init", config: enrichedConfig }));
      
      vadRef.current = new VADController(handleTurnEnd, setAudioLevel);
      vadRef.current.start();
      setWaveState('LISTENING');
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'ai_response' || data.type === 'tts_text') {
        const aiText = data.ai_text || data.text;
        
        if (data.user_transcript) {
           transcriptRef.current.push({
             role: "user",
             content: data.user_transcript,
             timestamp: formatTime(timeLeft)
           });
        }
        
        transcriptRef.current.push({
           role: "ai",
           content: aiText,
           timestamp: formatTime(timeLeft)
        });

        setWaveState('SPEAKING');
        const utterance = new SpeechSynthesisUtterance(aiText);
        utterance.onend = () => {
          setWaveState('LISTENING');
          if (vadRef.current) vadRef.current.resumeListening();
        };
        window.speechSynthesis.speak(utterance);
      }
    };

    return () => {
      clearInterval(timer);
      if (vadRef.current) vadRef.current.stop();
      if (mpRef.current) mpRef.current.stopTracking();
      if (wsRef.current) wsRef.current.close();
    };
  }, [config]); 

  useEffect(() => {
    if (mpRef.current) mpRef.current.setCodingActive(isCodingActive);
  }, [isCodingActive]);

  const handleTurnEnd = (base64Audio) => {
    setWaveState('THINKING');
    const logs = mpRef.current.getAndClearLogs();
    globalVisionLogRef.current = [...globalVisionLogRef.current, ...logs];
    
    const payload = {
      type: "user_turn",
      audio_base64: base64Audio,
      vision_log: logs,
      is_coding_active: isCodingActive
    };
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  const endInterview = async () => {
    setIsEvaluating(true);
    if (vadRef.current) vadRef.current.stop();
    if (mpRef.current) mpRef.current.stopTracking();
    if (wsRef.current) wsRef.current.close();
    
    try {
      const payload = {
        full_transcript: transcriptRef.current,
        vision_log: globalVisionLogRef.current,
        questions_asked: config?.questions || [],
        session_meta: {
          company_name: config.company,
          role: config.role,
          round_type: config.roundType,
          time_limit_minutes: parseInt(config.timeLimit?.split(' ')[0]) || 45,
          time_limit_used: formatTime(timeLeft)
        }
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const reportData = await res.json();
      sessionStorage.setItem('interviewReport', JSON.stringify(reportData));
      router.push('/interview/report');
    } catch (e) {
      console.error("Evaluation failed:", e);
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isEvaluating) {
    return (
      <div className="flex h-screen w-full bg-[#0a0a0a] items-center justify-center flex-col text-white relative">
        <div className="absolute inset-0 bg-violet-600/10 blur-[150px] z-0 pointer-events-none"></div>
        <div className="w-24 h-24 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] z-10"></div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 animate-pulse z-10">
          Generating your HireReady Report...
        </h2>
        <p className="text-zinc-400 mt-4 max-w-md text-center z-10">Analyzing your communication, technical accuracy, and non-verbal cues.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden relative text-white">
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.2)]">
        <span className="font-mono text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{formatTime(timeLeft)}</span>
      </div>

      <div className="absolute bottom-6 left-6 z-50 w-48 h-36 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800/80 shadow-2xl">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] uppercase font-bold text-white drop-shadow-md">Monitoring Active</span>
        </div>
      </div>
      
      <button 
        onClick={endInterview}
        className="absolute bottom-6 right-6 z-50 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
      >
        End Interview
      </button>

      <div className="flex w-full h-full">
        <div className={`flex flex-col items-center justify-center h-full transition-all duration-500 relative ${isCodingActive ? 'w-1/2 border-r border-zinc-800' : 'w-full'}`}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <WaveVisualizer state={waveState} audioLevel={audioLevel} />
            
            {!isCodingActive && (
              <button 
                onClick={() => setIsCodingActive(true)}
                className="mt-12 px-6 py-3 bg-zinc-900/80 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:border-fuchsia-500/50 transition-all shadow-lg flex items-center gap-2 text-sm text-zinc-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Open Technical Whiteboard
              </button>
            )}
          </div>
        </div>

        {isCodingActive && (
          <div className="w-1/2 h-full animate-in slide-in-from-right duration-500 relative bg-zinc-950">
            <button 
              onClick={() => setIsCodingActive(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-zinc-800 rounded-md hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <WhiteboardEditor code={code} setCode={setCode} />
          </div>
        )}
      </div>
    </div>
  );
}
