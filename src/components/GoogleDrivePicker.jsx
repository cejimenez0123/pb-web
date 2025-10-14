
import React, { useState, useLayoutEffect,useEffect, useRef, useContext } from 'react';
import { IonList, IonItem, IonLabel, IonImg, IonText, IonGrid } from '@ionic/react';
import GoogleLogin from './GoogleLogin';
import DeviceCheck from './DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import Context from '../context';
import { setDialog } from '../actions/UserActions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
export default function GoogleDrivePicker({ onFilePicked }) {
    const {dialog,isPhone} = useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const isNative = DeviceCheck();
    const [showFiles,setShowFiles]=useState(true)
  const googleButtonRef = useRef(null);
  
  const driveTokenKey = 'googledrivetoken';

  // Check stored access token and user sign-in on mount
  useLayoutEffect(() => 
    {
   
    checkAccessToken();
    return async ()=>{
      const token = (await Preferences.get({ key: driveTokenKey })).value;
      const tokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
      const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);
      
      tokenValid?setAccessToken(token):null
    }
  }, [currentProfile]);
  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: 'googledrivetoken_expiry' })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

    if (tokenValid&&!accessToken) {
      setAccessToken(token);
      setSignedIn(true);
    }
    setLoading(false)
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
      setLoading(false)
    }
  };
  const openDialog=()=>{
  
    let dia = {...dialog}
    setShowFiles(true)
    dia.isOpen =true

    dia.onClose=()=>{setShowFiles(false)}
    dia.title="Google Drive"
     dia.text=isNative||isPhone?


     <IonList className="grid grid-cols-2 gap-2  ">
            {files.map((file) => (<IonItem class="col " ng-repeat="letter in letters" className="rounded-box  p-3 shadow-md hover:border hover:border-purple-200">
          
          <h5 className="text-center text-sm" >{file.name}</h5>
      </IonItem>))}
    </IonList>

:<IonList >
        
      {files.map((file) => (
        <IonItem  className="flex btn flex-col my-4 items-center rounded-full rounded-box max-w-[20rem] bg-transparent text-emerald-800 shadow-md hover:bg-purple-200 transition "

        
        key={file.id} onClick={() =>{
            setShowFiles(true); 
            onFilePicked(file)}}
            >
             
          <h5 className="text-center text-sm" >{file.name}</h5>
   
        </IonItem>
      ))}

    </IonList>
    dispatch(setDialog(dia))
  }
  if (loading) return <p>Loading files...</p>;
console.log("Access",accessToken)
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
 
