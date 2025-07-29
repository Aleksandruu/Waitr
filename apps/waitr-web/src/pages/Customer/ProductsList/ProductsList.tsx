import { useGetProductsQuery } from "@/api/customerApi";
import styles from "./ProductsList.module.scss";
import { useEffect } from "react";
import { Route } from "../../../routes/$locationSlug/$tableNumber/index";
import Product from "./Product/Product";
import { orderActions } from "../Customer.slice";
import { useAppDispatch, useAppSelector } from "../../../helpers/app.hooks";

type CustomerProps = {
  // props here
};

const Customer = ({}: CustomerProps) => {
  const { products, currentOrder } = useAppSelector((state) => state.order);

  const { locationSlug } = Route.useParams();

  const { data } = useGetProductsQuery(locationSlug);

  const dispatch = useAppDispatch();

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
