import {

  IonHeader,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonTextarea,
  IonImg,
  IonCard,
  IonCardContent,
  useIonRouter,
  IonContent,
} from '@ionic/react';
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture } from "../../actions/ProfileActions";
import { signUp } from "../../actions/UserActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import Context from "../../context";
import "../../App.css";
import InfoTooltip from '../../components/InfoTooltip';
import { debounce } from 'lodash';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
  
const ProfilePicture = React.memo(({ image }) => (
  <IonImg
    src={image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
    alt="Profile preview"
    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
  />
));
export default function SignUpContainer(props) {
  const selectRef = useRef()
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [fileFind, setFile] = useState(null);
  const [pictureUrl,setPictureUrl]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [identityToken,setIdentityToken]=useState(null)
  const [email, setEmail] = useState("");

const router = useIonRouter();
const searchParams = new URLSearchParams(router.routeInfo.search);

  const dispatch = useDispatch();
useEffect(() => {
  Preferences.get({ key: "idToken" }).then(token => {
    setIdentityToken(token.value);
  });
}, []);
  const { setError, setSuccess, setSeo, seo } = useContext(Context);

  useEffect(() => {
    setSeo({
      ...seo,
      title: "Plumbum (Sign Up) - Your Writing, Your Community"
    });
  }, []);

useEffect(() => {
  const params = new URLSearchParams(router.routeInfo.search);
  const toke = params.get("token");

  if (!token && toke) setToken(toke);

  if (toke) {
    Preferences.set({ key: "token", value: toke });
  }
}, [router.routeInfo.search]);

const handleProfilePicture = (e) => {
  const file = e.target.files[0];
  if(Capacitor.isNativePlatform()){
  if (!file) return;

  if (!file.type.startsWith('image/')) {

    setError('Please upload a valid image file.');
    return;
  }

  // // revoke previous blob URL if it exists
  if (pictureUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(pictureUrl);
  }

  const newUrl = URL.createObjectURL(file);
  console.log('Preview URL:', newUrl);

  setFile(file);
  setPictureUrl(newUrl);
  setError('');
}else{
  const reader = new FileReader();
reader.onloadend = () => {
  setPictureUrl(reader.result);
  setFile(file)
  console.log(reader.result)
};

reader.readAsDataURL(file);
}
};


useEffect(() => {
  return () => {
    if (pictureUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(pictureUrl);
    }
  };
}, [pictureUrl]);



  const completeSignUp = async () => {

const identityToken = await Preferences.get({key:"idToken"}).value 
await Preferences.get(({key:"googledrivetoken"})).value
const googleId= (await Preferences.get({key:"googleId"})).value
 
      const pictureParams = fileFind ? { file:fileFind } : { profilePicture: selectedImage };
      const params = {
        email,
        idToken:identityToken,
        googleId: googleId,
        token: token,
        password,
        username,
        frequency,
        selfStatement,
        privacy: isPrivate,
        ...pictureParams
      };
    
      if(fileFind){
dispatch(uploadProfilePicture({ file:fileFind })).then(res => checkResult(res, payload => {
          params.profilePicture = payload.fileName
          dispatch(signUp(params))
  .then(res => checkResult(res, payload => {
 if (payload.profile) {
          router.push(Paths.login());
        } else {
          setSuccess(null);
          setError(payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link");
        }
  }))
  .catch(err => {
    setSuccess(null);
    setError(err?.status == 409 
      ? "Username is not unique" 
      : err?.message || "Try reusing the link"
    );
  });
//            dispatch(signUp(params)).then(res => checkResult(res, payload => {
// console.log("GFDD")
//         if (payload.profile) {
//           router.push(Paths.login());
//         } else {
//           setSuccess(null);
//           setError(payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link");
//         }

//            },err=>{
//             console.log("GERR")
//              setSuccess(null);
//       setError(err.status==409?"Username is not unique":err.message || "Try reusing the link");
//            }))
        Preferences.set({key:"firstTime",value: payload.firstTime}).then(()=>{})
   },err=>{}))
      }else{
       dispatch(signUp(params)).then(res => checkResult(res, payload => {
console.log("cddD")
        if (payload.profile) {
          router.push(Paths.login());
        } else {
          setSuccess(null);
          setError(payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link");
        }
        Preferences.set({key:"firstTime",value: payload.firstTime}).then(()=>{})
   
      }),err=>{
         setSuccess(null);
         console.log("GffdDD")
      setError(err.status==409?"Username is not unique":err.message || "Try reusing the link");
      })}
    
  
  };


  
const handlePrivate = useCallback(
  debounce(() => {
    setIsPrivate(prev => !prev);
  }, 100),
  []
);
return(<IonContent
  fullscreen
  className="ion-padding"
  style={{
    "--padding-top": "0px",
    "--padding-bottom": "env(safe-area-inset-bottom)"
  }}
>
   <div className="mb-10 text-center">
      <h1 className="text-emerald-800 mx-auto text-2xl font-semibold">
        Complete Sign Up
      </h1>
    </div>

  <div className="max-w-xl mx-auto px-5 pt-16 pb-32">

    {/* Header */}
   
    <IonCard className="shadow-none bg-transparent">
      <IonCardContent className="space-y-8">

        {/* Username */}
        <div className="space-y-2">
          <IonInput
            label="Username"
            labelPlacement="stacked"
            className="border-b border-emerald-300 text-emerald-800 pb-2"
            value={username}
            placeholder="username"
            onIonInput={e =>
              setUsername((e.detail?.value ?? e.target.value ?? "").trim())
            }
          />
          {username.length !== 0 && username.length < 4 && (
            <IonText color="danger">
              <p className="text-sm">Minimum username length is 4 characters</p>
            </IonText>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <IonInput
            label="Password"
            labelPlacement="stacked"
            type="password"
            className="border-b border-emerald-300 text-emerald-800 pb-2"
            value={password}
            onIonInput={e =>
              setPassword((e.detail?.value ?? e.target.value ?? "").trim())
            }
            placeholder="password"
          />
          {password.length > 0 && password.length <= 6 && (
            <IonText color="danger">
              <p className="text-sm">Minimum password length is 6 characters</p>
            </IonText>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <IonInput
            label="Confirm Password"
            type="password"
            labelPlacement="stacked"
            className="border-b border-emerald-300 text-emerald-800 pb-2"
            value={confirmPassword}
            onIonInput={e =>
              setConfirmPassword((e.detail?.value ?? e.target.value ?? "").trim())
            }
            placeholder="confirm password"
          />
          {password !== confirmPassword && (
            <IonText color="danger">
              <p className="text-sm">Passwords need to match</p>
            </IonText>
          )}
        </div>

        {/* Privacy */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <InfoTooltip text="Will your account be private?" />
            <IonText className="text-emerald-800 font-medium">
              Private Account
            </IonText>
          </div>

          <div
            onClick={handlePrivate}
            className="flex items-center gap-3 cursor-pointer"
          >
            <IonText className="text-emerald-700 font-semibold">
              {isPrivate ? "Yes" : "No"}
            </IonText>
            <input
              type="checkbox"
              className="accent-emerald-600 scale-110"
              checked={isPrivate}
              onClick={handlePrivate}
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="space-y-4">
          <IonLabel className="text-lg text-emerald-800 font-medium block">
            Profile Picture
          </IonLabel>

          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-emerald-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-emerald-100 file:text-emerald-700"
            onChange={handleProfilePicture}
          />

          <div className="flex justify-center pt-2">
            <ProfilePicture image={pictureUrl} />
          </div>
        </div>

        {/* Email Frequency */}
        <div className="space-y-2">
          <IonLabel className="text-lg text-emerald-800 font-medium block">
            Email Frequency
          </IonLabel>
          <select
            className="w-full rounded-lg bg-emerald-50 text-emerald-700 px-4 py-3 border border-emerald-200"
            value={frequency}
            ref={selectRef}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value={1}>Daily</option>
            <option value={2}>Every 3 days</option>
            <option value={3}>Weekly</option>
            <option value={14}>Every 2 Weeks</option>
            <option value={30}>Monthly</option>
          </select>
        </div>

        {/* Self Statement */}
        <div className="space-y-2">
          <IonLabel className="text-lg text-emerald-800 font-medium block">
            Self Statement
          </IonLabel>
          <IonTextarea
            placeholder="What are you about?"
            rows={5}
            autoGrow
            className="bg-emerald-50 p-4 w-full text-emerald-800 rounded-lg"
            value={selfStatement}
            maxlength={250}
            onIonInput={e =>
              setSelfStatement((e.detail?.value ?? e.target.value ?? "").trim())
            }
          />
        </div>

        {/* Submit */}
        <div className="pt-6">
          <div
            onClick={completeSignUp}
            className="w-full bg-emerald-700 text-white text-center py-4 rounded-full cursor-pointer hover:bg-emerald-500 transition text-lg font-medium"
          >
            Join Plumbum!
          </div>
        </div>

      </IonCardContent>
    </IonCard>
  </div>
</IonContent>)
// return (
//   <IonContent style={{"--padding-bottom":"8em","--padding-top":"4em"}}>
    

//       {/* Header */}
//       <IonHeader className="bg-opacity-80 rounded-lg">
//         <IonTitle className="text-green-800 text-center text-xl">
//           Complete Sign Up
//         </IonTitle>
//       </IonHeader>
// <div className="max-w-xl mx-auto px-4 pt-20 pb-24">
//       <IonCard className="mt-6 shadow-none bg-transparent">
//         <IonCardContent className="space-y-6">

//           {/* Username */}
//           <div>
//             <IonInput
//               label="Username"
//               labelPlacement="stacked"
//               className="border-b border-emerald-300 text-emerald-800"
//               value={username}
//               placeholder="username"
//                  onIonInput={e => setUsername((e.detail?.value ?? e.target.value ?? "").trim())}
            
//             />
//             {username.length !== 0 && username.length < 4 && (
//               <IonText color="danger">
//                 <p className="text-sm mt-1">
//                   Minimum username length is 4 characters
//                 </p>
//               </IonText>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <IonInput
//               label="Password"
//               labelPlacement="stacked"
//               type="password"
//               className="border-b border-emerald-300 text-emerald-800"
//               value={password}
         
//                  onIonInput={e => setPassword((e.detail?.value ?? e.target.value ?? "").trim())}
//               placeholder="password"
//             />
//             {password.length > 0 && password.length <= 6 && (
//               <IonText color="danger">
//                 <p className="text-sm mt-1">
//                   Minimum password length is 6 characters
//                 </p>
//               </IonText>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <IonInput
//               label="Confirm Password"
//               type="password"
//               labelPlacement="stacked"
//               className="border-b border-emerald-300 text-emerald-800"
//               value={confirmPassword}
//                  onIonInput={e => setConfirmPassword((e.detail?.value ?? e.target.value ?? "").trim())}
          
//               placeholder="confirm password"
//             />
//             {password !== confirmPassword && (
//               <IonText color="danger">
//                 <p className="text-sm mt-1">
//                   Passwords need to match
//                 </p>
//               </IonText>
//             )}
//           </div>

//           {/* Privacy Toggle */}
//           <div className="flex items-center justify-between pt-2">
//             <div className="flex items-center gap-2">
//               <InfoTooltip text="Will your account be private?" />
//               <IonText className="text-emerald-800 font-medium">
//                 Private Account
//               </IonText>
//             </div>

//             <div
//               onClick={handlePrivate}
//               className="flex items-center gap-2 cursor-pointer"
//             >
//               <IonText className="text-emerald-700 font-semibold">
//                 {isPrivate ? "Yes" : "No"}
//               </IonText>
//               <input
//                 type="checkbox"
//                 className="accent-emerald-600 cursor-pointer"
//                 checked={isPrivate}
//                 onClick={handlePrivate}
//               />
//             </div>
//           </div>

//           {/* Profile Picture */}
//           <div>
//             <IonLabel className="text-lg text-emerald-800 font-medium block mb-2">
//               Profile Picture
//             </IonLabel>
//             <input
//               type="file"
//               accept="image/*"
//               className="block w-full text-sm text-emerald-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-100 file:text-emerald-700"
//               onChange={(e) => handleProfilePicture(e)}
//             />
//             <div className="mt-4 flex justify-center">
//               <ProfilePicture image={pictureUrl} />
//             </div>
//           </div>

//           {/* Email Frequency */}
//           <div>
//             <IonLabel className="text-lg text-emerald-800 font-medium block mb-2">
//               Email Frequency
//             </IonLabel>
//             <select
//               className="w-full rounded-lg bg-emerald-50 text-emerald-700 px-4 py-2 border border-emerald-200"
//               value={frequency}
//               ref={selectRef}
//               onChange={(e) => setFrequency(e.target.value)}
//             >
//               <option value={1}>Daily</option>
//               <option value={2}>Every 3 days</option>
//               <option value={3}>Weekly</option>
//               <option value={14}>Every 2 Weeks</option>
//               <option value={30}>Monthly</option>
//             </select>
//           </div>

//           {/* Self Statement */}
//           <div>
//             <IonLabel className="text-lg text-emerald-800 font-medium block mb-2">
//               Self Statement
//             </IonLabel>
//             <IonTextarea
//               placeholder="What are you about?"
//               rows={5}
//               autoGrow={true}
//               className="bg-emerald-50 p-3 w-full text-emerald-800 rounded-lg"
//               value={selfStatement}
//               maxlength={250}
//     onIonInput={e => setSelfStatement((e.detail?.value ?? e.target.value ?? "").trim())}
//             />
//           </div>

//           {/* Submit */}
//           <div
//             onClick={completeSignUp}
//             className="mt-6 bg-emerald-700 text-white text-center py-3 rounded-full cursor-pointer hover:bg-emerald-500 transition"
//           >
//             Join Plumbum!
//           </div>

//         </IonCardContent>
//       </IonCard>
//     </div>
//   </IonContent>
// );
}
