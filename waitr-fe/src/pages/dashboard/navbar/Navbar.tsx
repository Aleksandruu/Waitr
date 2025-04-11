import { useNavigate } from "@tanstack/react-router";
import styles from "./Navbar.module.scss";
import Button from "../../../base_components/button/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../../login/Auth.slice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <nav className={styles.nav}>
        <Button
          onClick={() => {
            dispatch(authActions.logout());
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
