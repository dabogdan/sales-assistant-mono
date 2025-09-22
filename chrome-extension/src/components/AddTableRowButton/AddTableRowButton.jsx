import { getTableRow } from "@/helpers";
import styles from "./addTableRowButton.module.css";

export function AddTableRowButton({ /* isAllDisabled, */ setTableData }) {
  const handleAddRowClick = () => {
    const newRow = {
      ...getTableRow("", ""),
      isAdviceLoading: false,
      isConcernSaved: false,
      isAdviceSaved: false,
    };
    setTableData((prevState) => {
      const updatedData = [...prevState, newRow];
      return updatedData;
    });
  };

  return (
    <button
      onClick={handleAddRowClick}
      // disabled={isAllDisabled}
      className={styles.addButton}
    >
      +
    </button>
  );
}
