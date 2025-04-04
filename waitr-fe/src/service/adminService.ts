import axios from "axios";
import { ILocation } from "../models/location.model";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function getLocations(): Promise<ILocation[]> {
  const response = await axios.get(apiUrl + "/admin/locations");
  return response.data;
}

export async function getLocation(locationId: string): Promise<ILocation> {
  const response = await axios.get(apiUrl + "/admin/location/" + locationId);
  return response.data;
}
