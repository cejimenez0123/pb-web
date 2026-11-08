
import  {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import {
  IonText,
  IonSpinner,
  IonImg,
  IonRow,
} from "@ionic/react";

import { SocialLogin } from "@capgo/capacitor-social-login";
import { Preferences } from "@capacitor/preferences";
import { ErrorBoundary } from "@sentry/react";
import { Capacitor } from "@capacitor/core";

import Googlelogo from "../images/logo/googlelogo.png";
import { useAlert } from "../core/useAlert";
import initSocialLogin from "./initSocialLogin";

const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

function GoogleLoginInner({ drive, onUserSignIn }) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  

  const { showPrompt } = useAlert();

  const googleButtonRef = useRef(null);
  const isNative = Capacitor.isNativePlatform();

  const driveTokenKey = "googledrivetoken";

  // ---------------------------
  // 1. Load Google Identity Services (WEB ONLY)
  // ---------------------------
  useLayoutEffect(() => {
    if (isNative) return;

    if (window.google?.accounts?.id) {
      setGisLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      const handleLoad = () => setGisLoaded(true);
      const handleError = () =>
        setLoginError("Failed to load Google Sign-In script");

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
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
  // 2. Restore stored session
  // ---------------------------
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const [
          email,
          name,
          googleId,
          driveToken,
          expiry,
          storedIdToken,
        ] = await Promise.all([
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
      } catch (error) {
        console.error("Error restoring Google session:", error);
      } finally {
        setBootstrapping(false);
      }
    };

    loadStoredUser();
  }, []);

  // ---------------------------
  // 3. Native Google login
  // ---------------------------
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

      if (!result) {
        throw new Error("No Google result returned");
      }

      const profile = result.profile || {};

      const nativeIdToken =
        result.idToken ||
        result.authentication?.idToken;

      const nativeAccessToken =
        result.accessToken?.token ||
        result.accessToken;

      if (!nativeIdToken) {
        throw new Error("Missing Google ID token");
      }

      const payload = {
        email: profile.email,
        name: profile.name,
        googleId: profile.id,
        idToken: nativeIdToken,
        driveAccessToken: nativeAccessToken,
      };

      await onUserSignIn?.(payload);

      setSignedIn(true);
    } catch (error) {
      console.error("GOOGLE NATIVE LOGIN ERROR:", error);

      setLoginError(
        error.message || "Google Sign-In failed."
      );
    } finally {
      setPending(false);
    }
  };

  // ---------------------------
  // 4. Web credential response
  // ---------------------------
  const handleCredentialResponse = async (response) => {
    if (pending) return;

    setPending(true);
    setLoginError(null);

    try {
      if (!response?.credential) {
        throw new Error("Missing Google credential");
      }

      const webIdToken = response.credential;

      let decoded;

      try {
        const tokenPayload = webIdToken.split(".")[1];

        if (!tokenPayload) {
          throw new Error("Missing token payload");
        }

        decoded = JSON.parse(
          atob(
            tokenPayload
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );
      } catch {
        throw new Error("Invalid Google token format");
      }

      const payload = {
        email: decoded?.email,
        name: decoded?.name || decoded?.given_name,
        googleId: decoded?.sub,
        idToken: webIdToken,
      };

      if (!payload.email || !payload.googleId) {
        throw new Error("Invalid Google user data");
      }

      await onUserSignIn?.(payload);

      setSignedIn(true);
    } catch (error) {
      console.error("GOOGLE WEB LOGIN ERROR:", error);

      setLoginError(error.message || "Login failed");
    } finally {
      setPending(false);
    }
  };

  // ---------------------------
  // 5. Initialize and render WEB Google button
  // ---------------------------
  useEffect(() => {
    if (isNative || !gisLoaded || signedIn) return;

    if (!window.google?.accounts?.id) return;
    if (!googleButtonRef.current) return;

    if (!CLIENT_ID) {
      setLoginError("Google OAuth client ID is missing.");
      return;
    }
 initSocialLogin().then(()=>{
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredentialResponse,
    });

    googleButtonRef.current.innerHTML = "";

    // window.google.accounts.id.renderButton(
    //   googleButtonRef.current,
    //   {
    //     theme: "outline",
    //     size: "large",
    //     text: "signin_with",
    //     width: 240,
    //   }
    // );
window.google.accounts.id.renderButton(
  googleButtonRef.current,
  {
    type: "standard",
    theme: "outline",
    size: "large",
    text: drive ? "continue_with" : "signin_with",
    shape: "pill",
    logo_alignment: "center",
    width: 160,
  }
);
    return () => {
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = "";
      }
    };
  })
  }, [isNative, gisLoaded, signedIn, CLIENT_ID]);

  // ---------------------------
  // 6. UI
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

      {isNative ? (
        <div
          onClick={
            !pending
              ? () => {
                  showPrompt({
                    message:
                      "Google Sign-In asks for permission to access Google Drive. We only read files you share. Not Required",
                    agreeText: "Continue",
                    agree: nativeGoogleSignIn,
                    type: "prompt",
                  });
                }
              : undefined
          }
          className="bg-gray-200 btn rounded-full flex h-[4rem] w-[10rem] mt-8"
        >
          <IonRow>
            <IonImg
              src={Googlelogo}
              className="max-h-5 max-w-5 mx-3 my-auto"
            />

            <IonText className="text-black my-auto">
              {drive ? "Access Google Drive" : "Sign in"}
            </IonText>
          </IonRow>
        </div>
      ) : (
        <div
          ref={googleButtonRef}
          className="flex justify-center mt-8"
        />
      )}

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

