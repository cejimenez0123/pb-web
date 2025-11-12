import { useContext, useEffect, useLayoutEffect,useRef,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateProfile,deleteUserAccounts, deletePicture, setDialog} from "../actions/UserActions";
import {uploadProfilePicture} from "../actions/ProfileActions"
import "../App.css"
import { useNavigate } from "react-router-dom";
import "../styles/Setting.css"
import checkResult from "../core/checkResult";
import Context from "../context";
import { IonContent, IonText } from "@ionic/react";
import Enviroment from "../core/Enviroment";
import ErrorBoundary from "../ErrorBoundary";
import { Capacitor } from "@capacitor/core";
import isValidUrl from "../core/isValidUrl";
export default function SettingsContainer(props) {  
    const navigate = useNavigate()
    const{setError,setSuccess}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dialog = useSelector(state=>state.users.dialog)
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
   
    const [params,setParams]=useState({profile:currentProfile,profilePic:pictureUrl,profileId:currentProfile?currentProfile.id:"",isPrivate:false,selfStatement:"",username:""})
    const [homeItems,setHomeItems] = useState([])
    const dispatch = useDispatch()

   const [image,setImage]=useState(null)

     let [pending,setPending] = useState(false)
     const handleChange = (key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };
    useEffect( ()=>{
        if(currentProfile){
            setProfile(currentProfile)
        }   
    },[currentProfile])

    useEffect(()=>{
          if(currentProfile&& currentProfile.profilePic){
            
            if(!isValidUrl(currentProfile.profilePic)){
                setPictureUrl(Enviroment.imageProxy(currentProfile.profilePic))
                setImage(currentProfile.profilePic)
        }else{
            setImage(currentProfile.profilePic)
            setPictureUrl(currentProfile.profilePic)
        }
    }
    },[currentProfile])
  
 
    const handleAgree = () => {
        dispatch(deleteUserAccounts()).then((res)=>{
            checkResult(res,payload=>{
                
              if(payload.message){
                setSuccess(payload.message)
                navigate("/")
              }
           
            },err=>{
                setError(err.message)
            })
       
        })
    }
    const handleClose = () => {
   
        dispatch(setDialog({isOpen:false}))
    };

    
    
    const setProfile = (profile)=>{
        setPending(true)
        isValidUrl(profile.profilePic)?setPictureUrl(profile.profilePic):setPictureUrl(Enviroment.imageProxy(profile.profilePic))
         isValidUrl(profile.profilePic)?setImage(profile.profilePic):setImage(Enviroment.imageProxy(profile.profilePic))
                 isValidUrl(profile.profilePic)?handleChange("file",profile.profilePic):handleChange("file",(Enviroment.imageProxy(profile.profilePic)))
         handleChange("selectedImage",profile.profilePic)
        handleChange("profile",profile)
        handleChange("username",profile.username)
        handleChange("profileId",profile.id)
        handleChange("privacy",profile.isPrivate)
        handleChange("selfStatement",profile.selfStatement)
   
        setPending(false)
        // fetchCollection(profile)
    }
    const handleOnSubmit =async (e)=>{
        e.preventDefault();
    //   console.log(file)
       if(params.file){
try{
       currentProfile && !isValidUrl(currentProfile.profilePic)&&dispatch(deletePicture({fileName:currentProfile.profilePic}))
}catch(err){
    console.log(err)
}

       try{
    
dispatch(uploadProfilePicture(params)).then(({payload})=>{

    console.log("VVDD",payload)
        
        console.log("VVDDDC",payload.fileName)
    
         dispatch(updateProfile({...params,profilePicture:payload.fileName})).then((result) =>checkResult(result,
                    (payload)=>{
               console.log("VVDDXX",payload)             
                        const {profile}=payload
                     
                        setProfile(profile)
                        setSuccess("Updated")
                      
                    },err=>{
                        window.alert(err.message)
                    }
        
                ))
    // })

})

       
    }catch(err){
        console.log(err)
       }
            }else{
 
            dispatch(updateProfile(params)).then((result) =>checkResult(result,
                payload=>{
                       setSuccess("Updated")
                },err=>{
                    window.alert(err.message)
                }
    
            ))
        }
    }
            
    
      

     
   
    const handleDeleteDialog=()=>{
        let dia = {...dialog}
        dia.agree={handleAgree} 
        dia.onClose={handleClose}
        dia.title=("Are you sure you want to delete your account?")
                        dia.text=("Deleting your account can't be reversed")
                        dia.agreeText ="Delete"
        dispatch(setDialog(dia))

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
                setHomeProfiles(newProfiles)  
                break;  
            }  
            default: break
    }
}
    const homeItem=(item)=>{
        switch(item.type){
            case "page":{
                return (<div className="home-item">{item.page.title}
                <IconButton onClick={()=>deleteHomeItem(item)}>
                    <Clear/></IconButton></div>)
            }
            case "book":{
                return (<div className="home-item">{item.book.title}
                <IconButton onClick={()=>deleteHomeItem(item)}>
                    <Clear/></IconButton></div>)
            }
            case "library":{
                return (<div className="home-item">{item.library.name}
                <IconButton onClick={()=>deleteHomeItem(item)}>
                    <Clear/>
                </IconButton></div>)
            }
            case "profile":{
                return (<div className="home-item">{item.profile.username}
                <IconButton onClick={()=>deleteHomeItem(item)}
            ><Clear/></IconButton></div>)
            }
        }
    }
const handleProfilePicture  = (e) => {
  e.preventDefault();
  const file = e.target.files?.[0];
  if (!file) return;

  

  // Validate type
  if (!file.type.startsWith('image/')) {
    setError('Please upload a valid image file.');
    return;
  }

  // Clean up any old preview URL
  if (image && (image.startsWith('blob:') || image.startsWith('data:'))) {
    URL.revokeObjectURL(image);
  }

  // Web preview logic
  if (!Capacitor.isNativePlatform()) {
    const newUrl = URL.createObjectURL(file);
    setImage(newUrl);
    handleChange("file",file);
    setPictureUrl(newUrl)
    // setError('');
    console.log('Preview URL (web):', newUrl);
  } else {

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPictureUrl(reader.result)
       handleChange("file",file);
    
      console.log('Preview (native, base64):', reader.result?.slice(0, 50));
    };
    reader.readAsDataURL(file);
  }
};

   
     if(!pending){
            return(
                <ErrorBoundary>
                <IonContent fullscreen={true}>
            <div >
                    <div  className="card my-4 text-emerald-800 max-w-96 items-center flex mx-auto p-3">
                      <label className="text-left flex flex-col "><h4 className="text-xl">Username:</h4>
                   
            
                            <input type="text"   
                                        className={" text-xl px-4 py-2 rounded-full  open-sans-medium text-emerald-800 bg-transparent border-2 border-emerald-800 border-2  "}
                                        value={params.username}
                                        onChange={(e)=>handleChange("username",e.target.value)
                                        }
                                         label="Username"/>
                                         </label>
                                          <div className='file'>
                   
                        <input
    className="file-input max-w-72 my-8 mx-auto "
        type="file"
        accept="image/*"
        onInput={(e)=>handleProfilePicture(e)}/>
             
     
          
          <img
          className="mx-auto"
            src={pictureUrl}
            alt="Selected"
            style={{ maxWidth: '10em', maxHeight: '300px', borderRadius: '10px' }}
          />
        
        
      
    
                    </div>
                    
                            <label className="text-left mt-4 " id="" >
                                <h6 className="mont-medium text-xl">Self Statement:</h6>
                               
                                    <textarea
                                    onChange={(e)=>{handleChange("selfStatement",e.target.value)}}
                                  
                                    value={params.selfStatement}
                                    className="textarea min-w-72 w-full  text-emerald-800 border-2 bg-transparent border-emerald-800 p-4 min-h-36 my-2"
                                    placeholder="Self Statement"/>
                            </label>
                            <div className="text-left">
                            {params.isPrivate?<button onClick={(e)=>{
                                e.preventDefault()
                                handleChange("isPrivate",false)}}className=" text-emerald-800 bg-emerald-50 hover:bg-green-100 mont-medium rounded-full border-emerald-700 border-2 text-xl text-emerald-800 text-bold">You are Private</button>:
                            <button 
                            onClick={(e)=>{
                                e.preventDefault()
                                handleChange("isPrivate",true)}}
                            className=" text-bold border-emerald-500  px-3 py-2 border-2 rounded-full text-emerald-800 bg-emerald-50 hover:bg-green-10 text-xl "><IonText>You are Public</IonText></button>}
   </div>
  <div className="mt-8">

                            <div
                               className="bg-emerald-800 bg-opacity-[60%] flex btn text-white px-4 py-3 w-full   rounded-full "
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e).then(()=>{})}
                            >
                                <IonText className="my-auto mx-auto text-2xl">Update</IonText>
                            </div>
                            </div>
                        <button 
                        className="rounded-full py-2 w-[10rem] mt-24 text-2xl  bg-golden text-white"
                                onClick={handleDeleteDialog}
                                id="open-modal" expand="block"
                        ><IonText>Delete</IonText> </button>
        
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


