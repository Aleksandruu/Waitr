import { ILocation } from "../../models/location.model";
import "./locationCard.scss";

function LocationCard({ location }: { location: ILocation }) {
  return (
    <div className="card">
      <h2>{location.location}</h2>
      <p>Manager: {location.name}</p>
      <p>Id: {location.id}</p>
    </div>
  );
}

export default LocationCard;
