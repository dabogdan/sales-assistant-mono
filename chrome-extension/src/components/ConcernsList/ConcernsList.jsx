import React from "react";

export function ConcernsList({ buttons, onClick }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
      {buttons.map((btn) => (
        <button key={btn} type="button" onClick={() => onClick?.(btn)}>
          {btn}
        </button>
      ))}
    </div>
  );
}
