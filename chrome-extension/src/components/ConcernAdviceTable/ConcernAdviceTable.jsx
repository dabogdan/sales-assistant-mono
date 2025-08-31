import styles from "./concernAdviceTableStyles.module.css";

export function ConcernAdviceTable({ tableData, setTableData }) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name && value) {
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
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Concern</th>
          <th>Advice</th>
        </tr>
      </thead>
      <tbody>
        {tableData && tableData.length > 0 ? (
          tableData.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  name={row.concern.id}
                  value={row.concern.value}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </td>
              <td>
                <input
                  type="text"
                  name={row.advice.id}
                  value={row.advice.value}
                  onChange={handleInputChange}
                  className={styles.input}
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
  );
}
