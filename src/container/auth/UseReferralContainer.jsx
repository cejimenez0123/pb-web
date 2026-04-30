
// import { useState, useEffect, useContext,} from "react";
// import { useDispatch } from "react-redux";
// import { uploadProfilePicture } from "../../actions/ProfileActions";
// import checkResult from "../../core/checkResult";
// import Paths from "../../core/paths";
// import info from "../../images/icons/info.svg";
// import "../../App.css";
// import { useReferral } from "../../actions/UserActions";
// import Context from "../../context";
// import authRepo from "../../data/authRepo";
// import { debounce } from "lodash";
// import { Preferences } from "@capacitor/preferences";
// import { IonContent, IonInput, IonTextarea, IonLabel, IonText,  useIonRouter } from "@ionic/react";
// import { ErrorBoundary } from "@sentry/react";
// import { Capacitor } from "@capacitor/core";

// export default function UseReferralContainer() {
 
//   const router = useIonRouter()
// const path = router.routeInfo?.pathname + router.routeInfo?.search; 
// const params = new URLSearchParams(router.routeInfo?.search);
//   const [token, setToken] = useState(params.get("token"))
//   console.log(token)
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   console.log(username)
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
//   const [selfStatement, setSelfStatement] = useState("");
//   const [file, setFile] = useState(null);
//   const [frequency, setFrequency] = useState(1);
//   const [isPrivate, setIsPrivate] = useState(false);
//   const [usernameUnique, setUsernameUnique] = useState(true);
//   const [canUser, setCanUser] = useState(false);
// const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const dispatch = useDispatch();

//   const { error, setError, setSuccess } = useContext(Context);
//   useEffect(() => {
   
//     if(token){
//    return async ()=>await Preferences.set({key:"token",value:token})
//     }
//   }, []);
//   useEffect(() => {
//     if (confirmPassword === password) {
//       if (username.length > 4) {
//         setCanUser(usernameUnique);
//       } else setCanUser(false);
//     } else setCanUser(false);
//   }, [usernameUnique, password, confirmPassword]);

//   useEffect(() => {
//     debounce(() => {
//       if (username.length > 0) {
//         authRepo.checkUsername(username).then((data) => {
//           setUsernameUnique(data ? data.available : false);
//         });
//       }
//     }, 300)();
//   }, [username]);

// const handleProfilePicture = (e) => {
//   const file = e.target.files[0];
//   if(Capacitor.isNativePlatform()){
//   if (!file) return;

//   if (!file.type.startsWith('image/')) {

//     setError('Please upload a valid image file.');
//     return;
//   }

//   // // revoke previous blob URL if it exists
//   if (selectedImage?.startsWith('blob:')) {
//     URL.revokeObjectURL(selectedImage);
//   }

//   const newUrl = URL.createObjectURL(file) + `#${Date.now()}`;
//   console.log('Preview URL:', newUrl);

//   setFile(file);
//   setSelectedImage(newUrl);
//   setError('');
// }else{
//   const reader = new FileReader();
// reader.onloadend = () => {
//   setSelectedImage(reader.result);
//   setFile(file)
  
// };

// reader.readAsDataURL(file);
// }
// };

// //   const completeSignUp = async () => {
// //     try{
   
// //      const pictureParams = file ? { profilePicture:file } : { profilePicture: selectedImage };
// //     // const toke = || token;
// //     let tok = token?? (await Preferences.get({key:"token"})).value

// //     if (password.length && username.length && email) {
// //           const params = {
// //         email,
// //         token: tok,
// //         password,
// //         username,
// //         frequency,
// //         // profilePicture: payload.fileName,
// //         selfStatement,
// //         isPrivate,
// //         ...pictureParams
// //       };
  
// //             if(file){
// // dispatch(uploadProfilePicture({ file:file})).then(res => checkResult(res, payload => {
// //          console.log("TCICJ",tok)
// //           params.profilePicture = payload.fileName
// //              handleUseRefferal(params)
// // },err=>{
// // console.log(err)
// //   setError(err.message)
// // })


// // )}}
// //     }catch(e){
// //       console.log(e)
// //       setError(e.message)
// //     }
// // }
// const completeSignUp = async () => {
//   try {
//     const pictureParams = file
//       ? { profilePicture: file }
//       : { profilePicture: selectedImage };

//     const tok =
//       token ?? (await Preferences.get({ key: "token" })).value;

//     if (!password || !username || !email) {
//       setError("Missing fields");
//       return;
//     }

//     const baseParams = {
//       email,
//       token: tok,
//       password,
//       username,
//       frequency,
//       selfStatement,
//       isPrivate,
//       ...pictureParams
//     };

//     // CASE 1: upload image first
//     if (file) {
//       const res = await dispatch(uploadProfilePicture({ file }));

//       return checkResult(
//         res,
//         (payload) => {
//           baseParams.profilePicture = payload.fileName;
//           handleUseRefferal(baseParams);
//         },
//         (err) => setError(err?.message)
//       );
//     }

//     // CASE 2: no image upload
//     handleUseRefferal(baseParams);

//   } catch (e) {
//     console.log(e);
//     setError(e?.message || "Signup failed");
//   }
// };

// // const handleUseRefferal = (params) => {
// //   dispatch(useReferral(params)).then((res) =>
// //     checkResult(
// //       res,
// //       async (payload) => {
// //         if (payload?.token) {
// //           await Preferences.set({ key: "token", value: payload.token });
// //         }

// //         if (payload?.profile) {
// //           await Preferences.set({ key: "firstTime", value: "true" });
// //           router.push(Paths.myProfile);
// //         }
// //       },
// //       (err) => setError(err?.message)
// //     )
// //   );
// // };
// const handleUseRefferal = (params) => {
//   dispatch(useReferral(params)).then((res) =>
//     checkResult(
//       res,
//       async (payload) => {
//         if (payload?.token) {
//           await Preferences.set({ key: "token", value: payload.token });
//         }

//         if (payload?.profile) {
//           await Preferences.set({ key: "firstTime", value: "true" });
//           router.push(Paths.myProfile);
//         }
//       },
//       (err) => setError(err?.message || "Referral failed")
//     )
//   );
// };
// return (
//   <ErrorBoundary>
//     <IonContent
//       fullscreen={true}
//       style={{"--padding-bottom": "10em"}}
//       className="bg-gradient-to-b from-emerald-800 to-emerald-600"
//     >
//       {/* Scroll Container */}
//       <div className="p-4 flex justify-center">
//         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-xl p-6 mx-auto shadow-xl pb-32">
          
//           <h2 className="text-white text-center text-3xl mont-medium mb-6">
//             Complete Sign Up
//           </h2>

//           {/* Email */}
//           {/* <IonInput
//               label="Email"
//               labelPlacement="stacked"
//               placeholder="example@x.com"
//             value={email}
//             onIonInput={(e) => setEmail(e.target.value)}
//             className="mb-4 bg-white/80 text-emerald-800 rounded-xl px-3"
//           /> */}
//      <TextInput
//       label="Email"
//               labelPlacement="stacked"
//               placeholder="example@x.com"
//   value={email}
//   onChange={(val) => setEmail(val.replace(/\s/g, ""))}
// />
//           {/* Username */}
//        <TextInput
//   label="Username"
//   placeholder="username"
//   value={username}
//   onChange={(val) => setUsername(val.replace(/\s/g, ""))}
// />

// {username && username.length < 4 && (
//   <p className="text-sm text-rose-300 mb-2">
//     Minimum username length is 4 characters
//   </p>
// )}
// {!usernameUnique && (
//   <p className="text-sm text-rose-300 mb-2">
//     Username is already taken
//   </p>
// )}

//           {/* Password */}
//          <div className="mb-4">
//           <PasswordInput
//   label="Password"
//   value={password}
//   onChange={setPassword}
//   confirm={false}
// />

// {password.length > 0 && password.length < 6 && (
//   <p className="text-sm text-rose-300 mb-2">
//     Minimum password length is 6 characters
//   </p>
// )}

// <PasswordInput
//   label="Confirm Password"
//   value={confirmPassword}
//   onChange={setConfirmPassword}
//   confirm={true}
// />

// {password !== confirmPassword && (
//   <p className="text-sm text-rose-300 mb-4">
//     Passwords must match
//   </p>
// )}
//           {/* <IonInput type={showPassword?"text":`password`}
//          value={password}
//          label='Password'
//          labelPlacement='stacked'
//          onIonInput={(e) => setPassword(e.target.value)}
//         placeholder='*****' 
//         >
//             {/* <IonIcon slot='end'> */}
//          {/* <button slot='end' onClick={()=>setShowPassword(prev=>!prev)}
//                 className={`text-[0.7rem] open-sans-medium ${showPassword?"":"" } my-auto`}>
//                     {showPassword?"Hide":"Show"}</button>  */}
//                     {/* </IonIcon> */}
//         {/* </IonInput> */}
//   {/* <IonLabel className="text-white">Password</IonLabel>
//   <div className="relative">
//     <IonInput
//       type={showPassword ? "text" : "password"}
//       placeholder="*****"
//       value={password}
//       onIonInput={(e) => setPassword(e.target.value.trim())}
//       className="bg-white/80 text-emerald-800 rounded-xl px-3 pr-12"
//     />
//     <button
//       type="button"
//       onClick={() => setShowPassword((prev) => !prev)}
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
//     >
//       {showPassword ? "Hide" : "Show"}
//     </button>
//   </div> */}

//   {/* {password.length > 0 && password.length < 6 && (
//     <p className="text-sm text-rose-300 mt-1">
//       Minimum password length is 6 characters
//     </p>
//   )} */}
// </div>
         

//           {/* Confirm Password */}

//           {/* Privacy */}
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <IonLabel className="text-white">Private account</IonLabel>
//               <span className="text-xs text-emerald-200">
//                 Hidden from search
//               </span>
//             </div>
//             <input
//               type="checkbox"
//               checked={isPrivate}
//               onChange={(e) => setIsPrivate(e.target.checked)}
//               className="toggle toggle-success"
//             />
//           </div>

//           {/* Profile Picture */}
//           <IonLabel className="text-white text-lg font-semibold block mb-2">
//             Profile Picture
//           </IonLabel>
//           <input
//             type="file"
//             accept="image/*"
//             className="file-input file-input-bordered w-full mb-4"
//             onChange={(e) => handleProfilePicture(e)}
//           />

//           {selectedImage && (
//             <img
//               src={selectedImage}
//               alt="Selected"
//               className="rounded-xl mx-auto mb-6 max-h-40"
//             />
//           )}

//           {/* Email Settings */}
//           <div className="mb-6">
//             <EmailSettings
//               setFrequency={setFrequency}
//               frequency={frequency}
//             />
//           </div>

//           {/* Self Statement */}
//           <IonTextarea
//             label="Self Statement"
//             labelPlacement="stacked"
//             placeholder="What are you about?"
//             value={selfStatement}
//             onIonInput={(e) => setSelfStatement(e.target.value)}
//             className="mb-6 bg-white/80 text-emerald-800 rounded-xl px-3"
//           />
//                 {/* <div className="fixed bottom-0 left-0 w-full px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-gradient-to-t from-emerald-900/95 to-transparent backdrop-blur-md z-50"> */}
//         <button
//           // disabled={!canUser}
//           onClick={completeSignUp}
//           className={`w-full py-4 rounded-full text-lg font-semibold shadow-lg transition ${
//             canUser
//               ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
//               : "bg-gray-300 text-gray-500"
//           }`}
//         >
//           Join Plumbum
//         </button>
//       {/* </div> */}
//         </div>
        
//       </div>

//       {/* ✅ FIXED CTA */}

//     </IonContent>
//   </ErrorBoundary>
// );

  
// }


// function EmailSettings({ frequency, setFrequency }) {
//   const options = [
//     { label: "Daily", value: 1 },
//     { label: "Weekly", value: 7 },
//     { label: "Monthly", value: 30 },
//     { label: "Unsubscribe", value: 0 },
//   ];

//   return (
//     <div className="space-y-3">
//       <h2 className="text-lg font-semibold text-white">
//         Email Preferences
//       </h2>

//       <div className="grid grid-cols-2 gap-2">
//         {options.map((opt) => (
//           <button
//             key={opt.value}
//             onClick={() => setFrequency(opt.value)}
//             className={`py-2 rounded-xl border transition ${
//               frequency === opt.value
//                 ? "bg-emerald-500 text-white border-emerald-500"
//                 : "bg-white/80 text-emerald-700 border-emerald-200"
//             }`}
//           >
//             {opt.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
// function TextInput({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
// }) {
//   return (
//     <div className="mb-4">
//       <label className="block text-white mb-1 text-sm font-medium">
//         {label}
//       </label>
//       <input
//         type={type}
//         value={value}
//         placeholder={placeholder}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full bg-white/80 text-emerald-800 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-400 transition"
//       />
//     </div>
//   );
// }
// function PasswordInput({
//   label,
//   value,
//   onChange,
//   confirm=false
// }) {
//   const [show, setShow] = useState(false);

//   return (
//     <div className="mb-4">
//       <label className="block text-white mb-1 text-sm font-medium">
//         {label}
//       </label>

//       <div className="relative">
//         <input
//           type={show ? "text" : "password"}
//           value={value}
//           placeholder="*****"
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full bg-white/80 text-emerald-800 rounded-xl px-3 py-3 pr-14 outline-none focus:ring-2 focus:ring-emerald-400 transition"
//         />

//         {!confirm && <button
//           type="button"
//           onClick={() => setShow((prev) => !prev)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-emerald-700"
//         >
//           {show ? "Hide" : "Show"}
//         </button>}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture } from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import "../../App.css";
import { useReferral } from "../../actions/UserActions";
import Context from "../../context";
import authRepo from "../../data/authRepo";
import { debounce } from "lodash";
import { Preferences } from "@capacitor/preferences";
import { IonContent, useIonRouter } from "@ionic/react";
import { ErrorBoundary } from "@sentry/react";
import { Capacitor } from "@capacitor/core";

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  dark:    "#183306",
  primary: "#1b5e20",
  medium:  "#50874F",
  light:   "#6C965C",
  cream:   "#f4f4e0",
};

export default function UseReferralContainer() {
  const router = useIonRouter();
  const params = new URLSearchParams(router.routeInfo?.search);
  const [token] = useState(params.get("token"));

  const [email, setEmail]                     = useState("");
  const [username, setUsername]               = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage]     = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
  );
  const [selfStatement, setSelfStatement] = useState("");
  const [file, setFile]                   = useState(null);
  const [frequency, setFrequency]         = useState(1);
  const [isPrivate, setIsPrivate]         = useState(false);
  const [usernameUnique, setUsernameUnique] = useState(true);
  const [canUser, setCanUser]             = useState(false);

  const dispatch = useDispatch();
  const { setError } = useContext(Context);

  // ── Store token on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (token) Preferences.set({ key: "token", value: token });
  }, []);

  // ── Validate form fields ────────────────────────────────────────────────
  useEffect(() => {
    const valid =
      confirmPassword === password &&
      password.length >= 6 &&
      username.length >= 4 &&
      email.length > 0 &&
      usernameUnique;
    setCanUser(valid);
  }, [usernameUnique, password, confirmPassword, username, email]);

  // ── Debounced username check — created once ─────────────────────────────
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

  // ── Revoke blob URLs on unmount to avoid memory leaks ──────────────────
  useEffect(() => {
    return () => {
      if (selectedImage?.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  // ── Profile picture handler ─────────────────────────────────────────────
  const handleProfilePicture = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (Capacitor.isNativePlatform()) {
      if (!f.type.startsWith("image/")) { setError("Please upload a valid image file."); return; }
      if (selectedImage?.startsWith("blob:")) URL.revokeObjectURL(selectedImage);
      setFile(f);
      setSelectedImage(URL.createObjectURL(f) + `#${Date.now()}`);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedImage(reader.result); setFile(f); };
      reader.readAsDataURL(f);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const completeSignUp = async () => {
    // Guard — even if button is disabled, protect against direct calls
    if (!password || !username || !email) { setError("Missing fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (!token) { setError("Invalid referral link"); return; }

    try {
      const baseParams = {
        email,
        token,
        password,
        username,
        frequency,
        selfStatement,
        isPrivate,
        profilePicture: file ?? selectedImage,
      };

      if (file) {
        const res = await dispatch(uploadProfilePicture({ file }));
        return checkResult(
          res,
          (payload) => {
            baseParams.profilePicture = payload.fileName;
            handleUseRefferal(baseParams);
          },
          (err) => setError(err?.message)
        );
      }

      handleUseRefferal(baseParams);
    } catch (e) {
      setError(e?.message || "Signup failed");
    }
  };

  const handleUseRefferal = (p) => {
    dispatch(useReferral(p)).then((res) =>
      checkResult(
        res,
        async (payload) => {
          if (payload?.token) await Preferences.set({ key: "token", value: payload.token });
          if (payload?.profile) {
            await Preferences.set({ key: "firstTime", value: "true" });
            router.push(Paths.myProfile);
          }
        },
        (err) => setError(err?.message || "Referral failed")
      )
    );
  };

  return (
    <ErrorBoundary>
      <IonContent fullscreen scrollY={true} style={{ "--background": C.cream }}>
<div className="flex flex-col py-24 px-4">
        {/* ── Gradient header ─────────────────────────────────────────── */}
        {/* <div
          style={{
            background: `linear-gradient(160deg, ${C.dark} 0%, ${C.medium} 60%, ${C.light} 100%)`,
            borderBottomLeftRadius: "2rem",
            borderBottomRightRadius: "2rem",
          }}
          className="px-6 pt-14 pb-10 text-center"
        > */}
          {/* <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl lora-bold">P</span>
          </div> */}
          <h1 className="lora-bold text-soft mx-auto text-3xl tracking-tight">Join Plumbum</h1>
          <p className="text-emerald-100/70 text-sm mt-1">Complete your account setup</p>
        {/* </div> */}

        {/* ── Identity ────────────────────────────────────────────────── */}
        <SectionHeader label="Identity" />
        <div className="px-5 pb-4 space-y-1">
          <FormField
            label="Email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(v) => setEmail(v.replace(/\s/g, ""))}
          />
          <FormField
            label="Username"
            value={username}
            placeholder="yourname"
            onChange={(v) => setUsername(v.replace(/\s/g, ""))}
          />
          {username.length > 0 && username.length < 4 && (
            <Hint error>Minimum 4 characters</Hint>
          )}
          {username.length >= 4 && !usernameUnique && (
            <Hint error>Username already taken</Hint>
          )}
          {username.length >= 4 && usernameUnique && (
            <Hint>✓ Username available</Hint>
          )}
        </div>

        {/* ── Security ────────────────────────────────────────────────── */}
        <SectionHeader label="Security" />
        <div className="px-5 pb-4 space-y-1">
          <PasswordField label="Password" value={password} onChange={setPassword} />
          {password.length > 0 && password.length < 6 && (
            <Hint error>Minimum 6 characters</Hint>
          )}
          <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Hint error>Passwords don't match</Hint>
          )}
          {confirmPassword.length > 0 && password === confirmPassword && password.length >= 6 && (
            <Hint>✓ Passwords match</Hint>
          )}
        </div>

        {/* ── Profile ─────────────────────────────────────────────────── */}
      
        <SectionHeader label="Profile" />
        <div className="px-5 pb-4 space-y-4">
          <div className="flex flex-col items-center gap-4">

            <img
              src={selectedImage}
              alt="Profile"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm flex-shrink-0"
            />
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-emerald-200 rounded-2xl px-4 py-3 text-center text-sm text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
                Tap to upload photo
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicture} />
              </div>
            </label>
          </div>
</div>
          <div>
            <label className="block text-xs font-semibold text-emerald-800 mb-1.5 tracking-wide uppercase">
              About You
            </label>
            <textarea
              placeholder="What are you about?"
              value={selfStatement}
              onChange={(e) => setSelfStatement(e.target.value)}
              rows={3}
              className="w-full bg-emerald-50 text-emerald-900 rounded-2xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition resize-none placeholder:text-emerald-300"
            />
          </div>
   <div className="flex flex-row justify-between items-center mb-6">
            
               <div>
              <p className="text-sm font-medium text-emerald-900">Private account</p>
              <p className="text-xs text-emerald-500">Hidden from search</p>
            </div>
          
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="toggle toggle-success"
            />
          </div>
          {/* <div className="flex flex-col py-1">
            <div className="max-w-[100vw]">
            <div>
              <p className="text-sm font-medium text-emerald-900">Private account</p>
              <p className="text-xs text-emerald-500">Hidden from search</p>
            </div>
            <label className=" items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner" />
            </label>
            </div>
          </div>
        </div> */}

        {/* ── Email Preferences ───────────────────────────────────────── */}
        <SectionHeader label="Email Preferences" />
        <div className="px-5 pb-32">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Daily",       value: 1  },
              { label: "Weekly",      value: 7  },
              { label: "Monthly",     value: 30 },
              { label: "Unsubscribe", value: 0  },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFrequency(opt.value)}
                className={[
                  "py-3 rounded-2xl text-sm font-medium transition-all border",
                  frequency === opt.value
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sticky CTA ──────────────────────────────────────────────── */}

        
          <button
            onClick={completeSignUp}
            disabled={!canUser}
            className={[
              "w-full py-4 rounded-full text-base font-semibold tracking-wide shadow-lg transition-all ",
              canUser
                ? "text-white shadow-emerald-900/20 active:scale-[0.98]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            ].join(" ")}
            style={canUser ? { background: `linear-gradient(135deg, ${C.primary}, ${C.medium})` } : {}}
          >
            {canUser ? "Complete Sign Up →" : "Fill in all fields"}
          </button>
       
</div>
      </IonContent>
    </ErrorBoundary>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ label }) {
  return (
    <div className="px-5 pt-5 pb-2 flex items-center gap-3">
      <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">{label}</span>
      <div className="flex-1 h-px bg-emerald-100" />
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="py-1">
      <label className="block text-xs font-semibold text-emerald-800 mb-1.5 tracking-wide uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-emerald-50 text-emerald-900 rounded-2xl px-4 py-3 text-sm outline-none border border-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition placeholder:text-emerald-300"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="py-1">
      <label className="block text-xs font-semibold text-emerald-800 mb-1.5 tracking-wide uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder="••••••"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-emerald-50 text-emerald-900 rounded-2xl px-4 py-3 pr-16 text-sm outline-none border border-emerald-100 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition placeholder:text-emerald-300"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function Hint({ children, error = false }) {
  return (
    <p className={`text-xs mt-0.5 mb-1 px-1 ${error ? "text-rose-500" : "text-emerald-500"}`}>
      {children}
    </p>
  );
}