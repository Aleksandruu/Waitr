import { LocationResponseDto } from "types";
import Link from "next/link";
import styles from "./LocationCard.module.scss";
import cardStyles from "../../card.module.scss";
import Button from "apps/waitr-web/src/base_components/Button/Button";
import { useChangeActiveStatusMutation } from "../../../../api/adminApi";

interface LocationCardProps {
  location?: LocationResponseDto;
  isLoading?: boolean;
}

function LocationCard(props: LocationCardProps) {
  const { location, isLoading } = props;
  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;

  const [changeActiveStatus, { isLoading: loading }] =
    useChangeActiveStatusMutation();

  return (
    <Link
      className={cardStyles.card}
      href={`/dashboard/admin/location/${location ? location.id : ""}`}
    >
      {location ? (
        <>
          <h2>{location.name}</h2>
          <p>Id: {location.id}</p>
          <p>Website: {clientUrl + "/" + location.slug}</p>
          {location.active ? (
            <Button
              color="red"
              text={"Deactivate location"}
              loading={loading}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                changeActiveStatus({ id: location.id, active: false });
              }}
            ></Button>
          ) : (
            <Button
              color="green"
              text={"Activate location"}
              loading={loading}
              onClick={(e) => {
                e?.preventDefault();
                e?.stopPropagation();
                changeActiveStatus({ id: location.id, active: true });
              }}
            ></Button>
          )}
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
    </Link>
  );
}

export default LocationCard;
