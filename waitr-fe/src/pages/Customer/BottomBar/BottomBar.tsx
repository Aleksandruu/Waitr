import Button from "waitr-fe/src/base_components/Button/Button";
import styles from "./BottomBar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "waitr-fe/src/store";
import { useNavigate, useParams } from "@tanstack/react-router";
import { orderActions } from "../Customer.slice";

type BottomBarProps = {};

const BottomBar = ({}: BottomBarProps) => {
  const state = useSelector(
    (state: RootState) =>
      state.order.status as "empty" | "products" | "checkout"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locationSlug, tableNumber } = useParams({ strict: false });

  const seeOrder = () => {
    dispatch(orderActions.setStatus("checkout"));
    navigate({
      to: "/$locationSlug/$tableNumber/order",
      params: {
        locationSlug: locationSlug!,
        tableNumber: tableNumber!,
      },
    });
  };

  return (
    <>
      <div className={styles.bottomFiller}></div>
      <div className={styles.bottomBar}>
        {state === "empty" ? (
          <Button text="Cheamă un ospătar" wider tall color="red"></Button>
        ) : state === "products" ? (
          <Button
            onClick={seeOrder}
            text="Vezi comanda"
            wider
            tall
            color="red"
          ></Button>
        ) : (
          <Button text="Plasează comanda" wider tall color="red"></Button>
        )}
      </div>
    </>
  );
};

export default BottomBar;
