import { useDispatch, useSelector } from "react-redux";
import styles from "./Order.module.scss";
import { useEffect } from "react";
import { orderActions } from "../Customer.slice";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";

type OrderProps = {
  // props here
};

const Order = ({}: OrderProps) => {
  const { products, status, currentOrder } = useAppSelector((state) => {
    return state.order;
  });

  const total = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orderActions.setStatus("checkout"));
  }, []);

  return (
    <div className={styles.container}>
      {status !== "placed" ? (
        <div className={styles.notepad}>
          <img className={styles.frame} src="/assets/Frame.svg" alt="" />
          {currentOrder.length > 0 && (
            <>
              <div className={styles.line}>
                <span>Produse deja comandate</span>
              </div>
              {currentOrder.map((product, index) => {
                return (
                  <p
                    className={styles.currentOrderItem}
                    key={product.productId + index}
                  >
                    <span>
                      {product.name} x{product.quantity}
                    </span>{" "}
                    <span className={styles.price}>
                      {(product.price * product.quantity).toFixed(2)} lei
                    </span>
                  </p>
                );
              })}
              <div className={styles.line}>
                <span>Produse noi</span>
              </div>
            </>
          )}
          {products.map((product, index) => {
            return (
              <p className={styles.productItem} key={product.productId + index}>
                <span>
                  {product.name} x{product.quantity}
                </span>{" "}
                <span className={styles.price}>
                  {(product.price * product.quantity).toFixed(2)} lei
                </span>
              </p>
            );
          })}
          <p className={styles.total}>
            <span>Total:</span> <span>{total.toFixed(2)} lei</span>
          </p>
        </div>
      ) : (
        <div className={styles.placed}>
          <h2>Multumim pentru comanda!</h2>
        </div>
      )}
    </div>
  );
};

export default Order;
