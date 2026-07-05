
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
import { acceptTerms, signUp } from "../../actions/UserActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import Context from "../../context";
import "../../App.css";
import InfoTooltip from '../../components/InfoTooltip';
// import { acceptTerms } from '../../actions/UserActions';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { useAlert } from '../../core/useAlert';
import AlertType from '../../core/AlertType';
import authRepo from '../../data/authRepo';
import debounce from '../../core/debounce';
import EULATERMS from './Agreement';
import Enviroment from '../../core/Enviroment';
import { useDialog } from '../../domain/usecases/useDialog';
import CURRENT_TERMS_VERSION from '../../core/CURRENT_TERMS_VERSION';
  
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
  const [writingSprintSlots, setWritingSprintSlots] = useState([]);
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
const [showTerms, setShowTerms] = useState(false);

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
const toggleSlot = (slotId) => {
  setWritingSprintSlots(prev =>
    prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]
  );
};
  // const {  setSeo, seo } = useContext(Context);

  // useEffect(() => {
  //   setSeo({
  //     ...seo,
  //     title: "Plumbum (Sign Up) - Your Writing, Your Community"
  //   });
  // }, []);
const {openDialog,resetDialog}=useDialog()
const openTerms = () => {
  openDialog({
    title: "Terms & Conditions",
    height: 90,
    breakpoint: 1,
    text: () => <EULATERMS/>,
    agree:async () => {
       await dispatch(acceptTerms({ version: CURRENT_TERMS_VERSION }));
      setAgreedToTerms(true);
      resetDialog();
    },
    agreeText: "I Agree",
    disagree: () => resetDialog(),
    disagreeText: "Cancel",
  });
};

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
    // try {
    if (!agreedToTerms) {
      showAlert({ message: "Please agree to the Terms of Service to continue", type: AlertType.error });
      return;
    }
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
  writingSprintSlots,
  frequency,
  selfStatement,
  privacy: isPrivate,
 termsVersion: CURRENT_TERMS_VERSION,
  termsAcceptedAt: new Date().toISOString(),
  privacy: isPrivate,
  ...pictureParams
};

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
    writingSprintSlots={writingSprintSlots}
  toggleSlot={toggleSlot}
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
    agreedToTerms={agreedToTerms}
  setAgreedToTerms={setAgreedToTerms}
  showTerms={showTerms}
  openTerms={openTerms}
  setShowTerms={setShowTerms}
  setConfirmPassword={setConfirmPassword}
  confirmPassword={confirmPassword}
    pictureUrl={pictureUrl}           // ← add
  handleProfilePicture={handleProfilePicture}  // ← add
  usernameUnique={usernameUnique}
/>
</IonContent>)
          }
const SPRINT_SLOTS = [
  { id: 'morning',   label: 'Morning',   emoji: '🌅', time: '7:00 AM'  },
  { id: 'midday',    label: 'Midday',    emoji: '☀️', time: '12:00 PM' },
  { id: 'afternoon', label: 'Afternoon', emoji: '🌤', time: '3:00 PM'  },
  { id: 'evening',   label: 'Evening',   emoji: '🌆', time: '7:00 PM'  },
  { id: 'night',     label: 'Night',     emoji: '🌙', time: '10:00 PM' },
];
 function IOSFormTemplate({
  email,
  setEmail,
  writingSprintSlots,
  toggleSlot,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
  password,
  setPassword,
  isPrivate,
    agreedToTerms,
  openTerms,
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
<p className="text-sm font-medium text-neutral-700">Your Writing Windows</p>
<p className="text-xs text-neutral-500 mt-0.5">We'll send you a prompt at these times. Show up, write something with others.</p>
  <div className="grid grid-cols-1 gap-2">
    {SPRINT_SLOTS.map((slot) => {
      const selected = writingSprintSlots.includes(slot.id);
      return (
        <button
          key={slot.id}
          type="button"
          onClick={() => toggleSlot(slot.id)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all
            ${selected
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
            }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{slot.emoji}</span>
            <span className="text-sm font-medium">{slot.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">{slot.time}</span>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
              ${selected ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-300'}`}>
              {selected && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        </button>
      );
    })}
  </div>
          {/* Password */}
          <div className="space-y-1">
            {/* Password */}
<div className="space-y-1">
  <label className="text-sm text-neutral-500">Password</label>
  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-400">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="flex-1 px-4 py-3 bg-white focus:outline-none"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="px-3 text-sm text-neutral-500 bg-white"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

{/* Confirm Password */}
<div className="space-y-1">
  <label className="text-sm text-neutral-500">Confirm Password</label>
  <div className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 transition
    ${confirmPassword.length > 0 && confirmPassword !== password
      ? "border-rose-400 focus-within:ring-rose-300"
      : "border-neutral-300 focus-within:ring-neutral-400"}`}>
    <input
      type={showPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="••••••••"
      className="flex-1 px-4 py-3 bg-white focus:outline-none"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="px-3 text-sm text-neutral-500 bg-white"
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
<div className="flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            checked={agreedToTerms}
            readOnly
            onClick={openTerms}
            className="mt-1"
          />
          <p className="text-xs text-neutral-500">
            I agree to the{" End User License Agreement and Terms & Conditions."}
            <button type="button" onClick={()=>window.open(Enviroment.domain+"/eula")} className="underline text-neutral-700">
              End User License Agreement
            </button>{" "}
            and{" "}
            <button type="button" onClick={()=>window.open(Enviroment.domain+"/terms")} className="underline text-neutral-700">
              Terms & Conditions
            </button>
          </p>
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