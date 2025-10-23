import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../core/di.js";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import isValidUrl from "../../core/isValidUrl.js";

export default async function getDownloadPicture(fileName) {
  if (!fileName) return null;

  const isNative = Capacitor.isNativePlatform(); // iOS / Android

  // 🚀 CASE 1: Native app (use Capacitor Filesystem caching)
  if (isNative) {
    try {
      const safeName = fileName.replace(/[^\w.-]/g, "_") + ".jpg";

      // Try to read from local cache
      const file = await Filesystem.readFile({
        path: safeName,
        directory: Directory.Cache,
      });

      return `data:image/jpeg;base64,${file.data}`;
    } catch {
      // Not found — get from Firebase and save locally
      const url = !isValidUrl(fileName)
        ? await getDownloadURL(ref(storage, fileName))
        : fileName;

      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();

      const base64Data = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const safeName = fileName.replace(/[^\w.-]/g, "_") + ".jpg";
      await Filesystem.writeFile({
        path: safeName,
        data: base64Data,
        directory: Directory.Cache,
      });

      return `data:image/jpeg;base64,${base64Data}`;
    }
  }

  // 🚀 CASE 2: Web/Desktop (return Firebase HTTPS URL)
  else {
    try {
      if (!isValidUrl(fileName)) {
        const url = await getDownloadURL(ref(storage, fileName));
        return url;
      } else {
        return fileName;
      }
    } catch (err) {
      console.error("Error fetching Firebase image:", err);
      return null;
    }
  }
}