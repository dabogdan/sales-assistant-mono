import React from "react";
import styles from "./captureIndicatorStyles.module.css";
import { useShallowStore, isCapturingSetSelector } from "@/store";

export function CaptureIndicator(/* { isCapturing } */) {
  const { isCapturing } = useShallowStore(isCapturingSetSelector);

  const circleStyles = `${styles.placeholder} ${
    isCapturing ? styles.pulsedRedCircle : ""
  }`;

  return <div className={circleStyles}></div>;
}
