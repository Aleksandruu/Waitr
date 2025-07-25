import styles from "./QuantityButton.module.scss";
import Button from "../Button/Button";
import { classNames } from "apps/web/src/helpers/className";

type QuantityButtonProps = {
  text: string;
  quantity: number;
  onClick: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  color?: "brand" | "yellow";
  tall?: boolean;
  borderRadius?: "none" | "small" | "medium" | "round";
};

const QuantityButton = ({
  quantity,
  onClick,
  onIncrement,
  onDecrement,
  text,
  disabled,
  color = "brand",
  tall = false,
  borderRadius = "round",
}: QuantityButtonProps) => {
  return (
    <>
      {!quantity ? (
        <Button
          text={text}
          onClick={onClick}
          color={color}
          tall={tall}
          borderRadius={borderRadius}
        ></Button>
      ) : (
        <div
          className={classNames(
            styles.quantityBtn,
            tall ? styles.tall : "",
            color === "yellow" ? styles.yellow : styles.brand,
            styles[`borderRadius-${borderRadius}`]
          )}
        >
          <span
            onClick={onDecrement}
            className={classNames(styles.control, styles.decrement)}
          >
            -
          </span>
          <span>{quantity}</span>
          <span
            onClick={disabled ? () => undefined : onIncrement}
            className={classNames(
              disabled ? styles.disabled : "",
              styles.control,
              styles.increment
            )}
          >
            +
          </span>
        </div>
      )}
    </>
  );
};

export default QuantityButton;
