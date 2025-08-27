"use client"

import { useParams } from "next/navigation";
import StaffCard from "./StaffCard/StaffCard";
import { useGetLocationByIdQuery } from "@api/adminApi";

const LocationPage = () => {
  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  const params = useParams();
  const { locationId } = params as { locationId: string };

  const {
    data: location,
    isLoading,
    isError,
  } = useGetLocationByIdQuery(locationId!);

  const skeleton = [1, 2, 3];

  return (
    <div className="container">
      <div className="middle-column-container flex-start">
        <h1>{location?.name}</h1>
        <p>{clientUrl + "/" + location?.slug}</p>
        {location
          ? location.staff?.map((staffMember) => (
              <StaffCard staff={staffMember} key={staffMember.id}></StaffCard>
            ))
          : skeleton.map((skeleton) => (
              <StaffCard isLoading={true} key={skeleton}></StaffCard>
            ))}
      </div>
    </div>
  );
};

export default LocationPage;
