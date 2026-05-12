// import {

//   IonHeader,
//   IonTitle,
//   IonItem,
//   IonLabel,
//   IonInput,
//   IonText,
//   IonTextarea,
//   IonImg,
//   IonCard,
//   IonCardContent,
//   useIonRouter,
//   IonContent,
// } from '@ionic/react';
// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { uploadProfilePicture } from "../../actions/ProfileActions";
// import { signUp } from "../../actions/UserActions";
// import checkResult from "../../core/checkResult";
// import Paths from "../../core/paths";
// import Context from "../../context";
// import { useAlert } from "../../core/useAlert.jsx";
// import AlertType from "../../core/AlertType.js";
// import "../../App.css";
// import InfoTooltip from '../../components/InfoTooltip';
// import { debounce } from 'lodash';
// import { Preferences } from '@capacitor/preferences';
// import { Capacitor } from '@capacitor/core';
  
// const ProfilePicture = React.memo(({ image }) => (
//   <IonImg
//     src={image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
//     alt="Profile preview"
//     style={{ width: '150px', height: '150px', borderRadius: '50%' }}
//   />
// ));
// export default function SignUpContainer(props) {
//   const selectRef = useRef()
//   const [token, setToken] = useState(null);
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
//   const [selfStatement, setSelfStatement] = useState("");
//   const [fileFind, setFile] = useState(null);
//   const [pictureUrl,setPictureUrl]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
//   const [frequency, setFrequency] = useState(1);
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [identityToken,setIdentityToken]=useState(null)
//   const [email, setEmail] = useState("");

// const router = useIonRouter();
// const searchParams = new URLSearchParams(router.routeInfo.search);

//   const dispatch = useDispatch();
// useEffect(() => {
//   Preferences.get({ key: "idToken" }).then(token => {
//     setIdentityToken(token.value);
//   });
// }, []);
//   const { setSeo, seo } = useContext(Context);
//   const { showAlert } = useAlert();

//   useEffect(() => {
//     setSeo({
//       ...seo,
//       title: "Plumbum (Sign Up) - Your Writing, Your Community"
//     });
//   }, []);

// useEffect(() => {
//   const params = new URLSearchParams(router.routeInfo.search);
//   const toke = params.get("token");

//   if (!token && toke) setToken(toke);

//   if (toke) {
//     Preferences.set({ key: "token", value: toke });
//   }
// }, [router.routeInfo.search]);

// const handleProfilePicture = (e) => {
//   const file = e.target.files[0];
//   if(Capacitor.isNativePlatform()){
//   if (!file) return;

//   if (!file.type.startsWith('image/')) {

//     showAlert({ message: 'Please upload a valid image file.', type: AlertType.error });
//     return;
//   }

//   // // revoke previous blob URL if it exists
//   if (pictureUrl?.startsWith('blob:')) {
//     URL.revokeObjectURL(pictureUrl);
//   }

//   const newUrl = URL.createObjectURL(file);
//   console.log('Preview URL:', newUrl);

//   setFile(file);
//   setPictureUrl(newUrl);
// }else{
//   const reader = new FileReader();
// reader.onloadend = () => {
//   setPictureUrl(reader.result);
//   setFile(file)
//   console.log(reader.result)
// };

// reader.readAsDataURL(file);
// }
// };


// useEffect(() => {
//   return () => {
//     if (pictureUrl?.startsWith('blob:')) {
//       URL.revokeObjectURL(pictureUrl);
//     }
//   };
// }, [pictureUrl]);



//   const completeSignUp = async () => {

// const identityToken = await Preferences.get({key:"idToken"}).value 
// await Preferences.get(({key:"googledrivetoken"})).value
// const googleId= (await Preferences.get({key:"googleId"})).value
 
//       const pictureParams = fileFind ? { file:fileFind } : { profilePicture: selectedImage };
//       const params = {
//         email,
//         idToken:identityToken,
//         googleId: googleId,
//         token: token,
//         password,
//         username,
//         frequency,
//         selfStatement,
//         privacy: isPrivate,
//         ...pictureParams
//       };
    
//       if(fileFind){
// dispatch(uploadProfilePicture({ file:fileFind })).then(res => checkResult(res, payload => {
//           params.profilePicture = payload.fileName
//           dispatch(signUp(params))
//   .then(res => checkResult(res, payload => {
//  if (payload.profile) {
//           router.push(Paths.login);
//         } else {
//           showAlert({ message: payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link", type: AlertType.error });
//         }
//   }))
//   .catch(err => {
//     showAlert({ message: err?.status == 409 ? "Username is not unique" : err?.message || "Try reusing the link", type: AlertType.error });
//   });

//         Preferences.set({key:"firstTime",value: payload.firstTime}).then(()=>{})
//    },err=>{}))
//       }else{
//        dispatch(signUp(params)).then(res => checkResult(res, payload => {

//         if (payload.profile) {
//           router.push(Paths.login);
//         } else {
//           showAlert({ message: payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link", type: AlertType.error });
//         }
//         Preferences.set({key:"firstTime",value: payload.firstTime}).then(()=>{})

//       }),err=>{
//       showAlert({ message: err.status==409?"Username is not unique":err.message || "Try reusing the link", type: AlertType.error });
//       })}
    
  
//   };


  
// const handlePrivate = useCallback(
//   debounce(() => {
//     setIsPrivate(prev => !prev);
//   }, 100),
//   []
// );
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
// }

import {

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
const [referralToken, setReferralTokenState] = useState(null);
// const referralToken = referralTokenState;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [fileFind, setFile] = useState(null);
  const [pictureUrl,setPictureUrl]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(false)
  const [email, setEmail] = useState("");

const router = useIonRouter();
const searchParams = new URLSearchParams(router.routeInfo.search);

  const dispatch = useDispatch();

useEffect(() => {
 

  const params = new URLSearchParams(router.routeInfo.search);
  
  const t = params.get("token");
  if (t) {
    Preferences.set({ key: "token", value: t }).then(res=>{});
  }
  if (t) setReferralTokenState(t);
}, []);
  const { setError, setSuccess, setSeo, seo } = useContext(Context);

  useEffect(() => {
    setSeo({
      ...seo,
      title: "Plumbum (Sign Up) - Your Writing, Your Community"
    });
  }, []);



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

// // 
// console.log("APRMA",{username,password,confirmPassword,selfStatement,isPrivate,frequency,selectedImage,fileFind})
const completeSignUp = async () => {
  try {
    // ✅ Safe Capacitor reads
    const { value: identityToken } = await Preferences.get({ key: "idToken" });
    const { value: googleId } = await Preferences.get({ key: "googleId" });

    const pictureParams = fileFind
      ? { file: fileFind }
      : { profilePicture: selectedImage };
let {value:token }= await Preferences.get("token")
    // ✅ referral token from URL param state
    

    // ✅ MUST match backend exactly
const params = {
  authToken: identityToken,
  referralToken:referralToken??token,
  email: email?.trim() || null,
  username:username.trim() || null,
  password,
  googleId,
  frequency,
  selfStatement,
  privacy: isPrivate,
  ...pictureParams
};
console.log(token)
    // =========================
    // If uploading image first
    // =========================
    if (fileFind) {
      const uploadRes = await dispatch(
        uploadProfilePicture({ file: fileFind })
      );

      await checkResult(uploadRes, async (payload) => {
        params.profilePicture = payload.fileName;

        try {
          const res = await dispatch(signUp(params));

          await checkResult(res, (payload) => {
            if (payload.profile) {
              router.push(Paths.login());
            } else {
              setSuccess(null);
              setError(
                payload?.error?.status === 409
                  ? "Username is not unique"
                  : payload?.error?.message || "Try reusing the link"
              );
            }
          });

          await Preferences.set({
            key: "firstTime",
            value: String(payload.firstTime || false)
          });
        } catch (err) {
          setSuccess(null);
          setError(
            err?.status === 409
              ? "Username is not unique"
              : err?.message || "Try reusing the link"
          );
        }
      });
    }

    // =========================
    // No image upload
    // =========================
    else {
      try {
        const res = await dispatch(signUp(params));

        await checkResult(res, async (payload) => {
          if (payload.profile) {
            router.push(Paths.login());
          } else {
            setSuccess(null);
            setError(
              payload?.error?.status === 409
                ? "Username is not unique"
                : payload?.error?.message || "Try reusing the link"
            );
          }

          await Preferences.set({
            key: "firstTime",
            value: String(payload.firstTime || false)
          });
        });
      } catch (err) {
        setSuccess(null);
        setError(
          err?.status === 409
            ? "Username is not unique"
            : err?.message || "Try reusing the link"
        );
      }
    }
  } catch (err) {
    setSuccess(null);
    setError(err?.message || "Unexpected error occurred");
  }
};

const handlePrivate = useCallback(
  debounce(() => {
    setIsPrivate(prev => !prev);
  }, 100),
  []
);

return(<IonContent
  fullscreen
  className="ion-padding bg-base-100"
  style={{
    "--padding-top": "0px",
    "--padding-bottom": "env(safe-area-inset-bottom)"
  }}
>

  <IOSFormTemplate
  email={email}
  setEmail={setEmail}
  username={username}
  setUsername={setUsername}
  password={password}
  setPassword={setPassword}
  isPrivate={isPrivate}
  setIsPrivate={setIsPrivate}
  onSubmit={completeSignUp}
  loading={loading}
/>
</IonContent>)
          }

 function IOSFormTemplate({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  isPrivate,
  setIsPrivate,
  onSubmit,
  loading
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-neutral-500">
            Join and start sharing your work
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-4">
          
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm text-neutral-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white 
                         focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
            />
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm text-neutral-500">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white 
                         focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm text-neutral-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 pr-12
                           focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Private Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Private account</span>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="toggle toggle-sm"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Your profile won’t appear in search or public listings.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-medium 
                     active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Continue"}
        </button>

      </div>
    </div>
  );
}