import "./admin.scss";
import { getLocations } from "../../service/adminService";
import { useEffect, useState } from "react";
import { ILocation } from "../../models/location.model";
import LocationCard from "../../components/locationCard/LocationCard";

const Admin = () => {
  const [locations, setLocations] = useState<ILocation[]>([]);

  useEffect(() => {
    getLocations().then((data) => {
      setLocations(data);
    });
  }, []);

  return (
    <div className="container">
      <div className="middle-column-container flex-start">
        <h1>Admin</h1>
        {locations.map((location) => (
          <LocationCard location={location} />
        ))}
      </div>
    </div>
  );
};

export default Admin;
