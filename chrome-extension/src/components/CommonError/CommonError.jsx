import { useEffect } from "react";
import styles from "./commonError.module.css";
import { useShallowStore, errorSetSelector } from "@/store";

export function CommonError(/* { error, setError } */) {
  const { error, setError } = useShallowStore(errorSetSelector);

  useEffect(() => {
    if (error)
      setTimeout(() => {
        setError("");
      }, 4000);
  }, [error, setError]);

  return <>{error && <p className={styles.error}>{error}</p>}</>;
}
