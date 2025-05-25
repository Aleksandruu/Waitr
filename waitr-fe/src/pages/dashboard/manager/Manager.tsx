import { Link } from "@tanstack/react-router";
import {
  useGetAllProductsQuery,
  useGetCategoriesQuery,
  useGetStaffQuery,
} from "../../../api/managerApi";
import StaffCard from "../Admin/LocationPage/StaffCard/StaffCard";
import styles from "./Manager.module.scss";
import cardStyles from "../card.module.scss";

type ManagerProps = {};

const Manager = ({}: ManagerProps) => {
  const { data: staff } = useGetStaffQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: products } = useGetAllProductsQuery();

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
          <div className={cardStyles.card} key={index}>
            <strong>{category.name}</strong>
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
          <div className={cardStyles.card} key={index}>
            <strong>{product.productName}</strong>
            <p>{product.categoryName}</p>
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
