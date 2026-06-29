import { audioFillers } from '../config/audioFillers';

export class VADController {
  constructor(onTurnEnd, onAudioLevel) {
    this.onTurnEnd = onTurnEnd;
    this.onAudioLevel = onAudioLevel;
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.isListening = false;
    this.silenceStart = null;
    this.silenceThreshold = 0.015; 
    this.silenceDuration = 2500; 
    this.animationFrame = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { noiseSuppression: true, echoCancellation: true } 
      });
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);
      
      this.mediaRecorder = new MediaRecorder(this.mediaStream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      
      this.isListening = true;
      this.mediaRecorder.start();
      this.monitor();
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  }

  monitor() {
    if (!this.isListening || !this.analyser) return;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const val = (dataArray[i] - 128) / 128;
      sum += val * val;
    }
    const rms = Math.sqrt(sum / dataArray.length);
    if (this.onAudioLevel) this.onAudioLevel(rms);

    if (rms < this.silenceThreshold) {
      if (!this.silenceStart) {
        this.silenceStart = Date.now();
      } else if (Date.now() - this.silenceStart > this.silenceDuration) {
        this.triggerEndTurn();
      }
    } else {
      this.silenceStart = null;
    }

    this.animationFrame = requestAnimationFrame(() => this.monitor());
  }

  triggerEndTurn() {
    this.isListening = false;
    cancelAnimationFrame(this.animationFrame);
    
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1];
          this.onTurnEnd(base64String);
        };
      };
    }
  }

  // playFiller() removed to prevent native TTS from speaking

  resumeListening() {
    this.silenceStart = null;
    this.isListening = true;
    this.audioChunks = [];
    if (this.mediaRecorder && this.mediaRecorder.state === "inactive") {
      this.mediaRecorder.start();
    }
    this.monitor();
  }

  stop() {
    this.isListening = false;
    cancelAnimationFrame(this.animationFrame);
    if (this.mediaStream) this.mediaStream.getTracks().forEach(t => t.stop());
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}
