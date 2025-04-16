import { Link } from "@tanstack/react-router";
import { useGetLocationQuery, useGetStaffQuery } from "../../../api/managerApi";
import StaffCard from "../Admin/LocationPage/StaffCard/StaffCard";
import styles from "./Manager.module.scss";
import cardStyles from "../card.module.scss";

type ManagerProps = {};

const Manager = ({}: ManagerProps) => {
  const { data } = useGetStaffQuery();
  useGetLocationQuery();

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Manager</h1>
        <h2>Staff</h2>
        {data?.map((staffMember) => (
          <StaffCard staff={staffMember}></StaffCard>
        ))}
        <Link
          to="/dashboard/manager/staff/create"
          className={cardStyles.addNewCard}
        >
          Add new staff member
        </Link>
        <h2>Products</h2>
      </div>
    </div>
  );
};

export default Manager;
