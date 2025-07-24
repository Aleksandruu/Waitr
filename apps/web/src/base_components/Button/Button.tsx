import { classNames } from "../../helpers/className";
import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  color?:
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "brand"
    | "brand-light"
    | "brand-dark";
  wide?: boolean;
  wider?: boolean;
  tall?: boolean;
  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
  textWrap?: boolean;
}

const Button = ({
  text,
  onClick = () => {},
  color = "green",
  wide = false,
  wider = false,
  tall = false,
  disabled = false,
  loading = false,
  submit = false,
  textWrap = false,
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[color],
        wide ? styles.wide : "",
        wider ? styles.wider : "",
        tall ? styles.tall : "",
        textWrap ? styles.textWrap : ""
      )}
      disabled={disabled || loading}
      onClick={(e) => onClick?.(e)}
      type={submit ? "submit" : "button"}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
