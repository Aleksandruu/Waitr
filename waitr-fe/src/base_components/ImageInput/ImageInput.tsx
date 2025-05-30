import { useEffect, useState } from "react";
import styles from "./ImageInput.module.scss";
import { resizeImage } from "waitr-fe/src/helpers/resizeImage";

type ImageInputProps = {
  name: string;
  onChange: (file: File) => void;
  initialImage?: File;
  small?: string;
};

const ImageInput = ({
  name,
  onChange,
  initialImage,
  small,
}: ImageInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handlePhotoChange = async (
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
      const previewUrl = URL.createObjectURL(initialImage);
      setImagePreview(previewUrl);
    }
  }, [initialImage]);

  return (
    <>
      <label htmlFor="photo" className={styles.label}>
        <p>{name}:</p>
        <small>{small}</small>
        <br />
        {imagePreview ? (
          <img className={styles.photo} src={imagePreview} alt="Preview" />
        ) : (
          <div className={styles.addImage}>+</div>
        )}{" "}
      </label>
      <input
        className={styles.input}
        id="photo"
        name="photo"
        type="file"
        onChange={handlePhotoChange}
      />
    </>
  );
};

export default ImageInput;
