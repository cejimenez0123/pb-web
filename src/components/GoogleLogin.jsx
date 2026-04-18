import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { IonText, IonSpinner, IonImg, IonRow } from "@ionic/react";
import { useDispatch } from "react-redux";
import { SocialLogin } from "@capgo/capacitor-social-login";
// import DeviceCheck from "./DeviceCheck";
import { Preferences } from "@capacitor/preferences";
import Googlelogo from "../images/logo/googlelogo.png";
import ErrorBoundary from "../ErrorBoundary";
import { sendGAEvent } from "../core/ga4";
import { Capacitor } from "@capacitor/core";

function GoogleLoginInner({ drive, onUserSignIn }) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [pending, setPending] = useState(false);

  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);

  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const googleButtonRef = useRef(null);
  const isNative =Capacitor.isNativePlatform()

  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
console.log("CLIENT"+CLIENT_ID,"ios"+IOS_CLIENT_ID)
  const driveTokenKey = "googledrivetoken";

  // ---------------------------
  // 1️⃣ Native init
  // ---------------------------
  useLayoutEffect(() => {
    try {
      SocialLogin.initialize({
        google: {
          webClientId: CLIENT_ID,
          iOSClientId: IOS_CLIENT_ID,
          iOSServerClientId: CLIENT_ID,
          mode: "online",
        },
      }).catch(console.error);
    } catch (err) {
      console.error(err);
    }
  }, [CLIENT_ID, IOS_CLIENT_ID]);

  // ---------------------------
  // 2️⃣ Load Google script (FIXED)
  // ---------------------------
  useLayoutEffect(() => {
    if (isNative) return;

    if (window.google?.accounts) {
      setGisLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => setGisLoaded(true);
    script.onerror = () =>
      setLoginError("Failed to load Google Sign-In script");

    document.body.appendChild(script);
  }, [isNative]);

  // ---------------------------
  // 3️⃣ Restore session
  // ---------------------------
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const [email, name, googleId, driveToken, expiry, storedIdToken] =
          await Promise.all([
            Preferences.get({ key: "userEmail" }),
            Preferences.get({ key: "userName" }),
            Preferences.get({ key: "googleId" }),
            Preferences.get({ key: driveTokenKey }),
            Preferences.get({ key: "googledrivetoken_expiry" }),
            Preferences.get({ key: "googleIdToken" }),
          ]);

        const valid =
          driveToken.value &&
          expiry.value &&
          Date.now() < parseInt(expiry.value, 10);

        if (email.value && googleId.value && valid) {
          setAccessToken(driveToken.value);
          setIdToken(storedIdToken.value);

          setSignedIn(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setBootstrapping(false);
      }
    };

    loadStoredUser();
  }, []);

  // ---------------------------
  // 4️⃣ Native login (FIXED)
  // ---------------------------
  // const nativeGoogleSignIn = async () => {
  //   if (pending) return;

  //   setPending(true);
  //   setLoginError(null);

  //   sendGAEvent("login_start", {
  //     method: "google",
  //     platform: "native",
  //     drive: !!drive,
  //   });

  //   try {
  //     const user = await SocialLogin.login({
  //       provider: "google",
  //       options: {
  //         scopes: [
  //           "email",
  //           "profile",
  //           "https://www.googleapis.com/auth/drive.readonly",
  //         ],
  //       },
  //     });

  //     if (!user.result) throw new Error("No user data returned");

  //     const { accessToken, idToken, profile } = user.result;

  //     const tokenValue = accessToken?.token || accessToken;
  //     const expiry = Date.now() + 3600 * 1000;

  //     await Promise.all([
  //       Preferences.set({ key: "userEmail", value: profile.email }),
  //       Preferences.set({ key: "userName", value: profile.name }),
  //       Preferences.set({ key: "googleId", value: profile.id }),
  //       Preferences.set({ key: "googleIdToken", value: idToken || "" }),
  //       Preferences.set({ key: driveTokenKey, value: tokenValue || "" }),
  //       Preferences.set({
  //         key: "googledrivetoken_expiry",
  //         value: expiry.toString(),
  //       }),
  //     ]);

  //     setAccessToken(tokenValue);
  //     setIdToken(idToken);
  //     setSignedIn(true);

  //     onUserSignIn?.({
  //       email: profile.email,
  //       name: profile.name,
  //       googleId: profile.id,
  //       driveAccessToken: tokenValue,
  //       idToken,
  //     });
  //   } catch (err) {
  //     console.error(err);

  //     setLoginError("Google Sign-In failed.");
  //   } finally {
  //     setPending(false);
  //   }
  // };
const nativeGoogleSignIn = async () => {
  if (pending) return;

  setPending(true);
  setLoginError(null);

  try {
    const user = await SocialLogin.login({
      provider: "google",
      options: {
        scopes: [
          "email",
          "profile",
          "https://www.googleapis.com/auth/drive.readonly",
        ],
      },
    });

    const result = user?.result;

    if (!result) throw new Error("No Google result returned");

    const profile = result.profile || {};
    const idToken = result.idToken || result.authentication?.idToken;
    const accessToken = result.accessToken?.token || result.accessToken;

    if (!idToken) {
      throw new Error("Missing Google ID token (required for login)");
    }

    const payload = {
      email: profile.email,
      name: profile.name,
      googleId: profile.id,
      idToken,
      driveAccessToken: accessToken,
    };

    await onUserSignIn?.(payload);

    setSignedIn(true);
  } catch (err) {
    console.error("GOOGLE NATIVE LOGIN ERROR:", err);
    setLoginError(err.message || "Google Sign-In failed.");
  } finally {
    setPending(false);
  }
};
  // ---------------------------
  // 5️⃣ Web login
  // ---------------------------
  useEffect(() => {
    if (isNative || !gisLoaded || signedIn) return;
    if (!window.google?.accounts) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });

    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 240,
      });
    }
  }, [isNative, gisLoaded, signedIn, CLIENT_ID]);

  // ---------------------------
  // 6️⃣ Web credential (FIXED race)
  // ---------------------------
  // const handleCredentialResponse = async (response) => {
  //   if (pending) return;
  //   setPending(true);

  //   try {
  //     const decoded = JSON.parse(atob(response.credential.split(".")[1]));

  //     const info = {
  //       email: decoded.email,
  //       name: decoded.name || decoded.given_name,
  //       googleId: decoded.sub,
  //     };

  //     await Promise.all([
  //       Preferences.set({ key: "userEmail", value: info.email }),
  //       Preferences.set({ key: "userName", value: info.name }),
  //       Preferences.set({ key: "googleId", value: info.googleId }),
  //       Preferences.set({
  //         key: "googleIdToken",
  //         value: response.credential,
  //       }),
  //     ]);

  //     setIdToken(response.credential);
  //     setSignedIn(true);

  //     if (window.google?.accounts?.oauth2) {
  //       const tokenClient = window.google.accounts.oauth2.initTokenClient({
  //         client_id: CLIENT_ID,
  //         scope: "https://www.googleapis.com/auth/drive.readonly",
  //         callback: async (tokenResponse) => {
  //           if (!tokenResponse.access_token) {
  //             setLoginError("Failed to get Drive token");
  //             return;
  //           }

  //           const expiryMs =
  //             Date.now() + tokenResponse.expires_in * 1000;

  //           await Promise.all([
  //             Preferences.set({
  //               key: driveTokenKey,
  //               value: tokenResponse.access_token,
  //             }),
  //             Preferences.set({
  //               key: "googledrivetoken_expiry",
  //               value: expiryMs.toString(),
  //             }),
  //           ]);

  //           setAccessToken(tokenResponse.access_token);

  //           setSignedIn(true); // ✅ FIXED PLACE

  //           onUserSignIn?.({
  //             ...info,
  //             driveAccessToken: tokenResponse.access_token,
  //             idToken: response.credential,
  //           });
  //         },
  //       });

  //       tokenClient.requestAccessToken();
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     setLoginError("Login failed");
  //   } finally {
  //     setPending(false);
  //   }
  // };
const handleCredentialResponse = async (response) => {
  if (pending) return;
  setPending(true);

  try {
    if (!response?.credential) {
      throw new Error("Missing Google credential");
    }

    const idToken = response.credential;

    // safer decode (guarded)
    let decoded = null;
    try {
      decoded = JSON.parse(atob(idToken.split(".")[1]));
    } catch (e) {
      throw new Error("Invalid Google token format");
    }

    const payload = {
      email: decoded?.email,
      name: decoded?.name || decoded?.given_name,
      googleId: decoded?.sub,
      idToken,
    };

    if (!payload.email || !payload.googleId) {
      throw new Error("Invalid Google user data");
    }

    await onUserSignIn?.(payload);

    setSignedIn(true);
  } catch (err) {
    console.error("GOOGLE WEB LOGIN ERROR:", err);
    setLoginError(err.message || "Login failed");
  } finally {
    setPending(false);
  }
};
  // ---------------------------
  // 7️⃣ UI
  // ---------------------------
  if (bootstrapping || pending) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-full">
        <IonSpinner name="crescent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-full">
      <div
        onClick={!pending ? nativeGoogleSignIn : undefined}
        className="bg-gray-200 btn rounded-full flex h-[4rem] w-[10rem] mt-8"
      >
        <IonRow>
          <IonImg src={Googlelogo} className="max-h-5 max-w-5 mx-3 my-auto" />
          <IonText className="text-black my-auto">
            {drive ? "Access Google Drive" : "Sign in"}
          </IonText>
        </IonRow>
      </div>

      {loginError && (
        <IonText color="danger" className="mt-3">
          {loginError}
        </IonText>
      )}
    </div>
  );
}

export default function GoogleLogin(props) {
  return (
    <ErrorBoundary fallback={<div>Login temporarily unavailable.</div>}>
      <GoogleLoginInner {...props} />
    </ErrorBoundary>
  );
}



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