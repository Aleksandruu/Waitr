import { useProductsQuery } from "waitr-fe/src/api/customerApi";
import styles from "./ProductsList.module.scss";
import { useEffect } from "react";
import { Route } from "waitr-fe/src/routes/$locationSlug/$tableNumber/index";
import Product from "./Product/Product";

type CustomerProps = {
  // props here
};

const Customer = ({}: CustomerProps) => {
  const { locationSlug } = Route.useParams();
  const { data } = useProductsQuery(locationSlug);

  return (
    <div className={styles.products}>
      {data?.map((productCategory) => {
        return (
          <div style={{ width: "90%" }} key={productCategory.categoryId}>
            <h2>{productCategory.categoryName}</h2>
            {productCategory.products?.map((product) => {
              return <Product key={product.id} product={product}></Product>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Customer;
