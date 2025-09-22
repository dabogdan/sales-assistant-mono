import {
  useShallowStore,
  audioEmotionSetSelector,
  domainEmotionSetSelector,
  desiredResponseSetSelector,
  emotionalyAwareResponseSetSelector,
  textEmotionsSetSelector,
  keywordsSetSelector,
} from "@/store";
import styles from "./adviserInfo.module.css";

export function AdviserInfo(/* {
  audioEmotion,
  textEmotions,
  keywords,
  domain,
  desiredResponse,
  emotionallyAwareResponse,
} */) {
  const { audioEmotion } = useShallowStore(audioEmotionSetSelector);
  const { domain } = useShallowStore(domainEmotionSetSelector);
  const { desiredResponse } = useShallowStore(desiredResponseSetSelector);
  const { emotionallyAwareResponse } = useShallowStore(
    emotionalyAwareResponseSetSelector
  );
  const { textEmotions } = useShallowStore(textEmotionsSetSelector);
  const { keywords } = useShallowStore(keywordsSetSelector);

  return (
    <div className={styles.adviserInfo}>
      {audioEmotion && (
        <div>
          <b>Detected Audio Emotion:</b> {audioEmotion}
        </div>
      )}
      {textEmotions && textEmotions.length > 0 && (
        <ul>
          <b>Detected Text Emotions:</b>
          {textEmotions.map(({ label, score }) => (
            <li key={label}>
              {label} ({score}%)
            </li>
          ))}
        </ul>
      )}
      {keywords && keywords.length > 0 && (
        <ul>
          <b>Detected Keywords:</b>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
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
          <div>{emotionallyAwareResponse}</div>
        </div>
      )}
    </div>
  );
}
