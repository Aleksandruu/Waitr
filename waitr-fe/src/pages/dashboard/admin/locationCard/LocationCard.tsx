import { ILocation } from "../../../../models/location.model";
import "./locationCard.scss";
import { Link } from '@tanstack/react-router'


function LocationCard({ location }: { location: ILocation }) {
  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;

  return (
    <Link className="card" to="/dashboard/admin/location/$locationId" params={{locationId: location.id}}>
      <h2>{location.name}</h2>
      <p>Id: {location.id}</p>
      <p>Website: {clientUrl + "/" + location.slug}</p>
      </Link>
  );
}

export default LocationCard;
