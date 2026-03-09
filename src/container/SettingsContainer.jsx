import { useContext, useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateProfile,deleteUserAccounts, deletePicture, setDialog, getCurrentProfile, signOutAction} from "../actions/UserActions";
import {uploadProfilePicture} from "../actions/ProfileActions"
import "../App.css"
import "../styles/Setting.css"
import checkResult from "../core/checkResult";
import Context from "../context";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonContent, IonImg, IonText, useIonRouter } from "@ionic/react";
import Enviroment from "../core/Enviroment";
import ErrorBoundary from "../ErrorBoundary";
import { Capacitor } from "@capacitor/core";
import isValidUrl from "../core/isValidUrl";
import uploadFile from "../core/uploadFile";
import { Preferences } from "@capacitor/preferences";
import Paths from "../core/paths";
import { useDialog } from "../domain/usecases/useDialog";
import { Geolocation } from "@capacitor/geolocation";

import GoogleMapSearch from "./collection/GoogleMapSearch"
import { io } from "socket.io-client";
const socket = io(Enviroment.url);
import { getGeocode } from "use-places-autocomplete";

async function getPlaceFromLatLng(lat, lng) {
  if(lat && lng){
  const results = await getGeocode({
    location: { lat, lng }
  });

  return results[0];
}else{
  return null
}
}
const registerUser = (profileId, location) => {
  console.log("Registering user with profileId:", profileId, "and location:", location);
    socket.emit('register', { profileId, location });
  };
export default function SettingsContainer(props) {  

    const router = useIonRouter()
  
    const{setError,setSuccess}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    // const dialog = useSelector(state=>state.users.dialog)
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    const [params, setParams] = useState({
  profile: null,
  file: null,
  profilePicture: pictureUrl,
  profileId: "",
  isPrivate: false,
  selfStatement: "",
  location: {
    latitude: 40.82341365353257,
    longitude: -73.87828682676974,
    address: ""
  },
  username: ""
});
const [homeItems,setHomeItems] = useState([])
    const [loading,setLoading] = useState(false)
    const isNative = Capacitor.isNativePlatform()
    const dispatch = useDispatch()
  const {dialog,openDialog,closeDialog}=useDialog()
const [location,setLocation]=useState(null)
    const [pending,setPending] = useState(false)
     const handleChange = (key, value) => {

    setParams((prev) => ({ ...prev, [key]: value }));

     
  };
  const getPostion = async () => {
    if(isNative){
 const position = await Geolocation.getCurrentPosition();
  getPlaceFromLatLng(position.coords.latitude, position.coords.longitude).then(place=>{
     
             setLocation({

        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
                 name: place.name,
            address: place.formatted_address
      });
        
    if (currentProfile && currentProfile.id) {
   
        getPlaceFromLatLng(position.coords.latitude, position.coords.longitude).then(place=>{
             registerUser(currentProfile.id, params.location);
      
          handleChange("location",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
    
            address: place.formatted_address
          })
          
  
        }).catch(err=>console.log("Error getting place details:", err))
      }
      
          })
   
     
}else{
      navigator.geolocation.getCurrentPosition(
      (position) => {
          getPlaceFromLatLng(position.coords.latitude, position.coords.longitude).then(place=>{
     
             setLocation({

        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
                 name: place.name,
            address: place.formatted_address
      });
        
   
          })
      
    
   
         getPlaceFromLatLng(position.coords.latitude, position.coords.longitude).then(place=>{
          console.log("Place details:", place);
          handleChange("location",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name:place.formatted_addres,
            address: place.formatted_address
          })
            if(currentProfile&&currentProfile.id){
         location&& registerUser(currentProfile.id,params.location)
        }
        
        }).catch(err=>console.log("Error getting place details:", err))
        setError(null);
        setLoading(false);
      })}}
   useEffect(() => {
  if (currentProfile?.id) {
    setProfile(currentProfile);
  }
}, [currentProfile]);
    useEffect(()=>{
      dispatch(getCurrentProfile())
    },[])
 

  
 
    const handleAgree = () => {
        dispatch(deleteUserAccounts()).then((res)=>{
            checkResult(res,payload=>{
                
              if(payload.message){
                setSuccess(payload.message)
                router.push("/")
              }
           
            },err=>{
                setError(err.message)
            })
       
        })
    }
    const handleClose = () => {
   
        closeDialog()
    };

      const handleSignOut =async () => {
 
    await Preferences.clear()
   router.push(Paths.login(),"forward","replace")
    dispatch(signOutAction())
  
   
};
    
    // const setProfile = (profile)=>{
    //     setPending(true)
    //     isValidUrl(profile.profilePic)?setPictureUrl(profile.profilePic):setPictureUrl(Enviroment.imageProxy(profile.profilePic))
        
    //     handleChange("selectedImage",profile.profilePic)
    //     handleChange("profilePicture",profile.profilePic)
    //     handleChange("profile",profile)
    //     handleChange("location",{...profile.location,address:""})
    //     handleChange("username",profile.username)
    //     handleChange("profileId",profile.id)
    //     handleChange("privacy",profile.isPrivate)
    //     handleChange("selfStatement",profile.selfStatement)
   
    //     setPending(false)
  
    // }
    const setProfile = async (profile) => {
  if (!profile) return;

  setPending(true);

  const profilePic =
    profile.profilePic ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s";

  const picture = isValidUrl(profilePic)
    ? profilePic
    : Enviroment.imageProxy(profilePic);

  setPictureUrl(picture);
let placeData = await getPlaceFromLatLng(profile.location.latitude,profile.location.longitude)
console.log("CDD",placeData)
  setParams((prev) => ({
    ...prev,
    profile,
    profilePicture: profilePic,
    selectedImage: profilePic,
    username: profile.username || "",
    profileId: profile.id || "",
    location: { ...(profile.location || {}), address: placeData.formatted_address },
    isPrivate: profile.isPrivate ?? false,
    selfStatement: profile.selfStatement || ""
  }));

  setPending(false);
};
    const handleOnSubmit =async (e)=>{
        e.preventDefault();

try{
  if(params.file){
      dispatch(deletePicture({fileName:currentProfile.profilePic}))
      dispatch(uploadProfilePicture({...params})).then(result=>{
        checkResult(result,payload=>{
const {url,fileName}=payload
 handleChange("profilePicture",fileName)
updateCurrentProfile({...params,profilePicture:fileName})
 isValidUrl(url)?setPictureUrl(url):setPictureUrl(Enviroment.imageProxy(fileName))


window.alert("Updating Profile")
                        //  setProfile(profile)
        },err=>{

        })
      })
  }else{

  
    updateCurrentProfile(params)

 
      }
}catch(err){
    console.log("Update profile error:"+err.message)
}}
    
   const updateCurrentProfile=(parameters)=>{
            dispatch(updateProfile({...parameters})).then((result) =>checkResult(result,
                    (payload)=>{
                        const {profile}=payload
                        console.log("FSDF",profile.profilePic)
                       profile && profile.profilePic && isValidUrl(profile.profilePic)?setPictureUrl(profile.profilePic):setPictureUrl(Enviroment.imageProxy(profile.profilePic))
                         setProfile(profile)
                        setSuccess("Updated")
                    
                    },err=>{
                           window.alert(err.message)
                        setError(err.message)
                        console.log("Update profile dispatch error:"+err.message)
                    
                    
        }))
   }         

      

     
   
    const handleDeleteDialog=()=>{
      closeDialog()
        let dia = {...dialog}
        dia.agree={handleAgree} 
        dia.onClose={handleClose}
        dia.title=("Are you sure you want to delete your account?")
                        dia.text=("Deleting your account can't be reversed")
                        dia.agreeText ="Delete"
        openDialog(dia)

    }
    const deleteHomeItem  = (item)=>{
        switch(item.type){
            case "page":{
                let newItems =  homeItems.filter(hash=>{return hash!==item})
                setHomeItems(newItems)
                let newPages= homePages.filter(id=>id!==item.id)
                setHomePages(newPages) 
                break;
            }
        
            case "book":{
            let newItems  = homeItems.filter(hash=>{return hash!==item})
                setHomeItems(newItems)  
            let newBooks = homeBooks.filter(id=>{return (id !== item.id)})
                setHomeBooks(newBooks)
                break;
            }
            case "library":{
                let newItems = homeItems.filter(hash=>{return hash!==item})    
                setHomeItems(newItems)  
                let newLibraries =  homeLibraries.filter(id=>{return (id !== item.id)}) 
                setHomeLibraries(newLibraries)
                break;
            }
            case "profile":{
                let newItems= homeItems.filter(hash=>{return  hash!==item})
                setHomeItems(newItems) 
                let newProfiles = homeProfiles.filter(id=>{return id !== item.id})
                // setHomeProfiles(newProfiles)  
                break;  
            }  
            default: break
    }
}

async function handleProfilePictureNative() {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Uri, // This works best with Uploader's 'filePath'
      source: CameraSource.Prompt,
    });
    try {
    const fileName = await uploadFile(image);
    handleChange("profilePicture",fileName)
    setPictureUrl(image.webPath)
 
  } catch (e) {
    console.error('Upload failed:', e);
  }
 

    }catch(er){

    }

}



const handleProfilePicture = async (e) => {
    
  try {
    let file, previewUrl;

 
      file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {

        setError('Please upload a valid image file.');
        return;
      }
      if (pictureUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(pictureUrl);
      }

    previewUrl = URL.createObjectURL(file) + `#${Date.now()}`;
  
    handleChange("file", file);
    window.alert("file")
    setPictureUrl(previewUrl);
    setError('');
    
  } catch (err) {
    console.error('Error capturing or loading image:', err);
    setError(err.message || 'Image upload failed');
  }
};

   
     if(!pending){
            return(
                <ErrorBoundary>
                <IonContent fullscreen={true}>
             <div className="bg-slate-100 pb-[10em]">
            <div  className="bg-slate-100 pt-20 pb-30">
                   <div className="text-right px-4" ><button onClick={handleSignOut} className="bg-golden text-white px-4 py-2 rounded">Log Out</button></div>
                    <div  className="card my-4 text-emerald-800 max-w-96 items-center flex mx-auto p-3">
                      <label className="text-left flex flex-col "><h4 className="text-[1.2em]  mx-4">Username:</h4>
                   
            
                            <input type="text"   
                                        className={"text-[1.2em]  px-4 py-2 bg-white w-[100vw] border-slate-50 mb-8  border-2 border-emerald-800 border-2  "}
                                        value={params.username}
                                        onChange={(e)=>handleChange("username",e.target.value.toLocaleLowerCase())
                                        }
                                         label="Username"/>
                                         </label>
                                         <GoogleMapSearch initLocationName={params.location.address??""} onLocationSelected={(coordinates)=>{
                                                    handleChange("location",coordinates)
                                                   setLocation({...coordinates})
                                                 }}/><button onClick={getPostion} className="bg-blueSea text-white px-4 py-2 rounded">Use Current Location</button>
                                             <label className="text-left flex flex-col "><h4 className="text-[1.2em]  mx-4">
                                              Location:</h4>
                   
        
                            <input type="text"   
                                        className={"text-[1.2em]  px-4 py-2 bg-white w-[100vw] border-slate-50 mb-8  border-2 border-emerald-800 border-2  "}
                                        value={params.location.address??""}
                                        onChange={(e)=>handleChange("username",e.target.value.toLocaleLowerCase())
                                        }
                                         label="Username"/>
                                         </label>
                                          <div className='file mt-4 mb-4'>
                   {Capacitor.isNativePlatform() ? (
  <button onClick={handleProfilePictureNative}>Choose Photo</button>
) : (
  <input type="file" className="file-input" accept="image/*" onChange={handleProfilePicture} />
)} 

                     
             
     
          
        <IonImg
  src={pictureUrl || "https://placehold.co/200"}
  className="mx-auto my-4"
  style={{ maxWidth: "10em", borderRadius: "10px" }}
/>
        
        
      
    
                    </div>
                    
                            <label className="text-left mt-4 " id="" >
                                <h6 className="text-[1.2em] mx-4">Self Statement:</h6>
                               
                                    <textarea
                                    onChange={(e)=>{handleChange("selfStatement",e.target.value)}}
                                  
                                    value={params.selfStatement}
                                    className="textarea w-[100vw] w-full  text-emerald-800 border-2 bg-white border-slate-50 px-6 py-4 min-h-36 my-2"
                                    placeholder="Self Statement"/>
                            </label>
                            <section className="flex flex-col w-[100vw]">
                           <label className="text-left  "> <h4 className="text-[1.2em] mx-4 mb-4 mt-8">Privacy Settings:</h4>
                           </label>
                           <div className="bg-white rounded-2xl mt-6">
  <div className="px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
     
      <div>
        <div className="text-gray-900 font-medium">
          {params.isPrivate ? 'Private Profile' : 'Public Profile'}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {params.isPrivate 
            ? 'Only you can see your profile' 
            : 'Your profile is visible to everyone'}
        </div>
      </div>
    </div>
    <div
      onClick={(e) => {
        e.preventDefault();
        handleChange("isPrivate", !params.isPrivate);
      }}
      className={`  min-h-6 min-w-6  ${params.isPrivate ? 'bg-blueSea' : 'bg-soft'} rounded-full `}
    >  </div> 
   
  </div>
</div>

   
   </section>
  <div className="mt-8 w-[100vw]">

                            <div
                               className="bg-sky-700 mx-auto bg-opacity-[60%] flex btn text-white w-[90%] h-[5em] flex  rounded-xl "
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                <IonText className="my-auto mx-auto text-2xl">Update Profile</IonText>
                              
                            </div>
                             
                            </div>
                           
                        <button 
                        className="rounded-xl py-2 w-[100%] mt-24 text-2xl  bg-golden text-white"
                                onClick={handleDeleteDialog}
                                id="open-modal" expand="block"
                        ><IonText>Delete Account</IonText> </button>
        
                        </div>
            </div>
            </div>
          </IonContent>
          </ErrorBoundary>
        )
    }else{
        return(<div>
            Something's wrong
        </div>)
    }


}


