import { ILocation } from "../../../models/location.model";
import LocationCard from "./locationCard/LocationCard";
import { Link } from "@tanstack/react-router";
import styles from "./Admin.module.scss";
import { useGetLocationsQuery } from "../../../api/adminApi";

type AdminProps = {
  locations?: ILocation[];
};

const Admin = ({ locations: propsLocations }: AdminProps) => {
  const { data, refetch, isFetching } = useGetLocationsQuery();

  return (
    <div className="container">
      <div className="middle-column-container">
        <h1>Admin</h1>
        {data?.map((location) => (
          <LocationCard key={location.id} location={location} />
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
