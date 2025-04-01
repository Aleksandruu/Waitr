import axios from "axios";
import { environment } from "../environment/environment";
import { ILocation } from "../models/location.model";

export async function getLocations(): Promise<ILocation[]> {
  const response = await axios.get(environment.apiUrl + "/admin/locations");
  return response.data;
}
