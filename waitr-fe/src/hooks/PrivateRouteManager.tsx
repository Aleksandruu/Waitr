import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  role: string;
  username: string;
}

const PrivateRouteManager = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.role !== "manager") {
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRouteManager;
