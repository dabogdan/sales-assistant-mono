/*global chrome*/
import { useEffect } from "react";
import "./Home.css";
import {
  AdviserInfo,
  CaptureIndicator,
  CapturingForm,
  CommonError,
} from "@/components";
import {
  audioEmotionSetSelector,
  desiredResponseSetSelector,
  domainEmotionSetSelector,
  emotionalyAwareResponseSetSelector,
  keywordsSetSelector,
  textEmotionsSetSelector,
  transcriptSetSelector,
  useShallowStore,
} from "@/store";

export function Home() {
  const { transcript, setTranscript } = useShallowStore(transcriptSetSelector);
  const { setAudioEmotion } = useShallowStore(audioEmotionSetSelector);
  const { setDomain } = useShallowStore(domainEmotionSetSelector);
  const { setDesiredResponse } = useShallowStore(desiredResponseSetSelector);
  const { setEmotionallyAwareResponse } = useShallowStore(
    emotionalyAwareResponseSetSelector
  );
  const { setTextEmotions } = useShallowStore(textEmotionsSetSelector);
  const { setKeywords } = useShallowStore(keywordsSetSelector);

  useEffect(() => {
    if (chrome && chrome.runtime) {
      chrome.runtime.onMessage.addListener(function (message) {
        if (message.target !== "APP") return;

        const {
          transcript,
          audio_emotion_label,
          audio_emotion_score,
          text_emotions,
          keywords,
          domain,
          desired_response,
          emotionally_aware_response,
        } = message;

        if (transcript) setTranscript(transcript);

        if (audio_emotion_label && audio_emotion_score) {
          setAudioEmotion(`${audio_emotion_label} (${audio_emotion_score}%)`);
        }
        if (text_emotions) {
          setTextEmotions(text_emotions);
        }
        if (keywords) setKeywords(keywords);
        if (domain) {
          setDomain(domain);
        }
        if (desired_response) {
          setDesiredResponse(desired_response);
        }
        if (emotionally_aware_response) {
          setEmotionallyAwareResponse(emotionally_aware_response);
        }
      });
    }
  }, [
    setAudioEmotion,
    setDesiredResponse,
    setDomain,
    setEmotionallyAwareResponse,
    setKeywords,
    setTextEmotions,
    setTranscript,
  ]);

  return (
    <div className="container">
      <CaptureIndicator />
      <div className="transcript">{transcript}</div>
      <CapturingForm />
      <CommonError />
      <AdviserInfo />
    </div>
  );
}
