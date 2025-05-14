import { OrderItemDto } from "shared";
import styles from "./Product.module.scss";
import Button from "waitr-fe/src/base_components/Button/Button";
import { classNames } from "waitr-fe/src/helpers/className";

type ProductProps = {
  orderItem: OrderItemDto;
};

const Product = ({ orderItem }: ProductProps) => {
  const formattedTime = new Date(orderItem.orderTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const borderStyle =
    orderItem.status === "ready"
      ? styles.ready
      : ["cook", "barista", "barman"].includes(orderItem.status)
        ? styles.preparing
        : orderItem.status === "delivered"
          ? styles.delivered
          : styles.payed;

  return (
    <div className={classNames(styles.product, borderStyle)}>
      <div>
        <h2>
          {orderItem.name} x{orderItem.quantity}
        </h2>
        <p>Comandat la {formattedTime}</p>
        {["cook", "barista", "barman"].includes(orderItem.status) && (
          <p>Se prepara...</p>
        )}
      </div>
      {orderItem.status === "payed" ? (
        <div></div>
      ) : orderItem.status === "delivered" ? (
        <Button text="Incaseaza" color="yellow" tall></Button>
      ) : ["cook", "barista", "barman"].includes(orderItem.status) ? (
        <Button text="Livreaza" color="orange" disabled tall></Button>
      ) : (
        <Button text="Livreaza" color="red" tall></Button>
      )}
    </div>
  );
};

export default Product;
