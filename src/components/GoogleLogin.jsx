// import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
// import { IonText, IonSpinner, IonButton } from '@ionic/react';
// import { useDispatch } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
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
//   const [idToken, setIdToken] = useState(null);

//   const isNative = DeviceCheck();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const googleButtonRef = useRef(null);
//   const driveTokenKey = 'googledrivetoken';
//   const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
//   const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
//   // Load GIS script only on web
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
//   useEffect(()=>{
//     let initialize = async ()=>await SocialLogin.initialize({google:{
//       webClientId:CLIENT_ID,
//       iOSClientId:IOS_CLIENT_ID,
//       iOSServerClientId:CLIENT_ID,
//       mode: 'online'
//   }})
//   initialize()
//   },[])
//   // Initialize GIS web button (only if browser)
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

//   // Load saved tokens and user info from storage
//   useEffect(() => {
//     const loadStoredUser = async () => {
//       setPending(true);
//       try {
//         const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
//         const storedName = (await Preferences.get({ key: 'userName' })).value;
//         const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
//         const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
//         const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
//         const storedIdToken = (await Preferences.get({ key: 'googleIdToken' })).value;

//         const tokenValid =
//           storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

//         if (storedEmail && storedGoogleId && tokenValid) {
//           setAccessToken(storedDriveToken);
//           setIdToken(storedIdToken);
//           setUserInfo({ email: storedEmail, name: storedName, googleId: storedGoogleId });
//           setSignedIn(true);
//           if (onUserSignIn) {
//             onUserSignIn({
//               email: storedEmail,
//               name: storedName,
//               googleId: storedGoogleId,
//               driveAccessToken: storedDriveToken,
//               idToken: storedIdToken,
//             });
//           }
//           if (location.pathname === '/login') {
//             navigate(Paths.myProfile());
//           }
//         }
//       } catch (e) {
//         console.error('Error loading stored user:', e);
//       } finally {
//         setPending(false);
//       }
//     };
//     loadStoredUser();
//   }, [location, navigate, onUserSignIn]);

//   // Native Google sign-in
//   const nativeGoogleSignIn = async () => {
//     setPending(true);
//     setLoginError(null);
//     try {
  

//       const user = await SocialLogin.login({provider:"google",options:{
      
//         scopes: ['email','name', 'profile', 'https://www.googleapis.com/auth/drive.readonly'],
 
//       }})
//       if (!user) throw new Error('No user data returned from native login.');

//       await Preferences.set({ key: 'userEmail', value: user.email });
//       await Preferences.set({ key: 'userName', value: user.name });
//       await Preferences.set({ key: 'googleId', value: user.id });

//       if (user.idToken) {
//         await Preferences.set({ key: 'googleIdToken', value: user.idToken });
//         setIdToken(user.idToken);
//       }

//       if (user.accessToken) {
//         const expiry = Date.now() + 3600 * 1000;
//         await Preferences.set({ key: driveTokenKey, value: user.accessToken });
//         await Preferences.set({ key: 'googledrivetoken_expiry', value: expiry.toString() });
//         setAccessToken(user.accessToken);
//       }

//       setUserInfo(user);
//       setSignedIn(true);

//       if (onUserSignIn) {
//         onUserSignIn({
//           email: user.email,
//           name: user.name,
//           googleId: user.id,
//           driveAccessToken: user.accessToken,
//           idToken: user.idToken,
//         });
//       }

//       dispatch(logIn({ email: user.email, uId: user.id, isNative })).then((res) => {
//         checkResult(res, () => navigate(Paths.myProfile()));
//       });
//     } catch (error) {
//       console.error('Google Native Sign-In error', error);
//       setLoginError('Google Sign-In failed. Please try again.'+JSON.stringify(error));
//     } finally {
//       setPending(false);
//     }
//   };

//   // Web sign-in callback with Drive token request if needed
//   const handleCredentialResponse = async (response) => {
//     if (!response.credential) {
//       setLoginError('No credential received from Google.');
//       return;
//     }
//     try {
//       await Preferences.set({ key: 'googleIdToken', value: response.credential });
//       setIdToken(response.credential);

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

//       const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
//       const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
//       const tokenValid =
//         storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);

//       if (tokenValid) {
//         setAccessToken(storedDriveToken);
//         if (onUserSignIn) {
//           onUserSignIn({
//             email: decoded.email,
//             name: decoded.name || decoded.given_name,
//             googleId: decoded.sub,
//             driveAccessToken: storedDriveToken,
//             idToken: response.credential,
//           });
//         }
//       } else if (window.google && window.google.accounts && window.google.accounts.oauth2) {
//         const tokenClient = window.google.accounts.oauth2.initTokenClient({
//           client_id: CLIENT_ID,
//           scope: 'https://www.googleapis.com/auth/drive.readonly',
//           callback: async (tokenResponse) => {
//             if (tokenResponse.access_token) {
//               const expiryMs = Date.now() + tokenResponse.expires_in * 1000;
//               await Preferences.set({ key: driveTokenKey, value: tokenResponse.access_token });
//               await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });
//               setAccessToken(tokenResponse.access_token);
//               if (onUserSignIn) {
//                 onUserSignIn({
//                   email: decoded.email,
//                   name: decoded.name || decoded.given_name,
//                   googleId: decoded.sub,
//                   driveAccessToken: tokenResponse.access_token,
//                   idToken: response.credential,
//                 });
//               }
//               dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then((res) =>
//                 checkResult(res, () => navigate(Paths.myProfile()),err=>{
//                         setLoginError(JSON.stringify(err))
//                 })
//               );
//             } else {
//               setLoginError('Failed to get Google Drive access token.');
//             }
//           },
//         });
//         tokenClient.requestAccessToken();
//       }
//     } catch (error) {
//       console.error('Invalid ID token:', error);
//       setLoginError('Invalid ID token received.');
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center w-full min-h-full">
//       HERE
//       {pending && <IonSpinner name="crescent" color="primary" />}
//       {!pending && !accessToken && (
//         <>
//           {isNative? (
//             <IonButton expand="block" onClick={nativeGoogleSignIn}>
//               Sign in with Google
//             </IonButton>
//           ) : (
//             <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
//           )}
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
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { useNavigate } from 'react-router-dom';
import { logIn } from '../actions/UserActions';
import Paths from '../core/paths';

export default function GoogleLogin({ onUserSignIn }) { 
    const [gisLoaded, setGisLoaded] = useState(false);

    const [signedIn, setSignedIn] = useState(false); // Internal state for this component's UI
    const driveTokenKey = "googledrivetoken"; // Consistent key for Drive access token
    const navigate = useNavigate()
    const dispatch = useDispatch(); // Initialize useDispatch hook

    // Replace with your actual Client ID
    const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

    // Combined scopes: basic user info + Drive access
    const LOGIN_SCOPES = 'email profile openid https://www.googleapis.com/auth/drive.readonly';

    // Function to load the Google Identity Services (GIS) script
    const loadGisScript = () => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;

        script.onload = () => {
            setGisLoaded(true);
            console.log("Google Identity Services script loaded for login.");
        };
        script.onerror = (error) => {
            console.error("Failed to load Google Identity Services script:", error);
        };
        document.body.appendChild(script);

        // Cleanup function for the effect
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    };
    useLayoutEffect(()=>{
        if (!window.google || !window.google.accounts) {
            loadGisScript();
        } else {
            setGisLoaded(true); // GIS already loaded by another component or previous run
        }
    },[])
    // Main useEffect for managing GIS loading and login state
    useEffect(() => {
        
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const storedGoogleId = localStorage.getItem('googleId');
        const storedDriveToken = localStorage.getItem(driveTokenKey);
        const storedDriveTokenExpiry = localStorage.getItem('googledrivetoken_expiry');
        const isTokenValid = storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);
        if (storedEmail && storedGoogleId && isTokenValid) {
            dispatch(logIn({email:storedEmail,uId:storedGoogleId})).then(res=>{ checkResult(res,payload=>{
                setPending(false)
                setSignedIn(true);
                setGisLoaded(true)
                if(payload.error){
                    setLogInError("Error with Username or Password")
                }else{
                    navigate(Paths.myProfile())
                }
            },err=>{
                if(err.message=="Request failed with status code 401"){
setLogInError("User Not Found. Apply Below")
                }else{
                    setLogInError(err.message)
                }
                setPending(false)
            })
        }) }else if (gisLoaded && window.google && window.google.accounts && window.google.accounts.id) {
           

            
                navigate(Paths.myProfile())
            
           
         

                console.log("User found in localStorage. Dispatching login action...");
               
                console.log("Dispatching login with:", { googleId: storedGoogleId, accessToken: storedDriveToken });
       
if(!signedIn){
            
                    dispatch(logIn({email:storedEmail,uId:storedGoogleId})).then(res=>{ checkResult(res,payload=>{
                        setPending(false)
                        setSignedIn(true);
                        if(payload.error){
                            setLogInError("Error with Username or Password")
                        }else{
                            navigate(Paths.myProfile())
                        }
                    },err=>{
                        if(err.message=="Request failed with status code 401"){
    setLogInError("User Not Found. Apply Below")
                        }else{
                            setLogInError(err.message)
                        }
                        setPending(false)
                    })})
                    onUserSignIn({ email: storedEmail, name: storedName, googleId: storedGoogleId, driveAccessToken: storedDriveToken });
                // }
               
}else{
    navigate(Paths.myProfile())
}
                return; // Exit as user is already logged in
            }

          if(window.google&&window.google.accounts){window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse, // Callback for ID Token
                auto_select: false, // Prevents auto-login on every page load unless explicitly configured
                cancel_on_tap_outside: true,
            })

            // Render the Google Sign-In button
            window.google.accounts.id.renderButton(
                document.getElementById('google-sign-in-button'),
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with",
                    borderRadius:"10%",
                    // shape: "rectangular",
                    width: "250",
                    logo_alignment: "left"
                }
            )}

            // Important: If a token exists but is expired, clear it
            if (storedDriveToken && storedDriveTokenExpiry && !isTokenValid) {
                console.log("Stored Drive token expired. Clearing from localStorage.");
                localStorage.removeItem(driveTokenKey);
                localStorage.removeItem('googledrivetoken_expiry');
            }
        
        // gisLoaded
    }, []); // Added dispatch to dependency array

    // Callback for the Google Sign-In button (ID Token)
    const handleCredentialResponse = (response) => {
        if (response.credential) {
            try {
                const decodedToken = parseJwt(response.credential);

                if (decodedToken) {
                    // Update internal state immediately after ID Token processing
                   
                    setSignedIn(true); // Update UI state to show logged-in view

                    // Store basic user info in localStorage
                    localStorage.setItem('userEmail', decodedToken.email);
                    localStorage.setItem('userName', decodedToken.name || decodedToken.given_name);
                    localStorage.setItem('googleId', decodedToken.sub);

                    console.log("User signed in (ID Token processed). Now requesting access token for Drive...");
                    // Proceed to request access token with Drive scopes
                    requestDriveAccessToken(decodedToken.sub, decodedToken.email, decodedToken.name || decodedToken.given_name);
                  
                }
            } catch (error) {
                console.error("Error decoding ID token or processing sign-in:", error);
            }
        } else {
            console.error("Sign-in failed: No credential received from ID token response.", response);
        }
    };

    // Function to request the access token with Drive scopes
    const requestDriveAccessToken = (id, email, name) => {
        if (window.google && window.google.accounts && window.google.accounts.oauth2) {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: LOGIN_SCOPES, // Use the combined scopes here
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        const driveAccessToken = tokenResponse.access_token;
                        const expiryMs = Date.now() + (parseInt(tokenResponse.expires_in, 10) * 1000);

                        // Store Drive access token and expiry in localStorage
                        localStorage.setItem(driveTokenKey, driveAccessToken);
                        localStorage.setItem("googledrivetoken_expiry", expiryMs.toString());
                        console.log("Drive-scoped access token obtained and stored.");

                        // Dispatch Redux login action after getting all necessary info
                        // Replace with your actual dispatch call:
                        console.log("Dispatching login after new access token:", { googleId: id, accessToken: driveAccessToken });
                        // dispatch(loginUser({ googleId: id, accessToken: driveAccessToken, email: email, name: name }));

                        // Notify parent component of complete login
                        if (onUserSignIn) {
                            onUserSignIn({
                                email: email,
                                name: name,
                                googleId: id,
                                driveAccessToken: driveAccessToken,
                            });
                        }
                    } else {
                        console.error("Failed to get Drive-scoped access token:", tokenResponse);
                        alert("Access to Google Drive was not granted. Drive picker will not work.");
                        // Notify parent about basic login, but without Drive token
                        if (onUserSignIn) {
                            onUserSignIn({
                                email: email,
                                name: name,
                                googleId: id,
                                driveAccessToken: null, // Explicitly null if permission denied
                            });
                        }
                    }
                },
            });
            client.requestAccessToken(); // This will show the combined consent screen if not already granted
        } else {
            console.error("GIS OAuth2 client not available for access token request.");
        }
    };

    // Helper function to decode a JWT (ID Token)
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error("Invalid JWT token:", e);
            return null;
        }
    };

    const handleSignOut = () => {
        window.google.accounts.id.disableAutoSelect(); // Clears GIS cookie for auto-login
        // Clear all stored items related to login and drive token
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('googleId');
        localStorage.removeItem(driveTokenKey);
        localStorage.removeItem('googledrivetoken_expiry');

        // Reset component's internal state
        
        setSignedIn(false);

        // Notify parent component about sign out
        if (onUserSignIn) {
            onUserSignIn(null); // Indicate user signed out
        }
        console.log("User signed out.");
    };

    return (
        <div>
            {!gisLoaded && <p>Loading Google Sign-In...</p>}

            {!signedIn ? (
                // This div will be replaced by the Google Sign-In button
                <div id="google-sign-in-button"  style={{ display: gisLoaded ? 'block' : 'none' }}></div>
            ) : null}
        </div>
    );
}