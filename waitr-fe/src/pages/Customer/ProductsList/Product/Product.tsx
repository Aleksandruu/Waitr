import { ProductResponse } from "shared/models/product.response.model";
import styles from "./Product.module.scss";
import { useState } from "react";
import { orderActions } from "../../Customer.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "waitr-fe/src/store";
import AddToCartButton from "waitr-fe/src/base_components/AddToCartButton/AddToCartButton";

type ProductProps = {
  product: ProductResponse;
};

const Product = ({ product }: ProductProps) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const quantity = useSelector((state: RootState) => {
    return (
      state.order.products.find(
        (p: { id: string; quantity: number }) => p.id === product.id
      )?.quantity || 0
    );
  });

  const addToCart = () => {
    console.log(product.id);
    dispatch(orderActions.addProductToOrder({ productId: product.id }));
  };

  const increment = () => {
    dispatch(
      orderActions.increaseQuantityForProduct({ productId: product.id })
    );
  };

  const decrement = () => {
    dispatch(
      orderActions.decreaseQuantityForProduct({ productId: product.id })
    );
  };

  return (
    <div className={styles.product}>
      <h3
        className={styles.name}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {product.name}
      </h3>
      <p>{product.ingredients}</p>
      <div className={expanded ? "" : styles.hidden}>
        <p style={{ color: "black" }}>For 100g:</p>
        <p>{product.nutrients}</p>
        <p style={{ color: "black" }}>Allergens:</p>
        <p>{product.allergens}</p>
      </div>
      <div className={styles.priceAndAddToCart}>
        <p className={styles.price}>{product.price} lei</p>
        <AddToCartButton
          onClick={addToCart}
          onIncrement={increment}
          onDecrement={decrement}
          quantity={quantity}
        ></AddToCartButton>
      </div>
    </div>
  );
};

export default Product;
