import styles from "./Select.module.scss";
import inputStyles from "../Input.module.scss";
import InputWrapper from "../InputWrapper/InputWrapper";
import { toCammelCase } from "../../helpers/toCammelCase";

type SelectProps = {
  name: string;
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  options: Array<{ value: string; label: string }>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
};

const Select = ({
  name = "",
  placeholder = "",
  label = "",
  error = undefined,
  options = [],
  onChange = () => {},
  register = null,
}: SelectProps) => {
  return (
    <InputWrapper label={label} error={error}>
      <select
        name={name}
        id={name}
        className={inputStyles.input}
        {...register}
        onChange={onChange}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </InputWrapper>
  );
};

export default Select;
