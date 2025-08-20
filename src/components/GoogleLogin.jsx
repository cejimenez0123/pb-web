// import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
// import { IonText, IonSpinner, IonButton } from '@ionic/react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { SocialLogin } from '@capgo/capacitor-social-login';
// import { logIn } from '../actions/UserActions';
// import Paths from '../core/paths';
// import DeviceCheck from './DeviceCheck';
// import checkResult from '../core/checkResult';
// import Context from '../context';
// import { Preferences } from '@capacitor/preferences';

// export default function GoogleLogin({ onUserSignIn }) {
//   const { isError } = useContext(Context);
//   const [pending, setPending] = useState(false);
//   const [loginError, setLoginError] = useState(null);
//   const [signedIn, setSignedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [gisLoaded, setGisLoaded] = useState(false);
// const [accessToken,setAccessToken]=useState(null)
//   const isNative = DeviceCheck();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
//   const googleButtonRef = useRef(null);
//   const driveTokenKey = 'googledrivetoken';

//   // Load GIS script for web sign-in
//   useLayoutEffect(() => {
//     if (!isNative) {
//       if (!window.google || !window.google.accounts) {
//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.defer = true;
//         script.onload = () => setGisLoaded(true);
//         script.onerror = () => setLoginError('Failed to load Google Sign-In script');
//         document.body.appendChild(script);
//       } else {
//         setGisLoaded(true);
//       }
//     }
//   }, [isNative]);

//   // Initialize Google Sign-In button on web after GIS loaded
//   useEffect(() => {
//     if (!isNative && gisLoaded && window.google && window.google.accounts && !signedIn) {
//       window.google.accounts.id.initialize({
//         client_id: CLIENT_ID,
//         callback: handleCredentialResponse,
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       });
//       if (googleButtonRef.current) {
//         window.google.accounts.id.renderButton(
//           googleButtonRef.current,
//           {
//             onclick:nativeGoogleSignIn,
//             theme: 'outline',
//             size: 'large',
//             text: 'signin_with',
//             shape: 'rectangular',
//             width: 200,
//             logo_alignment: 'left',
//             type: 'standard',
//           }
//         );
//       }
//     }
//   }, [gisLoaded, CLIENT_ID, signedIn, isNative]);

//   // Load stored user and tokens on mount
//   useEffect(() => {
//     async function loadStoredUser() {
//       setPending(true);
//       try {
//         const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
//         const storedName = (await Preferences.get({ key: 'userName' })).value;
//         const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
//         const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
//         const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
// setAccessToken(storedDriveToken)
//         const isTokenValid =
//           storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

//         if (storedEmail && storedGoogleId && isTokenValid) {
//           setSignedIn(true);
//           setUserInfo({ email: storedEmail, name: storedName, googleId: storedGoogleId });
//           if (onUserSignIn) {
//             onUserSignIn({
//               email: storedEmail,
//               name: storedName,
//               googleId: storedGoogleId,
//               driveAccessToken: storedDriveToken,
//             });
//           }
//           navigate(Paths.myProfile());
//         }
//       } catch (error) {
//         console.error('Error retrieving stored user data:', error);
//       } finally {
//         setPending(false);
//       }
//     }
//     loadStoredUser();
//   }, [onUserSignIn, navigate]);

//   // Native mobile Google sign-in using capacitor-social-login
//   const nativeGoogleSignIn = async () => {
//     setPending(true);
//     setLoginError(null);
//     try {
//       const socialUser = await SocialLogin.signIn({ provider: 'google' });
//       if (!socialUser) throw new Error('No user data from native Google login.');

//       await Preferences.set({ key: 'userEmail', value: socialUser.email });
//       await Preferences.set({ key: 'userName', value: socialUser.name });
//       await Preferences.set({ key: 'googleId', value: socialUser.id });
//         console.log("Tot",socialUser.accessToken)
//       if (socialUser.accessToken) {
//         const expiryMs = Date.now() + 3600 * 1000;
//         await Preferences.set({ key: driveTokenKey, value: socialUser.accessToken });
//         await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
//       }

//       setUserInfo(socialUser);
//       setSignedIn(true);

//       if (onUserSignIn) {
//         onUserSignIn({
//           email: socialUser.email,
//           name: socialUser.name,
//           googleId: socialUser.id,
//           driveAccessToken: socialUser.accessToken,
//         });
//       }
//       dispatch(logIn({ email: socialUser.email, uId: socialUser.id, isNative })).then((res) => {
//         checkResult(res, () => navigate(Paths.myProfile()));
//       });
//     } catch (error) {
//       console.error('Native Google Sign-In error:', error);
//       setLoginError('Google Sign-In failed. Please try again.');
//     } finally {
//       setPending(false);
//     }
//   };

//   // Web Google sign-in callback (GIS)
//   const handleCredentialResponse = async (response) => {
//     if (!response.credential) {
//       setLoginError('No credential received from Google.');
//       return;
//     }
//     try {
//       const decoded = JSON.parse(atob(response.credential.split('.')[1]));
//       await Preferences.set({ key: 'userEmail', value: decoded.email });
//       await Preferences.set({ key: 'userName', value: decoded.name || decoded.given_name });
//       await Preferences.set({ key: 'googleId', value: decoded.sub });

//       setUserInfo({
//         email: decoded.email,
//         name: decoded.name || decoded.given_name,
//         googleId: decoded.sub,
//       });
//       setSignedIn(true);

//       if (onUserSignIn) {
//         onUserSignIn({
//           email: decoded.email,
//           name: decoded.name || decoded.given_name,
//           googleId: decoded.sub,
//         });
//       }
//       dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then((res) => {
//         checkResult(res, () => {
//           navigate(Paths.myProfile());
//         });
//       });
//     } catch (error) {
//       console.error('Invalid ID token:', error);
//       setLoginError('Invalid ID token received.');
//     }
//   };



//   return (
//     <div className="flex flex-col justify-center items-center w-full min-h-full">
//       {pending && <IonSpinner name="crescent" color="primary" />}
//       {!pending && (
//         <>
         
//             <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
       
//         </>
//       )}
//       {loginError && (
//         <IonText color="danger" className="mt-3">
//           {loginError}
//         </IonText>
//       )}

//       {accessToken && userInfo && (
//         <div className="mt-4 text-center">
//           <IonText>Welcome, {userInfo.name}</IonText>
//         </div>
//       )}
//     </div>
//   );
// // }
// import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
// import { IonText, IonSpinner } from '@ionic/react';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { SocialLogin } from '@capgo/capacitor-social-login';
// import { logIn } from '../actions/UserActions';
// import Paths from '../core/paths';
// import DeviceCheck from './DeviceCheck';
// import checkResult from '../core/checkResult';
// import Context from '../context';
// import { Preferences } from '@capacitor/preferences';

// export default function GoogleLogin({ onUserSignIn }) {
//   const { isError } = useContext(Context);
//   const [pending, setPending] = useState(false);
//   const [loginError, setLoginError] = useState(null);
//   const [signedIn, setSignedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState(null);
//   const [gisLoaded, setGisLoaded] = useState(false);
//   const [accessToken, setAccessToken] = useState(null);

//   const isNative = DeviceCheck();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
//   const googleButtonRef = useRef(null);
//   const driveTokenKey = 'googledrivetoken';

//   // Load GIS script for web sign-in
//   useLayoutEffect(() => {
//     if (!isNative) {
//       if (!window.google || !window.google.accounts) {
//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.defer = true;
//         script.onload = () => setGisLoaded(true);
//         script.onerror = () => setLoginError('Failed to load Google Sign-In script');
//         document.body.appendChild(script);
//       } else {
//         setGisLoaded(true);
//       }
//     }
//   }, [isNative]);

//   // Initialize Google Sign-In button on web after GIS loaded
//   useEffect(() => {
//     if (!isNative && gisLoaded && window.google && window.google.accounts && !signedIn) {
//       window.google.accounts.id.initialize({
//         client_id: CLIENT_ID,
//         callback: handleCredentialResponse,
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       });
//       if (googleButtonRef.current) {
//         window.google.accounts.id.renderButton(
//           googleButtonRef.current,
//           {
//             theme: 'outline',
//             size: 'large',
//             text: 'signin_with',
//             shape: 'rectangular',
//             width: 200,
//             logo_alignment: 'left',
//             type: 'standard',
//           }
//         );
//       }
//     }
//   }, [gisLoaded, CLIENT_ID, signedIn, isNative]);

//   // Load stored user and tokens on mount
//   useEffect(() => {
//     async function loadStoredUser() {
//       setPending(true);
//       try {
//         const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
//         const storedName = (await Preferences.get({ key: 'userName' })).value;
//         const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
//         const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
//         const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;

//         const isTokenValid =
//           storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

//         if (storedEmail && storedGoogleId && isTokenValid) {
//           setAccessToken(storedDriveToken);
//           setSignedIn(true);
//           setUserInfo({ email: storedEmail, name: storedName, googleId: storedGoogleId });
//           if (onUserSignIn) {
//             onUserSignIn({
//               email: storedEmail,
//               name: storedName,
//               googleId: storedGoogleId,
//               driveAccessToken: storedDriveToken,
//             });
//           }
//           navigate(Paths.myProfile());
//         }
//       } catch (error) {
//         console.error('Error retrieving stored user data:', error);
//       } finally {
//         setPending(false);
//       }
//     }
//     loadStoredUser();
//   }, [onUserSignIn, navigate]);

//   // Native mobile Google sign-in using capacitor-social-login
//   const nativeGoogleSignIn = async () => {
//     setPending(true);
//     setLoginError(null);
//     try {
//       const socialUser = await SocialLogin.signIn({ provider: 'google' });
//       if (!socialUser) throw new Error('No user data from native Google login.');

//       await Preferences.set({ key: 'userEmail', value: socialUser.email });
//       await Preferences.set({ key: 'userName', value: socialUser.name });
//       await Preferences.set({ key: 'googleId', value: socialUser.id });

//       if (socialUser.accessToken) {
//         const expiryMs = Date.now() + 3600 * 1000;
//         await Preferences.set({ key: driveTokenKey, value: socialUser.accessToken });
//         await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
//         setAccessToken(socialUser.accessToken);
//       }

//       setUserInfo(socialUser);
//       setSignedIn(true);

//       if (onUserSignIn) {
//         onUserSignIn({
//           email: socialUser.email,
//           name: socialUser.name,
//           googleId: socialUser.id,
//           driveAccessToken: socialUser.accessToken,
//         });
//       }
//       dispatch(logIn({ email: socialUser.email, uId: socialUser.id, isNative })).then((res) =>
//         checkResult(res, () => navigate(Paths.myProfile()))
//       );
//     } catch (error) {
//       console.error('Native Google Sign-In error:', error);
//       setLoginError('Google Sign-In failed. Please try again.');
//     } finally {
//       setPending(false);
//     }
//   };

//   // Web Google sign-in callback (GIS)
// //   const handleCredentialResponse = async (response) => {
// //     if (!response.credential) {
// //       setLoginError('No credential received from Google.');
// //       return;
// //     }
// //     try {
// //       const decoded = JSON.parse(atob(response.credential.split('.')[1]));
// //       await Preferences.set({ key: 'userEmail', value: decoded.email });
// //       await Preferences.set({ key: 'userName', value: decoded.name || decoded.given_name });
// //       await Preferences.set({ key: 'googleId', value: decoded.sub });

// //       setUserInfo({
// //         email: decoded.email,
// //         name: decoded.name || decoded.given_name,
// //         googleId: decoded.sub,
// //       });
// //       setSignedIn(true);

// //       if (onUserSignIn) {
// //         onUserSignIn({
// //           email: decoded.email,
// //           name: decoded.name || decoded.given_name,
// //           googleId: decoded.sub,
// //         });
// //       }
// //       dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then((res) => {
// //         checkResult(res, () => {
// //           navigate(Paths.myProfile());
// //         });
// //       });
// //     } catch (error) {
// //       console.error('Invalid ID token:', error);
// //       setLoginError('Invalid ID token received.');
// //     }
// //   };
// const handleCredentialResponse = async (response) => {
//     if (!response.credential) {
//       setLoginError('No credential received from Google.');
//       return;
//     }
//     try {
//       // Decode ID token for user info
//       const decoded = JSON.parse(atob(response.credential.split('.')[1]));
//       await Preferences.set({ key: 'userEmail', value: decoded.email });
//       await Preferences.set({ key: 'userName', value: decoded.name || decoded.given_name });
//       await Preferences.set({ key: 'googleId', value: decoded.sub });
  
//       setUserInfo({
//         email: decoded.email,
//         name: decoded.name || decoded.given_name,
//         googleId: decoded.sub,
//       });
//       setSignedIn(true);
  
//       // Request Drive OAuth token
//       if (window.google && window.google.accounts && window.google.accounts.oauth2) {
//         const tokenClient = window.google.accounts.oauth2.initTokenClient({
//           client_id: CLIENT_ID,
//           scope: 'https://www.googleapis.com/auth/drive.readonly',
//           callback: async (tokenResponse) => {
//             if (tokenResponse.access_token) {
//               const expiryMs = Date.now() + tokenResponse.expires_in * 1000;
//               await Preferences.set({ key: driveTokenKey, value: tokenResponse.access_token });
//               await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
  
//               if (onUserSignIn) {
//                 onUserSignIn({
//                   email: decoded.email,
//                   name: decoded.name || decoded.given_name,
//                   googleId: decoded.sub,
//                   driveAccessToken: tokenResponse.access_token,
//                 });
//               }
  
//               dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then((res) => {
//                 checkResult(res, () => navigate(Paths.myProfile()));
//               });
//             } else {
//               setLoginError('Failed to get Google Drive access token.');
//             }
//           },
//         });
  
//         // Prompt user consent for the requested Drive scope
//         tokenClient.requestAccessToken();
//       } else {
//         setLoginError('OAuth2 client not initialized.');
//       }
//     } catch (error) {
//       console.error('Error handling credentials:', error);
//       setLoginError('Invalid ID token received.');
//     }
//   };
  

//   return (
//     <div className="flex flex-col justify-center items-center w-full min-h-full">
//       {pending && <IonSpinner name="crescent" color="primary" />}
//       {!pending && !signedIn && (
//         <>
//           <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
//         </>
//       )}
//       {loginError && (
//         <IonText color="danger" className="mt-3">
//           {loginError}
//         </IonText>
//       )}

//       {accessToken && userInfo && (
//         <div className="mt-4 text-center">
//           <IonText>Welcome, {userInfo.name}</IonText>
//         </div>
//       )}
//     </div>
//   );
// }



// // import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
// // import { IonText, IonSpinner } from '@ionic/react';
// // import { useDispatch } from 'react-redux';
// // import { useNavigate } from 'react-router-dom';
// // import { logIn } from '../actions/UserActions';
// // import Paths from '../core/paths';
// // import DeviceCheck from './DeviceCheck';
// // import checkResult from '../core/checkResult';
// // import Context from '../context';
// // import { Preferences } from '@capacitor/preferences';

// // export default function GoogleLogin({ onUserSignIn }) {
// //   const { isError } = useContext(Context);
// //   const [gisLoaded, setGisLoaded] = useState(false);
// //   const [pending, setPending] = useState(true);
// //   const [loginError, setLoginError] = useState(null);
// //   const [signedIn, setSignedIn] = useState(false);
// //   const [idToken, setIdToken] = useState(null);
// //   const isNative = DeviceCheck();
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
// //   const driveTokenKey = "googledrivetoken";
// //   const googleButtonRef = useRef(null);

// //   // Combined scopes for login + Drive read-only access
// //   const LOGIN_SCOPES = 'email profile openid https://www.googleapis.com/auth/drive.readonly';

// //   // Load GIS script once
// //   useLayoutEffect(() => {
// //     if (!window.google || !window.google.accounts) {
// //       const script = document.createElement('script');
// //       script.src = 'https://accounts.google.com/gsi/client';
// //       script.async = true;
// //       script.defer = true;
// //       script.onload = () => setGisLoaded(true);
// //       script.onerror = () => setLoginError('Failed to load Google Sign-In script');
// //       document.body.appendChild(script);
// //     } else {
// //       setGisLoaded(true);
// //     }
// //   }, []);

// //   // Initialize Google Sign-In button once GIS script loaded
// //   useEffect(() => {
// //     if (gisLoaded && window.google && window.google.accounts && !signedIn) {
// //       window.google.accounts.id.initialize({
// //         client_id: CLIENT_ID,
// //         callback: handleCredentialResponse,
// //         auto_select: false,
// //         cancel_on_tap_outside: true,
// //       });
// //       window.google.accounts.id.renderButton(
// //         googleButtonRef.current,
// //         {
// //           theme: 'outline',
// //           size: 'large',
// //           text: 'signin_with',
// //           shape: 'rectangular',
// //           width: 200,
// //           logo_alignment: 'left',
// //           type: 'standard',
// //         }
// //       );
// //     }
// //   }, [gisLoaded, CLIENT_ID, signedIn]);

// //   // Load stored user info and tokens on mount
// //   useEffect(() => {
// //     async function loadStoredUser() {
// //       try {
// //         const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
// //         const storedName = (await Preferences.get({ key: 'userName' })).value;
// //         const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
// //         const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
// //         const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
// //         const isTokenValid = storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);
// //         if(!storedDriveToken){
// // setSignedIn(false)
// // return
// //         }
// //         if (storedEmail && storedGoogleId && isTokenValid) {
// //           setSignedIn(true);
// //           setPending(false);
// //           setIdToken(storedGoogleId);
// //           if (onUserSignIn) {
// //             onUserSignIn({ email: storedEmail, name: storedName, googleId: storedGoogleId, driveAccessToken: storedDriveToken });
// //           }
// //           navigate(Paths.myProfile());
// //         } else {
// //           setPending(false);
// //           // Clear stale tokens
// //           if (!isTokenValid) {
// //             await Preferences.remove(driveTokenKey);
// //             await Preferences.remove('googledrivetoken_expiry');
// //           }
// //         }
// //       } catch (error) {
// //         console.error('Error retrieving stored user data:', error);
// //         setPending(false);
// //       }
// //     }
// //     loadStoredUser();
// //   }, [onUserSignIn, navigate]);

// //   // Handle Google sign-in credential response (ID token)
// //   const handleCredentialResponse = async (response) => {
// //     if (!response.credential) {
// //       setLoginError('No credential received from Google.');
// //       return;
// //     }
// //     try {
// //       const decoded = JSON.parse(atob(response.credential.split('.')[1]));
// //       await Preferences.set({ key: 'userEmail', value: decoded.email });
// //       await Preferences.set({ key: 'userName', value: decoded.name || decoded.given_name });
// //       await Preferences.set({ key: 'googleId', value: decoded.sub });

// //       setIdToken(decoded.sub);
// //       setSignedIn(true);
// //       setPending(false);

// //       if (onUserSignIn) {
// //         onUserSignIn({
// //           email: decoded.email,
// //           name: decoded.name || decoded.given_name,
// //           googleId: decoded.sub,
// //         });
// //       }

// //       requestDriveAccessToken(decoded.sub, decoded.email, decoded.name || decoded.given_name);

// //       // Dispatch login action
// //       dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then(res => {
// //         checkResult(res, () => {
// //           navigate(Paths.myProfile());
// //         });
// //       });

// //     } catch (error) {
// //       console.error('Invalid ID token:', error);
// //       setLoginError('Invalid ID token received.');
// //     }
// //   };

// //   // Request the Google Drive OAuth2 access token
// //   const requestDriveAccessToken = (id, email, name) => {
// //     if (window.google && window.google.accounts && window.google.accounts.oauth2) {
// //       const client = window.google.accounts.oauth2.initTokenClient({
// //         client_id: CLIENT_ID,
// //         scope: LOGIN_SCOPES,
// //         callback: async (tokenResponse) => {
// //           if (tokenResponse.access_token) {
// //             const driveAccessToken = tokenResponse.access_token;
// //             const expiryMs = Date.now() + parseInt(tokenResponse.expires_in, 10) * 1000;

// //             await Preferences.set({ key: driveTokenKey, value: driveAccessToken });
// //             await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });

// //             console.log('Drive access token obtained and stored.');

// //             if (onUserSignIn) {
// //               onUserSignIn({ email, name, googleId: id, driveAccessToken });
// //             }
// //           } else {
// //             console.error('Failed to get Drive access token.', tokenResponse);
// //             alert('Access to Google Drive was not granted; Drive functionality will be limited.');

// //             if (onUserSignIn) {
// //               onUserSignIn({ email, name, googleId: id, driveAccessToken: null });
// //             }
// //           }
// //         }
// //       });
// //       client.requestAccessToken();
// //     } else {
// //       console.error('GIS OAuth2 client not ready for access token request.');
// //     }
// //   };

// //   return (
// //     <div className="w-full flex justify-center items-center">
// //       {pending && <IonSpinner name="crescent" color="primary" />}
// //       {!pending && !signedIn && (
// //         <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
// //       )}
// //       {loginError && (
// //         <IonText color="danger" className="mt-3 text-center">{loginError}</IonText>
// //       )}
// //     </div>
// //   );
// // }
import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { IonText, IonSpinner } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { logIn } from '../actions/UserActions';
import Paths from '../core/paths';
import DeviceCheck from './DeviceCheck';
import checkResult from '../core/checkResult';
import Context from '../context';
import { Preferences } from '@capacitor/preferences';

export default function GoogleLogin({ onUserSignIn }) {
  const { isError } = useContext(Context);
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const googleButtonRef = useRef(null);
  const driveTokenKey = 'googledrivetoken';

  // Load GIS script for web sign-in
  useLayoutEffect(() => {
    if (!isNative) {
      if (!window.google || !window.google.accounts) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => setGisLoaded(true);
        script.onerror = () => setLoginError('Failed to load Google Sign-In script');
        document.body.appendChild(script);
      } else {
        setGisLoaded(true);
      }
    }
  }, [isNative]);

  // Initialize Google Sign-In button on web after GIS loaded
  useEffect(() => {
    if (!isNative && gisLoaded && window.google && window.google.accounts && !signedIn) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 200,
            logo_alignment: 'left',
            type: 'standard',
          }
        );
      }
    }
  }, [gisLoaded, CLIENT_ID, signedIn, isNative]);

  // Load stored user and tokens on mount
  useEffect(() => {
    async function loadStoredUser() {
      setPending(true);
      try {
        const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
        const storedName = (await Preferences.get({ key: 'userName' })).value;
        const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
        const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
        const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;

        const isTokenValid =
          storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

        if (storedEmail && storedGoogleId && isTokenValid) {
          setAccessToken(storedDriveToken);
          setSignedIn(true);
          setUserInfo({ email: storedEmail, name: storedName, googleId: storedGoogleId });
console.log("FDfx",storedDriveToken)
          if (onUserSignIn) {
            onUserSignIn({
              email: storedEmail,
              name: storedName,
              googleId: storedGoogleId,
              driveAccessToken: storedDriveToken,
            });
          }
          // Navigate only if currently on login page
          if (location.pathname === '/login') {
            navigate(Paths.myProfile());
          }
        }
      } catch (error) {
        console.error('Error retrieving stored user data:', error);
      } finally {
        setPending(false);
      }
    }
    loadStoredUser();
  }, [onUserSignIn, navigate, location]);

  // Native mobile Google sign-in
  const nativeGoogleSignIn = async () => {
    setPending(true);
    setLoginError(null);
    try {
      const socialUser = await SocialLogin.signIn({ provider: 'google' });
      if (!socialUser) throw new Error('No user data from native Google login.');

      await Preferences.set({ key: 'userEmail', value: socialUser.email });
      await Preferences.set({ key: 'userName', value: socialUser.name });
      await Preferences.set({ key: 'googleId', value: socialUser.id });

      if (socialUser.accessToken) {
        const expiryMs = Date.now() + 3600 * 1000;
        await Preferences.set({ key: driveTokenKey, value: socialUser.accessToken });
        await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
        setAccessToken(socialUser.accessToken);
      }

      setUserInfo(socialUser);
      setSignedIn(true);

      if (onUserSignIn) {
        onUserSignIn({
          email: socialUser.email,
          name: socialUser.name,
          googleId: socialUser.id,
          driveAccessToken: socialUser.accessToken,
        });
      }
      dispatch(logIn({ email: socialUser.email, uId: socialUser.id, isNative })).then((res) =>
        checkResult(res, () => navigate(Paths.myProfile()))
      );
    } catch (error) {
      console.error('Native Google Sign-In error:', error);
      setLoginError('Google Sign-In failed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  // Web Google sign-in callback (GIS), with minimal extra token requests,
  // only request Drive token if none stored yet, to avoid double prompt
  const handleCredentialResponse = async (response) => {
    if (!response.credential) {
      setLoginError('No credential received from Google.');
      return;
    }
    try {
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      await Preferences.set({ key: 'userEmail', value: decoded.email });
      await Preferences.set({ key: 'userName', value: decoded.name || decoded.given_name });
      await Preferences.set({ key: 'googleId', value: decoded.sub });

      setUserInfo({
        email: decoded.email,
        name: decoded.name || decoded.given_name,
        googleId: decoded.sub,
      });
      setSignedIn(true);

      // Check if Drive token is already stored and valid
      const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
      const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
      const isTokenValid =
        storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

      if (isTokenValid) {
        setAccessToken(storedDriveToken);
        if (onUserSignIn) {
          onUserSignIn({
            email: decoded.email,
            name: decoded.name || decoded.given_name,
            googleId: decoded.sub,
            driveAccessToken: storedDriveToken,
          });
        }
      } else if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        // Request Drive OAuth token only if no valid token yet
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              const expiryMs = Date.now() + tokenResponse.expires_in * 1000;
              await Preferences.set({ key: driveTokenKey, value: tokenResponse.access_token });
              await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
              setAccessToken(tokenResponse.access_token);
              if (onUserSignIn) {
                onUserSignIn({
                  email: decoded.email,
                  name: decoded.name || decoded.given_name,
                  googleId: decoded.sub,
                  driveAccessToken: tokenResponse.access_token,
                });
              }
              dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then((res) =>
                checkResult(res, () => navigate(Paths.myProfile()))
              );
            } else {
              setLoginError('Failed to get Google Drive access token.');
            }
          },
        });
        tokenClient.requestAccessToken();
      }
    } catch (error) {
      console.error('Invalid ID token:', error);
      setLoginError('Invalid ID token received.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-full">
      {pending && <IonSpinner name="crescent" color="primary" />}
      { !accessToken && (
        <>
          <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
        </>
      )}
      {loginError && (
        <IonText color="danger" className="mt-3">
          {loginError}
        </IonText>
      )}

      {accessToken && userInfo && (
        <div className="mt-4 text-center">
          <IonText>Welcome, {userInfo.name}</IonText>
        </div>
      )}
    </div>
  );
}

