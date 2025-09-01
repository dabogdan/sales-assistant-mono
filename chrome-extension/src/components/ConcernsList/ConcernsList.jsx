import { getTableRow } from "@/helpers";
import styles from "./concernsList.module.css";
import { useEffect } from "react";
import {
  concernsAdvicesStorageSetSelector,
  concernsSetSelector,
  isDisabledSetSelector,
  useShallowStore,
} from "@/store";

export const DEFAULT_CONCERNS = [
  { concern: "too expensive", advice: "Consider lowering the price" },
  { concern: "no budget right now", advice: "Offer a phased plan or deferred start; include a simple ROI estimate." },
  { concern: "need to think about it", advice: "Send a 1-page summary with ROI and book a short follow-up." },
  { concern: "need to check with my boss", advice: "Provide a decision-maker brief and offer to join their internal call." },
  { concern: "already using a competitor", advice: "Highlight key differentiators and propose a small side-by-side pilot." }
];

export function ConcernsList() {
  const { concernsAdvicesStorage, setConcernsAdvicesStorage } = useShallowStore(
    concernsAdvicesStorageSetSelector
  );
  const { isAllDisabled } = useShallowStore(isDisabledSetSelector);
  const { concerns, setConcerns } = useShallowStore(concernsSetSelector);

  useEffect(() => {
    setConcerns(DEFAULT_CONCERNS);
  }, [setConcerns]);

  const handleConcernClick = (concern) => {
    return () => {
      const filteredConcerns = concerns.filter(
        (con) => con.concern !== concern.concern
      );
      setConcerns(filteredConcerns);
      const newRow = {
        ...getTableRow(concern.concern, concern.advice),
        isAdviceLoading: false,
        isConcernSaved: false,
        isAdviceSaved: false,
      };
      const newState = [...concernsAdvicesStorage, newRow];
      setConcernsAdvicesStorage(newState);
    };
  };

  return (
    <div className={styles.concernsList}>
      {concerns &&
        concerns.length > 0 &&
        concerns.map((concern) => (
          <button
            key={concern.concern}
            type="button"
            disabled={isAllDisabled}
            onClick={handleConcernClick(concern)}
          >
            {concern.concern}
          </button>
        ))}
    </div>
  );
}
