
import { SocialLogin } from "@capgo/capacitor-social-login";

const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;

let socialLoginPromise = null;

export default function initSocialLogin() {
  if (!socialLoginPromise) {
    socialLoginPromise = SocialLogin.initialize({
      google: {
        webClientId: CLIENT_ID,
        iOSClientId: IOS_CLIENT_ID,
        iOSServerClientId: CLIENT_ID,
      },
      apple: {
        clientId: IOS_CLIENT_ID,
      },
    }).catch((error) => {
      // Allow a subsequent attempt if initialization fails.
      socialLoginPromise = null;
      console.error("SocialLogin initialization failed:", error);
      throw error;
    });
  }

  return socialLoginPromise;
}