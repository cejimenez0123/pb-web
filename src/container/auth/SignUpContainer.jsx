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
import Context from "../../context";
import "../../App.css";
import InfoTooltip from '../../components/InfoTooltip';
import { debounce } from 'lodash';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export default function SignUpContainer(props) {
  const selectRef = useRef()
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [selfStatement, setSelfStatement] = useState("");
  const [file, setFile] = useState(null);
  const [pictureUrl,setPictureUrl]=useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);
  const [identityToken,setIdentityToken]=useState(null)
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  Preferences.get({key:"idToken"}).then(token=>{
    setIdentityToken(token.value)
   })
  const { setError, setSuccess, setSeo, seo } = useContext(Context);

  useEffect(() => {
    setSeo({
      ...seo,
      title: "Plumbum (Sign Up) - Your Writing, Your Community"
    });
  }, []);

  useEffect(() => {
    let toke = searchParams.get("token")
    console.log("Tokenef",toke)
    if(!token&&toke)setToken(toke)
    return async ()=>await Preferences.set({key:"token",value:toke})
  }, []);
const fileInputRef = useRef(null);
const prevObjectUrlRef = useRef(null);

// useEffect(() => {
//   return () => {
//     if (selectedImage) {
//       URL.revokeObjectURL(selectedImage);
//     }
//   };
// }, [selectedImage]);
//   const handleFileInput = (e) => {
// const img = (e.currentTarget && e.currentTarget.files && e.currentTarget.files[0]) || (e.target && e.target.files && e.target.files[0]);
// //   
//     try{
//     // const img = e.cutarget.files[0];
//    console.log(img)
//     if (img&&img.type.startsWith('image/'))  {
      
//        setFile(img);
//       setError(null);
//       setSelectedImage(URL.createObjectURL(img));
      
     
//     }
//     if (!img.type.startsWith('image/')) {
//         setError('Please upload a valid image file.');
//         setSuccess(null);
//         setSelectedImage(null);
//         return;
//       }
//   }catch(err){
//     console.log(err)
//   }
//   };
// const handleFileInput = (e) => {
//   const img = e.target.files[0];
//   console.log(img)
//   // if (img) {
//     if (!img.type.startsWith('image/')) {
//       console.log("COX")
//       setError('Please upload a valid image file.');
//       setSelectedImage(null);
//       return;
//     }

//     // Clean up any previous preview URL
//     if (selectedImage) {
//       URL.revokeObjectURL(selectedImage);
//     }
//     console.log("Tocuh")
// let url = URL.createObjectURL(img)
// console.log(url)
//     setFile(img);
//     setError(null);
//   setPictureUrl(url) // File works fine here
//   // }
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
  if (pictureUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(pictureUrl);
  }

  const newUrl = URL.createObjectURL(file) + `#${Date.now()}`;
  console.log('Preview URL:', newUrl);

  setFile(file);
  setPictureUrl(newUrl);
  setError('');
}else{
  const reader = new FileReader();
reader.onloadend = () => {
  setPictureUrl(reader.result);
  console.log(reader.result)
};

reader.readAsDataURL(file);
}
};

//     const handleProfilePicture =(e)=>{
        
//         const file = e.target.files[0];
// console.log(file)
//         if (file) {
//           // Check file type
//           if (!file.type.startsWith('image/')) {
//             console.log("X")
//             setError('Please upload a valid image file.');
           
//             return;
//           }
//           console.log("B")
//           setFile(file)
//           setError('');
//           setPictureUrl(URL.createObjectURL(file))

          
//         }
 
    // }
//     const handleProfilePicture = (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     setError("Please upload a valid image file.");
//     return;
//   }

//   const url = URL.createObjectURL(file) + `#${Date.now()}`; // 👈 force unique URL
//   console.log(url);
//   setPictureUrl(url);
//   setFile(file);
//   setError('');
// };

// const handleFileInput = (e) => {
//   // prefer e.currentTarget.files (reliable in React)
//   const file = (e.currentTarget && e.currentTarget.files && e.currentTarget.files[0]) || (e.target && e.target.files && e.target.files[0]);
//   if (!file) return;
//   console.log(file)
// console.log("tocuh")
//   if (!file.type.startsWith("image/")) {
//     setError("Please upload a valid image file.");
//     setSuccess(null);
//     setSelectedImage(null);
//     setFile(null);
//     return;
//   }

//   // revoke previous object URL if any
//   if (prevObjectUrlRef.current) {
//     URL.revokeObjectURL(prevObjectUrlRef.current);
//     prevObjectUrlRef.current = null;
//   }

//   const objectUrl = URL.createObjectURL(file);
//   prevObjectUrlRef.current = objectUrl;

//   setFile(file);
//   setSelectedImage(objectUrl);
// };

// cleanup on unmount: revoke object URL
useEffect(() => {
  if (selectedImage?.startsWith('blob:')) {
  URL.revokeObjectURL(selectedImage);
}
  
}, []);


// cleanup on unmount: revoke object URL



  const completeSignUp = async () => {
    // let toke = searchParams.get("token")
const identityToken = await Preferences.get({key:"idToken"}).value 
await Preferences.get(({key:"googledrivetoken"})).value
const googleId= (await Preferences.get({key:"googleId"})).value
    // if (((||(|| (password.length > 6 && username.length > 3))) {
    // 
      const pictureParams = file ? { file } : { profilePicture: selectedImage };
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
      const uploadAction = file
        ? dispatch(uploadProfilePicture({ file })).then(res => checkResult(res, payload => {
          params.profilePicture = payload.fileName;
          return dispatch(signUp(params));
        }))
        : dispatch(signUp(params));

      uploadAction.then(res => checkResult(res, payload => {
        Preferences.set({key:"firstTime",value: payload.firstTime}).then(()=>{})
   
        if (payload.profile) {
          navigate(Paths.myProfile());
        } else {
          setSuccess(null);
          setError(payload.error.status==409?"Username is not unique":payload.error.message || "Try reusing the link");
        }
      }, err => {
        setSuccess(null);
      setError(err.status==409?"Username is not unique":err.message || "Try reusing the link");
      }));
    // } else {
    //   setError("Password and Username can't be empty");
    // }
  };
  const ProfilePicture=({image})=>{
    return image? (

  <IonImg
    src={pictureUrl}
    alt="Profile preview"
    style={{ width: '150px', height: '150px', borderRadius: '50%' }}
  />


):(<img src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}

    alt="Profile preview"
    style={{
      width: '150px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '50%',
    }}/>)}


  
  const handlePrivate=debounce(()=>{
  setIsPrivate(!isPrivate)
  },100)
  return (
    
      <IonPage>
      <IonContent fullscreen={true}
     >
        <IonHeader className=" bg-opacity-80 rounded-lg max-w-[96%] md:max-w-[42em] md:px-12 mx-auto">
        <IonTitle className="text-green-800 text-center text-[2rem] ">
          Complete Sign Up
        </IonTitle>
      </IonHeader>
        <IonCard style={{maxWidth:"30rem"}} className="px-4 mx-auto shadow-none bg-transparent">
          <IonCardContent>
         <div className='px-4 sm:w-[50em] w-[95vw] mx-auto'>
         
                <IonInput
                label='username'
                labelPlacement='stacked'
                className="text-emerald-800 border-b rounded-full  "
                value={username}
                placeholder="username"
                onIonInput={e => setUsername(e.detail.value.trim())}
              />
           
            {username.length !== 0 && username.length < 4 && (
              <IonText color="danger">
                <h6>Minimum username length is 4 characters</h6>
              </IonText>
            )}
               <div className='w-[12rem] flex-col flex justify-center mx-auto'>
       
      </div>
         
             {/* <> */}
               {/* <IonItem className="input rounded-full bg-transparent border-emerald-200 border-2  mt-4 flex items-center"> */}
               
                   <IonInput
                label='Password'
                labelPlacement='stacked'
                type='password'
               
               className="rounded-lg bg-emerald1-100 text-[0.8rem] text-emerald-800"
                value={password}
                onIonInput={e => setPassword(e.detail.value.trim())}
                placeholder="password"
 
              />
              
                {/* </IonItem> */}
                {(password.length > 0 && password.length <= 6) && (
                  <IonText color="danger">
                    <h6>Minimum Password Length is 6 characters</h6>
                  </IonText>
                )}
                  {/* <IonItem className="input rounded-full bg-transparent border-emerald-200 border-2  mt-4 flex items-center"> */}
                  <IonInput
                    label='Confirm Password'
                    type="password"
                    labelPlacement='stacked'
 className="rounded-lg bg-emerald1-100 text-[0.8rem] text-emerald-800"
                    value={confirmPassword}
                    onIonInput={e => setConfirmPassword(e.detail.value.trim())}
                    placeholder="password"
                  />
                {/* </IonItem> */}
                {password != confirmPassword && (
                  <IonText color="danger">
                    <h6>Passwords need to match</h6>
                  </IonText>
                )}
              {/* </>} */}
            {/* )} */}
            <IonItem
  lines="none"
  className="w-full mt-8 ion-align-items-center"
>
  <div className="flex flex-row pt-8 items-center gap-3"> 
  
    {/* <InfoTooltip text="Will your account be private?" /> */}

    

  
    {/* <div className='flex flex-row'  >
    <IonText className="my-auto">Is Private?</IonText>
     */}
    {/* Yes/No status */}
    {/* <div >
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
   
    </div> */}
  <IonItem lines="none" className="flex flex-col items-start mt-4 space-y-2">
            <div className="flex flex-row items-center gap-3">
              <InfoTooltip text="Will your account be private?" />
              <IonText className="text-emerald-800 font-medium">Is Private?</IonText>
              <IonText
                onClick={handlePrivate}
                className="ml-4 cursor-pointer text-emerald-700 font-semibold"
              >
                {isPrivate ? "Yes" : "No"}
              </IonText>
              <input
                id="ion-cb-1"
                type="checkbox"
                className="mx-3 accent-emerald-600 cursor-pointer"
                checked={isPrivate}
                onClick={handlePrivate}
              />
            </div>
          </IonItem>
  </div>
</IonItem>
      <div className="mt-6">
            <IonLabel className="text-xl text-emerald-800 font-medium mb-2 block">
              Add a Profile Picture
            </IonLabel>
            <input
              type="file"
              accept="image/*"
              className="block file-input mx-auto my-4 text-emerald-700"
              onChange={(e)=>handleProfilePicture(e)}
            />
            <ProfilePicture key={pictureUrl} image={pictureUrl} />
          </div>
  {/* <IonLabel className="text-xl text-left pb-2">
    Add a Profile Picture
  </IonLabel>
  
             <input
    className="file-input max-w-72 my-8 mx-auto "
        type="file"   <div>
            <IonLabel className="text-xl text-emerald-800 font-medium mb-2 block">
              Email Frequency
            </IonLabel>
            <select
              className="w-full rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 border border-emerald-200"
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
        accept="image/*"
        onChange={(e)=>handleProfilePicture(e)}/>
 
<ProfilePicture key={pictureUrl} image={pictureUrl}/> */}


            <IonItem className="mb-4 flex flex-row justify-between">
      
             <div>
            <IonLabel className="text-xl  mt-4 text-emerald-800 font-medium mb-2 block">
              Email Frequency
            </IonLabel>
            <select
              className="w-full rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 border border-emerald-200"
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
            </IonItem>
                   
            <IonLabel className="text-xl text-emerald-800 font-medium mb-2 block">
              Self Statement
            </IonLabel>
            <IonTextarea
              placeholder="What are you about?"
              rows={5}
              autoGrow={true}
              className="textarea bg-transparent bg-emerald-100 p-1  w-full text-emerald-800 text-md lg:text-l"
              value={selfStatement}
              maxlength={250}
              onIonInput={e => setSelfStatement(e.detail.value)}
            />
           
<div onClick={completeSignUp} className='bg-green-700 btn  flex flex-row mx-auto mb-12 border border-emerald-600 rounded-full hover:bg-emerald-400'>
              <IonText className="text-white mx-auto my-auto text-xl">Join Plumbum!</IonText>
          
            </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
 </IonPage>
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