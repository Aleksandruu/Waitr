import { Children } from "react";
import { toCammelCase } from "../../helpers/toCammelCase";
import styles from "./InputWrapper.module.scss";

type InputWrapperProps = {
  label: string;
  error: string | undefined;
  children: React.ReactNode;
};

const InputWrapper = ({
  label = "",
  error = undefined,
  children,
}: InputWrapperProps) => {
  const labelId = toCammelCase(label);

  return (
    <div className={styles.inputLabel}>
      <label htmlFor={labelId} className={styles.label}>
        {label}:
      </label>
      {children}
      {!!error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default InputWrapper;
