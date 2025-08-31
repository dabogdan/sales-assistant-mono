import styles from "./businessTypeInputStyles.module.css";
import { useEffect, useState } from "react";
import { Loader, WaitWarning } from "..";
import {
  businessTypeStorageSetSelector,
  concernsAdvicesStorageSetSelector,
  concernsSetSelector,
  errorSetSelector,
  isCapturingSetSelector,
  isDisabledSetSelector,
  useShallowStore,
} from "@/store";
// import { simulateApiResponse } from "@/helpers";
// import { suggestionsRes } from "@/mockData";

export function BusinessTypeInput() {
  const [value, setValue] = useState("");
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [saveButtonName, setSaveButtonName] = useState("");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [isGenerateButtonDisabled, setIsGgenerateButtonDisabled] =
    useState(false);
  const [isAttentionShown, setIsAttentionShown] = useState(false);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [percents, setPercents] = useState("0");
  const { businessTypeStorage, setBusinessTypeStorage } = useShallowStore(
    businessTypeStorageSetSelector
  );
  const { setConcernsAdvicesStorage } = useShallowStore(
    concernsAdvicesStorageSetSelector
  );
  const { isAllDisabled, setIsAllDisabled } = useShallowStore(
    isDisabledSetSelector
  );
  const { concerns, setConcerns } = useShallowStore(concernsSetSelector);
  const { setError } = useShallowStore(errorSetSelector);
  const { isCapturing } = useShallowStore(isCapturingSetSelector);

  useEffect(() => {
    setIsAttentionShown(value !== businessTypeStorage);
  }, [businessTypeStorage, value]);

  useEffect(() => {
    if (businessTypeStorage) {
      setValue(businessTypeStorage);
    }
  }, [businessTypeStorage, setValue]);

  useEffect(() => {
    if (value !== businessTypeStorage) {
      setSaveButtonName("Save");
      setIsSaveButtonDisabled(false);
    } else {
      setSaveButtonName("Saved");
      setIsSaveButtonDisabled(true);
    }
  }, [businessTypeStorage, value]);

  useEffect(() => {
    if (!businessTypeStorage || isCapturing) setIsGgenerateButtonDisabled(true);
    else setIsGgenerateButtonDisabled(false);
  }, [businessTypeStorage, isCapturing]);

  const handleChangeClick = (event) => {
    setValue(event.target.value);
  };

  const handleGenerateClick = async () => {
    try {
      setShouldShowLoader(true);
      setIsAllDisabled(true);
      setIsWarningShown(true);
      setBusinessTypeStorage(value);
      setIsGgenerateButtonDisabled(true);

      const res = await fetch(import.meta.env.VITE_URL_AUTO_SUGGEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ business: businessTypeStorage }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        const percents = chunk.match(/\d{1,2}/)?.[0];
        setPercents(percents);

        const suggestionsJSON = chunk
          .replace(/\[.+\]/, "")
          .replace(/[\r\n]*/g, "");
        if (suggestionsJSON) {
          const suggestions = JSON.parse(suggestionsJSON);
          const suggestionsArr = Object.entries(suggestions).map(
            ([concern, advices]) => ({
              concern,
              advice: advices[0],
            })
          );

          // If there are more than 5 suggestions, keep only the first 5
          if (suggestionsArr.length > 5) {
            suggestionsArr.splice(5);
          }

          const suggestionsJoined = concerns.concat(suggestionsArr);
          setConcerns(suggestionsJoined);
        }
      }
      setShouldShowLoader(false);
      setIsAllDisabled(false);
      setIsWarningShown(false);
      setIsGgenerateButtonDisabled(false);
    } catch (error) {
      console.error("Error saving business type:", error);
      setShouldShowLoader(false);
      setIsAllDisabled(false);
      setIsWarningShown(false);
      setIsGgenerateButtonDisabled(false);
      setError("Ooops! We cannot generate suggestions buttons now...");
    }
  };

  const handleSaveClick = () => {
    setConcernsAdvicesStorage([]);
    setBusinessTypeStorage(value);
  };

  return (
    <div className={styles.inputContainer}>
      <label htmlFor="business-type" className={styles.label}>
        Business type
      </label>
      <div className={styles.inputWrapper}>
        <input
          id="business-type"
          type="text"
          value={value}
          disabled={isAllDisabled}
          onChange={handleChangeClick}
          placeholder="Enter business type"
          className={styles.input}
        />
        <button
          disabled={isSaveButtonDisabled || isAllDisabled}
          onClick={handleSaveClick}
          className={styles.saveButton}
        >
          {saveButtonName}
        </button>
        <button
          disabled={isGenerateButtonDisabled || isAllDisabled}
          onClick={handleGenerateClick}
          className={styles.saveButton}
        >
          {shouldShowLoader ? <Loader /> : "Generate"}
        </button>
      </div>
      {isAttentionShown && (
        <div className={styles.attentionText}>
          You delete your concerns and advices if you change business type.
        </div>
      )}
      <WaitWarning shouldShow={isWarningShown} percents={percents} />
    </div>
  );
}
