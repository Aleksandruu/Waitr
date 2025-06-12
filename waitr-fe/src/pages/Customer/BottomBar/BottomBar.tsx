import Button from "waitr-fe/src/base_components/Button/Button";
import styles from "./BottomBar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "waitr-fe/src/store";
import { useNavigate, useParams } from "@tanstack/react-router";
import { orderActions, OrderState } from "../Customer.slice";
import {
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
} from "waitr-fe/src/api/customerApi";
import { CartItemDto, CreateOrderDto, ProductQuantityDto } from "shared";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";

type BottomBarProps = {};

const BottomBar = ({}: BottomBarProps) => {
  const { products, status } = useAppSelector((state) => state.order);

  const { locationSlug, tableNumber } = useParams({ strict: false });

  const { data: currentOrder, refetch } = useGetCurrentOrderQuery({
    locationSlug: locationSlug!,
    table: parseInt(tableNumber!, 10),
  });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placeOrder = () => {
    const orderObject: CreateOrderDto = {
      orderTime: new Date(),
      products: mapCartItemToProductQuantityDto(products),
    };

    createOrder({
      order: orderObject,
      locationSlug: locationSlug!,
      tableNumber: parseInt(tableNumber!, 10),
    });

    setTimeout(() => {
      navigate({
        to: "/$locationSlug/$tableNumber",
        params: {
          locationSlug: locationSlug!,
          tableNumber: tableNumber!,
        },
      });
      refetch();
    }, 2000);
  };

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
        {status === "empty" ? (
          <Button text="Cheamă ospătar" wider tall color="brand"></Button>
        ) : status === "products" ? (
          <>
            <Button text="Cheamă ospătar" tall color="brand"></Button>
            <Button
              onClick={seeOrder}
              text="Vezi comanda"
              tall
              color="brand"
            ></Button>
          </>
        ) : currentOrder?.length && products.length > 0 ? (
          <Button
            onClick={placeOrder}
            text="Adauga la comanda"
            wider
            tall
            color="brand"
            loading={isCreating}
            disabled={status === "placed"}
          ></Button>
        ) : currentOrder?.length && products.length === 0 ? (
          <Button text="Cere nota" wider tall color="brand"></Button>
        ) : (
          <Button
            onClick={placeOrder}
            text="Plasează comanda"
            wider
            tall
            color="brand"
            loading={isCreating}
            disabled={status === "placed"}
          ></Button>
        )}
      </div>
    </>
  );
};

const mapCartItemToProductQuantityDto = (
  cartItems: CartItemDto[]
): ProductQuantityDto[] => {
  const orderItems: ProductQuantityDto[] = cartItems.map((product) => {
    return {
      id: product.productId,
      quantity: product.quantity,
      preferences: "",
    };
  });
  return orderItems;
};

export default BottomBar;
