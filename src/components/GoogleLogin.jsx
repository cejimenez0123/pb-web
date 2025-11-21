import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import { IonText, IonSpinner, IonImg, IonRow } from "@ionic/react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { logIn } from "../actions/UserActions";
import Paths from "../core/paths";
import DeviceCheck from "./DeviceCheck";
import Context from "../context";
import { Preferences } from "@capacitor/preferences";
import Googlelogo from "../images/logo/googlelogo.png";
import ErrorBoundary from "../ErrorBoundary"; // make sure this path matches your project

function GoogleLoginInner({ drive, onUserSignIn }) {
  const { isError } = useContext(Context);
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);

  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
  const driveTokenKey = "googledrivetoken";

  // ---------------------------
  // 1️⃣ Initialize for mobile
  // ---------------------------
  useLayoutEffect(() => {
    // if (!isNative) return;

    try {
      SocialLogin.initialize({
        google: {
          webClientId: CLIENT_ID,
          iOSClientId: IOS_CLIENT_ID,
          iOSServerClientId: CLIENT_ID,
          mode: "online",
        },
      }).catch((err) => console.error("SocialLogin init error:", err));
    } catch (err) {
      console.error("Error initializing SocialLogin:", err);
    }
  }, [isNative, CLIENT_ID, IOS_CLIENT_ID]);

  // ---------------------------
  // 2️⃣ Load GIS script (for web)
  // ---------------------------
  useLayoutEffect(() => {
    if (isNative) return;

    try {
      if (!window.google?.accounts) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setGisLoaded(true);
        script.onerror = () =>
          setLoginError("Failed to load Google Sign-In script");
        document.body.appendChild(script);
      } else {
        setGisLoaded(true);
      }
    } catch (err) {
      console.error("Error loading GIS script:", err);
    }
  }, [isNative]);

  // ---------------------------
  // 3️⃣ Restore previous session
  // ---------------------------
  useEffect(() => {
    const loadStoredUser = async () => {
      setPending(true);
      try {
        const [email, name, googleId, driveToken, expiry, idToken] =
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

        if (
          email.value &&
          googleId.value &&
          valid &&
          email.value !== "undefined"
        ) {
          setAccessToken(driveToken.value);
          setIdToken(idToken.value);
          const info = {
            email: email.value,
            name: name.value,
            googleId: googleId.value,
            uId: googleId.value,
          };
          setUserInfo(info);
          setSignedIn(true);
          onUserSignIn?.({
            email: email.value,
            name: name.value,
            googleId: googleId.value,
            driveAccessToken: driveToken.value,
            idToken: idToken.value,
          });
        }
      } catch (e) {
        console.error("Error loading stored user:", e);
      } finally {
        setPending(false);
      }
    };
    loadStoredUser();
  }, [location, navigate, onUserSignIn]);

  // ---------------------------
  // 4️⃣ Native (mobile) login
  // ---------------------------
  const nativeGoogleSignIn = async () => {
    try {
      localStorage.clear()
      await Preferences.clear()
      await SocialLogin.logout({ provider: "google" });
      setPending(true);
      setLoginError(null);

      const user = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile", "https://www.googleapis.com/auth/drive.readonly"],
        },
      });

      if (!user?.result) throw new Error("No user data returned.");

      const { accessToken, idToken, profile } = user.result;
      const expiry = Date.now() + 3600 * 1000;
window.alert(accessToken)
      await Promise.all([
        Preferences.set({ key: "userEmail", value: profile.email }),
        Preferences.set({ key: "userName", value: profile.name }),
        Preferences.set({ key: "googleId", value: profile.id }),
        Preferences.set({ key: "googleIdToken", value: idToken || "" }),
        Preferences.set({ key: driveTokenKey, value: accessToken?.token || "" }),
        Preferences.set({
          key: "googledrivetoken_expiry",
          value: expiry.toString(),
        }),
      ]);

      const info = {
        email: profile.email,
        name: profile.name,
        googleId: profile.id,
      };

      setUserInfo(info);
      setAccessToken(accessToken);
      setIdToken(idToken);
      setSignedIn(true);

      onUserSignIn?.({
        email: profile.email,
        name: profile.name,
        googleId: profile.id,
        driveAccessToken: accessToken,
        idToken,
      });

      dispatch(logIn({ email: profile.email, uId: profile.id, isNative }));
    } catch (err) {
      console.error("Native sign-in error", err);
      setLoginError(`Google Sign-In failed. ${err.message || JSON.stringify(err)}`);
    } finally {
      setPending(false);
    }
  };

  // ---------------------------
  // 5️⃣ Web login setup
  // ---------------------------
  useEffect(() => {
    if (isNative || !gisLoaded || signedIn) return;
    if (!window.google?.accounts) return;

    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          width: 240,
        });
      }
    } catch (err) {
      console.error("Error initializing Google button:", err);
    }
  }, [isNative, gisLoaded, signedIn, CLIENT_ID]);

  // ---------------------------
  // 6️⃣ Handle web credential
  // ---------------------------
  const handleCredentialResponse = async (response) => {
    if (!response?.credential) {
      return setLoginError("No credential received.");
    }

    try {
      const decoded = JSON.parse(atob(response.credential.split(".")[1]));
      const info = {
        email: decoded.email,
        name: decoded.name || decoded.given_name,
        googleId: decoded.sub,
      };

      await Promise.all([
        Preferences.set({ key: "userEmail", value: info.email }),
        Preferences.set({ key: "userName", value: info.name }),
        Preferences.set({ key: "googleId", value: info.googleId }),
        Preferences.set({ key: "googleIdToken", value: response.credential }),
      ]);

      setIdToken(response.credential);
      setUserInfo(info);
      setSignedIn(true);

      if (window.google?.accounts?.oauth2) {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: "https://www.googleapis.com/auth/drive.readonly",
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              const expiryMs = Date.now() + tokenResponse.expires_in * 1000;
              await Preferences.set({
                key: driveTokenKey,
                value: tokenResponse.access_token,
              });
              await Preferences.set({
                key: "googledrivetoken_expiry",
                value: expiryMs.toString(),
              });
              setAccessToken(tokenResponse.access_token);

              onUserSignIn?.({
                ...info,
                driveAccessToken: tokenResponse.access_token,
                idToken: response.credential,
              });

              dispatch(logIn({ email: info.email, uId: info.googleId, isNative }));
            } else {
              setLoginError("Failed to get Google Drive token.");
            }
          },
        });
        tokenClient.requestAccessToken();
      }
    } catch (e) {
      console.error("Web login error:", e);
      setLoginError("Invalid ID token.");
    }
  };

  // ---------------------------
  // 7️⃣ UI
  // ---------------------------
  // if (pending) {
  //   return (
  //     <div className="flex flex-col justify-center items-center w-full min-h-full">
  //       <IonSpinner name="crescent" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col  justify-center items-center w-full min-h-full">
      <div
        onClick={nativeGoogleSignIn}
        color="dark"
        className="bg-gray-200 btn rounded-full flex h-[4rem] text-white w-[10rem] mt-8"
      >
        <IonRow>
          <IonImg src={Googlelogo} className="max-h-5 max-w-5 mx-3 my-auto" />
          <IonText className="text-black my-auto">
            {drive ? "Access your Google Drive" : "Sign in"}
          </IonText>
        </IonRow>
      </div>

      {/* <div ref={googleButtonRef} className="mt-4"></div> */}

      {loginError && (
        <IonText color="danger" className="mt-3">
          {loginError}
        </IonText>
      )}
    </div>
  );
}

// ---------------------------
// 🔒 Wrapped Component
// ---------------------------
export default function GoogleLogin(props) {
  return (
    <ErrorBoundary fallback={<div>Login temporarily unavailable.</div>}>
      <GoogleLoginInner {...props} />
    </ErrorBoundary>
  );
}

