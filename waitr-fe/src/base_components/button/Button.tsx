import { classNames } from "../../helpers/className";
import styles from "./Button.module.scss";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: "green" | "yellow" | "red";
  wide?: boolean;
  tall?: boolean;
  disabled?: boolean;
}

function Button({
  text,
  onClick = () => {},
  color = "green",
  wide = false,
  tall = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[color],
        wide ? styles.wide : "",
        tall ? styles.tall : ""
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
