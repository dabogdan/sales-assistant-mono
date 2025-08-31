import styles from "./waitWarningStyles.module.css";

export function WaitWarning({ shouldShow, percents }) {
  return (
    <>
      {shouldShow && (
        <div className={styles.container}>
          AI is generating suggestions... {percents}% complete
        </div>
      )}
    </>
  );
}
