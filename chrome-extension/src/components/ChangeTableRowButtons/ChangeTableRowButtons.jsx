import styles from "./changeTableRowButtons.module.css";
import {
  businessTypeStorageSetSelector,
  concernsAdvicesStorageSetSelector,
  errorSetSelector,
  isDisabledSetSelector,
  useShallowStore,
} from "@/store";

export function ChangeTableRowButtons({
  shouldShowButtons,
  isGenerateButtonShown = false,
  setTableData,
  tableData,
  rowIndx,
  fieldForSave,
}) {
  const { concernsAdvicesStorage, setConcernsAdvicesStorage } = useShallowStore(
    concernsAdvicesStorageSetSelector
  );
  const { isAllDisabled, setIsAllDisabled } = useShallowStore(
    isDisabledSetSelector
  );
  const { businessTypeStorage } = useShallowStore(
    businessTypeStorageSetSelector
  );
  const { setError } = useShallowStore(errorSetSelector);

  const handleGenerateClick = async () => {
    setIsAllDisabled(true);
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIndx].isAdviceLoading = true;
      return newData;
    });

    try {
      const concernValue = tableData[rowIndx]?.concern?.value ?? "";
      if (!concernValue.trim()) return;

      const res = await fetch(import.meta.env.VITE_URL_GENERATE_SUGGESTIONS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: concernValue,
          business: businessTypeStorage,
        }),
      });

      const data = await res.json();
      const firstSuggestion = data.suggestions[0] || "";

      setIsAllDisabled(false);
      setTableData((prev) => {
        const newData = [...prev];
        newData[rowIndx].advice.value = firstSuggestion;
        newData[rowIndx].isAdviceLoading = false;
        return newData;
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setIsAllDisabled(false);
      setTableData((prev) => {
        const newData = [...prev];
        newData[rowIndx].isAdviceLoading = false;
        return newData;
      });
      setError("Ooops! We cannot generate advice now...");
    }
  };

  const handleSaveClick = () => {
    const updatedData = [...tableData];

    updatedData[rowIndx][fieldForSave] = true;
    setTableData(updatedData);

    const updatedStorageState = [...tableData];
    setConcernsAdvicesStorage(updatedStorageState);

    setTimeout(() => {
      updatedData[rowIndx][fieldForSave] = false;
      setTableData(updatedData);
      setConcernsAdvicesStorage(updatedData);
    }, 1000);
  };

  const handleDiscardClick = () => {
    setTableData(concernsAdvicesStorage);
  };

  return (
    <>
      {shouldShowButtons ? (
        <div className={styles.container}>
          <button
            className={styles.button}
            onClick={handleSaveClick}
            // disabled={isAllDisabled}
          >
            Save
          </button>
          <button
            className={styles.button}
            onClick={handleDiscardClick}
            // disabled={isAllDisabled}
          >
            Discard
          </button>
          {isGenerateButtonShown && (
            <button
              className={styles.button}
              onClick={handleGenerateClick}
              disabled={isAllDisabled}
            >
              Update Advice
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}
