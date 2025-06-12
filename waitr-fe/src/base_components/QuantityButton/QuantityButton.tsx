import styles from "./QuantityButton.module.scss";
import Button from "../Button/Button";
import { classNames } from "waitr-fe/src/helpers/className";

type QuantityButtonProps = {
  text: string;
  quantity: number;
  onClick: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  color?: "brand" | "yellow";
  tall?: boolean;
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
}: QuantityButtonProps) => {
  return (
    <>
      {!quantity ? (
        <Button
          text={text}
          onClick={onClick}
          color={color}
          tall={tall}
        ></Button>
      ) : (
        <div
          className={classNames(styles.quantityBtn, tall ? styles.tall : "")}
        >
          <span onClick={onDecrement}>-</span>
          <span>{quantity}</span>
          <span
            onClick={disabled ? () => undefined : onIncrement}
            className={disabled ? styles.disabled : ""}
          >
            +
          </span>
        </div>
      )}
    </>
  );
};

export default QuantityButton;
