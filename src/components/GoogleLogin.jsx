
// import  {
//   useState,
//   useEffect,

//   useRef,
// } from "react
// ";

// import {
//   IonText,
//   IonSpinner,

// } from "@ionic/react";

// import { SocialLogin } from "@capgo/capacitor-social-login";
// import { Preferences } from "@capacitor/preferences";
// import { ErrorBoundary } from "@sentry/react";
// import { Capacitor } from "@capacitor/core";

// import Googlelogo from "../images/logo/googlelogo.png";
// import { useAlert } from "../core/useAlert";
// import initSocialLogin from "./initSocialLogin";


// const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

// function GoogleLoginInner({ drive, onUserSignIn }) {
//   const [bootstrapping, setBootstrapping] = useState(true);
//   const [pending, setPending] = useState(false);
//   const [loginError, setLoginError] = useState(null);
//   const [signedIn, setSignedIn] = useState(false);
//   const [gisLoaded, setGisLoaded] = useState(false);
  

//   const { showPrompt } = useAlert();
// const loginInProgressRef = useRef(false);
// const credentialHandlerRef = useRef(null);
//   const handleCredentialResponse = async (response) => {
//    if (loginInProgressRef.current) return;

// loginInProgressRef.current = true;
// setPending(true);

//     setLoginError(null);

//     try {
//       if (!response?.credential) {
//         throw new Error("Missing Google credential");
//       }

//       const webIdToken = response.credential;

//       let decoded;

//       try {
//         const tokenPayload = webIdToken.split(".")[1];

//         if (!tokenPayload) {
//           throw new Error("Missing token payload");
//         }

//         decoded = JSON.parse(
//           atob(
//             tokenPayload
//               .replace(/-/g, "+")
//               .replace(/_/g, "/")
//           )
//         );
//       } catch {
//         throw new Error("Invalid Google token format");
//       }

//       const payload = {
//         email: decoded?.email,
//         name: decoded?.name || decoded?.given_name,
//         googleId: decoded?.sub,
//         idToken: webIdToken,
//       };

//       if (!payload.email || !payload.googleId) {
//         throw new Error("Invalid Google user data");
//       }

//       await onUserSignIn?.(payload);

//       setSignedIn(true);
//     } catch (error) {
//       console.error("GOOGLE WEB LOGIN ERROR:", error);

//       setLoginError(error.message || "Login failed");
//     } finally {
//   loginInProgressRef.current = false;
//   setPending(false);
// }
//   };
// credentialHandlerRef.current = handleCredentialResponse;
//   const googleButtonRef = useRef(null);
//   const isNative = Capacitor.isNativePlatform();

//   const driveTokenKey = "googledrivetoken";

//   // ---------------------------
//   // 1. Load Google Identity Services (WEB ONLY)
//   // ---------------------------
  
// useEffect(() => {
//   if (isNative) return;

//   let active = true;

//   loadGoogleIdentityServices()
//     .then(() => {
//       if (active) {
//         setGisLoaded(true);
//         setLoginError(null);
//       }
//     })
//     .catch((error) => {
//       if (active) {
//         console.error("Google GIS loading error:", error);
//         setLoginError(error.message);
//       }
//     });

//   return () => {
//     active = false;
//   };
// }, [isNative]);
//   // ---------------------------
//   // 2. Restore stored session
//   // ---------------------------
//   useEffect(() => {
//     const loadStoredUser = async () => {
//       try {
//         const [
//           email,
//           name,
//           googleId,
//           driveToken,
//           expiry,
//           storedIdToken,
//         ] = await Promise.all([
//           Preferences.get({ key: "userEmail" }),
//           Preferences.get({ key: "userName" }),
//           Preferences.get({ key: "googleId" }),
//           Preferences.get({ key: driveTokenKey }),
//           Preferences.get({ key: "googledrivetoken_expiry" }),
//           Preferences.get({ key: "googleIdToken" }),
//         ]);

//         const valid =
//           driveToken.value &&
//           expiry.value &&
//           Date.now() < parseInt(expiry.value, 10);

//         if (email.value && googleId.value && valid) {
//           setAccessToken(driveToken.value);
//           setIdToken(storedIdToken.value);
//           setSignedIn(true);
//         }
//       } catch (error) {
//         console.error("Error restoring Google session:", error);
//       } finally {
//         setBootstrapping(false);
//       }
//     };

//     loadStoredUser();
//   }, []);

//   // ---------------------------
//   // 3. Native Google login
//   // ---------------------------
//   const nativeGoogleSignIn = async () => {
//     if (loginInProgressRef.current) return;

// loginInProgressRef.current = true;
// setPending(true);
    
//     setLoginError(null);

//     try {
    
//     await initSocialLogin();
//       const user = await SocialLogin.login({
//         provider: "google",
//         options: {
//           scopes: [
//             "email",
//             "profile",
//             "https://www.googleapis.com/auth/drive.file",
//           ],
//         },
//       });

//       const result = user?.result;

//       if (!result) {
//         throw new Error("No Google result returned");
//       }

//       const profile = result.profile || {};

//       const nativeIdToken =
//         result.idToken ||
//         result.authentication?.idToken;

//       const nativeAccessToken =
//         result.accessToken?.token ||
//         result.accessToken;

//       if (!nativeIdToken) {
//         throw new Error("Missing Google ID token");
//       }

//       const payload = {
//         email: profile.email,
//         name: profile.name,
//         googleId: profile.id,
//         idToken: nativeIdToken,
//         driveAccessToken: nativeAccessToken,
//       };

//       await onUserSignIn?.(payload);

//       setSignedIn(true);
//     } catch (error) {
//       console.error("GOOGLE NATIVE LOGIN ERROR:", error);

//       setLoginError(
//         error.message || "Google Sign-In failed."
//       );
//     }finally {
//   loginInProgressRef.current = false;
//   setPending(false);
// }
//   };

//   // ---------------------------
//   // 4. Web credential response
//   // ---------------------------


//   // ---------------------------
//   // 5. Initialize and render WEB Google button
//   // ---------------------------
//   // ---------------------------
// // 5. Initialize and render WEB Google button
// // ---------------------------
// useEffect(() => {
//   if (isNative || !gisLoaded || signedIn) return;

//   let active = true;
// const mountGoogleButton = async () => {
//   try {
//     if (!CLIENT_ID) {
//       throw new Error("Google OAuth client ID is missing.");
//     }

//     if (!active || !googleButtonRef.current) return;

//     if (!window.google?.accounts?.id) {
//       throw new Error("Google Identity Services is unavailable.");
//     }

//     window.google.accounts.id.initialize({
//       client_id: CLIENT_ID,
//       callback: (response) => {
//         credentialHandlerRef.current?.(response);
//       },
//     });

//     const container = googleButtonRef.current;

//     container.replaceChildren();

//     window.google.accounts.id.renderButton(container, {
//       type: "standard",
//       theme: "outline",
//       size: "large",
//       text: "signin_with",
//       shape: "pill",
//       logo_alignment: "center",
//       width: 160,
//     });

//   } catch (error) {
//     console.error("Google button initialization error:", error);

//     if (active) {
//       setLoginError(error.message);
//     }
//   }
// };

//   mountGoogleButton();

//   return () => {
//     active = false;

//     if (googleButtonRef.current) {
//       googleButtonRef.current.replaceChildren();
//     }
//   };
// }, [isNative, gisLoaded, signedIn]);

//   // ---------------------------
//   // 6. UI
//   // ---------------------------
//   if (bootstrapping || pending) {
//     return (
//       <div className="flex flex-col justify-center items-center w-full min-h-full">
//         <IonSpinner name="crescent" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col justify-center items-center w-full min-h-full">

//     {isNative? (<>

 
//             <div
//             className={[styles.button.base.slice(1,styles.button.base.length)," bg-white w-[180px]  py-2 rounded-full text-plumb-surface ",
//               `active:bg-[#edf2fa]
//                 border
//     border-[#747775]
//     border-1
//     dark:border-plumb-surface
//     focus-visible:outline-none
//     focus-visible:ring-2
//     focus-visible:ring-[#4285F4]
//     focus-visible:ring-offset-2
//     dark:bg-transparent dark:bg-plumb-surface`
//             ].join(" ")}
 
//           onClick={
        
//             () => {
//                   showPrompt({
//                     message:
//                       "Google Sign-In asks for permission to access Google Drive. We only read files you share. Not Required",
//                     agreeText: "Continue",
//                     agree: nativeGoogleSignIn,
//                     type: "prompt",
//                   });
//                 }}>
//                    <div className="flex flex-row mx-aut my-auto">
//  <img src={Googlelogo} className='max-h-5 my-auto mr-2 max-w-5' />
//           <h6 className='text-sm my-auto text-plumb-ink '>
//             {drive ? "Access Google Drive" : "Sign in"}
//           </h6>
// </div>
//                 </div>
              
//     </>):<>
//     <div
//          ref={googleButtonRef}
//           className="flex justify-center py-2 mt-8"
//         />
//     </>}

//       {loginError && (
//         <h5 color="danger" className="mt-3">
//           {loginError}
//         </h5>
//       )}
//     </div>
//   );
// }

// export default function GoogleLogin(props) {
//   return (
//     <ErrorBoundary fallback={<div>Login temporarily unavailable.</div>}>
//       <GoogleLoginInner {...props} />
//     </ErrorBoundary>
//   );
// }




// let googleScriptPromise = null;

// function loadGoogleIdentityServices() {
//   if (window.google?.accounts?.id) {
//     return Promise.resolve();
//   }

//   if (googleScriptPromise) {
//     return googleScriptPromise;
//   }

//   googleScriptPromise = new Promise((resolve, reject) => {
//     let script = document.querySelector(
//       'script[src="https://accounts.google.com/gsi/client"]'
//     );

//     const handleLoad = () => {
//       if (window.google?.accounts?.id) {
//         resolve();
//       } else {
//         googleScriptPromise = null;
//         reject(new Error("Google Identity Services unavailable."));
//       }
//     };

//     const handleError = () => {
//       googleScriptPromise = null;
//       reject(new Error("Failed to load Google Sign-In script."));
//     };

//     if (script) {
//       script.addEventListener("load", handleLoad, { once: true });
//       script.addEventListener("error", handleError, { once: true });

//       // Handle scripts that loaded before listeners were attached.
//       if (window.google?.accounts?.id) {
//         resolve();
//       }

//       return;
//     }

//     script = document.createElement("script");
//     script.src = "https://accounts.google.com/gsi/client";
//     script.async = true;
//     script.defer = true;

//     script.addEventListener("load", handleLoad, { once: true });
//     script.addEventListener("error", handleError, { once: true });

//     document.head.appendChild(script);
//   });

//   return googleScriptPromise;
// }


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
import initSocialLogin from "./initSocialLogin";
import styles from "../styles/style";
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
  await initSocialLogin()
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
        onClick={!pending ?()=>{
          showPrompt({message:"Google Sign-In asks for permission to access Google Drive. We only read files you share. Not Required",agreeText:"Continue",agree:()=>nativeGoogleSignIn(),type:"prompt"})

        }  : undefined}
        
                    className={[styles.button.base.slice(1,styles.button.base.length)," bg-white w-[180px]  py-2 rounded-full text-plumb-surface ",
              `active:bg-[#edf2fa]
                border

    border-1
    dark:border-plumb-surface
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[#4285F4]
    focus-visible:ring-offset-2
    dark:bg-transparent dark:bg-plumb-surface`
            ].join(" ")}
 
      >
          <div className="flex flex-row mx-aut my-auto">
        {/* <IonRow> */}
          <img src={Googlelogo} className='max-h-5 my-auto mr-2 max-w-5' />
          <h6 className="text-black my-auto text-[.85em]">
            {drive ? "Access Google Drive" : "Sign in"}
          </h6>
          </div>
        {/* </IonRow> */}
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
