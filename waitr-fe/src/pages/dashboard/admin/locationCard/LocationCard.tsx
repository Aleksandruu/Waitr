import { LocationResponseDto } from "shared";
import { Link } from "@tanstack/react-router";
import styles from "./LocationCard.module.scss";
import cardStyles from "../../card.module.scss";

interface LocationCardProps {
  location?: LocationResponseDto;
  isLoading?: boolean;
}

function LocationCard({ location, isLoading }: LocationCardProps) {
  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;

  return (
    <Link
      className={cardStyles.card}
      to="/dashboard/admin/location/$locationId"
      params={{ locationId: location ? location.id : "" }}
    >
      {location ? (
        <>
          <h2>{location.name}</h2>
          <p>Id: {location.id}</p>
          <p>Website: {clientUrl + "/" + location.slug}</p>
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
