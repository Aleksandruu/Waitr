import { useEffect } from "react";
import styles from "./Staff.module.scss";
import { useLazyGetStaffProductsQuery } from "apps/waitr-web/src/api/staffApi";
import Product from "./Product/Product";
import { connectStaffSocket } from "./Staff.sockets";
import { RootState } from "apps/waitr-web/src/store";
import { useAppSelector } from "apps/waitr-web/src/helpers/app.hooks";

type StaffProps = {
  // props here
};

const Staff = ({}: StaffProps) => {
  const [fetchStaffProducts, { data, isLoading, error }] =
    useLazyGetStaffProductsQuery();
  const { id: locationId } = useAppSelector((state) => state.location);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    fetchStaffProducts();
  }, [fetchStaffProducts]);

  useEffect(() => {
    if (!locationId || !user) return;

    connectStaffSocket(locationId, user.role, () => {
      fetchStaffProducts();
    });
  }, [locationId, user, fetchStaffProducts]);

  return (
    <div className={styles.products}>
      {data && data.length > 0
        ? data.map((product) => (
            <Product
              key={product.orderProductId}
              orderProductId={product.orderProductId}
              quantity={product.quantity}
              status={product.status}
              productName={product.productName}
              preferences={product.preferences}
              tableNumber={product.tableNumber}
              orderTime={product.orderTime}
            />
          ))
        : "Nu exista produse momentan!"}
    </div>
  );
};

export default Staff;
