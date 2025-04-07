import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../hooks/AuthProvider";
import "./navbar.scss";

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav>
        <p>Hello, {auth?.getUsername()}!</p>
        <button
          onClick={() => {
            auth?.logOut();
            navigate({ to: "/login" });
          }}
          className="btn"
        >
          Logout
        </button>
      </nav>
      <div className="nav-filler"></div>
    </>
  );
}

export default Navbar;
