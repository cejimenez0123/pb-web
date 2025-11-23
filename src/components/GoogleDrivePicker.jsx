import { useState, useEffect, useLayoutEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { IonItem, IonText, IonList } from '@ionic/react';
import Context from "../context";
import DeviceCheck from './DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import { setDialog } from '../actions/UserActions';
import { Capacitor } from '@capacitor/core';
import GoogleLogin from './GoogleLogin';
import Enviroment from '../core/Enviroment';

export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {


  const { dialog, isPhone, currentProfile } = useContext(Context);
  const dispatch = useDispatch();
  // const [loading, setLoading] = useState(false);

//   const [signedIn, setSignedIn] = useState(false);
//   const [showFiles, setShowFiles] = useState(false);
// const navigate = useNavigate()
//   const [gapiLoaded, setGapiLoaded] = useState(false);
//   const [driveClientLoaded, setDriveClientLoaded] = useState(false);
//   const [gisLoadedForPicker, setGisLoadedForPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
   const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
     

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
  }, [CLIENT_ID, IOS_CLIENT_ID]);

  // --- Native Google Sign-In Flow ---
const nativeGoogleSignIn = async () => {
    try {
      SocialLogin.logout({provider:"google"})
      SocialLogin.refresh()
      const user = await SocialLogin.login({
        provider:"google",
        options:{
          scopes:["email","profile", "https://www.googleapis.com/auth/drive.readonly"]
        }
        // options: {
        //   scopes: ["email", "profile", "https://www.googleapis.com/auth/drive.readonly"],
        // },
        
        
      }).catch((err) => console.error("SocialLogin error:", err));
      console.log("USDSD",user)
      if (!user.result) throw new Error("No user data returned.")
      const { accessToken } = user.result;
      const expiry = Date.now() + 3600 * 1000;
console.log("Acccess",accessToken)
  
      setAccessToken(accessToken.token);
     await Preferences.set({key:driveTokenKey,value:accessToken.token})
  await Preferences.set({key:TOKEN_EXPIRY_KEY,value:expiry})
    } catch (err) {
      console.log(err)
      // window.alert("!",err.message)
      console.error("Native sign-in error", err);
   
    } 
  };

  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

  
      setAccessToken(token);
 
    
  }

useEffect(() => {
  const initGapi = async () => {
    if (!window.gapi) {
      console.warn("⏳ GAPI script not found yet, retrying...");
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        window.gapi.load('client:picker', {
          callback: resolve,
          onerror: () => reject(new Error("Failed to load gapi client modules")),
          timeout: 5000,
          ontimeout: () => reject(new Error("Timed out loading gapi")),
        });
      });

      await window.gapi.client.load('drive', 'v3');
      
      setGapiLoaded(true);
      setDriveClientLoaded(true);
    } catch (err) {
      console.error("❌ Error initializing GAPI:", err);
    }
  };

  const loadGapiScript = () => {
    if (window.gapi) {
      initGapi();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = initGapi;
    script.onerror = () => console.error("❌ Failed to load gapi script");
    document.body.appendChild(script);
  };

  const loadGisScript = () => {

    if (window.google?.accounts?.oauth2) {
      setGisLoadedForPicker(true);
      console.log("✅ GIS (Google Identity Services) already loaded");
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGisLoadedForPicker(true);
      console.log("✅ GIS OAuth2 client loaded");
    };
    script.onerror = () => console.error("❌ Failed to load GIS script");
    document.body.appendChild(script);
  };
if(!Capacitor.isNativePlatform()&&false){
  loadGapiScript();
  loadGisScript();
}

}, []);


  // --- Fetch Files from Google Drive ---
  const fetchFiles = async () => {
    const token =(await Preferences.get({ key: driveTokenKey})).value
    console.log("REERER",token)
    try{
    if (!token) return;

    // setLoading(true);
   fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)', {
      headers: {
        Authorization: `Bearer ${token}`,
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
       
      })
      .catch(err => {
        console.error('Google Drive API error:', err);
        // setLoading(false);
      });
    }catch(err){
        console.error("Error in fetchFiles:", err);
        }
  };
// const fetchFiles = async () => {
//     const token =(await Preferences.get({ key: driveTokenKey}))v
 
//     try{
//     if (!token) return;

//     setLoading(true);
//     fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)', {
//       headers: {
//         Authorization: `Bearer ${token.value}`,
//         Accept: 'application/json',
//       },
//     })
//       .then(res => {
//         if (res.status === 401) throw new Error('Unauthorized — invalid or expired token');
//         return res.json();
//       })
//       .then(data => {
//         // console.log("Drive files:", data);
//         setFiles(data.files || []);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Google Drive API error:', err);
//         setLoading(false);
//       });
//     }catch(err){
//         console.error("Error in fetchFiles:", err);
//         }
//   };
  useLayoutEffect(() => {
    if (accessToken) fetchFiles();else checkAccessToken()
  }, [accessToken]);

  // --- File Dialog ---
  const openDialog = () => {
    let dia = { ...dialog };
    // setShowFiles(true);
    dia.isOpen = true;
    dia.onClose = () => dispatch(setDialog({isOpen:false}))
    dia.title = "google Drive";

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
    
        {!accessToken ? (
          // <GoogleLogin  drive={true}/>
          <div
            onClick={nativeGoogleSignIn}
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
        )}
      
   
    </div>
  );
}
