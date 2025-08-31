import {
  ConcernAdviceTable,
  BusinessTypeInput,
  ConcernsList,
} from "@/components";
import { useState } from "react";

const concernButtons = ["Button 1", "Button 2", "Button 3"];

const getTableRow = (concern, advice) => ({
  concern: { id: crypto.randomUUID(), value: concern },
  advice: { id: crypto.randomUUID(), value: advice },
  id: crypto.randomUUID(),
});

export function Settings() {
  const [concerns, setConcerns] = useState(concernButtons);
  const [tableData, setTableData] = useState([]);

  const handleButtonClick = (button) => {
    const filteredButtons = concerns.filter((btn) => btn !== button);
    setConcerns(filteredButtons);
    setTableData((prevData) => {
      prevData.push(getTableRow(button, ""));
      return prevData;
    });
  };

  return (
    <>
      <BusinessTypeInput />
      <ConcernsList buttons={concerns} onClick={handleButtonClick} />
      <ConcernAdviceTable tableData={tableData} setTableData={setTableData} />
    </>
  );
}
