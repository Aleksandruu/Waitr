import { OrderItemDto } from "types";
import styles from "./Product.module.scss";
import Button from "@src/base_components/Button/Button";
import { classNames } from "@helpers/className";
import {
  useDeliverMutation,
  useLazyGetOrderQuery,
} from "@api/waiterApi";
import {
  useAppDispatch,
  useAppSelector,
} from "@helpers/app.hooks";
import QuantityButton from "@src/base_components/QuantityButton/QuantityButton";
import { waiterActions } from "../Waiter.slice";

type ProductProps = {
  orderItem: OrderItemDto;
};

const Product = ({ orderItem }: ProductProps) => {
  const { selectedTable, selectedTableProductsToBePaid } = useAppSelector(
    (state) => state.waiter
  );
  const [deliverProduct, { isLoading }] = useDeliverMutation();
  const dispatch = useAppDispatch();
  const [fetchOrder] = useLazyGetOrderQuery();

  const productToBePaid = selectedTableProductsToBePaid.find(
    (product) => product.id === orderItem.id
  );
  const quantityToBePaid = productToBePaid ? productToBePaid.quantity : 0;

  const handleAddToPayment = () => {
    dispatch(
      waiterActions.addProductToSelectedTableProductsToBePaid(orderItem)
    );
  };

  const handleIncrement = () => {
    dispatch(
      waiterActions.increaseQuantityForSelectedTableProduct({
        productId: orderItem.id,
      })
    );
  };

  const handleDecrement = () => {
    dispatch(
      waiterActions.decreaseQuantityForSelectedTableProduct({
        productId: orderItem.id,
      })
    );
  };

  const formattedTime = new Date(orderItem.orderTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const borderStyle =
    orderItem.status === "ready" || orderItem.status === "billed"
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
        {orderItem.status == "delivered" && <p>Produs livrat</p>}
        {orderItem.status == "billed" && <p>Pe nota de plata</p>}
        {orderItem.status == "payed" && <p>Produs achitat</p>}
      </div>
      {orderItem.status === "payed" ? (
        <div></div>
      ) : orderItem.status === "delivered" ? (
        <QuantityButton
          text={"Incaseaza"}
          quantity={quantityToBePaid}
          color="yellow"
          tall={true}
          onClick={handleAddToPayment}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          disabled={quantityToBePaid === orderItem.quantity}
        />
      ) : ["cook", "barista", "barman"].includes(orderItem.status) ? (
        <Button text="Livreaza" color="orange" disabled tall></Button>
      ) : orderItem.status === "billed" ? (
        ""
      ) : (
        <Button
          text="Livreaza"
          color="red"
          tall
          onClick={() =>
            deliverProduct({
              orderProductId: orderItem.id,
              tableNumber: selectedTable,
            }).then(() => fetchOrder(selectedTable))
          }
          loading={isLoading}
        ></Button>
      )}
    </div>
  );
};

export default Product;
