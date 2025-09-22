/*global chrome*/

import { useEffect } from "react";
import styles from "./capturingForm.module.css";
import {
  audioEmotionSetSelector,
  businessTypeStorageSetSelector,
  concernsAdvicesStorageSetSelector,
  desiredResponseSetSelector,
  domainEmotionSetSelector,
  emotionalyAwareResponseSetSelector,
  errorSetSelector,
  isCapturingSetSelector,
  isClearShownSetSelector,
  keywordsSetSelector,
  textEmotionsSetSelector,
  transcriptSetSelector,
  useShallowStore,
} from "@/store";

async function getMediaStreamId() {
  const streamId = await chrome.tabCapture.getMediaStreamId();
  console.log("Media Stream ID:", streamId);
  return streamId;
}

export function CapturingForm(/* {
  isCapturing,
  setIsCapturing,
  setTranscript,
  setAudioEmotion,
  setDomain,
  setDesiredResponse,
  setEmotionallyAwareResponse,
  setTextEmotions,
  setKeywords,
} */) {
  // const [isClearShown, setIsClearShown] = useState(false);
  const { isClearShown, setIsClearShown } = useShallowStore(
    isClearShownSetSelector
  );
  const { setError } = useShallowStore(errorSetSelector);
  const { concernsAdvicesStorage } = useShallowStore(
    concernsAdvicesStorageSetSelector
  );
  const { businessTypeStorage } = useShallowStore(
    businessTypeStorageSetSelector
  );
  const { setTranscript } = useShallowStore(transcriptSetSelector);
  const { setAudioEmotion } = useShallowStore(audioEmotionSetSelector);
  const { setDomain } = useShallowStore(domainEmotionSetSelector);
  const { setDesiredResponse } = useShallowStore(desiredResponseSetSelector);
  const { setEmotionallyAwareResponse } = useShallowStore(
    emotionalyAwareResponseSetSelector
  );
  const { setTextEmotions } = useShallowStore(textEmotionsSetSelector);
  const { setKeywords } = useShallowStore(keywordsSetSelector);
  const { isCapturing, setIsCapturing } = useShallowStore(
    isCapturingSetSelector
  );

  useEffect(() => {
    if (!chrome || !chrome.runtime) return;
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.target !== "APP") return;
      const { action } = message;
      if (action === "WEBSOCKET_CLOSED") {
        setIsCapturing(false);
        setIsClearShown(true);
        setError("Capture was stoped");
      }
      if (action === "WEBSOCKET_ERROR") {
        setIsCapturing(false);
        setIsClearShown(true);
        setError("Unable to connect with server");
      }
    });
  }, [setError, setIsCapturing, setIsClearShown]);

  function handleClear() {
    setTranscript("");
    setAudioEmotion("");
    setDomain("");
    setDesiredResponse("");
    setEmotionallyAwareResponse("");
    setTextEmotions([]);
    setKeywords([]);
    setIsClearShown(false);
  }

  async function handleMediaCapture(value) {
    try {
      let action, isCapturing, streamId;

      if (value === "start") {
        action = "START_CAPTURE";
        isCapturing = true;
        streamId = await getMediaStreamId();
      } else if (value === "stop") {
        action = "STOP_CAPTURE";
        isCapturing = false;
        setIsClearShown(true);
      }

      setIsCapturing(isCapturing);

      const message = {
        streamId,
        action,
        target: "SERVICE_WORKER",
      };

      if (
        action === "START_CAPTURE" &&
        concernsAdvicesStorage &&
        businessTypeStorage
      ) {
        const keywords_map = { [businessTypeStorage]: [] };
        const domain_response_map = {};
        concernsAdvicesStorage.forEach(({ concern, advice }) => {
          keywords_map[businessTypeStorage].push(concern.value);
          domain_response_map[concern.value] = advice.value;
        });
        message.keywords_map = keywords_map;
        message.domain_response_map = domain_response_map;
        message.business_name = businessTypeStorage;
      }
      console.log("Sending message:", message);

      chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error("Capture error:", error);
    }
  }

  return (
    <form className={styles.capturingForm}>
      <button
        type="button"
        onClick={() => handleMediaCapture("start")}
        disabled={isCapturing}
        className={styles.button}
      >
        Start Capturing
      </button>
      <button
        type="button"
        onClick={() => handleMediaCapture("stop")}
        disabled={!isCapturing}
        className={styles.button}
      >
        Stop Capturing
      </button>
      {isClearShown && (
        <button type="button" onClick={handleClear} className={styles.button}>
          Clear
        </button>
      )}
    </form>
  );
}
