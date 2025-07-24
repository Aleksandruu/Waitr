import { ProductResponseDto } from "types";
import styles from "./Product.module.scss";
import { useState } from "react";
import { orderActions } from "../../Customer.slice";
import QuantityButton from "apps/web/src/base_components/QuantityButton/QuantityButton";
import { useAppDispatch } from "apps/web/src/helpers/app.hooks";

type ProductProps = {
  product: ProductResponseDto;
  quantity: number;
};

const Product = (props: ProductProps) => {
  const { product, quantity } = props;
  const [expanded, setExpanded] = useState(quantity > 0);

  const dispatch = useAppDispatch();

  // Functions for AddToCartButton (no event parameter needed)
  const handleAddToCart = () => {
    dispatch(
      orderActions.addProductToOrder({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      })
    );
  };

  const handleIncrement = () => {
    dispatch(
      orderActions.increaseQuantityForProduct({ productId: product.id })
    );
  };

  const handleDecrement = () => {
    dispatch(
      orderActions.decreaseQuantityForProduct({ productId: product.id })
    );
  };

  const toggleExpand = () => {
    if (!quantity) {
      setExpanded(!expanded);
    }
  };

  return (
    <div className={styles.product}>
      <div className={styles.info} onClick={toggleExpand}>
        <h3 className={styles.name}>{product.name}</h3>
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
        <div onClick={toggleExpand} className={styles.photoContainer}>
          {product.photoUrl ? (
            <img loading="lazy" src={product.photoUrl} alt={product.name} />
          ) : (
            <div className={styles.noPhoto}></div>
          )}
        </div>
        {expanded && (
          <QuantityButton
            onClick={handleAddToCart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            quantity={quantity}
            text="Adauga in cos"
          />
        )}
      </div>
    </div>
  );
};

export default Product;
