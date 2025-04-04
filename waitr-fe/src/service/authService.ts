import { Login } from "../models/login.model";
import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export const isAuthenticated = () => {
  const token = localStorage.getItem("waitr_token");
  return token !== null;
};

export async function login(
  username: string,
  password: string
): Promise<Login> {
  const response = await axios.post<Login>(apiUrl + "/auth/login", {
    username,
    password,
  });
  return response.data;
}
