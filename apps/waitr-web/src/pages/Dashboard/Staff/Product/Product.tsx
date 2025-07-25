import styles from "./Product.module.scss";
import Button from "apps/waitr-web/src/base_components/Button/Button";
import { useMarkProductReadyMutation } from "apps/waitr-web/src/api/staffApi";

type StaffProductProps = {
  orderProductId: number;
  quantity: number;
  status: string;
  productName: string;
  preferences?: string;
  tableNumber: number;
  orderTime: string;
};

const Product = (props: StaffProductProps) => {
  const {
    orderProductId,
    quantity,
    status,
    productName,
    preferences,
    tableNumber,
    orderTime,
  } = props;
  const [markReady, { isLoading }] = useMarkProductReadyMutation();

  const formattedTime = new Date(orderTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleMarkReady = () => {
    markReady({ orderProductId, tableNumber });
  };

  return (
    <div className={styles.product}>
      <div className={styles.content}>
        <h2>
          {productName} x{quantity}
        </h2>
        <p>Comandat la {formattedTime}</p>
      </div>
      <Button
        text="Ready"
        color="green"
        tall
        onClick={handleMarkReady}
        loading={isLoading}
      />
    </div>
  );
};

export default Product;
