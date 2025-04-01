import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Login from "./pages/login/Login";
import AuthProvider from "./hooks/AuthProvider";
import Manager from "./pages/manager/Manager";
import PrivateRouteAdmin from "./hooks/PrivateRouteAdmin";
import PrivateRouteManager from "./hooks/PrivateRouteManager";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRouteManager />}>
            <Route path="/manager" element={<Manager />} />
          </Route>
          <Route element={<PrivateRouteAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
