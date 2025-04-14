import styles from "./StaffCard.module.scss";
import { StaffMember } from "../../../../../models/location.model";
import cardStyles from "../../../card.module.scss";

interface StaffCardProps {
  staff?: StaffMember;
  isLoading?: boolean;
}

function StaffCard({ staff, isLoading }: StaffCardProps) {
  return (
    <div className={cardStyles.card}>
      {staff ? (
        <>
          <h2>{staff.name}</h2>
          <p>{staff.role}</p>
          <p>{staff.id}</p>
        </>
      ) : (
        ""
      )}
      {isLoading ? (
        <div className={cardStyles.loading}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : null}
    </div>
  );
}

export default StaffCard;
