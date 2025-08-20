// import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
// import { useDispatch } from 'react-redux'; // Import useDispatch
// import { useNavigate } from 'react-router-dom';
// import { logIn } from '../actions/UserActions';
// import Paths from '../core/paths';
// import getLocalStore from '../core/getLocalStore';
// import DeviceCheck from './DeviceCheck';
// import checkResult from '../core/checkResult';
// import Context from '../context';
// import setLocalStore from '../core/setLocalStore';
// import { Preferences } from '@capacitor/preferences';
// export default function GoogleLogin({ onUserSignIn }) { 
//     const {isError}=useContext(Context)
//     const [gisLoaded, setGisLoaded] = useState(false);
//     const isNative = DeviceCheck()
//     const [pending,setPending]=useState(true)
//     const [loginError,setLogInError]=useState(null)
//     const [idToken,setIdToken]=useState(null)
//     const [signedIn, setSignedIn] = useState(false); // Internal state for this component's UI
//     const driveTokenKey = "googledrivetoken"; // Consistent key for Drive access token
//     const navigate = useNavigate()
//     const dispatch = useDispatch(); // Initialize useDispatch hook

//     // Replace with your actual Client ID
//     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;

//     // Combined scopes: basic user info + Drive access
//     const LOGIN_SCOPES = 'email profile openid https://www.googleapis.com/auth/drive.readonly';

//     // Function to load the Google Identity Services (GIS) script
//     const loadGisScript = () => {
//         const script = document.createElement('script');
//         script.src = 'https://accounts.google.com/gsi/client';
//         script.async = true;
//         script.defer = true;

//         script.onload = () => {
//             setGisLoaded(true);
//             console.log("Google Identity Services script loaded for login.");
//         };
//         script.onerror = (error) => {
//             console.error("Failed to load Google Identity Services script:", error);
//         };
//         document.body.appendChild(script);

//         // Cleanup function for the effect
//         return () => {
//             if (document.body.contains(script)) {
//                 document.body.removeChild(script);
//             }
//         };
//     };
//     useLayoutEffect(()=>{
//         if (!window.google || !window.google.accounts) {
//             loadGisScript();
//         } else {
//             setGisLoaded(true); // GIS already loaded by another component or previous run
//         }
//     },[])
//     // Main useEffect for managing GIS loading and login state
//     useEffect(() => {
//        return async ()=>{ 
//         const storedEmail =(await Preferences.get({key:'userEmail'})).value;
//         const storedName = (await Preferences.get({key:'userName'})).value;
//         const storedGoogleId = (await Preferences.get({key:'googleId'})).value
//         const storedDriveToken = (await Preferences.get({key:driveTokenKey})).value
//         const storedDriveTokenExpiry = (await Preferences.get({key:'googledrivetoken_expiry'})).value;
//         const isTokenValid = storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);
//         if (storedEmail && storedGoogleId && isTokenValid) {
//             dispatch(logIn({email:storedEmail,uId:storedGoogleId,isNative})).then(res=>{ checkResult(res,payload=>{
//                 setPending(false)
//                 setSignedIn(true);
//                 setGisLoaded(true)
//                 if(payload.error){
//                     setLogInError("Error with Username or Password")
//                 }else{
//                     navigate(Paths.myProfile())
//                 }
//             },err=>{
//                 if(err.message=="Request failed with status code 401"){
// setLogInError("User Not Found. Apply Below")
//                 }else{
//                     setLogInError(err.message)
//                 }
//                 setPending(false)
//             })
//         }) }else if (gisLoaded && window.google && window.google.accounts && window.google.accounts.id) {
           

         
            
           
         

//                 console.log("User found in localStorage. Dispatching login action...");
               
//                 console.log("Dispatching login with:", { googleId: storedGoogleId, accessToken: storedDriveToken });
       
// if(!signedIn){
            
//                     dispatch(logIn({email:storedEmail,uId:storedGoogleId,isNative})).then(res=>{ checkResult(res,payload=>{
//                         setPending(false)
//                         setSignedIn(true);
//                         if(payload.error){
//                             setLogInError("Error with Username or Password")
//                         }else{
//                             navigate(Paths.myProfile())
//                         }
//                     },err=>{
//                         if(err.message=="Request failed with status code 401"){
//     setLogInError("User Not Found. Apply Below")
//                         }else{
//                             setLogInError(err.message)
//                         }
//                         setPending(false)
//                     })})
//                     onUserSignIn({ email: storedEmail, name: storedName, googleId: storedGoogleId, driveAccessToken: storedDriveToken });
//                 // }
               
// }else{
//     navigate(Paths.myProfile())
// }
//                 return; // Exit as user is already logged in
//             }

//           if(window.google&&window.google.accounts){window.google.accounts.id.initialize({
//                 client_id: CLIENT_ID,
//                 callback: handleCredentialResponse, // Callback for ID Token
//                 auto_select: false, // Prevents auto-login on every page load unless explicitly configured
//                 cancel_on_tap_outside: true,
//             })

//             // Render the Google Sign-In button
//             window.google.accounts.id.renderButton(
//                 document.getElementById('google-sign-in-button'),
//                 {
//                     theme: "outline",
//                     size: "large",
                    
//                     text: "signin_with",
//                     borderRadius:"20%",
//                     shape: "rectangular",
//                     width: "200",
//                     logo_alignment: "left"
//                 }
//             )}

//             // Important: If a token exists but is expired, clear it
//             if (storedDriveToken && storedDriveTokenExpiry && !isTokenValid) {
//                 console.log("Stored Drive token expired. Clearing from localStorage.");
//                 await Preferences.remove(driveTokenKey);
//                 await Preferences.remove('googledrivetoken_expiry');
//             }
        
//             }    // gisLoaded
//     }, []); // Added dispatch to dependency array

//     // Callback for the Google Sign-In button (ID Token)
//     const handleCredentialResponse = async (response) => {
//         if (response.credential) {
//             try {
//                 const decodedToken = parseJwt(response.credential);

//                 if (decodedToken) {
//                     // Update internal state immediately after ID Token processing
                   
//                     setSignedIn(true); // Update UI state to show logged-in view

//                     // Store basic user info in localStorage
//                   await Preferences.set({key:'userEmail', value:decodedToken.email});
//              await Preferences.set({key:'userName',value:decodedToken.name || decodedToken.given_name});
//                await  Preferences.set({key:'googleId',value:decodedToken.sub});

//                     console.log("User signed in (ID Token processed). Now requesting access token for Drive...");
//                     // Proceed to request access token with Drive scopes
//                     requestDriveAccessToken(decodedToken.sub, decodedToken.email, decodedToken.name || decodedToken.given_name);
                  
//                 }
//             } catch (error) {
//                 console.error("Error decoding ID token or processing sign-in:", error);
//             }
//         } else {
//             console.error("Sign-in failed: No credential received from ID token response.", response);
//         }
//     };

//     // Function to request the access token with Drive scopes
//     const requestDriveAccessToken = (id, email, name) => {
//         if (window.google && window.google.accounts && window.google.accounts.oauth2) {
//             const client = window.google.accounts.oauth2.initTokenClient({
//                 client_id: CLIENT_ID,
//                 scope: LOGIN_SCOPES, // Use the combined scopes here
//                 callback: (tokenResponse) => {
//                     if (tokenResponse.access_token) {
//                         const driveAccessToken = tokenResponse.access_token;
//                         const expiryMs = Date.now() + (parseInt(tokenResponse.expires_in, 10) * 1000);

//                         // Store Drive access token and expiry in localStorage
//                        Preferences.set({key:driveTokenKey, value:driveAccessToken});
//                        Preferences.set({key:"googledrivetoken_expiry", value:expiryMs.toString()})
//                         console.log("Drive-scoped access token obtained and stored.");

//                         // Dispatch Redux login action after getting all necessary info
//                         // Replace with your actual dispatch call:
//                         console.log("Dispatching login after new access token:", { googleId: id, accessToken: driveAccessToken });
//                         // dispatch(loginUser({ googleId: id, accessToken: driveAccessToken, email: email, name: name }));

//                         // Notify parent component of complete login
//                         if (onUserSignIn) {
//                             onUserSignIn({
//                                 email: email,
//                                 name: name,
//                                 googleId: id,
//                                 driveAccessToken: driveAccessToken,
//                             });
//                         }
//                     } else {
//                         console.error("Failed to get Drive-scoped access token:", tokenResponse);
//                         alert("Access to Google Drive was not granted. Drive picker will not work.");
//                         // Notify parent about basic login, but without Drive token
//                         if (onUserSignIn) {
//                             onUserSignIn({
//                                 email: email,
//                                 name: name,
//                                 googleId: id,
//                                 driveAccessToken: null, // Explicitly null if permission denied
//                             });
//                         }
//                     }
//                 },
//             });
//             client.requestAccessToken(); // This will show the combined consent screen if not already granted
//         } else {
//             console.error("GIS OAuth2 client not available for access token request.");
//         }
//     };

//     // Helper function to decode a JWT (ID Token)
//     const parseJwt = (token) => {
//         try {
//             return JSON.parse(atob(token.split('.')[1]));
//         } catch (e) {
//             console.error("Invalid JWT token:", e);
//             return null;
//         }
//     };

 
//   Preferences.get({key:"token"}).then(token=>setIdToken(token.value))

//     return (
//         <div>
//             {!gisLoaded && <p>Loading Google Sign-In...</p>}

//             {!signedIn||!idToken ? (
//                 // This div will be replaced by the Google Sign-In button
//                 <div id="google-sign-in-button"  style={{ display: gisLoaded ? 'block' : 'none'}}></div>
//             ) : null}
//         </div>
//     );
// }
import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { IonText, IonSpinner } from '@ionic/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logIn } from '../actions/UserActions';
import Paths from '../core/paths';
import DeviceCheck from './DeviceCheck';
import checkResult from '../core/checkResult';
import Context from '../context';
import { Preferences } from '@capacitor/preferences';

export default function GoogleLogin({ onUserSignIn }) {
  const { isError } = useContext(Context);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [pending, setPending] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const isNative = DeviceCheck();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const driveTokenKey = "googledrivetoken";
  const googleButtonRef = useRef(null);

  // Combined scopes for login + Drive read-only access
  const LOGIN_SCOPES = 'email profile openid https://www.googleapis.com/auth/drive.readonly';

  // Load GIS script once
  useLayoutEffect(() => {
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
  }, []);

  // Initialize Google Sign-In button once GIS script loaded
  useEffect(() => {
    if (gisLoaded && window.google && window.google.accounts && !signedIn) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
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
  }, [gisLoaded, CLIENT_ID, signedIn]);

  // Load stored user info and tokens on mount
  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedEmail = (await Preferences.get({ key: 'userEmail' })).value;
        const storedName = (await Preferences.get({ key: 'userName' })).value;
        const storedGoogleId = (await Preferences.get({ key: 'googleId' })).value;
        const storedDriveToken = (await Preferences.get({ key: driveTokenKey })).value;
        const storedDriveTokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
        const isTokenValid = storedDriveToken && storedDriveTokenExpiry && Date.now() < parseInt(storedDriveTokenExpiry, 10);
        if(!storedDriveToken){
setSignedIn(false)
return
        }
        if (storedEmail && storedGoogleId && isTokenValid) {
          setSignedIn(true);
          setPending(false);
          setIdToken(storedGoogleId);
          if (onUserSignIn) {
            onUserSignIn({ email: storedEmail, name: storedName, googleId: storedGoogleId, driveAccessToken: storedDriveToken });
          }
          navigate(Paths.myProfile());
        } else {
          setPending(false);
          // Clear stale tokens
          if (!isTokenValid) {
            await Preferences.remove(driveTokenKey);
            await Preferences.remove('googledrivetoken_expiry');
          }
        }
      } catch (error) {
        console.error('Error retrieving stored user data:', error);
        setPending(false);
      }
    }
    loadStoredUser();
  }, [onUserSignIn, navigate]);

  // Handle Google sign-in credential response (ID token)
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

      setIdToken(decoded.sub);
      setSignedIn(true);
      setPending(false);

      if (onUserSignIn) {
        onUserSignIn({
          email: decoded.email,
          name: decoded.name || decoded.given_name,
          googleId: decoded.sub,
        });
      }

      requestDriveAccessToken(decoded.sub, decoded.email, decoded.name || decoded.given_name);

      // Dispatch login action
      dispatch(logIn({ email: decoded.email, uId: decoded.sub, isNative })).then(res => {
        checkResult(res, () => {
          navigate(Paths.myProfile());
        });
      });

    } catch (error) {
      console.error('Invalid ID token:', error);
      setLoginError('Invalid ID token received.');
    }
  };

  // Request the Google Drive OAuth2 access token
  const requestDriveAccessToken = (id, email, name) => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: LOGIN_SCOPES,
        callback: async (tokenResponse) => {
          if (tokenResponse.access_token) {
            const driveAccessToken = tokenResponse.access_token;
            const expiryMs = Date.now() + parseInt(tokenResponse.expires_in, 10) * 1000;

            await Preferences.set({ key: driveTokenKey, value: driveAccessToken });
            await Preferences.set({ key: 'googledrivetoken_expiry', value: expiryMs.toString() });

            console.log('Drive access token obtained and stored.');

            if (onUserSignIn) {
              onUserSignIn({ email, name, googleId: id, driveAccessToken });
            }
          } else {
            console.error('Failed to get Drive access token.', tokenResponse);
            alert('Access to Google Drive was not granted; Drive functionality will be limited.');

            if (onUserSignIn) {
              onUserSignIn({ email, name, googleId: id, driveAccessToken: null });
            }
          }
        }
      });
      client.requestAccessToken();
    } else {
      console.error('GIS OAuth2 client not ready for access token request.');
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {pending && <IonSpinner name="crescent" color="primary" />}
      {!pending && !signedIn && (
        <div ref={googleButtonRef} role="button" aria-label="Google Sign-In Button"></div>
      )}
      {loginError && (
        <IonText color="danger" className="mt-3 text-center">{loginError}</IonText>
      )}
    </div>
  );
}
