import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonCheckbox,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonRow,
  IonCol,
} from '@ionic/react';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture } from "../../actions/ProfileActions";
import { signUp } from "../../actions/UserActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import info from "../../images/icons/info.svg";
import Context from "../../context";
import "../../App.css";
import GoogleLogin from "../../components/GoogleLogin";
import InfoTooltip from '../../components/InfoTooltip';
import setLocalStore from '../../core/setLocalStore';
import getLocalStore from '../../core/getLocalStore';
import DeviceCheck from '../../components/DeviceCheck';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import { debounce } from 'lodash';

export default function SignUpContainer(props) {
  const isNative = DeviceCheck()
  const selectRef = useRef()
  const [token, setToken] = useState('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [file, setFile] = useState(null);
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [googleID, setGoogleID] = useState(null);
  const [identityToken,setIdentityToken]=useState(null)
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
   getLocalStore("idToken").then(token=>{
    setIdentityToken(token)
   })
  const { setError, setSuccess, setSeo, seo } = useContext(Context);

  useEffect(() => {
    setSeo({
      ...seo,
      title: "Plumbum (Sign Up) - Your Writing, Your Community"
    });
  }, [setSeo, seo]);

  useEffect(() => {
    setToken(token);
    setLocalStore("token",token,isNative)
  }, [searchParams, token]);

  const handleFileInput = (e) => {
    const img = e.target.files[0];
    if (img) {
      if (!img.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        setSuccess(null);
        setSelectedImage(null);
        return;
      }
      setFile(img);
      setError(null);
      setSelectedImage(URL.createObjectURL(img));
    }
  };

  const completeSignUp = async () => {
    let toke = searchParams.get("token") || token;
    if (await getLocalStore("googledrivetoken",isNative)||await getLocalStore("idToken",isNative) || (password.length > 6 && username.length > 3)) {
      const pictureParams = file ? { file } : { profilePicture: selectedImage };
      const params = {
        email,
        idToken:identityToken,
        googleId: googleID,
        token: toke,
        password,
        username,
        frequency,
        selfStatement,
        privacy: isPrivate,
        ...pictureParams
      };
      const uploadAction = file
        ? dispatch(uploadProfilePicture({ file })).then(res => checkResult(res, payload => {
          params.profilePicture = payload.fileName;
          return dispatch(signUp(params));
        }))
        : dispatch(signUp(params));

      uploadAction.then(res => checkResult(res, payload => {
        setLocalStore("firstTime", payload.firstTime,isNative)
   
        if (payload.profile) {
          navigate(Paths.myProfile());
        } else {
          setSuccess(null);
          setError(payload.error || "Try reusing the link");
        }
      }, err => {
        setSuccess(null);
        setError(err.message || err);
      }));
    } else {
      setError("Password and Username can't be empty");
    }
  };
  const handlePrivate=debounce(()=>{

  setIsPrivate(!isPrivate)
  },100)
  return (
    
      
      <IonContent fullscreen className="ion-padding pt-8">
        <IonHeader className="bg-emerald-700 bg-opacity-80 rounded-lg max-w-[96%] md:max-w-[42em] md:px-12 mx-auto">
        <IonTitle className="text-green-800 text-center ">
          Complete Sign Up
        </IonTitle>
      </IonHeader>
        <IonCard style={{maxWidth:"30rem"}} className="mx-auto shadow-none bg-transparent">
          <IonCardContent>
         
            <IonItem className="input rounded-full bg-transparent border-emerald-200 border-2  mt-4 flex items-center">
                <IonInput
                label='username'
                labelPlacement='stacked'
                className="text-emerald-800 border  rounded-full border-emerald-100 "
                value={username}
                placeholder="username"
                onIonInput={e => setUsername(e.detail.value.trim())}
              />
            </IonItem>
            {username.length !== 0 && username.length < 4 && (
              <IonText color="danger">
                <h6>Minimum username length is 4 characters</h6>
              </IonText>
            )}
               <div className='w-[12rem] flex-col flex justify-center mx-auto'>
           {googleID||identityToken? null:<>
           <GoogleLogin onUserSignIn={({email,
                                googleId,
                                driveAccessToken})=>{
setGoogleID(googleId)
setEmail(email)

                                }}
                                  />
                             
            <AppleSignInButton onUserSignIn={({idToken,email})=>{
              setEmail(email)
              setLocalStore("idToken",idToken,isNative)
            
            }}/></>}
      </div>
         
              {googleID||identityToken?null:<>
               <IonItem className="input rounded-full bg-transparent border-emerald-200 border-2  mt-4 flex items-center">
               
                   <IonInput
                label='Password'
                labelPlacement='stacked'
                className="text-emerald-800 border rounded-full border-emerald-100 "
                value={password}
                onIonInput={e => setPassword(e.detail.value.trim())}
                placeholder="password"
              />
              
                </IonItem>
                {(password.length > 0 && password.length <= 6) && (
                  <IonText color="danger">
                    <h6>Minimum Password Length is 6 characters</h6>
                  </IonText>
                )}
                  <IonItem className="input rounded-full bg-transparent border-emerald-200 border-2  mt-4 flex items-center">
                  <IonInput
                    label='Confirm Password'
                    type="password"
                    labelPlacement='stacked'
                  
                    value={confirmPassword}
                    onIonInput={e => setConfirmPassword(e.detail.value.trim())}
                    placeholder="password"
                  />
                </IonItem>
                {password !== confirmPassword && (
                  <IonText color="danger">
                    <h6>Passwords need to match</h6>
                  </IonText>
                )}
              </>}
            {/* )} */}
            <IonItem
  lines="none"
  className="w-full mt-8 ion-align-items-center"
>
  <div className="flex flex-row pt-8 items-center gap-3"> 
  
    <InfoTooltip text="Will your account be private?" />

    

  
    <div className='flex flex-row'  >
    <IonText className="my-auto">Is Private?</IonText>
    
    {/* Yes/No status */}
    <div >
    <IonText 
    onClick={handlePrivate}
    className="my-auto min-w-10 ml-4">
      {isPrivate ? "Yes" : "No"}
    </IonText>
    </div>
     <input

    id="ion-cb-1"
      // slot="start"
type='checkbox'
     
      className='my-auto   mx-6'
      checked={isPrivate}
      onClick={handlePrivate}
   
    /> 
   
    </div>
  </div>
</IonItem>


            
            <IonItem lines="none" className="flex i flex-col w-[100vw] mx-auto mt-8">
              <IonLabel className=" text-xl text-left pb-2">
                Add a Profile Picture
              </IonLabel>
              <input
                className="file-input mt-4 text-center  mx-auto w-[20em] sm:w-72"
                type="file"
                accept="image/*"
                onInput={handleFileInput}
              />
              {selectedImage && (
                <div style={{ marginTop: '20px' }}>
                  <IonImg
                    src={selectedImage}
                    alt="Selected"
                    style={{ maxWidth: '10em', maxHeight: '300px', borderRadius: '10px',margin:"auto" }}
                  />
                </div>
              )}
            </IonItem>
            <IonItem className="mb-4 flex flex-row justify-between">
              <IonLabel className="block  mont-medium text-[1.2rem] font-semibold mb-2">
                Email Frequency
              </IonLabel>
                       <select
            className="w-full bg-white select text-emerald-700 mont-medium select-bordered "
            value={frequency}
            ref={selectRef}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option className="text-emerald-700" value={1}>daily</option>
            <option  className="text-emerald-700" value={2}>Every 3 days</option>
            <option  className="text-emerald-700" value={3}>Weekly</option>
            <option  className="text-emerald-700" value={14}>Every 2 Weeks</option>
            <option  className="text-emerald-700" value={30}>Monthly</option>

          </select>
            </IonItem>
            <IonLabel className="text-left w-full text-xl mb-2">
              Self Statement
            </IonLabel>
            <IonTextarea
              placeholder="What are you about?"
              className="textarea bg-transparent border w-full border-white text-md lg:text-l"
              value={selfStatement}
              onIonInput={e => setSelfStatement(e.detail.value)}
            />
           
<div onClick={completeSignUp} className='bg-green-700 btn  flex flex-row mx-auto mb-12 border border-emerald-600 rounded-full hover:bg-emerald-400'>
              <IonText className="text-white mx-auto my-auto text-xl">Join Plumbum!</IonText>
          
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
 
  );
}



//     </div>
//     <div className="mb-8 flex flex-col mx-auto">
//       <label className="flex font-bold text-white lora-medium text-xl text-left pb-2 flex-col">
//         Add a Profile Picture
//         </label>
//     <input
//     className="file-input my-8 mx-auto text-left  max-w-[90%] lg:w-72 mx-auto"
//         type="file"
//         accept="image/*"
//         onInput={handleFileInput}
//       />
//    </div>   
// {/* </label> */}
// <div className="max-w-72 mx-auto mb-8">
//       {selectedImage && (
//         <div style={{ marginTop: '20px' }}>
          
//           <img
//           className="mx-auto"
//             src={selectedImage}
//             alt="Selected"
//             style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
//           />
//         </div>
        
//       )}
//       </div>
//       <div>
//       <div className="mb-4 flex flex-row justify-between">
//           <label className="block text-white mont-medium text-[1.5rem] font-semibold mb-2">
//             Email Frequency
//           </label>
//           <select
//             className="w-full bg-white select text-emerald-700 mont-medium select-bordered "
//             value={frequency}
//             ref={selectRef}
//             onChange={(e) => setFrequency(e.target.value)}
//           >
//             <option className="text-emerald-700" value={1}>daily</option>
//             <option  className="text-emerald-700" value={2}>Every 3 days</option>
//             <option  className="text-emerald-700" value={3}>Weekly</option>
//             <option  className="text-emerald-700" value={14}>Every 2 Weeks</option>
//             <option  className="text-emerald-700" value={30}>Monthly</option>

//           </select>
//         </div>
//       </div>
//       <label className="text-left  min-w-[100%] text-white mx-auto lora-medium text-xl font-bold  mb-2">Self Statement </label> 
//       <textarea 
//       placeholder="What are you about?"
//       className="textarea bg-transparent border w-[100%]  border-white text-md lg:text-l" value={selfStatement} onChange={(e)=>setSelfStatement(e.target.value)}/>
//          <div
//             disabled={confirmPassword!==password&&username.length>4}
//             className='bg-green-600 mont-medium text-white max-w-[18em] mx-auto mb-12 flex border hover:bg-emerald-400 bg-gradient-to-r from-emerald-300  to-emerald-500  border-0 text-white py-2 rounded-full px-4 mt-8 min-h-14 '
//                onClick={completeSignUp}
                
//                  ><h6 className="mx-auto my-auto py-4 px-1 text-xl">Join Plumbum!</h6></div>
//             </div>
            
//             </div>   
//      )
// }