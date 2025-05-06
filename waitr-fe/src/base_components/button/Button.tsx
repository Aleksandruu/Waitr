import { classNames } from "../../helpers/className";
import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: "green" | "yellow" | "red" | "brand" | "brand-light" | "brand-dark";
  wide?: boolean;
  wider?: boolean;
  tall?: boolean;
  disabled?: boolean;
  loading?: boolean;
  submit?: boolean;
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
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[color],
        wide ? styles.wide : "",
        wider ? styles.wider : "",
        tall ? styles.tall : ""
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={submit ? "submit" : "button"}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
