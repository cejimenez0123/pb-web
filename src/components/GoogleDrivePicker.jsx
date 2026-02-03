import { useState, useLayoutEffect,  useContext } from 'react';
import { useDispatch } from 'react-redux';
import { SocialLogin } from "@capgo/capacitor-social-login";
import { IonText, IonList, IonContent, IonInfiniteScroll, } from '@ionic/react';
import Context from "../context";

import { Preferences } from '@capacitor/preferences';
import Googlelogo from "../images/logo/googlelogo.png";
import { useDialog } from '../domain/usecases/useDialog';
export default function GoogleDrivePicker({ onFilePicked, onReauthenticateNeeded }) {


  const { dialog, isPhone, } = useContext(Context);
  const dispatch = useDispatch();
  const [files, setFiles] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
   const driveTokenKey = "googledrivetoken";
   const TOKEN_EXPIRY_KEY = "googledrivetoken_expiry"; // Key for expiry time
  const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
  const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;
   const {openDialog,closeDialog}=  useDialog()

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
     
      const user = await SocialLogin.login({
        provider:"google",
        options:{
          scopes:["email","profile", "https://www.googleapis.com/auth/drive.readonly"]
        }
    
        
        
      }).catch((err) => console.error("SocialLogin error:", err));
     
      if (!user.result) throw new Error("No user data returned.")
      const { accessToken } = user.result;
      const expiry = Date.now() + 3600 * 1000;

      setAccessToken(accessToken.token);
     await Preferences.set({key:driveTokenKey,value:accessToken.token})
  await Preferences.set({key:TOKEN_EXPIRY_KEY,value:expiry})
  fetchFiles()
    } catch (err) {
      console.log(err)
      console.error("Native sign-in error", err);
   
    } 
  };

  async function checkAccessToken() {
    const token = (await Preferences.get({ key: driveTokenKey })).value;
    const tokenExpiry = (await Preferences.get({ key: TOKEN_EXPIRY_KEY })).value;
    const tokenValid = token && tokenExpiry && Date.now() < parseInt(tokenExpiry, 10);

    if(tokenValid){
      setAccessToken(token);
    }else{
      setAccessToken(null)
    }
    
  }


const fetchFiles = async () => {
    const token =(await Preferences.get({ key: driveTokenKey})).value

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
        
        setFiles(data.files || []);
     
      })
      .catch(err => {
        console.error('Google Drive API error:', err);
        setAccessToken(null)
        // setLoading(false);
      });
    }catch(err){
        console.error("Error in fetchFiles:", err);
            setAccessToken(null)
        }
  };
  useLayoutEffect(() => {
    fetchFiles()
  }, [accessToken]);
  useLayoutEffect(()=>{
    checkAccessToken()
  },[])
  // --- File Dialog ---
  const open = () => {
  openDialog({
    title: null,
    text: (
      <div
        style={{ "--background": "#f4f4e0" }}
        className="bg-cream"
      >
        {/* Scrollable grid container */}
        <div
          className={`overflow-y-auto ${isPhone ? "grid grid-cols-2 gap-2" : "grid gap-2"}`}
          style={{ maxHeight: "70vh" }} // limits height so content scrolls
        >
          {files.map(file => (
            <div
              key={file.id}
              className="px-2 py-2 flex border w-[100%] rounded-box shadow-sm border-blueSea border-opacity-20 hover:border-blueSea "
              onClick={() => onFilePicked(file)}
            >
              {/* <div className="te  p-2 "> */}
                <h5 className="mx-auto p-2 my-auto text-center bg-cream text-sm">
                  {file.name}
                </h5>
              {/* </div> */}
            </div>
          ))}
        </div>
      </div>
    ),
    breakpoint: 1,
    disagreeText: "Close",
  });
};




  return (
    <button 
  onClick={!accessToken ? () => nativeGoogleSignIn() : () => open()}  
  className={`
    flex items-center justify-start text-center 
     btn
    w-[88%] md:w-[90%] md:mx-auto h-[3.5rem] max-w-[24em]
    rounded-xl border-2 overflow-hidden
    ${accessToken 
      ? "bg-emerald-600 border-emerald-600 text-white" 
      : " bg-white border-cream text-emerald-800"
    } 
    hover:bg-emerald-500 transition-all
  `}
>
  
    {!accessToken? (
      <div className="flex jutify-around w-[84%] flex-nowrap  text-center flex-row max-w-[24em]  ">
        <div className='flex flex-row w-[80%] mx-auto'>
     <img src={Googlelogo} 
          className={`flex-shrink-auto my-auto max-h-6 `} />

       <IonText
          className={`${!accessToken?"text-emerald-800 ":"text-white bg-soft"} mx-4 margin-y-auto  whitespace-nowrap my-auto text-[1.2em]`}
            >
       
            Log in to Google Drive
          </IonText> 
      </div>
      </div> 
    ) : (
      <IonText className="text-[1.1rem] mx-auto font-medium whitespace-nowrap">
       Upload from Google Drive
      </IonText>
    )}
 
</button>

  );
}
