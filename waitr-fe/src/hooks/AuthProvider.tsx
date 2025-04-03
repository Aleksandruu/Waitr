import { useContext, createContext, useState } from "react";
import { login } from "../service/authService";
import { User } from "../models/user.model";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { createInterceptor } from "./HttpInterceptor";
import { useNavigate } from "@tanstack/react-router";

interface AuthContextType {
  user: User | null;
  token: string;
  logIn(data: { username: string; password: string }): Promise<string>;
  logOut(): void;
}

interface TokenPayload {
  role: string;
  username: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

createInterceptor();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("waitr_token") || ""
  );

  const logIn = async (data: { username: string; password: string }) => {
    const res = await login(data.username, data.password);
    setUser(res.user);
    setToken(res.accessToken);
    localStorage.setItem("waitr_token", res.accessToken);
    const decoded = jwtDecode<TokenPayload>(res.accessToken);
    return decoded.role;
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("waitr_token");
  };

  return (
    <AuthContext.Provider value={{ token, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
