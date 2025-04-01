import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../service/authService";
import { User } from "../models/user.model";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { createInterceptor } from "./HttpInterceptor";

interface AuthContextType {
  user: User | null;
  token: string;
  logIn(data: { username: string; password: string }): void;
  logOut(): void;
}

interface TokenPayload {
  role: string;
  username: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: "",
  logIn: () => {},
  logOut: () => {},
});

createInterceptor();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("waitr_token") || ""
  );
  const navigate = useNavigate();

  const logIn = async (data: { username: string; password: string }) => {
    login(data.username, data.password)
      .then((res) => {
        setUser(res.user);
        setToken(res.accessToken);
        localStorage.setItem("waitr_token", res.accessToken);
        const decoded = jwtDecode<TokenPayload>(res.accessToken);
        if (decoded.role === "admin") {
          navigate("/admin");
        }
        if (decoded.role === "manager") {
          navigate("/manager");
        }
        return;
      })
      .catch((error) => {
        alert(error);
      });
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("waitr_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
