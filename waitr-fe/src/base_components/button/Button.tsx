import { classNames } from "../../helpers/className";
import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: "green" | "yellow" | "red";
  wide?: boolean;
  tall?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const Button = ({
  text,
  onClick = () => {},
  color = "green",
  wide = false,
  tall = false,
  disabled = false,
  loading = false,
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[color],
        wide ? styles.wide : "",
        tall ? styles.tall : ""
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
