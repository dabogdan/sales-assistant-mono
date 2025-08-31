import styles from "./businessTypeInputStyles.module.css";

export function BusinessTypeInput({ value, onChange }) {
  return (
    <div>
      <label htmlFor="business-type" className={styles.label}>
        Business type
      </label>
      <input
        id="business-type"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter business type"
        className={styles.input}
      />
    </div>
  );
}
