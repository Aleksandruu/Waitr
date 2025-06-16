import { BillResponseDto } from "shared";
import styles from "./Bill.module.scss";
import Button from "waitr-fe/src/base_components/Button/Button";
import { classNames } from "waitr-fe/src/helpers/className";
import {
  usePayBillMutation,
  useLazyGetOrderQuery,
} from "waitr-fe/src/api/waiterApi";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";

type BillProps = {
  bill: BillResponseDto;
};

const Bill = ({ bill }: BillProps) => {
  const { selectedTable } = useAppSelector((state) => state.waiter);
  const [payBill, { isLoading }] = usePayBillMutation();
  const [fetchOrder] = useLazyGetOrderQuery();

  const formattedTime = new Date(bill.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedTotal = bill.totalAmount;
  const formattedTips = bill.tips > 0 ? bill.tips : 0;

  return (
    <div className={classNames(styles.bill, styles.billed)}>
      <div>
        <h2>Nota de plata</h2>
        <p>Creata la {formattedTime}</p>
        <div className={styles.billItems}>
          {bill.items.map((item, index) => (
            <div key={index} className={styles.billItem}>
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>{item.price * item.quantity} RON</span>
            </div>
          ))}
        </div>
        {formattedTips > 0 && (
          <p className={styles.tips}>Tips: {formattedTips} RON</p>
        )}
        <p className={styles.total}>Total: {formattedTotal} RON</p>
      </div>
      <Button
        text="Incaseaza"
        color="red"
        tall
        onClick={() => payBill(bill.id).then(() => fetchOrder(selectedTable))}
        loading={isLoading}
      />
    </div>
  );
};

export default Bill;
