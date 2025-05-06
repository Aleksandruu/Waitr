import { useSelector } from "react-redux";
import styles from "./Order.module.scss";
import { RootState } from "waitr-fe/src/store";

type OrderProps = {
  // props here
};

const Order = ({}: OrderProps) => {
  const order = useSelector((state: RootState) => {
    return state.order.products;
  });

  return (
    <div className={styles.container}>
      <div className={styles.notepad}>
        <img className={styles.frame} src="/assets/Frame.svg" alt="" />
      </div>
    </div>
  );
};

export default Order;
