"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Payment.module.scss";
import QuantityButton from "@src/base_components/QuantityButton/QuantityButton";
import Button from "@src/base_components/Button/Button";
import { useGetUnpaidOrderQuery } from "@/api/customerApi";
import { CartItemDto } from "types";
import { orderActions } from "../Customer.slice";
import { useAppDispatch, useAppSelector } from "@helpers/app.hooks";

type PaymentProps = {};

const Payment = (props: PaymentProps) => {
  const params = useParams();
  const { locationSlug, tableNumber } = params as { locationSlug: string; tableNumber: string };
  const dispatch = useAppDispatch();
  const [tipInput, setTipInput] = useState<string>("0");

  const { selectedProductsForPayment, tipAmount } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    setTipInput(tipAmount.toString());
  }, [tipAmount]);

  const subtotal = selectedProductsForPayment.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const totalAmount = subtotal + tipAmount;

  useEffect(() => {
    dispatch(orderActions.setStatus("payment"));
  }, [dispatch]);

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTipInput(value);

    const numericValue = parseFloat(value) || 0;
    dispatch(orderActions.setTipAmount(numericValue));
  };

  const { data: currentOrder = [], isLoading } = useGetUnpaidOrderQuery({
    locationSlug: locationSlug || "",
    table: Number(tableNumber) || 0,
  });

  const handleAddToPayment = (product: CartItemDto) => {
    dispatch(
      orderActions.addProductToPayment({ productId: product.productId })
    );
  };

  const handleIncrement = (productId: string) => {
    dispatch(orderActions.incrementProductForPayment({ productId }));
  };

  const handleDecrement = (productId: string) => {
    dispatch(orderActions.decrementProductForPayment({ productId }));
  };

  const handleSelectAll = () => {
    dispatch(orderActions.selectAllProductsForPayment());
  };

  const areAllProductsSelected =
    currentOrder.length > 0 &&
    currentOrder.every((product: any) => {
      const selectedProduct = selectedProductsForPayment.find(
        (p) => p.productId === product.productId
      );
      return selectedProduct && selectedProduct.quantity === product.quantity;
    });

  return (
    <div className={styles.container}>
      {currentOrder.length > 0 && (
        <div className={styles.actionsHeader}>
          <Button
            text="Selectează tot"
            color="brand"
            onClick={handleSelectAll}
            disabled={areAllProductsSelected}
          />
          <p className={styles.totalAmount}>Subtotal: {subtotal} lei</p>
        </div>
      )}

      {currentOrder.map((product: any) => (
        <div key={product.productId} className={styles.productItem}>
          <div className={styles.productInfo}>
            <h3>{product.name}</h3>
            <p className={styles.price}>{product.price} lei</p>
            <p className={styles.quantity}>Cantitate: {product.quantity}</p>
          </div>
          <div className={styles.actionArea}>
            <QuantityButton
              text="Plătește"
              quantity={
                selectedProductsForPayment.find(
                  (p) => p.productId === product.productId
                )?.quantity || 0
              }
              color="brand"
              onClick={() => handleAddToPayment(product)}
              onIncrement={() => handleIncrement(product.productId)}
              onDecrement={() => handleDecrement(product.productId)}
              disabled={
                selectedProductsForPayment.find(
                  (p) => p.productId === product.productId
                )?.quantity === product.quantity
              }
            />
          </div>
        </div>
      ))}

      {currentOrder.length > 0 && (
        <div className={styles.tipSection}>
          <h3>Bacșiș</h3>
          <div className={styles.tipInputContainer}>
            <input
              type="number"
              min="0"
              step="1"
              value={tipInput}
              onChange={handleTipChange}
              className={styles.tipInput}
            />
            <span className={styles.tipCurrency}>lei</span>
          </div>
          <div className={styles.totalWithTip}>
            <p>Total cu bacșiș: {totalAmount} lei</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
