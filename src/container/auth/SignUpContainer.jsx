
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

import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useAlert } from '../../core/useAlert';
import AlertType from '../../core/AlertType';
import authRepo from '../../data/authRepo';
import debounce from '../../core/debounce';
  
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
  const {showAlert}=useAlert()
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
  const {  setSeo, seo } = useContext(Context);

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

  showAlert({message:'Please upload a valid image file.',type:AlertType.error});
    return;
  }

  // // revoke previous blob URL if it exists
  if (pictureUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(pictureUrl);
  }

  const newUrl = URL.createObjectURL(file);
  

  setFile(file);
  setPictureUrl(newUrl);

}else{
  const reader = new FileReader();
reader.onloadend = () => {
  setPictureUrl(reader.result);
  setFile(file)

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
  try {
    // ✅ Safe Capacitor reads
    if (!usernameUnique) {
  showAlert({ message: "Username is already taken", type: AlertType.error });
  return;
}
    const { value: identityToken } = await Preferences.get({ key: "idToken" });
    const { value: googleId } = await Preferences.get({ key: "googleId" });

    const pictureParams = fileFind
      ? { file: fileFind }
      : { profilePicture: selectedImage };
let { value: token } = await Preferences.get({ key: "token" });
   
const params = {
  authToken: identityToken,
  referralToken:referralToken??token,
  username:username.trim() || null,
  password,
  googleId,
  frequency,
  selfStatement,
  privacy: isPrivate,
  ...pictureParams
};
console.log("Sign-up params:", params)
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
              router.push(Paths.login);
            } else {
          
            showAlert({message:  
                payload?.error?.status === 409
                  ? "Username is not unique"
                  : payload?.error?.message || "Try reusing the link",type:AlertType.error})
           
            }
          }, err => {
    
            showAlert({message:
              err?.status === 409
                ? "Username is not unique"
                : err?.message || "Try reusing the link",type:AlertType.error
            });
          });

          await Preferences.set({
            key: "firstTime",
            value: String(payload.firstTime || false)
          });
        } catch (err) {

          showAlert({message:
            err?.status === 409
              ? "Username is not unique"
              : err?.message || "Try reusing the link",type:AlertType.error
          });
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
            router.push(Paths.login);
          } else {
   
            showAlert({message:
              payload?.error?.status === 409
                ? "Username is not unique"
                : payload?.error?.message || "Try reusing the link",type:AlertType.error
            });
          }

          await Preferences.set({
            key: "firstTime",
            value: String(payload.firstTime || false)
          });
        });
      } catch (err) {

        showAlert({message:
          err?.status === 409
            ? "Username is not unique"
            : err?.message || "Try reusing the link",type:AlertType.error
        });
  
      }
    }
  } catch (err) {

    showAlert({message:
      err?.status === 409
        ? "Username is not unique"
        : err?.message || "Try reusing the link",type:AlertType.error
    });
   
  }
};
const [usernameUnique, setUsernameUnique] = useState(true);

const debouncedCheck = useRef(
  debounce((u) => {
    authRepo.checkUsername(u).then((data) => {
      setUsernameUnique(data ? data.available : false);
    });
  }, 300)
).current;

useEffect(() => {
  if (username.length > 0) debouncedCheck(username);
}, [username]);
useEffect(() => {
  if (username.length > 0) debouncedCheck(username);
}, [username]);
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
  setConfirmPassword={setConfirmPassword}
  confirmPassword={confirmPassword}
    pictureUrl={pictureUrl}           // ← add
  handleProfilePicture={handleProfilePicture}  // ← add
  usernameUnique={usernameUnique}
/>
</IonContent>)
          }

 function IOSFormTemplate({
  email,
  setEmail,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
  password,
  setPassword,
  isPrivate,
  setIsPrivate,
  onSubmit,
  loading,
    pictureUrl,                // ← add
  handleProfilePicture   ,
  usernameUnique
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
     

          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm text-neutral-500">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="@username"
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white 
                         focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
            />
            {username.length >= 4 && !usernameUnique && (
    <p className="text-xs text-rose-500">Username already taken</p>
  )}
  {username.length >= 4 && usernameUnique && (
    <p className="text-xs text-emerald-500">✓ Username available</p>
  )}
          </div>
 <div className="flex flex-col items-center gap-4">
  <img
    src={pictureUrl}          // ← was selectedImage (undefined in IOSFormTemplate)
    alt="Profile"
    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm flex-shrink-0"
  />
  <label className="flex-1 cursor-pointer">
    <div className="border-2 border-dashed border-emerald-200 rounded-2xl px-4 py-3 text-center text-sm text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
      Tap to upload photo
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleProfilePicture}  // ← was undefined
      />
    </div>
  </label>
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
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 pr-16
                           focus:outline-none focus:ring-2 focus:ring-neutral-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {/* Confirm Password */}
<div className="space-y-1">
  <label className="text-sm text-neutral-500">Confirm Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="••••••••"
      className={`w-full px-4 py-3 rounded-xl border pr-16
                 focus:outline-none focus:ring-2 transition
                 ${confirmPassword.length > 0 && confirmPassword !== password
                   ? "border-rose-400 focus:ring-rose-300"
                   : "border-neutral-300 focus:ring-neutral-400"
                 }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500 bg-white pl-1"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
  {confirmPassword.length > 0 && confirmPassword !== password && (
    <p className="text-xs text-rose-500">Passwords don't match</p>
  )}
  {confirmPassword.length > 0 && confirmPassword === password && (
    <p className="text-xs text-emerald-500">✓ Passwords match</p>
  )}
</div>
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