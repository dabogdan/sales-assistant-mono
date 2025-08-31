/*global chrome*/
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioEmotion, setAudioEmotion] = useState(null);
  const [textEmotions, setTextEmotions] = useState([]);
  const [interpretation, setInterpretation] = useState({summary: "", domain: ""});

  const getActiveTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    return tab;
  };

  useEffect(() => {
    if (chrome && chrome.runtime) {
      chrome.runtime.onMessage.addListener(function (request) {
        if (request.transcript) {
          setTranscript(request.transcript);
        }
        if (request.audio_emotion && request.text_emotions) {
          setAudioEmotion(`${request.audio_emotion} (${request.audio_score}%)`);
          setTextEmotions(request.text_emotions);
        }        
        if (request.interpretation) {
          setInterpretation(request.interpretation);
        }
      });
    }
  }, []);

  async function handeMediaCapture(value) {
    try {
      const tab = await getActiveTab();
      let action, isCapturing;

      if (value === "start") {
        action = "START_CAPTURE";
        isCapturing = true;
      } else if (value === "stop") {
        action = "STOP_CAPTURE";
        isCapturing = false;
      }

      setIsCapturing(isCapturing);

      chrome.runtime.sendMessage({ tabId: tab.id, action });
    } catch (error) {
      console.error("Capture error:", error);
    }
  }

  return (
    <div className="container">
      <h3 className="app-title">AI Sales Assistant</h3>
      <form className="capturing-form">
        <button
          type="button"
          onClick={() => handeMediaCapture("start")}
          disabled={isCapturing}
          className="button"
        >
          Start Capturing
        </button>
        <button
          type="button"
          onClick={() => handeMediaCapture("stop")}
          disabled={!isCapturing}
          className="button"
        >
          Stop Capturing
        </button>
      </form>
      {transcript && (
        <div className="transcript-display">
          <span className="transcript-title">Transcript below:</span>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}
      {(audioEmotion || textEmotions.length > 0) && (
        <div className="emotion-display">
          <span className="emotion-title">Detected Emotions:</span>
          <p className="emotion-text">Audio: {audioEmotion || "N/A"}</p>
          <div className="text-emotions">
            <p className="emotion-text">Text:</p>
            <ul>
              {textEmotions.map((e, index) => (
                <li key={index}>
                  {e.label} ({e.score}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {interpretation && (
        <div className="interpretation-display">
          <span className="interpretation-title">Summary:</span>
          <div>
            <strong className="interpretation-title">{interpretation.domain}</strong>
          </div>
          <p className="interpretation-text">{interpretation.summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
