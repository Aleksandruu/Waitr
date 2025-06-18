import Button from "waitr-fe/src/base_components/Button/Button";
import styles from "./BottomBar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "waitr-fe/src/store";
import { useNavigate, useParams } from "@tanstack/react-router";
import { orderActions, OrderState } from "../Customer.slice";
import {
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
  useCallWaiterMutation,
  useIsWaiterCalledQuery,
  useCreateBillMutation,
} from "waitr-fe/src/api/customerApi";
import {
  CartItemDto,
  CreateOrderDto,
  ProductQuantityDto,
  CreateBillDto,
} from "shared";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";
import { useState } from "react";
import PaymentMethodPopup from "../Payment/PaymentMethodPopup";

type BottomBarProps = {};

const BottomBar = ({}: BottomBarProps) => {
  const { products, status, selectedProductsForPayment, tipAmount, isLoaded } =
    useAppSelector((state) => state.order);
  const [localWaiterCalled, setLocalWaiterCalled] = useState(false);
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

  const { locationSlug, tableNumber } = useParams({ strict: false });
  const tableNumberInt = parseInt(tableNumber!, 10);

  const { data: currentOrder, refetch } = useGetCurrentOrderQuery({
    locationSlug: locationSlug!,
    table: tableNumberInt,
  });

  const { data: waiterCalled } = useIsWaiterCalledQuery({
    locationSlug: locationSlug!,
    table: tableNumberInt,
  });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [callWaiter, { isLoading: isCallingWaiter }] = useCallWaiterMutation();
  const [createBill, { isLoading: isCreatingBill }] = useCreateBillMutation();

  const totalAmount = selectedProductsForPayment.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

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
      tableNumber: tableNumberInt,
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

  const goToPayment = () => {
    dispatch(orderActions.setStatus("payment"));
    navigate({
      to: "/$locationSlug/$tableNumber/payment",
      params: {
        locationSlug: locationSlug!,
        tableNumber: tableNumber!,
      },
    });
  };

  const handleCallWaiter = async () => {
    try {
      await callWaiter({
        locationSlug: locationSlug!,
        tableNumber: tableNumberInt,
      }).unwrap();

      // Set local state for immediate feedback
      setLocalWaiterCalled(true);

      // Reset the local waiter called state after 10 seconds
      setTimeout(() => {
        setLocalWaiterCalled(false);
      }, 10000);
    } catch (error) {
      console.error("Failed to call waiter:", error);
    }
  };

  const handleRequestBill = () => {
    setIsPaymentPopupOpen(true);
  };

  const handleSelectPaymentMethod = async (paymentMethod: "cash" | "card") => {
    try {
      const billData: CreateBillDto = {
        items: selectedProductsForPayment,
        paymentMethod: paymentMethod,
        tips: tipAmount,
      };

      await createBill({
        bill: billData,
        locationSlug: locationSlug!,
        tableNumber: tableNumberInt,
      }).unwrap();

      setIsPaymentPopupOpen(false);

      // Navigate back to the main page or show a success message
      navigate({
        to: "/$locationSlug/$tableNumber",
        params: {
          locationSlug: locationSlug!,
          tableNumber: tableNumber!,
        },
      });
    } catch (error) {
      console.error("Failed to create bill:", error);
      setIsPaymentPopupOpen(false);
    }
  };

  return (
    <>
      {isLoaded && (
        <>
          <div className={styles.bottomFiller}></div>
          <div className={styles.bottomBar}>
            <PaymentMethodPopup
              isOpen={isPaymentPopupOpen}
              onClose={() => setIsPaymentPopupOpen(false)}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              isLoading={isCreatingBill}
            />
            {status === "empty" ? (
              <Button
                text={waiterCalled ? "Ospătar chemat" : "Cheamă ospătar"}
                wider
                tall
                color="brand"
                onClick={handleCallWaiter}
                loading={isCallingWaiter}
                disabled={waiterCalled}
              ></Button>
            ) : status === "products" ? (
              <>
                <Button
                  text={waiterCalled ? "Ospătar chemat" : "Cheamă ospătar"}
                  tall
                  color="brand"
                  onClick={handleCallWaiter}
                  loading={isCallingWaiter}
                  disabled={waiterCalled}
                ></Button>
                <Button
                  onClick={seeOrder}
                  text="Vezi comanda"
                  tall
                  color="brand"
                ></Button>
              </>
            ) : status === "payment" ? (
              <>
                <Button
                  onClick={goToPayment}
                  text={"Plata online"}
                  tall
                  color="brand"
                  disabled
                ></Button>
                <Button
                  onClick={handleRequestBill}
                  text={"Cere nota"}
                  tall
                  color="brand"
                  disabled={totalAmount === 0}
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
              <Button
                text={"Plătește comanda"}
                wider
                tall
                color="brand"
                onClick={goToPayment}
              ></Button>
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
      )}
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
