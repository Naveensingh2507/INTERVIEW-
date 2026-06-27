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
      <div style={{ display: 'flex', height: '100vh', width: '100%', background: 'var(--bg)', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-primary)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--glow-bg)', filter: 'blur(150px)', zIndex: 0, pointerEvents: 'none', opacity: 0.5 }}></div>
        <div style={{ width: 96, height: 96, border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.6))', zIndex: 10 }}></div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#10b981', animation: 'pulseText 2s infinite', zIndex: 10 }}>
          Generating your HireReady Report...
        </h2>
        <p style={{ color: 'var(--text-sub)', marginTop: 16, maxWidth: 450, textAlign: 'center', zIndex: 10 }}>Analyzing your communication, technical accuracy, and non-verbal cues.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: 'var(--bg)', overflow: 'hidden', position: 'relative', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Timer */}
      <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', padding: '8px 24px', borderRadius: 999, boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: '0.1em', color: '#10b981' }}>{formatTime(timeLeft)}</span>
      </div>

      {/* Webcam mini feed */}
      <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 50, width: 192, height: 144, background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--card-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Monitoring Active</span>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      
      {/* End Button */}
      <button 
        onClick={endInterview}
        style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 50, padding: '12px 24px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 999, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif" }}
        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
      >
        End Interview
      </button>

      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', height: '100%', transition: 'width 0.5s', position: 'relative', width: isCodingActive ? '50%' : '100%', borderRight: isCodingActive ? '1px solid var(--card-border)' : 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 384, height: 384, background: 'var(--glow-bg)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.6, pointerEvents: 'none' }}></div>
          
          <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <WaveVisualizer state={waveState} audioLevel={audioLevel} />
            
            {!isCodingActive && (
              <button 
                onClick={() => setIsCodingActive(true)}
                style={{ marginTop: 48, padding: '12px 24px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-sub)', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Open Technical Whiteboard
              </button>
            )}
          </div>
        </div>

        {isCodingActive && (
          <div style={{ width: '50%', height: '100%', position: 'relative', background: 'var(--bg)', animation: 'slideInRight 0.5s ease-out' }}>
            <button 
              onClick={() => setIsCodingActive(false)}
              style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 8, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--text-sub)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.color = 'var(--text-sub)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <WhiteboardEditor code={code} setCode={setCode} />
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
