import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

const OAuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    let rawState = params.get("state");
    const code = params.get("code");

    let storyId = null;
console.log("OAuth returned:", {
  fullUrl: window.location.href,
  state: params.get("state"),
  code: params.get("code")
});
    // ✅ Support both plain string and JSON state
    try {
      const parsed = JSON.parse(rawState);
      storyId = parsed?.storyId || parsed;
    } catch {
      storyId = rawState;
    }

    console.log("OAuth returned:", {
      fullUrl: window.location.href,
      state: rawState,
      parsedStoryId: storyId,
      code,
      isNative: Capacitor.isNativePlatform()
    });

    if (storyId) {
      const redirectPath = `/story/${storyId}/editor`;

      console.log("Redirecting to:", redirectPath);

      // ✅ Use hard redirect for BOTH platforms (most reliable)
      window.location.replace(redirectPath);
    } else {
      console.warn("No state found, redirecting home");

      window.location.replace("/");
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      Signing you in...
    </div>
  );
};

export default OAuthCallback;