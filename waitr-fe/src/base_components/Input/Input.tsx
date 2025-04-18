import { classNames } from "../../helpers/className";
import { toCammelCase } from "../../helpers/toCammelCase";
import InputWrapper from "../InputWrapper/InputWrapper";
import styles from "../Input.module.scss";

interface InputProps {
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  type?: "text" | "email" | "password" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
}

const Input = ({
  placeholder = "",
  label = "",
  error = undefined,
  type = "text",
  onChange = () => {},
  register = null,
}: InputProps) => {
  const labelId = toCammelCase(label);

  return (
    <InputWrapper label={label} error={error}>
      <input
        placeholder={placeholder}
        name={labelId}
        onChange={onChange}
        type={type}
        className={classNames(
          styles.input,
          error !== undefined ? styles.error : ""
        )}
        {...register}
      />
    </InputWrapper>
  );
};

export default Input;
