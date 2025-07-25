import { classNames } from "../../helpers/className";
import { toCammelCase } from "../../helpers/toCammelCase";
import InputWrapper from "../InputWrapper/InputWrapper";
import styles from "../Input.module.scss";

interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  type?: "text" | "email" | "password" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
}

const Input = ({
  name = "",
  placeholder = "",
  label = "",
  error = undefined,
  type = "text",
  onChange = () => {},
  register = null,
}: InputProps) => {
  return (
    <InputWrapper label={label} error={error}>
      <input
        id={name}
        {...register}
        placeholder={placeholder}
        name={name}
        onChange={(e) => {
          register?.onChange?.(e);
          onChange?.(e);
        }}
        type={type}
        className={classNames(
          styles.input,
          error !== undefined ? styles.error : ""
        )}
      />
    </InputWrapper>
  );
};

export default Input;
