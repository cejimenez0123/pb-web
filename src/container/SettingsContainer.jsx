import { useContext, useLayoutEffect,useRef,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateProfile,deleteUserAccounts, deletePicture, setDialog} from "../actions/UserActions";
import {uploadProfilePicture} from "../actions/ProfileActions"
import "../App.css"
import { useNavigate } from "react-router-dom";
import "../styles/Setting.css"
import checkResult from "../core/checkResult";
import Context from "../context";
import { IonContent } from "@ionic/react";
import Enviroment from "../core/Enviroment";
export default function SettingsContainer(props) {  
    const navigate = useNavigate()
    const{setError,currentProfile,setSuccess,dialog}=useContext(Context)
    const [newUsername,setNewUsername] = useState("")
    const [selfStatement,setSelfStatement] = useState(currentProfile&&currentProfile.selfStatement?currentProfile.selfStatement:"")
    const [isPrivate,setPrivacy] = useState(false)
    const [homeItems,setHomeItems] = useState([])
    const dispatch = useDispatch()
    const [file,setFile]=useState(null)
    const [selectedImage,setSelectedImage]=useState()
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    let [pending,setPending] = useState(false)
  
    useLayoutEffect( ()=>{
        if(currentProfile){
            setProfile(currentProfile)
        }
        if(currentProfile&& currentProfile.profilePic){
            
            if(!currentProfile.profilePic.includes("http")){
                setPictureUrl(Enviroment.imageProxy(currentProfile.profilePic))
            // getDownloadPicture(currentProfile.profilePic).then(url=>{
               
            //     setPictureUrl(url.full)
            // })
        }else{
            setSelectedImage(currentProfile.profilePic)
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

        setNewUsername(profile.username)
    
   
        setSelectedImage(profile.profilePic)
        setSelfStatement(profile.selfStatement)
        setPrivacy(profile.privacy)
        setPending(false)
        // fetchCollection(profile)
    }
    const handleOnSubmit =(e)=>{
        e.preventDefault();
        if(currentProfile!=null){
                   const fileParams = { file: file
        }

       if(file){

        dispatch(deletePicture({fileName:currentProfile.profilePic}))
        dispatch(uploadProfilePicture(fileParams)).then((result) => {
            checkResult(result,(payload)=>{

                const params = {
                    profile: currentProfile,
                    username: newUsername,
                    profilePicture: payload.fileName,
                    selfStatement: selfStatement,
                    privacy: isPrivate
                    
                }
                dispatch(updateProfile(params)).then((result) =>checkResult(result,
                    payload=>{
                        window.alert("Updated")
                    },err=>{
                        window.alert(err.message)
                    }
        
                ))
            },(err)=>{
                window.alert(err.message)
                setSignUpError(true)
            })
    
        })}else{
            const params = {
                profile: currentProfile,
                username: newUsername,
                profilePicture: currentProfile.fileName,
                selfStatement: selfStatement,
                privacy: isPrivate
                
            }
            dispatch(updateProfile(params)).then((result) =>checkResult(result,
                payload=>{
                    window.alert("Updated")
                },err=>{
                    window.alert(err.message)
                }
    
            ))
        }
       
            
    
    }   

    } 
   
    const handleDeleteDialog=()=>{
        let dia = {...dialog}
        dia.agree={handleAgree} 
        dia.onClose={handleClose}
        dia.title=("Are you sure you want to delete your account?")
                        dia.text=("Deleting your account can't be reversed")
                        dia.agreeText ="Delete"
    

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
    const handleProfilePicture =(e)=>{
        
        const file = e.target.files[0];

        if (file) {
          // Check file type
          if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
           
            return;
          }
          setFile(file)
          setError('');
          setPictureUrl(URL.createObjectURL(file))

          
        }
 
    }
   
     if(!pending){
            return(
                <IonContent fullscreen={true}>
            <div >
                    <div  className="card my-4 text-emerald-800 max-w-96 items-center flex mx-auto p-3">
                      <label className="text-left flex flex-col mont-medium"><h4 className="text-xl">Username:</h4>
                   
                      {/* <IonInput   
                    
                                        value={newUsername}
                                     
                                        onChange={(e)=>setNewUsername(e.target.value)}
                                             label="Username"/>
                                             </IonItem> */}
                            <input type="text"   
                                        className={" text-xl px-4 py-2 rounded-full  open-sans-medium text-emerald-800 bg-transparent border-2 border-emerald-800 border-2  "}
                                        value={newUsername}
                                        onChange={(e)=>setNewUsername(e.target.value)
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
                                    onChange={(e)=>{setSelfStatement(e.target.value)}}
                                  
                                    value={selfStatement}
                                    className="textarea min-w-72 w-full  text-emerald-800 border-2 bg-transparent border-emerald-800 p-4 min-h-36 my-2"
                                    placeholder="Self Statement"/>
                            </label>
                            <div className="text-left">
                            {isPrivate?<button onClick={(e)=>{
                                e.preventDefault()
                                setPrivacy(false)}}className=" text-emerald-800 bg-emerald-50 hover:bg-green-100 mont-medium rounded-full border-emerald-700 border-2 text-xl text-emerald-800 text-bold">You are Private</button>:
                            <button 
                            onClick={(e)=>{
                                e.preventDefault()
                                setPrivacy(true)}}
                            className=" text-bold border-emerald-500  h-18 w-24 border-2 rounded-full text-emerald-800 bg-emerald-50 hover:bg-green-10 text-xl mont-medium">You are Public</button>}
   </div>
  <div className="mt-8">

                            <button
                               className="bg-emerald-800 btn text-white px-2 py-2 mont-medium rounded-full text-2xl"
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                Update
                            </button>
                            </div>
                        <button 
                        className="rounded-full py-2 w-[10rem] mt-24 text-2xl mont-medium bg-orange-800 text-white"
                                onClick={handleDeleteDialog}
                                id="open-modal" expand="block"
                        > Delete</button>
        
                        </div>
            </div>
          </IonContent>
        )
    }else{
        return(<div>
            Something's wrong
        </div>)
    }


}


