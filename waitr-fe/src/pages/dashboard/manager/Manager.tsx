import { Link } from "@tanstack/react-router";
import { useGetLocationQuery, useGetStaffQuery } from "../../../api/managerApi";
import StaffCard from "../Admin/LocationPage/StaffCard/StaffCard";
import styles from "./Manager.module.scss";
import cardStyles from "../card.module.scss";

type ManagerProps = {};

const Manager = ({}: ManagerProps) => {
  const { data } = useGetStaffQuery();

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
        {data?.map((staffMember) => (
          <StaffCard staff={staffMember} key={staffMember.id}></StaffCard>
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
