import { FileBuffer } from "shared";

export const bufferToFile = (buffer: FileBuffer, mime: string) => {
  if (buffer) {
    const uint8Array = new Uint8Array(buffer.data);

    const blob = new Blob([uint8Array], { type: mime });

    return new File([blob], "logo", {
      type: mime,
      lastModified: Date.now(),
    });
  }
};
