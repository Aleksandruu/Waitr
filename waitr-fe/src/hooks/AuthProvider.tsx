import { useContext, createContext, useState } from "react";
import { login } from "../service/authService";
import { User } from "../models/user.model";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { createInterceptor } from "./HttpInterceptor";

interface AuthContextType {
  getRole(): string;
  getUsername(): string;
  token: string;
  logIn(data: { username: string; password: string }): Promise<void>;
  logOut(): void;
}

export interface TokenPayload {
  role: "admin" | "manager" | "waiter" | "cook";
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
createInterceptor();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(
    localStorage.getItem("waitr_token") || ""
  );

  const logIn = async (data: { username: string; password: string }) => {
    const res = await login(data.username, data.password);
    setToken(res.accessToken);
    localStorage.setItem("waitr_token", res.accessToken);
  };

  const getRole = () => {
    if (token === "") {
      return "";
    }
    const role = jwtDecode<TokenPayload>(token).role;
    return role;
  };

  const getUsername = () => {
    if (token === "") {
      return "";
    }
    const username = jwtDecode<TokenPayload>(token).name;
    return username;
  };

  const logOut = () => {
    setToken("");
    localStorage.removeItem("waitr_token");
  };

  return (
    <AuthContext.Provider
      value={{ token, getRole, getUsername, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
