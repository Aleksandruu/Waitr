import { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Staff.module.scss";
import { useLazyGetStaffProductsQuery } from "waitr-fe/src/api/staffApi";
import Product from "./Product/Product";
import { connectStaffSocket } from "./Staff.sockets";
import { RootState } from "waitr-fe/src/store";

type StaffProps = {
  // props here
};

const Staff = ({}: StaffProps) => {
  const [fetchStaffProducts, { data, isLoading, error }] =
    useLazyGetStaffProductsQuery();
  const { id: locationId } = useSelector((state: RootState) => state.location);
  const { user } = useSelector((state: RootState) => state.auth);

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
