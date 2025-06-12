import { useGetProductsQuery } from "waitr-fe/src/api/customerApi";
import styles from "./ProductsList.module.scss";
import { useEffect } from "react";
import { Route } from "waitr-fe/src/routes/$locationSlug/$tableNumber/index";
import Product from "./Product/Product";
import { useDispatch } from "react-redux";
import { orderActions } from "../Customer.slice";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";

type CustomerProps = {
  // props here
};

const Customer = ({}: CustomerProps) => {
  const { products, currentOrder } = useAppSelector((state) => state.order);

  const { locationSlug } = Route.useParams();

  const { data } = useGetProductsQuery(locationSlug);

  const dispatch = useDispatch();

  useEffect(() => {
    if (products.length === 0 && currentOrder.length === 0) {
      dispatch(orderActions.setStatus("empty"));
    } else dispatch(orderActions.setStatus("products"));
  }, [products, currentOrder]);

  return (
    <div className={styles.products}>
      {data
        ?.filter((category) => category.products.length > 0)
        .map((productCategory) => {
          return (
            <div style={{ width: "90%" }} key={productCategory.categoryId}>
              <h2>{productCategory.categoryName}</h2>
              {productCategory.products?.map((product) => {
                return (
                  <Product
                    key={product.id}
                    product={product}
                    quantity={
                      products.find(
                        (cartItem) => cartItem.productId === product.id
                      )?.quantity || 0
                    }
                  ></Product>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Customer;
