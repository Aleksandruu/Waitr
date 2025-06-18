import { Link, useNavigate } from "@tanstack/react-router";
import {
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetCategoriesQuery,
  useGetStaffQuery,
} from "../../../api/managerApi";
import StaffCard from "../Admin/LocationPage/StaffCard/StaffCard";
import styles from "./Manager.module.scss";
import cardStyles from "../card.module.scss";
import { classNames } from "waitr-fe/src/helpers/className";

type ManagerProps = {};

const Manager = ({}: ManagerProps) => {
  const { data: staff } = useGetStaffQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: products } = useGetAllProductsQuery();

  const [deleteCategory] = useDeleteCategoryMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Manager</h1>
        <Link
          to="/dashboard/manager/location-setup"
          className={cardStyles.addNewCard}
        >
          Location Settings
        </Link>

        <h2>Staff</h2>
        {staff?.map((staffMember, index) => (
          <StaffCard staff={staffMember} key={index}></StaffCard>
        ))}
        <Link
          to="/dashboard/manager/staff/create"
          className={cardStyles.addNewCard}
        >
          Add new staff member
        </Link>

        <h2>Categories</h2>
        {categories?.map((category, index) => (
          <div
            className={classNames(cardStyles.card, styles.category)}
            key={index}
          >
            <strong>{category.name}</strong>
            <img
              src="/assets/trash-solid.svg"
              alt="delete"
              onClick={() => deleteCategory(category.id)}
            />
          </div>
        ))}
        <Link
          to="/dashboard/manager/category/create"
          className={cardStyles.addNewCard}
        >
          Add new category
        </Link>

        <h2>Products</h2>
        {products?.map((product, index) => (
          <div
            className={classNames(cardStyles.card, styles.category)}
            key={index}
          >
            <div
              onClick={() =>
                navigate({
                  to: `/dashboard/manager/product/edit/${product.productId}`,
                })
              }
            >
              <strong>{product.productName}</strong>
              <p>{product.categoryName}</p>
            </div>
            <img
              src="/assets/trash-solid.svg"
              alt="delete"
              onClick={() => deleteProduct(product.productId)}
            />
          </div>
        ))}
        <Link
          to="/dashboard/manager/product/create"
          className={cardStyles.addNewCard}
        >
          Add new product
        </Link>
      </div>
    </div>
  );
};

export default Manager;
