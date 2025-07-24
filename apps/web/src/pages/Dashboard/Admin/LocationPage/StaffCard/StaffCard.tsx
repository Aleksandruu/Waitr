import { StaffMember } from "types";
import cardStyles from "../../../card.module.scss";

interface StaffCardProps {
  staff?: StaffMember;
  isLoading?: boolean;
}

const StaffCard = (props: StaffCardProps) => {
  const { staff, isLoading } = props;
  return (
    <div className={cardStyles.card}>
      {staff ? (
        <>
          <h2>{staff.username}</h2>
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
};

export default StaffCard;
