import TableList from "./TableList/TableList";
import styles from "./Waiter.module.scss";
import {
  useLazyGetOrderQuery,
  useGetOrdersQuery,
  useGetBillsQuery,
  useLazyGetBillsQuery,
} from "apps/waitr-web/src/api/waiterApi";
import Product from "./Product/Product";
import Bill from "./Bill/Bill";
import { connectWaiterSocket } from "./Waiter.sockets";
import { use, useEffect } from "react";
import { BillResponseDto, OrderItemDto, OrderResponseDto } from "shared";
import BottomBar from "./BottomBar/BottomBar";
import { useAppSelector } from "apps/waitr-web/src/helpers/app.hooks";

type WaiterProps = {
  // props here
};

const Waiter = ({}: WaiterProps) => {
  const { selectedTable, orders } = useAppSelector((state) => state.waiter);
  const { id: locationId } = useAppSelector((state) => state.location);

  useGetOrdersQuery();
  const [fetchOrder] = useLazyGetOrderQuery();
  const [fetchBills] = useLazyGetBillsQuery();
  const { data: bills } = useGetBillsQuery(selectedTable, {
    skip: !selectedTable,
  });

  const orderData: OrderResponseDto | undefined = orders.find(
    (order: OrderResponseDto) => {
      return order.table === selectedTable;
    }
  );

  useEffect(() => {
    if (!locationId) return;

    connectWaiterSocket(locationId, (table) => {
      fetchOrder(table);
      fetchBills(table);
    });
  }, [locationId, fetchOrder]);

  return (
    <div className={styles.container}>
      <TableList />

      {bills && bills.length > 0 && (
        <div className={styles.billsSection}>
          {bills.map((bill: BillResponseDto) => (
            <Bill key={bill.id} bill={bill} />
          ))}
        </div>
      )}

      {orderData && orderData.products.length > 0 ? (
        orderData.products.map((orderItem: OrderItemDto, index: number) => {
          return <Product key={index} orderItem={orderItem} />;
        })
      ) : (
        <p>Nu exista comenzi pentru acest masa</p>
      )}
      <BottomBar></BottomBar>
    </div>
  );
};

export default Waiter;
