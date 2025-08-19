import { Preferences } from "@capacitor/preferences";

export default async function setLocalStore(key, value) {
  try {
    // Preferences.set works both on native platforms and web
    await Preferences.set({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    });
  } catch (error) {
    console.error("Error setting local store:", error);
    // On web fallback, you could also try localStorage manually
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        );
      } catch (e) {
        console.error("Fallback localStorage set error:", e);
      }
    }
  }
}
