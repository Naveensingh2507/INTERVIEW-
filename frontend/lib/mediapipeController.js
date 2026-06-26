export class MediaPipeController {
  constructor() {
    this.visionLog = [];
    this.intervalId = null;
    this.isCodingActive = false;
  }

  async initialize(videoElement) {
    if (!window.FaceMesh) {
      console.warn("FaceMesh CDN not loaded yet.");
    }
    console.log("MediaPipe initialized.");
    this.videoElement = videoElement;
  }

  setCodingActive(isActive) {
    this.isCodingActive = isActive;
  }

  startTracking() {
    // Hard cap webcam frame sampling at MAX 3 FPS using setInterval
    this.intervalId = setInterval(() => {
      this.analyzeFrame();
    }, 333); 
  }

  stopTracking() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  analyzeFrame() {
    const timestamp = new Date().toISOString();
    let eyeContact = "good";
    let readingDetected = false;

    // Simulated type-writer effect check for prototype
    const randomVal = Math.random();
    if (randomVal > 0.95) readingDetected = true;

    if (!this.isCodingActive) {
      if (randomVal < 0.1) eyeContact = "poor";
    } else {
      eyeContact = "good"; 
    }

    this.visionLog.push({
      timestamp,
      eye_contact: eyeContact,
      posture: "good",
      reading_detected: readingDetected
    });
  }

  getAndClearLogs() {
    const logs = [...this.visionLog];
    this.visionLog = [];
    return logs;
  }
}
