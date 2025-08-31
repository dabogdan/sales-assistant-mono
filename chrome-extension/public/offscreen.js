/*global chrome*/

class CaptureAudio {
  constructor() {
    this.audioProcessor = null;
    // this.requestUserPermission();
    this.handleEvents();
  }

  requestUserPermission() {
    try {
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (error) {
      console.error("Get user permission failed:", error);
    }
  }

  handleEvents() {
    chrome.runtime.onMessage.addListener(
      async (message /* , sender, sendResponse */) => {
        if (message.target !== "OFFSCREEN") return;
        console.log("Received message in offscreen:", message);

        if (["START_CAPTURE", "STOP_CAPTURE"].includes(message.action)) {
          if (message.action === "START_CAPTURE") {
            const audioDisplayStream =
              await navigator.mediaDevices.getUserMedia({
                audio: {
                  mandatory: {
                    chromeMediaSource: "tab",
                    chromeMediaSourceId: message.streamId,
                  },
                },
                video: false,
              });

            this.audioProcessor = new AudioProcessor(audioDisplayStream);
            this.audioProcessor.startRecording();
          } else {
            if (this.audioProcessor) this.audioProcessor.stopRecording();
          }
        }
      }
    );
  }
}

//Run class constructor
new CaptureAudio();

class AudioProcessor {
  constructor(audioDisplayStream) {
    this.audioDisplayStream = audioDisplayStream;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.speechRecognition = null;
    this.socket = null;
    this.socketReady = false;
    this.latestTranscript = "";
  }

  initWebSocket() {
    return new Promise((resolve) => {
      this.socket = new WebSocket("ws://localhost:8000/ws/emotion");

      this.socket.onopen = () => {
        console.log("🔌 WebSocket opened");
        this.socketReady = true;
        resolve();
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🧠 Emotion message:", data);

        chrome.runtime.sendMessage({
          target: "APP",
          audio_emotion: data.audio_emotion.label,
          audio_score: data.audio_emotion.score,
          text_emotions: data.text_emotions,
          domain: data.domain,
          desired_response: data.desired_response,
          emotionally_aware_response: data.emotionally_aware_response,
        });
      };

      this.socket.onerror = (e) => {
        console.error("WebSocket error:", e);
      };

      this.socket.onclose = () => {
        console.log("🔌 WebSocket closed");
        this.socketReady = false;
      };
    });
  }

  initSpeechRecognition() {
    const recognition =
      window.SpeechRecognition || new window.webkitSpeechRecognition() || null;
    if (!recognition) {
      alert("Web Speech API not supported");
      return null;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      this.processTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    return recognition;
  }

  //  this defines the end of your file, whenever called, a new file is created from the recorded data
  createFileFromCurrentRecordedData(recordedData) {
    const blob = new Blob(recordedData, { type: "audio/wav" });
    const file = new File([blob], "yourfilename.wav", { type: "audio/wav" });
    return file;
  }

  // Continue to play the captured audio to the user.
  playForUser() {
    const output = new AudioContext();
    const source = output.createMediaStreamSource(this.audioDisplayStream);
    source.connect(output.destination);
  }

  async startRecording() {
    // if (!this.speechRecognition) {
    //   this.speechRecognition = this.initSpeechRecognition();
    // }

    // if (this.speechRecognition) {
    //   this.speechRecognition.start();
    // }

    // enable audio playback for the user
    this.playForUser();

    await this.initWebSocket();

    if (this.audioDisplayStream.getAudioTracks().length === 0) {
      console.warn("⚠️ No audio tracks in stream");
      return;
    }

    if (!MediaRecorder.isTypeSupported("audio/webm")) {
      console.error("❌ audio/webm not supported");
      return;
    }

    this.mediaRecorder = new MediaRecorder(this.audioDisplayStream, {
      mimeType: "audio/webm",
    });

    this.mediaRecorder.onstart = () => {
      console.log("📢 MediaRecorder started");
    };

    this.mediaRecorder.ondataavailable = (event) => {
      console.log("📦 Audio data available", event.data);

      if (event.data.size > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Audio = reader.result.split(",")[1]; // remove data prefix

          const payload = {
            audio: base64Audio,
            transcript: this.latestTranscript,
            timestamp: Date.now(),
          };

          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(payload));
          }
        };

        reader.readAsDataURL(event.data); // Convert blob to base64
      }
    };

    this.mediaRecorder.onstop = () => {
      console.log("🛑 mediaRecorder stopped");

      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log("📤 sending 'end' to server");
        this.socket.send(JSON.stringify({ type: "end" }));
        this.socket.close();
      }
    };

    this.mediaRecorder.start(1000); // 1s chunks
    console.log("⏺️ MediaRecorder started");
    this.isRecording = true;
  }

  stopRecording() {
    console.log("🛑 stopRecording called");

    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }

    if (this.mediaRecorder && this.isRecording) {
      // Stopping the tracks.
      this.mediaRecorder.stream.getTracks().forEach((t) => t.stop());

      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  processTranscript(transcript) {
    const processedTranscript = this.cleanTranscript(transcript);
    this.latestTranscript = processedTranscript;
    this.displayTranscript(processedTranscript);
  }

  cleanTranscript(transcript) {
    return transcript
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .trim();
  }

  displayTranscript(transcript) {
    chrome.runtime.sendMessage({ target: "APP", transcript });
  }
}
