import { useParams } from "@tanstack/react-router";
import StaffCard from "./StaffCard/StaffCard";
import styles from "./LocationPage.module.scss";
import { useGetLocationByIdQuery } from "../../../../api/adminApi";

function LocationPage() {
  const clientUrl = import.meta.env.VITE_APP_CLIENT_URL;
  const { locationId } = useParams({ strict: false });

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
}

export default LocationPage;
