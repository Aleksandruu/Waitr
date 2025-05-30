import { ProductResponseDto } from "shared";
import styles from "./Product.module.scss";
import { useState } from "react";
import { orderActions } from "../../Customer.slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "waitr-fe/src/store";
import AddToCartButton from "waitr-fe/src/base_components/AddToCartButton/AddToCartButton";
import { classNames } from "waitr-fe/src/helpers/className";
type ProductProps = {
  product: ProductResponseDto;
};

const Product = ({ product }: ProductProps) => {
  const [expanded, setExpanded] = useState(false);

  const dispatch = useDispatch();

  const quantity = useSelector((state: RootState) => {
    return (
      state.order.products.find(
        (p: { productId: string; quantity: number }) =>
          p.productId === product.id
      )?.quantity || 0
    );
  });

  const addToCart = () => {
    dispatch(
      orderActions.addProductToOrder({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      })
    );
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
      <div>
        <h3
          className={styles.name}
          onClick={() => {
            if (!quantity) {
              setExpanded(!expanded);
            }
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
        <p className={styles.price}>{product.price} lei</p>
      </div>
      <div className={styles.photoAndAddToCart}>
        {product.photoUrl ? (
          <img loading="lazy" src={product.photoUrl} alt={product.name} />
        ) : (
          <div></div>
        )}
        <div
          className={classNames(
            expanded ? "" : styles.hidden,
            styles.addToCart
          )}
        >
          <AddToCartButton
            onClick={addToCart}
            onIncrement={increment}
            onDecrement={decrement}
            quantity={quantity}
          ></AddToCartButton>
        </div>
      </div>
    </div>
  );
};

export default Product;
