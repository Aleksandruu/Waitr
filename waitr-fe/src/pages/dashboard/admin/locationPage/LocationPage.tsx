import { useParams } from "@tanstack/react-router";
import { getLocation } from "../../../../service/adminService";
import { ILocation } from "../../../../models/location.model";
import { useEffect, useState } from "react";

function LocationPage() {
  const { locationId } = useParams({ strict: false });

  const [location, setLocation] = useState<ILocation | undefined>(undefined);

  useEffect(() => {
    getLocation(locationId!).then((location) => {
      setLocation(location);
    });
  }, [locationId]);

  return <div>{location?.name}</div>;
}

export default LocationPage;
