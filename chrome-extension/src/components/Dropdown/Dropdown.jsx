import { useEffect, useState } from "react";
import styles from "./dropdownStyles.module.css";

export function Dropdown({ options, onClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (options && options.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [options]);

  const handleClick = (option) => {
    return () => {
      onClick(option);
      setIsDropdownOpen(false);
    };
  };

  return (
    <>
      {isDropdownOpen && options && options.length > 0 && (
        <ul className={styles.dropdown}>
          {options.map((option) => (
            <li
              key={option}
              onClick={handleClick(option)}
              className={styles.dropdownItem}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
