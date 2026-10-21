
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
import { useAlert } from "../core/useAlert";
   const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
function GoogleLoginInner({ drive, onUserSignIn }) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [pending, setPending] = useState(false);

  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const {showPrompt,closeAlert} = useAlert();
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  const googleButtonRef = useRef(null);
  const isNative =Capacitor.isNativePlatform()



  const driveTokenKey = "googledrivetoken";

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
          "https://www.googleapis.com/auth/drive.file",
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
        onClick={!pending ?()=>{
          showPrompt({message:"Google Sign-In asks for permission to access Google Drive. We only read files you share. Not Required",agreeText:"Continue",agree:()=>nativeGoogleSignIn(),type:"prompt"})

        }  : undefined}
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

