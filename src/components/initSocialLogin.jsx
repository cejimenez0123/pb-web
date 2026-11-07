// import { SocialLogin } from "@capgo/capacitor-social-login";
// const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
// const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
// const initSocialLogin = (iosClientId=IOS_CLIENT_ID,clientId=CLIENT_ID) => {


//     SocialLogin.initialize({
//            apple: {
//              clientId:iosClientId,
//            },
//            google: {
//              webClientId: clientId,
//              iOSClientId: iosClientId,
//              iOSServerClientId: clientId,
//            },
//          }).catch(err => {
//     console.error("SocialLogin init failed:", err);
//   });
// };
// export default initSocialLogin
import { SocialLogin } from "@capgo/capacitor-social-login";

const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;

// Keep one initialization promise for the lifetime of the app.
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