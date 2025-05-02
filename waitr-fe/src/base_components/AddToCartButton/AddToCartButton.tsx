import { useState } from "react";
import styles from "./AddToCartButton.module.scss";
import { classNames } from "waitr-fe/src/helpers/className";
import Button from "../Button/Button";

type AddToCartButtonProps = {
  quantity: number;
  onClick: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

const AddToCartButton = ({
  quantity,
  onClick,
  onIncrement,
  onDecrement,
}: AddToCartButtonProps) => {
  return (
    <>
      {!quantity ? (
        <Button text="Add to order" onClick={onClick} color="red"></Button>
      ) : (
        <div className={styles.quantityBtn}>
          <span onClick={onDecrement}>-</span>
          <span>{quantity}</span>
          <span onClick={onIncrement}>+</span>
        </div>
      )}
    </>
  );
};

export default AddToCartButton;
