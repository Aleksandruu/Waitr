export function resizeImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        const maxHeight = 150; // Înălțimea maximă dorită
        const ratio = img.width / img.height;

        let newWidth = img.width;
        let newHeight = img.height;

        // Dacă înălțimea depășește 100px, redimensionăm imaginea
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = maxHeight * ratio;
        }

        // Creăm un canvas pentru a desena imaginea redimensionată
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Desenăm imaginea pe canvas
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Creăm un nou fișier din imaginea redimensionată
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, "image/jpeg");
        } else {
          reject(new Error("Canvas context not available"));
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    // Citim fișierul ca URL
    reader.readAsDataURL(file);
  });
}
