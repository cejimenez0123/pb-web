import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateProfile,
  deleteUserAccounts,
  deletePicture,
  setDialog
} from "../actions/UserActions";
import { uploadProfilePicture } from "../actions/ProfileActions";
import { Geolocation } from "@capacitor/geolocation";
import { IonContent, useIonRouter } from "@ionic/react";

import checkResult from "../core/checkResult";
import Context from "../context";
import Enviroment from "../core/Enviroment";
import { useSelector } from "react-redux";
import GoogleMapSearch from "./collection/GoogleMapSearch";
import { Capacitor } from "@capacitor/core";
async function reverseGeocode(lat, lng) {

  try {

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await res.json();

    return data?.display_name || "";

  } catch (err) {
    console.log("Reverse geocode error:", err);
    return "";
  }

}
export default function SettingsContainer() {

  const dispatch = useDispatch();
  const router = useIonRouter();

  const {  setError, setSuccess } = useContext(Context);
  const {currentProfile}=useSelector(state=>state.users)
  const [file, setFile] = useState(null);

const [form, setForm] = useState({
  username: "",
  selfStatement: "",
  isPrivate: false,
  profilePicture: "",
  location: {
    latitude: null,
    longitude: null,
    address: ""
  }
});

  const [pictureUrl, setPictureUrl] = useState(
    "https://placehold.co/200"
  );

  const [loading, setLoading] = useState(true);

  /* --------------------------
     Load profile into form
  ---------------------------*/
  useEffect(() => {

    if (!currentProfile) return;

    const pic = currentProfile.profilePic;
// if (currentProfile.location) {
//   setForm(prev => ({
//     ...prev,
   
//   }));
// }
    setForm({
      username: currentProfile.username ?? "",
      selfStatement: currentProfile.selfStatement ?? "",
      isPrivate: currentProfile.isPrivate ?? false,
      profilePicture: pic ?? "",
       location: {
      latitude: currentProfile?.location?.latitude??40,
      longitude: currentProfile?.location?.longitude??73,
      address: currentProfile?.location?.address || ""
    }
    });

    if (pic) {
      if (pic.includes("http")) {
        setPictureUrl(pic);
      } else {
        setPictureUrl(Enviroment.imageProxy(pic));
      }
    }

    setLoading(false);

  }, [currentProfile]);




const getPosition = async ()=> {
  if (Capacitor.isNativePlatform()) {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    return position.coords;
  } else {
    // Browser fallback using Google Geolocation API
    const res = await fetch("https://www.googleapis.com/geolocation/v1/geolocate?key=" + import.meta.env.VITE_GOOGLE_MAPS_API_KEY, {
      method: "POST"
    });
    const data = await res.json();
    return {
      latitude: data.location.lat,
      longitude: data.location.lng
    };
  }
}
    // Reverse geocode to get human-readable address
   
  


  /* --------------------------
     Form update
  ---------------------------*/
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  /* --------------------------
     Image upload preview
  ---------------------------*/
  const handleImage = (e) => {

    const selected = e.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Upload a valid image");
      return;
    }

    setFile(selected);
    setPictureUrl(URL.createObjectURL(selected));
  };

  /* --------------------------
     Submit update
  ---------------------------*/
  const handleSubmit = async () => {

    if (!currentProfile) return;

    try {

      let profilePicture = form.profilePicture;

      if (file) {

        await dispatch(deletePicture({
          fileName: currentProfile.profilePic
        }));

        const upload = await dispatch(
          uploadProfilePicture({ file })
        );

        checkResult(upload, payload => {
          profilePicture = payload.fileName;
        });
      }

dispatch(updateProfile({
  profile: currentProfile,
  username: form.username,
  profilePicture,
  selfStatement: form.selfStatement,
  privacy: form.isPrivate,
  location: form.location
})).then(result=>{

      checkResult(
        result,
        () => setSuccess("Profile updated"),
        err => setError(err.message)
      );
    })
    } catch (err) {
      setError("Update failed");
    }
  };

  /* --------------------------
     Delete account
  ---------------------------*/
  const handleDelete = () => {

    dispatch(setDialog({
      title: "Delete account?",
      text: "This cannot be undone.",
      agreeText: "Delete",
      agree: () => dispatch(deleteUserAccounts())
    }));

  };

  if (loading) {
    return (
      <IonContent>
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      </IonContent>
    );
  }

  return (

    <IonContent fullscreen>

      <div className="min-h-screen bg-base-200 flex justify-center pt-20 pb-32">

        <div className="card w-96  p-6 space-y-6">

          <h2 className="text-2xl font-bold text-center text-emerald-700">
            Profile Settings
          </h2>

          {/* Username */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">Username</span>
            </label>

            <input
              type="text"
              className="input input-bordered"
              value={form.username}
              onChange={(e)=>handleChange("username",e.target.value)}
            />

          </div>

          {/* Profile Image */}

          <div className="flex flex-col items-center gap-4">

            <div className="avatar">

              <div className="w-24 rounded-xl">

                <img src={pictureUrl} />

              </div>

            </div>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImage}
            />

          </div>
          <span className="w-fit mx-auto">
<GoogleMapSearch
  initLocationName={form.location?.address}
  onLocationSelected={(coordinates)=>{
    setForm(prev => ({
      ...prev,
      location: coordinates
    }));
  }}
/>
</span>
<button
  className="btn btn-outline btn-sm mt-2"
  onClick={getPosition}
>
  Use Current Location
</button>
          {/* Self Statement */}

          <div className="form-control">

            <label className="label">
              <span className="label-text">
                Self Statement
              </span>
            </label>

            <textarea
              className="textarea textarea-bordered h-32"
              value={form.selfStatement}
              onChange={(e)=>{
                if(e.target.value.length <= 120){
                  handleChange("selfStatement",e.target.value)
                }
              }}
            />

          </div>

          {/* Privacy */}

          <div className="form-control">

            <label className="cursor-pointer label">

              <span className="label-text">
                Private Profile
              </span>

              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={form.isPrivate}
                onChange={()=>handleChange("isPrivate",!form.isPrivate)}
              />

            </label>

          </div>

          {/* Buttons */}

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
          >
            Update Profile
          </button>

          <button
            className="btn btn-error btn-outline w-full"
            onClick={handleDelete}
          >
            Delete Account
          </button>

        </div>

      </div>

    </IonContent>
  );
}
// import { useContext, useLayoutEffect,useRef,useState } from "react";
// import { useDispatch,useSelector } from "react-redux";
// import { updateProfile,deleteUserAccounts, deletePicture, setDialog} from "../actions/UserActions";
// import {uploadProfilePicture} from "../actions/ProfileActions"
// import "../App.css"
// // const
// // import { useNavigate } from "react-router-dom";
// import "../styles/Setting.css"
// import checkResult from "../core/checkResult";
// import Context from "../context";
// import { IonContent, IonText, useIonRouter } from "@ionic/react";
// import Enviroment from "../core/Enviroment";
// export default function SettingsContainer(props) {  
//     // const navigate = useNavigate()
//     const router =useIonRouter()
//     const{setError,currentProfile,setSuccess}=useContext(Context)
//     const dialog = useSelector(state=>state.users.dialog)
//     const [newUsername,setNewUsername] = useState("")
//     const [selfStatement,setSelfStatement] = useState(currentProfile&&currentProfile.selfStatement?currentProfile.selfStatement:"")
//     const [isPrivate,setPrivacy] = useState(false)
//     const [homeItems,setHomeItems] = useState([])
//     const dispatch = useDispatch()
//     const [file,setFile]=useState(null)
//     const [selectedImage,setSelectedImage]=useState()
//     const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
//     let [pending,setPending] = useState(false)
//   useLayoutEffect(() => {
//   if (currentProfile) {
//     setProfile(currentProfile);
//   }
// }, [currentProfile]);
//     // useLayoutEffect( ()=>{
//     //     if(currentProfile){
//     //         setProfile(currentProfile)
//     //         return
//     //     }
//     //     if(currentProfile&& currentProfile.profilePic){
            
//     //         if(!currentProfile.profilePic.includes("http")){
//     //             setPictureUrl(Enviroment.imageProxy(currentProfile.profilePic))
     
//     //     }else{
//     //         setSelectedImage(currentProfile.profilePic)
//     //         setPictureUrl(currentProfile.profilePic)
//     //     }
//     // }
        
//     // },[currentProfile])


  
 
//     const handleAgree = () => {
//         dispatch(deleteUserAccounts()).then((res)=>{
//             checkResult(res,payload=>{
                
//               if(payload.message){
//                 setSuccess(payload.message)
//                 router.push("/","foward")
//               }
           
//             },err=>{
//                 setError(err.message)
//             })
       
//         })
//     }
//     const handleClose = () => {
   
//         dispatch(setDialog({isOpen:false}))
//     };
// const setProfile = (profile) => {
//   if (!profile) return;

//   setPending(true);

//   setNewUsername(profile.username || "");
//   setSelfStatement(profile.selfStatement || "");
//   setPrivacy(profile.isPrivate ?? false);

//   if (profile.profilePic) {
//     if (profile.profilePic.includes("http")) {
//       setPictureUrl(profile.profilePic);
//     } else {
//       setPictureUrl(Enviroment.imageProxy(profile.profilePic));
//     }
//   }

//   setPending(false);
// };
//     // const setProfile = (profile)=>{
//     //    setPending(true) 
//     //    // // 
//     //    isValidUrl(profile.profilePic)?setPictureUrl(profile.profilePic):setPictureUrl(Enviroment.imageProxy(profile.profilePic)) 
//     //    handleChange("selectedImage",profile.profilePic) 
//     //    handleChange("profilePicture",profile.profilePic) 
//     //    handleChange("profile",profile) 
//     //    handleChange("location",{...profile.location,address:""}) 
//     //    handleChange("username",profile.username) 
//     //    handleChange("profileId",profile.id) 
//     //    handleChange("privacy",profile.isPrivate) 
//     //     handleChange("selfStatement",profile.selfStatement) 
//     //      setPending(false) 
//     //      }
    
// const handleChange = (key, value) => { setParams((prev) => ({ ...prev, [key]: value })); };
//     const handleOnSubmit =(e)=>{
//         e.preventDefault();
//         if(currentProfile!=null){
//                    const fileParams = { file: file
//         }

//        if(file){

//         dispatch(deletePicture({fileName:currentProfile.profilePic}))
//         dispatch(uploadProfilePicture(fileParams)).then((result) => {
//             checkResult(result,(payload)=>{

//                 const params = {
//                     profile: currentProfile,
//                     username: newUsername,
//                     profilePicture: payload.fileName,
//                     selfStatement: selfStatement,
//                     privacy: isPrivate
                    
//                 }
//                 dispatch(updateProfile(params)).then((result) =>checkResult(result,
//                     payload=>{
//                         setSuccess("Updated")
//                     },err=>{
//                         setError(err.message)
//                     }
        
//                 ))
//             },(err)=>{
//                 setError(err.message)
//                 setSignUpError(true)
//             })
    
//         })}else{
//             const params = {
//                 profile: currentProfile,
//                 username: newUsername,
//                 profilePicture: currentProfile.profilePic,
//                 selfStatement: selfStatement,
//                 privacy: isPrivate
                
//             }
//             dispatch(updateProfile(params)).then((result) =>checkResult(result,
//                 payload=>{
//                     setSuccess("Updated")
//                 },err=>{
//                     setError(err.message)
//                 }
    
//             ))
//         }
       
            
    
//     }   

//     } 
   
//     const handleDeleteDialog=()=>{
//         let dia = {...dialog}
//         dia.agree={handleAgree} 
//         dia.onClose={handleClose}
//         dia.title=("Are you sure you want to delete your account?")
//                         dia.text=("Deleting your account can't be reversed")
//                         dia.agreeText ="Delete"
//         dispatch(setDialog(dia))

//     }
//     const deleteHomeItem  = (item)=>{
//         switch(item.type){
//             case "page":{
//                 let newItems =  homeItems.filter(hash=>{return hash!==item})
//                 setHomeItems(newItems)
//                 let newPages= homePages.filter(id=>id!==item.id)
//                 setHomePages(newPages) 
//                 break;
//             }
        
//             case "book":{
//             let newItems  = homeItems.filter(hash=>{return hash!==item})
//                 setHomeItems(newItems)  
//             let newBooks = homeBooks.filter(id=>{return (id !== item.id)})
//                 setHomeBooks(newBooks)
//                 break;
//             }
//             case "library":{
//                 let newItems = homeItems.filter(hash=>{return hash!==item})    
//                 setHomeItems(newItems)  
//                 let newLibraries =  homeLibraries.filter(id=>{return (id !== item.id)}) 
//                 setHomeLibraries(newLibraries)
//                 break;
//             }
//             case "profile":{
//                 let newItems= homeItems.filter(hash=>{return  hash!==item})
//                 setHomeItems(newItems) 
//                 let newProfiles = homeProfiles.filter(id=>{return id !== item.id})
//                 setHomeProfiles(newProfiles)  
//                 break;  
//             }  
//             default: break
//     }
// }
//     const homeItem=(item)=>{
//         switch(item.type){
//             case "page":{
//                 return (<div className="home-item">{item.page.title}
//                 <IconButton onClick={()=>deleteHomeItem(item)}>
//                     <Clear/></IconButton></div>)
//             }
//             case "book":{
//                 return (<div className="home-item">{item.book.title}
//                 <IconButton onClick={()=>deleteHomeItem(item)}>
//                     <Clear/></IconButton></div>)
//             }
//             case "library":{
//                 return (<div className="home-item">{item.library.name}
//                 <IconButton onClick={()=>deleteHomeItem(item)}>
//                     <Clear/>
//                 </IconButton></div>)
//             }
//             case "profile":{
//                 return (<div className="home-item">{item.profile.username}
//                 <IconButton onClick={()=>deleteHomeItem(item)}
//             ><Clear/></IconButton></div>)
//             }
//         }
//     }
//     const handleProfilePicture =(e)=>{
        
//         const file = e.target.files[0];

//         if (file) {
//           // Check file type
//           if (!file.type.startsWith('image/')) {
//             setError('Please upload a valid image file.');
           
//             return;
//           }
//           setFile(file)
//           setError('');
//           setPictureUrl(URL.createObjectURL(file))

          
//         }
 
//     }
   
//      if(!pending){
//             return(
//                 <IonContent fullscreen={true}>
//             <div >
//                     <div  className="card my-4 text-emerald-800 max-w-96 items-center flex mx-auto p-3">
//                       <label className="text-left flex flex-col "><h4 className="text-xl">Username:</h4>
                   
//                       {/* <IonInput   
                    
//                                         value={newUsername}
                                     
//                                         onChange={(e)=>setNewUsername(e.target.value)}
//                                              label="Username"/>
//                                              </IonItem> */}
//                             <input type="text"   
//                                         className={" text-xl px-4 py-2 rounded-full  open-sans-medium text-emerald-800 bg-transparent border-2 border-emerald-800 border-2  "}
//                                         value={newUsername}
//                                         onChange={(e)=>setNewUsername(e.target.value)
//                                         }
//                                          label="Username"/>
//                                          </label>
//                                           <div className='file'>
                   
//                         <input
//     className="file-input max-w-72 my-8 mx-auto "
//         type="file"
//         accept="image/*"
//         onInput={(e)=>handleProfilePicture(e)}/>
             
     
          
//           <img
//           className="mx-auto"
//             src={pictureUrl}
//             alt="Selected"
//             style={{ maxWidth: '10em', maxHeight: '300px', borderRadius: '10px' }}
//           />
        
        
      
    
//                     </div>
                    
//                             <label className="text-left mt-4 " id="" >
//                                 <h6 className="mont-medium text-xl">Self Statement:</h6>
                               
//                                     <textarea
//                                     onChange={(e)=>{
//                                         if(e.target.value.length<120){
//   setSelfStatement(e.target.value)
//                                         }else{
//                                             setError("Max Character Count 120")
//                                         }
//                                       }}
                                    
//                                     value={selfStatement}
//                                     className="textarea min-w-72 w-full  text-emerald-800 border-2 bg-transparent border-emerald-800 p-4 min-h-36 my-2"
//                                     placeholder="Self Statement"/>
//                             </label>
//                             <div className="text-left mt-4">
//                             {isPrivate?<button onClick={(e)=>{
//                                 e.preventDefault()
//                                 setPrivacy(false)}}className=" text-emerald-800 bg-emerald-50 hover:bg-green-100 mont-medium rounded-full border-emerald-700 border-2 text-xl text-emerald-800 text-bold">You are Private</button>:
//                             <button 
//                             onClick={(e)=>{
//                                 e.preventDefault()
//                                 setPrivacy(true)}}
//                             className=" text-bold border-emerald-500  h-18 w-24 border-2 rounded-full text-emerald-800 bg-emerald-50 hover:bg-green-10 text-xl ">You are Public</button>}
//    </div>
//   <div className="mt-8">

//                             <div
//                                className="bg-blueSea flex btn text-white w-[10rem] w-full   rounded-full "
//                                 variant="outlined" 
//                                 onClick={(e)=>handleOnSubmit(e)}
//                             >
//                                 <IonText className="my-auto mx-auto  text-2xl">Update</IonText>
//                             </div>
//                             </div>
//                         <button 
//                         className="rounded-full py-2 w-[10rem] mt-24 text-2xl  bg-golden text-white"
//                                 onClick={handleDeleteDialog}
//                                 id="open-modal" expand="block"
//                         ><IonText>Delete</IonText> </button>
        
//                         </div>
//             </div>
//           </IonContent>
//         )
//     }else{
//         return(<div>
//             Something's wrong
//         </div>)
//     }


// }


