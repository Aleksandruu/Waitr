import { Login } from "../models/login.model";
import { environment } from "../environment/environment";
import axios from "axios";

export async function login(
  username: string,
  password: string
): Promise<Login> {
  const response = await axios.post<Login>(`${environment.apiUrl}/auth/login`, {
    username,
    password,
  });
  return response.data;
}
