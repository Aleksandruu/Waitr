import { useParams } from "@tanstack/react-router";
import { getLocation } from "../../../../service/adminService";
import { ILocation } from "../../../../models/location.model";
import { useEffect, useState } from "react";
import StaffCard from "./staffCard/StaffCard";
import styles from "./LocationPage.module.scss";
import { useGetLocationByIdQuery } from "../../../../api/adminApi";

function LocationPage() {
  const { locationId } = useParams({ strict: false });

  const {
    data: location,
    isLoading,
    isError,
  } = useGetLocationByIdQuery(locationId!);

  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;

  return (
    <div className="container">
      <div className="middle-column-container flex-start">
        <h1>{location?.name}</h1>
        <p>{clientUrl + "/" + location?.slug}</p>
        {location?.staffMembers?.map((staffMember) => <StaffCard></StaffCard>)}
      </div>
    </div>
  );
}

export default LocationPage;
