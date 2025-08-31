import React from "react";
import styles from "./captureIndicatorStyles.module.css";

export function CaptureIndicator({ isCapturing }) {
  const circleStyles = `${styles.placeholder} ${
    isCapturing ? styles.pulsedRedCircle : ""
  }`;

  return <div className={circleStyles}></div>;
}
