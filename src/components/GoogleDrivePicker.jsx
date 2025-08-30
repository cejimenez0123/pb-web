
import React, { useState, useEffect, useRef, useContext } from 'react';
import { IonList, IonItem, IonLabel, IonImg, IonText } from '@ionic/react';
import GoogleLogin from './GoogleLogin';
import DeviceCheck from './DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import Context from '../context';
import { setDialog } from '../actions/UserActions';
import { useDispatch } from 'react-redux';
export default function GoogleDrivePicker({ onFilePicked }) {
    const {dialog} = useContext(Context)
    const dispatch = useDispatch()
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const isNative = DeviceCheck();
    const [showFiles,setShowFiles]=useState(true)
  const googleButtonRef = useRef(null);
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const driveTokenKey = 'googledrivetoken';

  // Check stored access token and user sign-in on mount
  useEffect(() => {
  
    checkAccessToken();
  }, []);
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
console.log("SDF",token)
    if (tokenValid) {
      setAccessToken(token);
      setSignedIn(true);
    }
  }
  // Fetch files from Google Drive when access token changes or user is signed in
  useEffect(() => {
    if (!accessToken) return;

    setLoading(true);
    fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.document"&fields=files(id,name,mimeType,iconLink)',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Google Drive API error:', err);
        setLoading(false);
      });
  }, [accessToken]);

  // Callback when GoogleLogin successfully signs in and provides token
  const handleUserSignIn = ({ driveAccessToken }) => {

    if (driveAccessToken) {
      setAccessToken(driveAccessToken);
      setSignedIn(true);
    }
  };
  const openDialog=()=>{
  
    let dia = {...dialog}
    setShowFiles(true)
    dia.isOpen =true

    dia.onClose=()=>{setShowFiles(false)}
    dia.title="Google Drive"
     dia.text=<IonList className='drive-grid-container'>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <IonItem  className="flex flex-col items-center bg-emerald-100 rounded-box shadow-md hover:bg-base-200 transition min-h-[140px]"
        lines="none"
        style={{ minWidth: 0 }}
        button key={file.id} onClick={() =>{
            setShowFiles(true); 
            onFilePicked(file)}}
            >
             
          {/* <IonThumbnail slot="start" className=' bg-emerald-100 border-none mx-auto my-3' > */}
            <IonImg className="mx-auto w-full h-full min-h-[110px]" src={file.iconLink} alt={file.name} />
          {/* </IonThumbnail> */}
          <IonLabel style={{height:"10em"}} className="text-center text-sm  max-w-18" >{file.name}</IonLabel>
   
        </IonItem>
      ))}
      </div>
    </IonList>
    dispatch(setDialog(dia))
  }
  if (loading) return <p>Loading files...</p>;

  if (!accessToken) {
    return (
      <div className="min-h-24 p-4">
        <IonText>Please sign in to Google Drive to import your documents.</IonText>
        <GoogleLogin onUserSignIn={({driveAccessToken})=>{handleUserSignIn({driveAccessToken})}} />
      </div>
    );
  }

  if (files.length === 0) {
    return <p>No Google Docs found in your Drive.</p>;
  }

  return <button className="text-white bg-emerald-600 w-[20rem] h-12 rounded-full"onClick={()=>{openDialog()}}>Open Files</button>

}
 
