// import { getDownloadURL, ref } from "firebase/storage";
// import { storage } from "../../core/di.js";
// import { Capacitor } from "@capacitor/core";
// import { Filesystem, Directory } from "@capacitor/filesystem";
// import isValidUrl from "../../core/isValidUrl.js";

// export default async function getDownloadPicture(fileName) {
//   if (!fileName) return null;

//   const isNative = Capacitor.isNativePlatform(); // iOS / Android

//   // 🚀 CASE 1: Native app (use Capacitor Filesystem caching)
//   if (isNative) {
//     try {
//       const safeName = fileName.replace(/[^\w.-]/g, "_") + ".jpg";

//       // Try to read from local cache
//       const file = await Filesystem.readFile({
//         path: safeName,
//         directory: Directory.Cache,
//       });

//       return `data:image/jpeg;base64,${file.data}`;
//     } catch {
//       // Not found — get from Firebase and save locally
//       const url = !isValidUrl(fileName)
//         ? await getDownloadURL(ref(storage, fileName))
//         : fileName;

//       const response = await fetch(url);
//       const blob = await response.blob();
//       const reader = new FileReader();

//       const base64Data = await new Promise((resolve, reject) => {
//         reader.onloadend = () => resolve(reader.result.split(",")[1]);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });

//       const safeName = fileName.replace(/[^\w.-]/g, "_") + ".jpg";
//       await Filesystem.writeFile({
//         path: safeName,
//         data: base64Data,
//         directory: Directory.Cache,
//       });

//       return `data:image/jpeg;base64,${base64Data}`;
//     }
//   }

//   // 🚀 CASE 2: Web/Desktop (return Firebase HTTPS URL)
//   else {
//     try {
//       if (!isValidUrl(fileName)) {
//         const url = await getDownloadURL(ref(storage, fileName));
//         return url;
//       } else {
//         return fileName;
//       }
//     } catch (err) {
//       console.error("Error fetching Firebase image:", err);
//       return null;
//     }
//   }
// }
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../core/di.js";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import isValidUrl from "../../core/isValidUrl.js";

/**
 * Returns:
 * {
 *   thumbnail: data:image/... (Base64, safe for IonImg on iOS),
 *   full: https://firebasestorage... (direct Firebase URL)
 * }
 */
export default async function getDownloadPicture(fileName) {
  if (!fileName) return { thumbnail: null, full: null };

  const isNative = Capacitor.isNativePlatform();

  try {
    // Step 1: Resolve Firebase HTTPS URL
    const firebaseUrl = !isValidUrl(fileName)
      ? await getDownloadURL(ref(storage, fileName))
      : fileName;

    // Step 2: Web/Desktop → use URL directly
    if (!isNative) {
      return {
        thumbnail: firebaseUrl,
        full: firebaseUrl,
      };
    }

    // Step 3: Native (iOS/Android) → look for cached thumbnail
    const safeName = fileName.replace(/[^\w.-]/g, "_") + "_thumb.jpg";
    try {
      const cached = await Filesystem.readFile({
        path: safeName,
        directory: Directory.Cache,
      });
      return {
        thumbnail: `data:image/jpeg;base64,${cached.data}`,
        full: firebaseUrl,
      };
    } catch {
      // continue to generate thumbnail
    }

    // Step 4: Download + generate Base64 thumbnail
    const response = await fetch(firebaseUrl);
    const blob = await response.blob();

    const base64Thumb = await shrinkAndConvertToBase64(blob, 256); // 256px width thumbnail

    // Step 5: Cache the thumbnail locally
    await Filesystem.writeFile({
      path: safeName,
      data: base64Thumb.split(",")[1],
      directory: Directory.Cache,
    });

    return {
      thumbnail: base64Thumb,
      full: firebaseUrl,
    };
  } catch (err) {
    console.error("Error loading image:", err);
    return { thumbnail: null, full: null };
  }
}

/**
 * Downsizes an image blob and returns Base64 data URL.
 */
async function shrinkAndConvertToBase64(blob, maxWidth) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onloadend = () => {
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      const w = Math.min(img.width, maxWidth);
      const h = img.height * scale;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
  });
}
