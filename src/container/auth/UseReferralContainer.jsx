
import { useState, useEffect, useContext,} from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture } from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import info from "../../images/icons/info.svg";
import "../../App.css";
import { useReferral } from "../../actions/UserActions";
import Context from "../../context";
import authRepo from "../../data/authRepo";
import { debounce } from "lodash";
import { Preferences } from "@capacitor/preferences";
import { IonContent, IonInput, IonTextarea, IonLabel, IonText,  useIonRouter } from "@ionic/react";
import { ErrorBoundary } from "@sentry/react";
import { Capacitor } from "@capacitor/core";

export default function UseReferralContainer() {
 
  const router = useIonRouter()
const path = router.routeInfo?.pathname + router.routeInfo?.search; 
const params = new URLSearchParams(router.routeInfo?.search);
  const [token, setToken] = useState(params.get("token"))
  console.log(token)
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [file, setFile] = useState(null);
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [usernameUnique, setUsernameUnique] = useState(true);
  const [canUser, setCanUser] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();

  const { error, setError, setSuccess } = useContext(Context);
  useEffect(() => {
   
    if(token){
   return async ()=>await Preferences.set({key:"token",value:token})
    }
  }, []);
  useEffect(() => {
    if (confirmPassword === password) {
      if (username.length > 4) {
        setCanUser(usernameUnique);
      } else setCanUser(false);
    } else setCanUser(false);
  }, [usernameUnique, password, confirmPassword]);

  useEffect(() => {
    debounce(() => {
      if (username.length > 0) {
        authRepo.checkUsername(username).then((data) => {
          setUsernameUnique(data ? data.available : false);
        });
      }
    }, 300)();
  }, [username]);

const handleProfilePicture = (e) => {
  const file = e.target.files[0];
  if(Capacitor.isNativePlatform()){
  if (!file) return;

  if (!file.type.startsWith('image/')) {

    setError('Please upload a valid image file.');
    return;
  }

  // // revoke previous blob URL if it exists
  if (selectedImage?.startsWith('blob:')) {
    URL.revokeObjectURL(selectedImage);
  }

  const newUrl = URL.createObjectURL(file) + `#${Date.now()}`;
  console.log('Preview URL:', newUrl);

  setFile(file);
  setSelectedImage(newUrl);
  setError('');
}else{
  const reader = new FileReader();
reader.onloadend = () => {
  setSelectedImage(reader.result);
  setFile(file)
  
};

reader.readAsDataURL(file);
}
};

  const completeSignUp = async () => {
     const pictureParams = file ? { profilePicture:file } : { profilePicture: selectedImage };
    // const toke = || token;
    let tok = token?? (await Preferences.get({key:"token"})).value
    
    if (password.length && username.length && email) {
          const params = {
        email,
        token: tok,
        password,
        username,
        frequency,
        // profilePicture: payload.fileName,
        selfStatement,
        isPrivate,
        ...pictureParams
      };
  
            if(file){
dispatch(uploadProfilePicture({ file:file})).then(res => checkResult(res, payload => {
          params.profilePicture = payload.fileName
             handleUseRefferal(params)
},err=>{})


)}}}

const handleUseRefferal=(params)=>{
     dispatch(useReferral(params)).then((res) =>
        checkResult(
          res,
          (payload) => {
            if (payload.token) Preferences.set({ key: "token", value: payload.token });
            if (payload.profile) {
              Preferences.set({ key: "firstTime", value: "true" });
              router.push(Paths.myProfile);
            }
          },
          (err) => setError(err.message)
        )
      );
}

return (
  <ErrorBoundary>
    <IonContent
      fullscreen={true}
      style={{"--padding-bottom": "10em"}}
      className="bg-gradient-to-b from-emerald-800 to-emerald-600"
    >
      {/* Scroll Container */}
      <div className="p-4 flex justify-center">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-xl p-6 mx-auto shadow-xl pb-32">
          
          <h2 className="text-white text-center text-3xl mont-medium mb-6">
            Complete Sign Up
          </h2>

          {/* Email */}
          {/* <IonInput
              label="Email"
              labelPlacement="stacked"
              placeholder="example@x.com"
            value={email}
            onIonInput={(e) => setEmail(e.target.value)}
            className="mb-4 bg-white/80 text-emerald-800 rounded-xl px-3"
          /> */}
     <TextInput
      label="Email"
              labelPlacement="stacked"
              placeholder="example@x.com"
  value={email}
  onChange={(val) => setEmail(val.replace(/\s/g, ""))}
/>
          {/* Username */}
       <TextInput
  label="Username"
  placeholder="username"
  value={username}
  onChange={(val) => setUsername(val.replace(/\s/g, ""))}
/>

{username && username.length < 4 && (
  <p className="text-sm text-rose-300 mb-2">
    Minimum username length is 4 characters
  </p>
)}
{!usernameUnique && (
  <p className="text-sm text-rose-300 mb-2">
    Username is already taken
  </p>
)}

          {/* Password */}
         <div className="mb-4">
          <PasswordInput
  label="Password"
  value={password}
  onChange={setPassword}
  confirm={false}
/>

{password.length > 0 && password.length < 6 && (
  <p className="text-sm text-rose-300 mb-2">
    Minimum password length is 6 characters
  </p>
)}

<PasswordInput
  label="Confirm Password"
  value={confirmPassword}
  onChange={setConfirmPassword}
  confirm={true}
/>

{password !== confirmPassword && (
  <p className="text-sm text-rose-300 mb-4">
    Passwords must match
  </p>
)}
          {/* <IonInput type={showPassword?"text":`password`}
         value={password}
         label='Password'
         labelPlacement='stacked'
         onIonInput={(e) => setPassword(e.target.value)}
        placeholder='*****' 
        >
            {/* <IonIcon slot='end'> */}
         {/* <button slot='end' onClick={()=>setShowPassword(prev=>!prev)}
                className={`text-[0.7rem] open-sans-medium ${showPassword?"":"" } my-auto`}>
                    {showPassword?"Hide":"Show"}</button>  */}
                    {/* </IonIcon> */}
        {/* </IonInput> */}
  {/* <IonLabel className="text-white">Password</IonLabel>
  <div className="relative">
    <IonInput
      type={showPassword ? "text" : "password"}
      placeholder="*****"
      value={password}
      onIonInput={(e) => setPassword(e.target.value.trim())}
      className="bg-white/80 text-emerald-800 rounded-xl px-3 pr-12"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div> */}

  {/* {password.length > 0 && password.length < 6 && (
    <p className="text-sm text-rose-300 mt-1">
      Minimum password length is 6 characters
    </p>
  )} */}
</div>
         

          {/* Confirm Password */}

          {/* Privacy */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <IonLabel className="text-white">Private account</IonLabel>
              <span className="text-xs text-emerald-200">
                Hidden from search
              </span>
            </div>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="toggle toggle-success"
            />
          </div>

          {/* Profile Picture */}
          <IonLabel className="text-white text-lg font-semibold block mb-2">
            Profile Picture
          </IonLabel>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full mb-4"
            onChange={(e) => handleProfilePicture(e)}
          />

          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              className="rounded-xl mx-auto mb-6 max-h-40"
            />
          )}

          {/* Email Settings */}
          <div className="mb-6">
            <EmailSettings
              setFrequency={setFrequency}
              frequency={frequency}
            />
          </div>

          {/* Self Statement */}
          <IonTextarea
            label="Self Statement"
            labelPlacement="stacked"
            placeholder="What are you about?"
            value={selfStatement}
            onIonInput={(e) => setSelfStatement(e.target.value)}
            className="mb-6 bg-white/80 text-emerald-800 rounded-xl px-3"
          />
                {/* <div className="fixed bottom-0 left-0 w-full px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-gradient-to-t from-emerald-900/95 to-transparent backdrop-blur-md z-50"> */}
        <button
          // disabled={!canUser}
          onClick={completeSignUp}
          className={`w-full py-4 rounded-full text-lg font-semibold shadow-lg transition ${
            canUser
              ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Join Plumbum
        </button>
      {/* </div> */}
        </div>
        
      </div>

      {/* ✅ FIXED CTA */}

    </IonContent>
  </ErrorBoundary>
);

  
}


function EmailSettings({ frequency, setFrequency }) {
  const options = [
    { label: "Daily", value: 1 },
    { label: "Weekly", value: 7 },
    { label: "Monthly", value: 30 },
    { label: "Unsubscribe", value: 0 },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-white">
        Email Preferences
      </h2>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFrequency(opt.value)}
            className={`py-2 rounded-xl border transition ${
              frequency === opt.value
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white/80 text-emerald-700 border-emerald-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
function TextInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="mb-4">
      <label className="block text-white mb-1 text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/80 text-emerald-800 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-400 transition"
      />
    </div>
  );
}
function PasswordInput({
  label,
  value,
  onChange,
  confirm=false
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-white mb-1 text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder="*****"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/80 text-emerald-800 rounded-xl px-3 py-3 pr-14 outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />

        {!confirm && <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-700"
        >
          {show ? "Hide" : "Show"}
        </button>}
      </div>
    </div>
  );
}