import { SocialLogin } from "@capgo/capacitor-social-login";

const initSocialLogin = (CLIENT_ID, IOS_CLIENT_ID) => {


  SocialLogin.initialize({
    google: {
      webClientId: CLIENT_ID,
      iOSClientId: IOS_CLIENT_ID,
      iOSServerClientId: CLIENT_ID,
      mode: "online",
    },
  }).catch(err => {
    console.error("SocialLogin init failed:", err);
  });
};
export default initSocialLogin