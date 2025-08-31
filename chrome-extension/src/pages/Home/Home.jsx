/*global chrome*/
import { useState, useEffect } from "react";
import "./Home.css";
import { CaptureIndicator } from "@/components";

const splitResponse = (str) => {
  const sentences = str.split("- ");
  const clinnedSentences = sentences.filter(
    (sentence) => sentence.trim() !== ""
  );

  const orderedSentences = clinnedSentences.map(
    (sentence, indx) => `${indx + 1}) ` + sentence.trim()
  );

  return orderedSentences;
};

export function Home() {
  const [audioEmotion, setAudioEmotion] = useState("");
  // const [textEmotion, setTextEmotion] = useState(null);
  const [domain, setDomain] = useState("");
  const [desiredResponse, setDesiredResponse] = useState("");
  const [emotionallyAwareResponse, setEmotionallyAwareResponse] = useState("");
  const [currentTabId, setCurrentTabId] = useState(null);
  const [isClearShown, setIsClearShown] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (chrome && chrome.runtime) {
      chrome.runtime.onMessage.addListener(function (message) {
        if (message.target !== "APP") return;
        if (message.currentTabId) {
          setCurrentTabId(message.currentTabId);
        }
        if (message.audio_emotion && message.audio_score) {
          setAudioEmotion(`${message.audio_emotion} (${message.audio_score}%)`);
        }
        if (message.domain) {
          setDomain(message.domain);
        }
        if (message.desired_response) {
          setDesiredResponse(message.desired_response);
        }
        if (message.emotionally_aware_response) {
          setEmotionallyAwareResponse(
            splitResponse(message.emotionally_aware_response)
          );
        }
      });
    }
  }, []);

  async function getMediaStreamId(targetTabId) {
    const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId });
    console.log("Media Stream ID:", streamId);
    return streamId;
  }

  async function handleMediaCapture(value) {
    try {
      let action, isCapturing, streamId;

      if (value === "start") {
        action = "START_CAPTURE";
        isCapturing = true;
        streamId = await getMediaStreamId(currentTabId);
      } else if (value === "stop") {
        action = "STOP_CAPTURE";
        isCapturing = false;
        setIsClearShown(true);
      }

      setIsCapturing(isCapturing);

      chrome.runtime.sendMessage({
        streamId,
        action,
        target: "SERVICE_WORKER",
      });
    } catch (error) {
      console.error("Capture error:", error);
    }
  }

  function handleClear() {
    setAudioEmotion("");
    setDomain("");
    setDesiredResponse("");
    setEmotionallyAwareResponse("");
    setIsClearShown(false);
  }

  return (
    <div className="container">
      <CaptureIndicator isCapturing={isCapturing} />
      <form className="capturing-form">
        <button
          type="button"
          onClick={() => handleMediaCapture("start")}
          disabled={isCapturing}
          className="button"
        >
          Start Capturing
        </button>
        <button
          type="button"
          onClick={() => handleMediaCapture("stop")}
          disabled={!isCapturing}
          className="button"
        >
          Stop Capturing
        </button>
        {isClearShown && (
          <button type="button" onClick={handleClear} className="button">
            Clear
          </button>
        )}
      </form>
      <div className="adviser-info">
        {audioEmotion && (
          <div>
            <b>Detected Audio Emotion:</b> {audioEmotion}
          </div>
        )}
        {domain && (
          <div>
            <b>Domain:</b> {domain}
          </div>
        )}
        {desiredResponse && (
          <div>
            <b>Desired Response: </b>
            {desiredResponse}
          </div>
        )}
        {emotionallyAwareResponse && (
          <div>
            <b>Emotionally Aware Response:</b>
            <div>
              {emotionallyAwareResponse.map((sentence) => (
                <p key={sentence}>{sentence}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
