import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
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
import { IonContent, IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonText, useIonViewWillEnter } from "@ionic/react";
import { ErrorBoundary } from "@sentry/react";
import { Capacitor } from "@capacitor/core";

export default function UseReferralContainer() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // const selectRef = useRef();
  const [token, setToken] = useState(query.get("token"));
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  console.log(username)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [file, setFile] = useState(null);
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [usernameUnique, setUsernameUnique] = useState(true);
  const [canUser, setCanUser] = useState(false);
  const [searchParams] = useSearchParams();
console.log(searchParams)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, setError, setSuccess } = useContext(Context);
  useEffect(() => {
    let toke = searchParams.get("token")

    if(!token&&toke)setToken(toke)
    return async ()=>await Preferences.set({key:"token",value:toke})
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

  // const handleFileInput = (e) => {
  //   const img = e.target.files[0];
  //   if (img && img.type.startsWith("image/")) {
  //     setFile(img);
  //     setSelectedImage(URL.createObjectURL(img));
  //     setError(null);
  //   } else {
  //     setError("Please upload a valid image file.");
  //     setSelectedImage(null);
  //   }
  // };
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
      // if(file){

      
// },err=>{

// })}else{
//               const params = {
//         email,
//         token: tok,
//         password,
//         username,
//         frequency,
//         profilePicture: selectedImage,
//         selfStatement,
//         isPrivate,
//       };
//     handleUseRefferal(params)
// }

      
  // };c
const handleUseRefferal=(params)=>{
     dispatch(useReferral(params)).then((res) =>
        checkResult(
          res,
          (payload) => {
            if (payload.token) Preferences.set({ key: "token", value: payload.token });
            if (payload.profile) {
              Preferences.set({ key: "firstTime", value: "true" });
              navigate(Paths.myProfile());
            }
          },
          (err) => setError(err.message)
        )
      );
}
  return (
    <ErrorBoundary>
    <IonContent fullscreen={true} className="p-4 flex justify-center  bg-gradient-to-b from-emerald-800 to-emerald-600">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl w-full max-w-xl p-6 mx-auto shadow-lg">
        <h2 className="text-emerald-700 text-center text-3xl mont-medium mb-6">Complete Sign Up</h2>

        {/* Email */}
        <IonInput
          label="Email"
          labelPlacement="stacked"
          placeholder="example@x.com"
          className="text-emerald-700 mb-4"
          value={email}
          onIonInput={(e) => setEmail(e.target.value)}
        />

        {/* Username */}
        <IonInput
          label="Username"
          labelPlacement="stacked"
          placeholder="username"
          className="text-emerald-700 mb-2"
          value={username}
          onIonInput={(e) => setUsername(e.target.value.trim())}
        />
        {username && username.length < 4 && (
          <p className="text-sm text-rose-400">Minimum username length is 4 characters</p>
        )}
        {!usernameUnique && <p className="text-sm text-rose-400">Username is already taken</p>}

        {/* Passwords */}
        <IonInput
          label="Password"
          type="password"
          labelPlacement="stacked"
          placeholder="*****"
          className="text-emerald-700 mb-2"
          value={password}
          onIonInput={(e) => setPassword(e.target.value.trim())}
        />
        {password.length > 0 && password.length < 6 && (
          <p className="text-sm text-rose-400">Minimum password length is 6 characters</p>
        )}

        <IonInput
          label="Confirm Password"
          type="password"
          labelPlacement="stacked"
          placeholder="*****"
          className="text-emerald-700 mb-2"
          value={confirmPassword}
          onIonInput={(e) => setConfirmPassword(e.target.value.trim())}
        />
        {password !== confirmPassword && (
          <p className="text-sm text-rose-400">Passwords must match</p>
        )}

        {/* Privacy Toggle */}
        <div className="flex justify-between items-center mt-4 mb-4">
          <div className="flex items-center gap-2 relative">
            <img src={info} className="w-5 h-5 cursor-pointer" />
            <span className="absolute -top-10 left-0 text-xs bg-white text-emerald-800 rounded-lg px-2 py-1 opacity-0 hover:opacity-100 transition">
              Hidden from search?
            </span>
            <IonLabel className="text-emerald-700">Private account</IonLabel>
          </div>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="toggle toggle-success"
          />
        </div>

        {/* Profile Picture */}
        <IonLabel className="text-emerald-700 text-lg font-bold block mb-2">Profile Picture</IonLabel>
        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-4"
      onChange={(e)=>handleProfilePicture(e)}
        />
        {selectedImage && (
          <img src={selectedImage} alt="Selected" className="rounded-xl mx-auto mb-4 max-h-40" />
        )}

        {/* Email Frequency */}
        <EmailSettings setFrequency={setFrequency} frequency={frequency}/>
        {/* <IonLabel className="text-white text-lg font-bold block mb-2">Email Frequency</IonLabel>
        <IonSelect
          interface="popover"
          value={frequency}
          onIonChange={(e) => setFrequency(Number(e.detail.value))}
          className="bg-white text-emerald-700 rounded-xl mb-4"
        >
          <IonSelectOption value={1}>Daily</IonSelectOption>
          <IonSelectOption value={2}>Every 3 days</IonSelectOption>
          <IonSelectOption value={3}>Weekly</IonSelectOption>
          <IonSelectOption value={14}>Every 2 weeks</IonSelectOption>
          <IonSelectOption value={30}>Monthly</IonSelectOption>
        </IonSelect> */}

        {/* Self Statement */}
        <IonTextarea
          label="Self Statement"
          labelPlacement="stacked"
          placeholder="What are you about?"
          value={selfStatement}
          onIonInput={(e) => setSelfStatement(e.target.value)}
          className="text-emerald-700 bg-transparent border border-white rounded-xl p-2 mb-8"
        />

        {/* Submit */}
        <div
          disabled={!canUser}
          onClick={completeSignUp}
          className={`btn w-full flex py-3 rounded-full text-lg ${
            canUser
              ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          <IonText className="my-auto mx-auto text-lg">Join Plumbum!</IonText>
        </div>
      </div>
    </IonContent>
    </ErrorBoundary>
  );
}


function EmailSettings({ frequency, setFrequency }) {
  // Map numeric frequency values to display labels
  const frequencyLabels = {
    1: "Daily",
    7: "Weekly",
    30: "Monthly",
    0: "Unsubscribe",
  };

  const handleSetFrequency = (value) => {
    setFrequency(value);
  };

  return (
    <div className="p-4 max-w-sm mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-emerald-700">
        Email Preferences
      </h2>

      {/* Tooltip */}
      <div
        className="tooltip tooltip-bottom"
        data-tip="Choose how often you receive emails"
      >
        <label className="block text-emerald-700 font-medium mb-2">
          Email Frequency
        </label>
      </div>

      {/* DaisyUI dropdown */}
      <div className="dropdown w-full">
        <label
          tabIndex={0}
          className="btn w-full bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
        >
          {frequencyLabels[frequency] || "Select Frequency"}
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-white rounded-box w-full border border-emerald-200 shadow-md"
        >
          <li>
            <button
              onClick={() => handleSetFrequency(1)}
              className="text-emerald-700 hover:bg-emerald-50"
            >
              Daily
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSetFrequency(7)}
              className="text-emerald-700 hover:bg-emerald-50"
            >
              Weekly
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSetFrequency(30)}
              className="text-emerald-700 hover:bg-emerald-50"
            >
              Monthly
            </button>
          </li>
          <li>
            <button
              onClick={() => handleSetFrequency(0)}
              className="text-emerald-700 hover:bg-emerald-50"
            >
              Unsubscribe
            </button>
          </li>
        </ul>
      </div>
    </div>
    
  );
}