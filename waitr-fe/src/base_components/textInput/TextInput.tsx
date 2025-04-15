import { classNames } from "../../helpers/className";
import styles from "./TextInput.module.scss";

interface TextInputProps {
  placeholder?: string;
  label?: string;
  error?: string | null;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
}

const toCammelCase = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
    .replace(/^./, (char) => char.toLowerCase());
};

const TextInput = ({
  placeholder = "",
  label = "",
  error = undefined,
  type = "text",
  onChange = () => {},
  register = null,
}: TextInputProps) => {
  const labelId = toCammelCase(label);

  return (
    <div className={styles.inputLabel}>
      <label htmlFor={labelId} className={styles.label}>
        {label}:
      </label>
      <input
        placeholder={placeholder}
        name={labelId}
        onChange={onChange}
        type={type}
        className={classNames(
          styles.inputTxt,
          error !== undefined ? styles.error : ""
        )}
        {...register}
      />
      {!!error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default TextInput;
