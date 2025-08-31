import styles from "./deleteTableRowButton.module.css";

export function DeleteTableRowButton({
  // isAllDisabled,
  rowId,
  setTableData,
  setConcernsAdvicesStorage,
}) {
  const handleDeleteRowClick = () => {
    setTableData((prevState) => {
      const updatedData = prevState.filter((row) => row.id !== rowId);
      setConcernsAdvicesStorage(updatedData);
      return updatedData;
    });
  };

  return (
    <button
      onClick={handleDeleteRowClick}
      // disabled={isAllDisabled}
      className={styles.button}
    >
      Delete
    </button>
  );
}
