import admin, { ServiceAccount } from "firebase-admin";
import serviceAccountJson from "../waitr-aa853-firebase-adminsdk-fbsvc-e36e08e124.json";

const serviceAccount = serviceAccountJson as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://waitr-aa853.firebasestorage.app",
});

const bucket = admin.storage().bucket();

export default bucket;
