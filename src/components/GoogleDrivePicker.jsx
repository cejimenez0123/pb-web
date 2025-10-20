import { useState, useEffect, useLayoutEffect, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { IonItem, IonText, IonList } from '@ionic/react';
import Context from "../context";
import DeviceCheck from './DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import { setDialog } from '../actions/UserActions';

export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {


  const { dialog, isPhone, currentProfile } = useContext(Context);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [driveClientLoaded, setDriveClientLoaded] = useState(false);
  const [gisLoadedForPicker, setGisLoadedForPicker] = useState(false);
  const [driveTokenAvailable, setDriveTokenAvailable] = useState(false);
  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

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
      if(!accessToken){
        throw new Error("No access token returned from Google.");
      }
      // Verify scopes on token
      try{
      fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
        .then(r => r.json())
        .then(info => {
          console.log("Token info:", info);
          if (!info.scope?.includes('drive.readonly')) {
            console.warn("⚠️ Token missing Drive scope — Drive access may fail.");
          }
        });
      }catch(err){
        console.error("Error verifying token scopes:", err);
      }
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

  useLayoutEffect(() => {
    if (accessToken) fetchFiles();else checkAccessToken()
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
