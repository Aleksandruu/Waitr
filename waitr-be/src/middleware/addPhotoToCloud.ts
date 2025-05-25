import { v4 as uuidv4 } from "uuid";
import bucket from "../firebase";

export const addPhotoToCloud = async (file: Express.Multer.File) => {
  const blob = bucket.file(`${uuidv4()}-${file?.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file?.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};
