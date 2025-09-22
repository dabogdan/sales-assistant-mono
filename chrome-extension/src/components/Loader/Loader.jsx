import styles from "./loaderStyles.module.css";

export function Loader({ className }) {
  return (
    <div className={`${styles.loader} ${className ? className : ""}`}>
      <div className={styles.spinner}></div>
    </div>
  );
}
