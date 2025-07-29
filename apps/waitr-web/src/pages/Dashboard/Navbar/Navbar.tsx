import { useRouter } from "next/navigation";
import styles from "./Navbar.module.scss";
import Button from "../../../base_components/Button/Button";
import { authActions } from "../../Login/Auth.slice";
import { bufferToFile } from "apps/waitr-web/src/helpers/byteArrayToFile";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "apps/waitr-web/src/helpers/app.hooks";
import { useGetLocationSettingsQuery } from "../../../api/managerApi";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
            router.push("/login");
          }}
          text="Logout"
          color="brand-light"
        ></Button>
        {logoUrl && <img className={styles.logo} src={logoUrl} alt="logo" />}
      </nav>
      <div className={styles.navFiller}></div>
    </>
  );
};

export default Navbar;
