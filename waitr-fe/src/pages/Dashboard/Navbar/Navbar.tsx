import { useNavigate } from "@tanstack/react-router";
import styles from "./Navbar.module.scss";
import Button from "../../../base_components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../Login/Auth.slice";
import { RootState } from "waitr-fe/src/store";
import { bufferToFile } from "waitr-fe/src/helpers/byteArrayToFile";
import { useEffect, useState } from "react";
import { useAppSelector } from "waitr-fe/src/helpers/app.hooks";
import { useGetLocationSettingsQuery } from "../../../api/managerApi";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetLocationSettingsQuery("undefined");

  const {
    logoBuffer: buffer,
    logoMime: mime,
    name,
  } = useAppSelector((state) => state.location);
  const [logoUrl, setLogoUrl] = useState<string | undefined>("");

  useEffect(() => {
    const file = buffer && mime ? bufferToFile(buffer, mime) : undefined;
    setLogoUrl(!!file ? URL.createObjectURL(file!) : undefined);
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [buffer, mime]);

  return (
    <>
      <nav className={styles.nav}>
        <Button
          onClick={() => {
            dispatch(authActions.logout());
            navigate({ to: "/login" });
          }}
          text="Logout"
          color="brand-light"
        ></Button>
        {logoUrl && <img className={styles.logo} src={logoUrl} alt="logo" />}
      </nav>
      <div className={styles.navFiller}></div>
    </>
  );
}

export default Navbar;
