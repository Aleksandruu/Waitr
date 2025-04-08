import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../hooks/AuthProvider";
import styles from "./Navbar.module.scss";
import Button from "../../../base_components/button/Button";

function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav className={styles.nav}>
        <p>Hello, {auth?.getUsername()}!</p>
        <Button
          onClick={() => {
            auth?.logOut();
            navigate({ to: "/login" });
          }}
          text="Logout"
          color="green"
        ></Button>
      </nav>
      <div className={styles.navFiller}></div>
    </>
  );
}

export default Navbar;
