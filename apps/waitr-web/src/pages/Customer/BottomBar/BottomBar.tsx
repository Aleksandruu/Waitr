import Button from "apps/waitr-web/src/base_components/Button/Button";
import styles from "./BottomBar.module.scss";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
  useCallWaiterMutation,
  useIsWaiterCalledQuery,
  useCreateBillMutation,
} from "apps/waitr-web/src/api/customerApi";
import {
  CartItemDto,
  CreateOrderDto,
  ProductQuantityDto,
  CreateBillDto,
} from "shared";
import { useAppDispatch, useAppSelector } from "apps/waitr-web/src/helpers/app.hooks";
import { useState } from "react";
import PaymentMethodPopup from "../Payment/PaymentMethodPopup";
import { orderActions } from "../Customer.slice";

type BottomBarProps = {};

const BottomBar = ({}: BottomBarProps) => {
  const { products, status, selectedProductsForPayment, tipAmount, isLoaded } =
    useAppSelector((state) => state.order);
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

  const dispatch = useAppDispatch();
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
