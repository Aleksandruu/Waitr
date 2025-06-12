import { useSelector } from "react-redux";
import TableList from "./TableList/TableList";
import styles from "./Waiter.module.scss";
import {
  useLazyGetOrderQuery,
  useGetOrdersQuery,
} from "waitr-fe/src/api/waiterApi";
import { RootState } from "waitr-fe/src/store";
import Product from "./Product/Product";
import { connectWaiterSocket } from "./Waiter.sockets";
import { useEffect } from "react";
import { OrderItemDto, OrderResponseDto } from "shared";
import { WaiterState } from "./Waiter.slice";
import BottomBar from "./BottomBar/BottomBar";

type WaiterProps = {
  // props here
};

const Waiter = ({}: WaiterProps) => {
  const { selectedTable, orders } = useSelector(
    (state: RootState) => state.waiter as WaiterState
  );
  const { id: locationId } = useSelector((state: RootState) => state.location);

  useGetOrdersQuery();
  const [fetchOrder] = useLazyGetOrderQuery();

  const orderData: OrderResponseDto | undefined = orders.find(
    (order: OrderResponseDto) => {
      return order.table === selectedTable;
    }
  );

  useEffect(() => {
    if (!locationId) return;

    connectWaiterSocket(locationId, (table) => {
      fetchOrder(table);
    });
  }, [locationId, fetchOrder]);

  return (
    <div className={styles.container}>
      <TableList />
      {orderData &&
        orderData.products &&
        orderData.products.map((orderItem: OrderItemDto, index: number) => {
          return <Product key={index} orderItem={orderItem} />;
        })}
      <BottomBar></BottomBar>
    </div>
  );
};

export default Waiter;
