import styles from "./businessTypeInputStyles.module.css";
import { useEffect, useState } from "react";
import { ConcernsList, Loader, WaitWarning } from "..";
import {
  businessTypeStorageSetSelector,
  concernsAdvicesStorageSetSelector,
  concernsSetSelector,
  errorSetSelector,
  isCapturingSetSelector,
  isDisabledSetSelector,
  useShallowStore,
} from "@/store";
import { DEFAULT_CONCERNS } from "@/components/ConcernsList/ConcernsList";
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
    setShouldShowLoader(true);
    setIsAllDisabled(true);
    setIsWarningShown(true);
    setBusinessTypeStorage(value);
    setIsGgenerateButtonDisabled(true);

    // reset UI before fetching
    setConcerns([...DEFAULT_CONCERNS]);
    setConcernsAdvicesStorage([]);

    try {
      const res = await fetch(import.meta.env.VITE_URL_AUTO_SUGGEST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: value }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let parsedOnce = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const m = chunk.match(/\[PROGRESS\s+(\d+)%\]/);
        if (m) setPercents(m[1]);

        buffer += chunk;

        if (!parsedOnce) {
          const mark = buffer.indexOf("[PARSED_OUTPUT]");
          if (mark !== -1) {
            const jsonStart = buffer.indexOf("{", mark);
            if (jsonStart !== -1) {
              const jsonStr = buffer.slice(jsonStart).replace(/[\r\n]*/g, "");
              try {
                const suggestions = JSON.parse(jsonStr);
                console.log(suggestions);

                // normalize: backend may return a string or an array with one item
                const suggestionsArr = Object.entries(suggestions).map(([concern, adv]) => ({
                  concern,
                  advice: Array.isArray(adv) ? adv[0] : String(adv ?? "").trim(),
                }));

                // cap to 30 per the new prompt
                if (suggestionsArr.length > 30) suggestionsArr.length = 30;

                const llmTagged = suggestionsArr.map(x => ({ ...x, source: "llm" }));
                setConcerns([...DEFAULT_CONCERNS, ...llmTagged]);
                parsedOnce = true;
              } catch {
                // partial JSON, keep buffering
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error saving business type:", error);
      setError("Ooops! We cannot generate suggestions buttons now...");
    } finally {
      setShouldShowLoader(false);
      setIsAllDisabled(false);
      setIsWarningShown(false);
      setIsGgenerateButtonDisabled(false);
    }
  };

  const handleSaveClick = () => {
    setConcernsAdvicesStorage([]);
    setBusinessTypeStorage(value);
    setConcerns(DEFAULT_CONCERNS);
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
