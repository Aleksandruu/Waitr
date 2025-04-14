import { ILocation } from "../../../models/location.model";
import LocationCard from "./locationCard/LocationCard";
import { Link } from "@tanstack/react-router";
import styles from "./Admin.module.scss";
import { useGetLocationsQuery } from "../../../api/adminApi";

type AdminProps = {
  data?: ILocation[];
};

const Admin = ({ data: propsLocations }: AdminProps) => {
  const { data } = useGetLocationsQuery();
  const skeletonLocations = [1, 2, 3];

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Admin</h1>
        {data
          ? data.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))
          : skeletonLocations.map((index) => (
              <LocationCard key={index} isLoading={true} />
            ))}
        <Link
          to="/dashboard/admin/location/create"
          className={styles.addNewLocation}
        >
          Add a new location
        </Link>
      </div>
    </div>
  );
};

export default Admin;
