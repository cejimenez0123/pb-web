
// import  { useState, useEffect, useRef, useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import { createStory } from '../actions/StoryActions';
// import checkResult from '../core/checkResult';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { SocialLogin } from '@capgo/capacitor-social-login';
// import { IonItem } from '@ionic/react';
// import Context from "../context";
// import Paths from '../core/paths';
// import { useLayoutEffect } from 'react';
// import { PageType } from '../core/constants';
// import { IonText,IonList } from '@ionic/react'; // Assuming this is for your UI button text
// import DeviceCheck from './DeviceCheck';
// import { Preferences } from '@capacitor/preferences';
// import { setDialog } from '../actions/UserActions';
// import GoogleLogin from './GoogleLogin';
// export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {
//     const TOKEN_KEY = "googledrivetoken"; // Consistent key for localStorage
//     const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time
//   const {dialog,isPhone} = useContext(Context)
//     const [gapiLoaded, setGapiLoaded] = useState(false);
//     const isNative = DeviceCheck() 
//     const [loading, setLoading] = useState(false);
//        const [driveClientLoaded, setDriveClientLoaded] = useState(false); // Indicates gapi.client.drive is loaded
//     const [gisLoadedForPicker, setGisLoadedForPicker] = useState(false); // NEW: GIS for OAuth2 token client
//     const [driveTokenAvailable, setDriveTokenAvailable] = useState(false); // To reflect if a usable token is found
//  const [showFiles,setShowFiles]=useState(true)
//  const [signedIn,setSignedIn]=useState(false)
//     const driveTokenKey = 'googledrivetoken';
// const [files, setFiles] = useState([]);
//  const [accessToken, setAccessToken] = useState(null);
//     const { currentProfile } = useContext(Context);
//     const [pending,setPending]=useState(false)
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
//       const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
// useLayoutEffect(() => {

//       SocialLogin.initialize({
//         google: {
//           webClientId: CLIENT_ID,
//           iOSClientId: IOS_CLIENT_ID,
//           iOSServerClientId: CLIENT_ID,
     
//           mode: 'online',
//         },
//       }).catch(err => console.error('SocialLogin init error:', err))
    
//   }, [isNative, CLIENT_ID, IOS_CLIENT_ID]);
//     // Drive-specific scope for the picker
//     const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
// const nativeGoogleSignIn = async () => {
//     setPending(true);
//     // setLoginError(null);
//     try {
//       const user = await SocialLogin.login({
//         provider: 'google',
//         options: { scopes: ['email', 'profile', 'https://www.googleapis.com/auth/drive.readonly'] },
//       });
      
//       if (!user) throw new Error('No user data returned.');
//       const {accessToken,idToken,profile}=user.result
//    console.log("ACCESX token",user.result.accessToken)
//       const expiry = Date.now() + 3600 * 1000;
//       await Promise.all([
       
//         Preferences.set({ key: driveTokenKey, value:user.result.accessToken|| '' }),
//         Preferences.set({ key: 'googledrivetoken_expiry', value: expiry.toString() }),
//       ]);

  
     

//       setAccessToken(user.result.accessToken);

//       setSignedIn(true);

     
//       // checkResult(res, () => navigate(Paths.myProfile()));
//     } catch (err) {
//       console.error('Native sign-in error', err);
//     //   setLoginError('Google Sign-In failed. ' + JSON.stringify(err));
//     } finally {
//       setPending(false);
//     }
//   };
//     // Helper to check if the stored token is expired
//     const isTokenExpired = useCallback(() => {
//         const storedToken = localStorage.getItem(TOKEN_KEY);
//         const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

//         if (!storedToken || !storedExpiry) {
//             return true; // No token or expiry means it's "expired" for practical purposes
//         }

//         const expiryTime = parseInt(storedExpiry, 10);
//         return Date.now() >= expiryTime;
//     }, []);

//     // --- Script Loading (GAPI and GIS for Picker's OAuth2 client) ---
//     useEffect(() => {
//         const loadGapiAndDriveClient = () => {
//             window.gapi.load('client:picker', () => {
//                 window.gapi.client.load('drive', 'v3')
//                     .then(() => {
//                         setDriveClientLoaded(true);
//                         console.log("GAPI client for Drive (v3) loaded in Picker.");
//                     })
//                     .catch(err => console.error("Error loading gapi.client.drive:", err));

//                 setGapiLoaded(true);
//                 console.log("GAPI client:picker module loaded.");
//             });
//         };

//         const loadGisForPicker = () => {
//             setGisLoadedForPicker(true);
//             console.log("GIS OAuth2 client library loaded for Picker.");
//         };

//         // Load GAPI script
//         if (!window.gapi) {
//             const scriptGapi = document.createElement('script');
//             scriptGapi.src = 'https://apis.google.com/js/api.js';
//             scriptGapi.onload = loadGapiAndDriveClient;
//             scriptGapi.onerror = (e) => console.error("Failed to load GAPI script:", e);
//             document.body.appendChild(scriptGapi);
//         } else {
//             loadGapiAndDriveClient(); // GAPI already loaded
//         }

//         // Load GIS script (for initTokenClient)
//         if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
//             const scriptGis = document.createElement('script');
//             scriptGis.src = 'https://accounts.google.com/gsi/client';
//             scriptGis.async = true;
//             scriptGis.defer = true;
//             scriptGis.onload = loadGisForPicker;
//             scriptGis.onerror = (e) => console.error("Failed to load GIS script for Picker:", e);
//             document.body.appendChild(scriptGis);
//         } else {
//             loadGisForPicker(); // GIS already loaded
//         }
//     }, []); // Empty dependency array, runs once on mount
//     useLayoutEffect(() => 
//     {
   
//     checkAccessToken();
   
//   }, [currentProfile]);
//   async function checkAccessToken() {
//     const token = (await Preferences.get({ key: driveTokenKey })).value;
//     const tokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
//     const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

//     if (tokenValid&&!accessToken) {
//       setAccessToken(token);
//       setSignedIn(true);
//     }
//     setLoading(false)
//   }
//   // Fetch files from Google Drive when access token changes or user is signed in
//   useEffect(() => {
//     if (!accessToken) return;

//     setLoading(true);
//     fetch(
//       'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)',
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: 'application/json',
//         },
//       }
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         setFiles(data.files || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Google Drive API error:', err);
//         setLoading(false);
//       });
//   }, [accessToken]);
//   const fetchFiles= async ()=>{
//         if (!accessToken) return;
//   const token = (await Preferences.get({ key: driveTokenKey })).value

//     setLoading(true);
//     fetch(
//       'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)',
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json',
//         },
//       }
//     )
//       .then((res) => res.json())
//       .then((data) => {
    
//         setFiles(data.files || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Google Drive API error:', err);
//         setLoading(false);
//       });}
  
//  useEffect(() => {
//    return async ()=>await fetchFiles()
  

//   }, [,dispatch,accessToken]);
//     // --- Check for stored token on initial load OR after API clients are ready ---
//     useEffect(() => {
//         // Only attempt to check token if both GAPI and GIS are loaded for the picker
//         if (gapiLoaded && driveClientLoaded && gisLoadedForPicker) {
//             if (!isTokenExpired()) {
//                 setDriveTokenAvailable(true);
//                 console.log("Drive Picker: Existing token found and is valid.");
//             } else {
//                 setDriveTokenAvailable(false);
//                 console.log("Drive Picker: No valid token found in localStorage.");
//                 // Clear any expired token to ensure a fresh request next time
//                 localStorage.removeItem(TOKEN_KEY);
//                 localStorage.removeItem(TOKEN_EXPIRY_KEY);
//             }
//         }
//     }, [gapiLoaded, driveClientLoaded, gisLoadedForPicker, isTokenExpired]);

//     // --- Function to request the Drive-specific access token ---
//     const requestDriveAccessToken = useCallback(() => {
//         // Check if token is still valid before requesting, and if so, directly open picker
//         if (!isTokenExpired()) {
//             setDriveTokenAvailable(true); // Ensure state is true
//             console.log("Drive Picker: Token is still valid, proceeding to open picker.");
//             createPicker(); // Directly open picker
//             return;
//         }

//         // Proceed to request a new token if APIs are ready
//         if (gisLoadedForPicker && window && window.google && window.google?.accounts?.oauth2) {
//             const client = window.google.accounts.oauth2.initTokenClient({
//                 client_id: CLIENT_ID,
//                 scope: DRIVE_SCOPES, // Request only Drive scope here
//                 callback: (tokenResponse) => {
//                     if (tokenResponse.access_token) {
//                         const driveAccessToken = tokenResponse.access_token;
//                         const expiryMs = Date.now() + (parseInt(tokenResponse.expires_in, 10) * 1000);

//                        Preferences.set(TOKEN_KEY, driveAccessToken).then(()=>{});
//                         Preferences.set(TOKEN_EXPIRY_KEY, expiryMs.toString()).then(()=>{});
//                         setDriveTokenAvailable(true); // Update state to true
//                         console.log("Drive Picker: New access token obtained and stored.");
//                         createPicker(); // Open picker after getting new token
//                     } else {
//                         console.error("Drive Picker: Failed to get access token:", tokenResponse);
//                         setDriveTokenAvailable(false); // Update state to false
//                         alert("Access to Google Drive was not granted. Please try logging in again.");
//                         // Notify parent only if reauthentication is definitely needed and user denied
//                         if (tokenResponse.error === 'access_denied' && onReauthenticateNeeded) {
//                             onReauthenticateNeeded();
//                         }
//                     }
//                 },
//             });
//             client.requestAccessToken(); // This will prompt the user for Drive access
//         } else {
//             console.error("Drive Picker: GIS OAuth2 client not available for token request.");
//             alert("Google authentication services not loaded. Please try again.");
//         }
//     }, [CLIENT_ID, DRIVE_SCOPES, gisLoadedForPicker, isTokenExpired, onReauthenticateNeeded]); // Added CLIENT_ID and DRIVE_SCOPES to deps


//     const createPicker = () => {
//         const storedToken = localStorage.getItem(TOKEN_KEY);

//         // Ensure all APIs are ready and a valid token exists
//         if (!gapiLoaded || !driveClientLoaded || !gisLoadedForPicker || !storedToken || isTokenExpired()) {
//             console.error("Cannot create picker: APIs not fully loaded or Drive token missing/expired. Attempting re-authentication.");
//             // If any critical dependency is missing, initiate the login flow
//             requestDriveAccessToken();
//             return;
//         }

//         if (!window.google || !window.google.picker) {
//              console.error("Google Picker API is not available on window.google.picker.");
//              return;
//         }

//         const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
//             .setMimeTypes('application/vnd.google-apps.document')
//             .setSelectFolderEnabled(false);

//         const picker = new window.google.picker.PickerBuilder()
//             .setAppId(CLIENT_ID.split('.')[0]) // App ID from your CLIENT_ID
//             .setOAuthToken(storedToken) // Use the token from localStorage
//             .addView(view)
//             .addView(new window.google.picker.DocsUploadView())
//             .setCallback(pickerCallback)
//             .build();

//         picker.setVisible(true);
//     };

//     const pickerCallback = (data) => {
//         if (data.action === window.google.picker.Action.PICKED) {
//             const file = data.docs[0];
//             console.log('File picked:', file);

//             if (onFilePicked) {
//                 onFilePicked(file);
//             }

//             if (file.mimeType === 'application/vnd.google-apps.document') {
//                 fetchGoogleDocContent(file);
//             } else {
//                 console.log('Selected file is not a Google Doc, skipping text content fetch.');
//             }
//         }
//     };

//     const fetchGoogleDocContent = async (file) => {
//         try {
//             const storedToken = localStorage.getItem(TOKEN_KEY);
//             if (!storedToken || isTokenExpired()) {
//                 console.error("Drive access token expired or not available. Cannot fetch content. Requesting re-authentication.");
//                 requestDriveAccessToken(); // Attempt to get a new token
//                 return;
//             }

//             if (!window.gapi || !window.gapi.client || !window.gapi.client.drive || !driveClientLoaded) {
//                 console.error("Google Drive API client (gapi.client.drive) not fully initialized or loaded.");
//                 return; // Prevent API call if client is not ready
//             }

//             const response = await window.gapi.client.drive.files.export({
//                 fileId: file.id,
//                 mimeType: 'text/html',
//                 access_token: storedToken
//             });

//             const htmlContent = response.body;
//             console.log('Google Doc HTML Content:', htmlContent);

//             dispatch(createStory({
//                 profileId: currentProfile.id,
//                 data: htmlContent,
//                 isPrivate: true,
//                 approvalScore: 0,
//                 type: PageType.text,
//                 title: file.name,
//                 commentable: false
//             })).then(res => checkResult(res, ({ story }) => {
//                 navigate(Paths.page.createRoute(story.id));
//             }, err => {
//                 console.error("Error creating story:", err);
//             }));

//         } catch (error) {
//             console.error('Error fetching Google Doc content:', error);
//             if (error.result && error.result.error) {
//                 console.error('API Error details:', error.result.error.message);
//             }
//         }
//     };
// const openDialog=()=>{
  
//     let dia = {...dialog}
//     setShowFiles(true)
//     dia.isOpen =true

//     dia.onClose=()=>{setShowFiles(false)}
//     dia.title="Google Drive"
//      dia.text=isNative||isPhone?


//      <IonList className="grid grid-cols-2 gap-2  ">
//             {files.map((file,i) => (
//                 <IonItem class="col " key={file.id} ng-repeat="letter in letters" className="rounded-box  p-3 shadow-md hover:border hover:border-purple-200"
//                 onClick={() =>{
//             setShowFiles(true); 
//             onFilePicked(file)}}
//             >
          
//           <h5 className="text-center text-sm" >{file.name}</h5>
//       </IonItem>))}
//     </IonList>

// :<IonList >
        
//       {files.map((file) => (
//         <IonItem  className="flex btn flex-col my-4 items-center rounded-full rounded-box max-w-[20rem] bg-transparent text-emerald-800 shadow-md hover:bg-purple-200 transition "

        
//         key={file.id} onClick={() =>{
//             setShowFiles(true); 
//             onFilePicked(file)}}
//             >
             
//           <h5 className="text-center text-sm" >{file.name}</h5>
   
//         </IonItem>
//       ))}

//     </IonList>
//     dispatch(setDialog(dia))
//   }
//     return (
//         <div>
//             {gapiLoaded && driveClientLoaded && gisLoadedForPicker ? (
//                 // Only render buttons if all necessary Google APIs are loaded
//                 !accessToken ? (
//                     // Show "Login to Google Drive" button if no valid token
//                     <div onClick={()=>nativeGoogleSignIn().then()}className='btn bg-emerald-700 rofunded-full border-emerald-600 mont-medium flex text-center w-[90%] h-[3rem]'>
//                         Log in to Google Drive
//                     </div>
//                 ) : (
//                     // Show "Open Google Drive" button if a valid token is available
//                     <div className='btn bg-emerald-700 rounded-full border-emerald-600 mont-medium flex text-center w-[90%] h-[3rem]'>
//                         <IonText class="mx-auto text-white my-auto text-[0.8rem]" onClick={openDialog}>
//                             Open Google Drive
//                         </IonText>
//                     </div>
//                 )
//             ) : (
//                 // Show loading message until all APIs are ready
//                 <p>Loading Google Drive services...</p>
//             )}
//         </div>
//     );
// }
import { useState, useEffect, useLayoutEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { createStory } from '../actions/StoryActions';
import checkResult from '../core/checkResult';
import { useNavigate } from 'react-router-dom';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { IonItem, IonText, IonList } from '@ionic/react';
import Context from "../context";
import Paths from '../core/paths';
import { PageType } from '../core/constants';
import DeviceCheck from './DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import { setDialog } from '../actions/UserActions';

export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {


  const { dialog, isPhone, currentProfile } = useContext(Context);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [driveClientLoaded, setDriveClientLoaded] = useState(false);
  const [gisLoadedForPicker, setGisLoadedForPicker] = useState(false);
  const [driveTokenAvailable, setDriveTokenAvailable] = useState(false);
  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [pending, setPending] = useState(false);
 const TOKEN_KEY = "googledrivetoken"; // Consistent key for localStorage
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
  const DRIVE_SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
  const isNative = DeviceCheck();

  // Initialize Social Login
  useLayoutEffect(() => {
    SocialLogin.initialize({
      google: {
        webClientId: CLIENT_ID,
        iOSClientId: IOS_CLIENT_ID,
        iOSServerClientId: CLIENT_ID,
        mode: 'online',
      },
    }).catch(err => console.error('SocialLogin init error:', err));
  }, [isNative, CLIENT_ID, IOS_CLIENT_ID]);

  // --- Native Google Sign-In Flow ---
  const nativeGoogleSignIn = async () => {
     await SocialLogin.logout({ provider: 'google' });
    setPending(true);
    try {
      const user = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['email', 'profile', DRIVE_SCOPES],
        },
      });

      if (!user) throw new Error('No user data returned.');
      const { accessToken, idToken, profile } = user.result;

      console.log("Access token:", accessToken);
      console.log("ID token:", idToken);

      // Verify scopes on token
      fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
        .then(r => r.json())
        .then(info => {
          console.log("Token info:", info);
          if (!info.scope?.includes('drive.readonly')) {
            console.warn("⚠️ Token missing Drive scope — Drive access may fail.");
          }
        });
 
      // Save token
      const expiry = Date.now() + 3600 * 1000;
      await Preferences.set({ key: TOKEN_KEY, value: accessToken.token });
      await Preferences.set({ key: TOKEN_EXPIRY_KEY, value: expiry.toString() });

      setAccessToken(accessToken);
      setSignedIn(true);
    } catch (err) {
      console.error('Native sign-in error', err);
    } finally {
      setPending(false);
    }
  };

  // --- Check stored access token ---
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: TOKEN_KEY })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

    if (tokenValid && !accessToken) {
      setAccessToken(token);
      setSignedIn(true);
    }
    setLoading(false);
  }

  useLayoutEffect(() => {
    checkAccessToken();
  }, [currentProfile]);

  // --- Load GAPI and GIS Scripts ---
  useEffect(() => {
    const loadGapiAndDriveClient = () => {
      window.gapi.load('client:picker', () => {
        window.gapi.client.load('drive', 'v3')
          .then(() => {
            setDriveClientLoaded(true);
            console.log("GAPI client for Drive (v3) loaded.");
          })
          .catch(err => console.error("Error loading gapi.client.drive:", err));

        setGapiLoaded(true);
      });
    };

    const loadGisForPicker = () => {
      setGisLoadedForPicker(true);
      console.log("GIS OAuth2 client loaded.");
    };

    if (!window.gapi) {
      const scriptGapi = document.createElement('script');
      scriptGapi.src = 'https://apis.google.com/js/api.js';
      scriptGapi.onload = loadGapiAndDriveClient;
      document.body.appendChild(scriptGapi);
    } else {
      loadGapiAndDriveClient();
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      const scriptGis = document.createElement('script');
      scriptGis.src = 'https://accounts.google.com/gsi/client';
      scriptGis.onload = loadGisForPicker;
      document.body.appendChild(scriptGis);
    } else {
      loadGisForPicker();
    }
  }, []);

  // --- Fetch Files from Google Drive ---
  const fetchFiles = async () => {
    const token =await Preferences.get({ key: TOKEN_KEY})
 
    try{
    if (!token) return;

    setLoading(true);
    fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)', {
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: 'application/json',
      },
    })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized — invalid or expired token');
        return res.json();
      })
      .then(data => {
        console.log("Drive files:", data);
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Google Drive API error:', err);
        setLoading(false);
      });
    }catch(err){
        console.error("Error in fetchFiles:", err);
        }
  };

  useEffect(() => {
    if (accessToken) fetchFiles();
  }, [accessToken]);

  // --- File Dialog ---
  const openDialog = () => {
    let dia = { ...dialog };
    setShowFiles(true);
    dia.isOpen = true;
    dia.onClose = () => setShowFiles(false);
    dia.title = "Google Drive";

    dia.text = (
      <IonList className={isPhone ? "grid grid-cols-2 gap-2" : ""}>
        {files.map(file => (
          <IonItem
            key={file.id}
            className="rounded-box px-2 py-3 shadow-md hover:border hover:border-purple-200"
            onClick={() => {  setShowFiles(true); 
            onFilePicked(file)}}
          >
            <h5 className="text-center text-sm">{file.name}</h5>
          </IonItem>
        ))}
      </IonList>
    );

    dispatch(setDialog(dia));
  };

  return (
    <div>
      {gapiLoaded && driveClientLoaded && gisLoadedForPicker ||isNative ?(
        !accessToken ? (
          <div
            onClick={() => nativeGoogleSignIn()}
            className="btn bg-emerald-700 text-white rounded-full border-emerald-600 mont-medium flex text-center w-[90%] h-[3rem]"
          >
            Log in to Google Drive
          </div>
        ) : (
          <div
            onClick={openDialog}
            className="btn bg-emerald-700 rounded-full border-emerald-600 mont-medium flex text-center w-[90%] h-[3rem]"
          >
            <IonText class="mx-auto text-white my-auto text-[0.8rem]">
              Open Google Drive
            </IonText>
          </div>
        )
      ) : (
        <p>Loading Google Drive services...</p>
      )}
    </div>
  );
}
