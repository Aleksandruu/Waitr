import { useEffect, useState } from "react";
import styles from "./ImageInput.module.scss";
import { resizeImage } from "waitr-fe/src/helpers/resizeImage";

type ImageInputProps = {
  name: string;
  onChange: (file: File) => void;
  initialImage?: File;
  small?: string;
};

const bufferToDataURL = (buffer: {
  type: "Buffer";
  data: number[] | Uint8Array;
}) => {
  try {
    // Creează un Uint8Array din datele buffer
    const uint8Array = new Uint8Array(buffer.data);

    // Creează un Blob din array-ul de bytes
    const blob = new Blob([uint8Array], { type: "image/jpeg" }); // sau 'image/png' după caz

    // Generează un URL pentru Blob
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Eroare la conversia bufferului:", error);
    return null;
  }
};

const ImageInput = ({
  name,
  onChange,
  initialImage,
  small,
}: ImageInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resizedFile = await resizeImage(file);
      onChange(resizedFile);

      const previewUrl = URL.createObjectURL(resizedFile);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    if (initialImage) {
      console.log(initialImage);
      const previewUrl = URL.createObjectURL(initialImage);
      setImagePreview(previewUrl);
    }
  }, [initialImage]);

  return (
    <>
      <label htmlFor="logo" className={styles.label}>
        <p>{name}:</p>
        <small>{small}</small>
        <br />
        {imagePreview ? (
          <img className={styles.logo} src={imagePreview} alt="Preview" />
        ) : (
          <div className={styles.addImage}>+</div>
        )}{" "}
      </label>
      <input
        className={styles.input}
        id="logo"
        name="logo"
        type="file"
        onChange={handleLogoChange}
      />
    </>
  );
};

export default ImageInput;
