import { useEffect, useState } from "react";
import styles from "./ImageInput.module.scss";
import { resizeImage } from "apps/waitr-web/src/helpers/resizeImage";

type ImageInputProps = {
  name: string;
  onChange: (file: File) => void;
  initialImage?: File;
  initialImageUrl?: string;
  small?: string;
};

const ImageInput = ({
  name,
  onChange,
  initialImage,
  initialImageUrl,
  small,
}: ImageInputProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl || null
  );

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

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

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
