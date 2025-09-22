import {
  concernsAdvicesStorageSetSelector,
  // isDisabledSetSelector,
  useShallowStore,
} from "@/store";
import {
  AddTableRowButton,
  ChangeTableRowButtons,
  CheckMark,
  DeleteTableRowButton,
  Loader,
} from "..";
import styles from "./concernAdviceTableStyles.module.css";
import { useEffect, useState } from "react";

export function ConcernAdviceTable() {
  const [tableData, setTableData] = useState([]);
  const { concernsAdvicesStorage, setConcernsAdvicesStorage } = useShallowStore(
    concernsAdvicesStorageSetSelector
  );
  // const { isAllDisabled } = useShallowStore(isDisabledSetSelector);

  useEffect(() => {
    setTableData(concernsAdvicesStorage);
  }, [concernsAdvicesStorage, setTableData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTableData((prevState) =>
      prevState.map((row) => {
        if (row.concern.id === name || row.advice.id === name) {
          return {
            ...row,
            [row.concern.id === name ? "concern" : "advice"]: {
              ...row[row.concern.id === name ? "concern" : "advice"],
              value,
            },
          };
        }
        return row;
      })
    );
  };

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Concern</th>
            <th colSpan={2}>Advice</th>
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.length > 0 ? (
            tableData.map((row, indx) => (
              <tr key={row.id} className={styles.row}>
                <td className={styles.cell}>
                  <input
                    type="text"
                    name={row.concern.id}
                    value={row.concern.value}
                    onChange={handleInputChange}
                    className={styles.input}
                    // disabled={isAllDisabled}
                  />
                  <ChangeTableRowButtons
                    shouldShowButtons={
                      row.concern.value?.trim() !==
                      (concernsAdvicesStorage[indx]?.concern?.value?.trim() ||
                        "")
                    }
                    isGenerateButtonShown={row.advice.value?.trim() === ""}
                    rowIndx={indx}
                    fieldForSave="isConcernSaved"
                    tableData={tableData}
                    setTableData={setTableData}
                  />
                  {row.isConcernSaved && <CheckMark />}
                </td>
                <td className={styles.cell}>
                  <input
                    type="text"
                    name={row.advice.id}
                    value={row.advice.value}
                    onChange={handleInputChange}
                    className={styles.input}
                    // disabled={isAllDisabled}
                  />
                  <ChangeTableRowButtons
                    shouldShowButtons={
                      row.advice.value?.trim() !==
                      (concernsAdvicesStorage[indx]?.advice?.value?.trim() ||
                        "")
                    }
                    isGenerateButtonShown={false}
                    rowIndx={indx}
                    fieldForSave="isAdviceSaved"
                    tableData={tableData}
                    setTableData={setTableData}
                  />
                  {row.isAdviceLoading && <Loader className={styles.loader} />}
                  {row.isAdviceSaved && <CheckMark />}
                </td>
                <td className={styles.buttonCell}>
                  <DeleteTableRowButton
                    rowId={row.id}
                    // isAllDisabled={isAllDisabled}
                    setTableData={setTableData}
                    setConcernsAdvicesStorage={setConcernsAdvicesStorage}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center" }}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <AddTableRowButton
        setTableData={setTableData}
        // isAllDisabled={isAllDisabled}
      />
    </>
  );
}
