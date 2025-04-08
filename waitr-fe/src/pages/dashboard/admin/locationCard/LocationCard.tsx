import { ILocation } from "../../../../models/location.model";
import { Link } from "@tanstack/react-router";
import styles from "./LocationCard.module.scss";

function LocationCard({ location }: { location: ILocation }) {
  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;

  return (
    <Link
      className={styles.card}
      to="/dashboard/admin/location/$locationId"
      params={{ locationId: location.id }}
    >
      <h2>{location.name}</h2>
      <p>Id: {location.id}</p>
      <p>Website: {clientUrl + "/" + location.slug}</p>
    </Link>
  );
}

export default LocationCard;
