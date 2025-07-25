import { useAppSelector } from "apps/waitr-web/src/helpers/app.hooks";
import styles from "./Navbar.module.scss";
import { useEffect, useState } from "react";
import { bufferToFile } from "apps/waitr-web/src/helpers/byteArrayToFile";

type NavbarProps = {
  // props here
};

const Navbar = ({}: NavbarProps) => {
  const {
    logoBuffer: buffer,
    logoMime: mime,
    name,
  } = useAppSelector((state) => state.location);
  const [logoUrl, setLogoUrl] = useState<string | undefined>("");

  useEffect(() => {
    const file = buffer && mime ? bufferToFile(buffer, mime) : undefined;
    console.log("file", mime);
    setLogoUrl(!!file ? URL.createObjectURL(file!) : undefined);
    return () => {
      if (logoUrl) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, [buffer, mime]);
  return (
    <>
      <nav className={styles.navbar}>
        {logoUrl ? (
          <img className={styles.logo} src={logoUrl} alt="logo" />
        ) : (
          <h1>{name}</h1>
        )}
      </nav>
      ;<div className={styles.navFiller}></div>
    </>
  );
};

export default Navbar;
