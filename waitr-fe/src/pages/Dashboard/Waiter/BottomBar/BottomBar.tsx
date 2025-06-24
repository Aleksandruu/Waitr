import { useState, useRef, useEffect } from "react";
import styles from "./BottomBar.module.scss";
import { useAppDispatch, useAppSelector } from "waitr-fe/src/helpers/app.hooks";
import Button from "waitr-fe/src/base_components/Button/Button";
import {
  useGoToTableMutation,
  useLazyGetOrderQuery,
  useCreateWaiterBillMutation,
} from "waitr-fe/src/api/waiterApi";
import { waiterActions } from "../Waiter.slice";
import ProductSelectionPopup from "./ProductSelectionPopup";

type BottomBarProps = {
  // props here
};

const BottomBar = ({}: BottomBarProps) => {
  const { selectedTableProductsToBePaid, selectedTable, orders } =
    useAppSelector((state) => state.waiter);

  const bottomBarRef = useRef<HTMLDivElement>(null);
  const [fillerHeight, setFillerHeight] = useState(100);
  const [products, setProducts] = useState<any[]>([]);
  const [createBill, { isLoading }] = useCreateWaiterBillMutation();
  const [fetchOrder] = useLazyGetOrderQuery();
  const [goToTable] = useGoToTableMutation();
  const dispatch = useAppDispatch();
  const [isProductPopupOpen, setIsProductPopupOpen] = useState(false);

  const isWaiterCalled = !!orders.find((order) => order.table === selectedTable)
    ?.waiterCalledAt;

  const onCreateBill = () => {
    createBill(
      selectedTableProductsToBePaid.map((product) => ({
        orderProductId: product.id,
        quantity: product.quantity,
      }))
    ).then(() => {
      fetchOrder(selectedTable);
      dispatch(waiterActions.setSelectedTableProductsToBePaid([]));
    });
  };

  const handleOpenProductPopup = () => {
    setIsProductPopupOpen(true);
  };

  const handleCloseProductPopup = () => {
    setIsProductPopupOpen(false);
    // Refresh order data after adding products
    fetchOrder(selectedTable);
  };

  useEffect(() => {
    const mergedProducts = selectedTableProductsToBePaid.reduce(
      (acc, product) => {
        const existingProduct = acc.find(
          (p) => p.productId === product.productId
        );

        if (existingProduct) {
          existingProduct.quantity += product.quantity;
        } else {
          acc.push({ ...product });
        }

        return acc;
      },
      [] as any[]
    );

    setProducts(mergedProducts);
  }, [selectedTableProductsToBePaid]);

  const total = products.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  useEffect(() => {
    const updateFillerHeight = () => {
      if (bottomBarRef.current) {
        const bottomBarHeight = bottomBarRef.current.offsetHeight;
        setFillerHeight(bottomBarHeight);
      }
    };

    updateFillerHeight();

    const resizeObserver = new ResizeObserver(updateFillerHeight);
    if (bottomBarRef.current) {
      resizeObserver.observe(bottomBarRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [products]);

  return (
    <>
      <div
        className={styles.bottomFiller}
        style={{ height: `${fillerHeight}px` }}
      ></div>
      <div className={styles.bottomBar} ref={bottomBarRef}>
        {products.length !== 0 ? (
          <>
            <div className={styles.productsToBePaid}>
              {products.map((product, index) => {
                return (
                  <p
                    className={styles.productItem}
                    key={product.productId + index}
                  >
                    <span>
                      {product.name} x{product.quantity}
                    </span>{" "}
                    <span className={styles.price}>
                      {(product.price * product.quantity).toFixed(2)} lei
                    </span>
                  </p>
                );
              })}
              <p className={styles.total}>
                <span>Total:</span> <span>{total.toFixed(2)} lei</span>
              </p>
            </div>
            <Button
              text={"Creaza nota"}
              wider
              tall
              color="brand"
              onClick={onCreateBill}
              loading={isLoading}
            ></Button>
          </>
        ) : isWaiterCalled ? (
          <Button
            text={"Mergi la masa"}
            wider
            tall
            color="red"
            onClick={() => goToTable(selectedTable).unwrap()}
          ></Button>
        ) : (
          <Button
            text={"Adauga produse"}
            wider
            tall
            color="brand"
            onClick={handleOpenProductPopup}
          ></Button>
        )}
      </div>

      {/* Product Selection Popup */}
      <ProductSelectionPopup
        isOpen={isProductPopupOpen}
        onClose={handleCloseProductPopup}
        tableNumber={selectedTable}
      />
    </>
  );
};

export default BottomBar;
