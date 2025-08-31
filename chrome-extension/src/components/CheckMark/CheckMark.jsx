import styles from "./checkMark.module.css";
import checkmark from "@/assets/check.png";

export function CheckMark() {
  return (
    <img src={checkmark} height={10} width={10} className={styles.checkmark} />
  );
}
