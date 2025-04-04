import "./admin.scss";
import { getLocations } from "../../../service/adminService";
import { useEffect, useState } from "react";
import { ILocation } from "../../../models/location.model";
import LocationCard from "./locationCard/LocationCard";
import { Link } from "@tanstack/react-router";

const Admin = () => {
  const [locations, setLocations] = useState<ILocation[]>([]);

  useEffect(() => {
    getLocations().then((locations) => {
      setLocations(locations);
    });
  }, []);

  return (
    <div className="container">
      <div className="middle-column-container flex-start">
        <h1>Admin</h1>
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      <Link to="/dashboard/admin/location/create" className="card">
        Add a new location
      </Link>
      </div>
    </div>
  );
};

export default Admin;
