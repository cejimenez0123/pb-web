// import { useContext, useLayoutEffect,useState } from "react";
// import { useDispatch,useSelector } from "react-redux";
// import { updateProfile,deleteUserAccounts, deletePicture} from "../actions/UserActions";
// import {uploadProfilePicture} from "../actions/ProfileActions"
// import getDownloadPicture from "../domain/usecases/getDownloadPicture";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { useNavigate } from "react-router-dom";
// import {    Button,
    
//             Dialog,
//             DialogActions,
//             DialogContent,
    
//             DialogContentText,
//             DialogTitle,
//             IconButton} from "@mui/material";
// import "../styles/Setting.css"
// import theme from "../theme"

// import checkResult from "../core/checkResult";
// import { checkmarkStyle } from "../styles/styles";
// import Paths from "../core/paths";
// import { Clear } from "@mui/icons-material";

// import uuidv4 from "../core/uuidv4";
// import Context from "../context";

// function SettingsContainer(props) {  
//     const navigate = useNavigate()
//     const [openModal, setOpenModal]= useState([false,"bookmark"])
//     const{setError,currentProfile,setSuccess}=useContext(Context)

//     const [newUsername,setNewUsername] = useState("")
//     const homeCollection = useSelector(state=>state.users.homeCollection)
//     const [selfStatement,setSelfStatement] = useState(currentProfile&&currentProfile.selfStatement?currentProfile.selfStatement:"")
//     const [isPrivate,setPrivacy] = useState(false)
//     const [homeItems,setHomeItems] = useState([])
//     const [hasMoreHome,setHasMoreHome]=useState(false)
//     const dispatch = useDispatch()
//     const [file,setFile]=useState(null)
//     const [selectedImage,setSelectedImage]=useState()
//     const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
//     let [pending,setPending] = useState(false)
//     const [deleteDialog,setDeleteDialog] = useState(false);
  
//     useLayoutEffect( ()=>{
//         if(currentProfile){
//             setProfile(currentProfile)
//         }
//         if(currentProfile&& currentProfile.profilePic){
            
//             if(!currentProfile.profilePic.includes("http")){
//             getDownloadPicture(currentProfile.profilePic).then(url=>{
               
//                 setPictureUrl(url)
//             })
//         }else{
//             setSelectedImage(currentProfile.profilePic)
//             setPictureUrl(currentProfile.profilePic)
//         }
//     }
        
//     },[currentProfile])


  
//     const handleClickOpen = () => {
//         setDeleteDialog(true);
//     };
//     const handleAgree = () => {
//         dispatch(deleteUserAccounts()).then((res)=>{
//             checkResult(res,payload=>{
                
//               if(payload.message){
//                 setSuccess(payload.message)
//                 navigate("/")
//               }
           
//             },err=>{
//                 setError(err.message)
//             })
       
//         })
//     }
//     const handleClose = () => {
//         setDeleteDialog(false);
//     };

    
    
//     const setProfile = (profile)=>{
//         setPending(true)

//         setNewUsername(profile.username)
    
   
//         setSelectedImage(profile.profilePic)
//         setSelfStatement(profile.selfStatement)
//         setPrivacy(profile.privacy)
//         setPending(false)
//         // fetchCollection(profile)
//     }
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
//                         window.alert("Updated")
//                     },err=>{
//                         window.alert(err.message)
//                     }
        
//                 ))
//             },(err)=>{
//                 window.alert(err.message)
//                 setSignUpError(true)
//             })
    
//         })}else{
//             const params = {
//                 profile: currentProfile,
//                 username: newUsername,
//                 profilePicture: currentProfile.fileName,
//                 selfStatement: selfStatement,
//                 privacy: isPrivate
                
//             }
//             dispatch(updateProfile(params)).then((result) =>checkResult(result,
//                 payload=>{
//                     window.alert("Updated")
//                 },err=>{
//                     window.alert(err.message)
//                 }
    
//             ))
//         }
       
            
    
//     }   
//         // dispatch(updateHomeCollection({
//         //     profile:currentProfile,
//         //     pages:homePages,
//         //     books:homeBooks,
//         //     libraries:homeLibraries,
//         //     profiles:homeProfiles})).then(result=>checkResult(result,payload=>{
//         //         window.alert("Updated Collection")
//         //     },err=>{
                
//         //     }))
//     } 
//     const DeleteDialog = ()=> <Dialog
//     open={deleteDialog}
//     onClose={handleClose}
//     aria-labelledby="alert-dialog-title"
//     aria-describedby="alert-dialog-description"
//   >
//     <DialogTitle id="alert-dialog-title">
//       {"Are you sure you want to delete your account?"}
//     </DialogTitle>
//     <DialogContent>
//       <DialogContentText id="alert-dialog-description">
//         Deleting your account can't be reversed
//       </DialogContentText>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={handleClose}>Disagree</Button>
//       <Button onClick={handleAgree} autoFocus>
//         Agree
//       </Button>
//     </DialogActions>
//   </Dialog>  
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
//             return(<div >
//                     <div  className="card my-4 text-emerald-800 max-w-96 items-center flex mx-auto p-3">
//                       <label className="text-left flex flex-col mont-medium"><h4 className="text-xl">Username:</h4>
//                             <input type="text"   
//                                         className={" text-xl px-4 py-2 rounded-full  open-sans-medium text-emerald-800 bg-transparent border-2 border-emerald-800 border-2  "}
//                                         value={newUsername}
//                                         onChange={(e)=>setNewUsername(e.target.value)
//                                         }
//                                          label="Username"/></label>
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
//             style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
//           />
        
        
      
    
//                     </div>
                    
//                             <label className="text-left mt-4 " id="" >
//                                 <h6 className="mont-medium text-xl">Self Statement:</h6>
                               
//                                     <textarea
//                                     onChange={(e)=>{setSelfStatement(e.target.value)}}
                                  
//                                     value={selfStatement}
//                                     className="textarea min-w-72 w-full  text-emerald-800 border-2 bg-transparent border-emerald-800 p-4 min-h-36 my-2"
//                                     placeholder="Self Statement"/>
//                             </label>
//                             <div className="text-left">
//                             {isPrivate?<button onClick={(e)=>{
//                                 e.preventDefault()
//                                 setPrivacy(false)}}className=" text-emerald-800 bg-emerald-50 hover:bg-green-100 mont-medium rounded-full border-emerald-700 border-2 text-xl text-emerald-800 text-bold">You are Private</button>:
//                             <button 
//                             onClick={(e)=>{
//                                 e.preventDefault()
//                                 setPrivacy(true)}}
//                             className=" text-bold border-emerald-500  h-18 w-24 border-2 rounded-full text-emerald-800 bg-emerald-50 hover:bg-green-10 text-xl mont-medium">You are Public</button>}
//    </div>
//   <div className="mt-8">

//                             <button
//                                className="bg-emerald-800 text-white h-18 w-24 mont-medium rounded-full text-2xl"
//                                 variant="outlined" 
//                                 onClick={(e)=>handleOnSubmit(e)}
//                             >
//                                 Update
//                             </button>
//                             </div>
//                         <button className="rounded-full py-2 w-[10rem] mt-24 text-2xl mont-medium bg-orange-800 text-white"
//                                 onClick={handleClickOpen}
                            
//                         > Delete</button>
//                         <DeleteDialog/>
        
//                         </div>
//             </div>)
//     }else{
//         return(<div>
//             Something's wrong
//         </div>)
//     }


// }





// export default SettingsContainer
import { useContext, useLayoutEffect,useRef,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateProfile,deleteUserAccounts, deletePicture} from "../actions/UserActions";
import {uploadProfilePicture} from "../actions/ProfileActions"
import getDownloadPicture from "../domain/usecases/getDownloadPicture";
import "../App.css"
import { useNavigate } from "react-router-dom";
// import {    Button,
    
//             // Dialog,
//             DialogActions,
//             DialogContent,
    
//             DialogContentText,
//             DialogTitle,
//             IconButton} from "@mui/material";
        
import "../styles/Setting.css"
import { IonModal,IonHeader,
  IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,IonInput, IonItem,IonButton 
    } from "@ionic/react"

import checkResult from "../core/checkResult";

// import { Clear } from "@mui/icons-material";

import Context from "../context";

import DeviceCheck from "../components/DeviceCheck";

export default function SettingsContainer(props) {  
    const navigate = useNavigate()
    const [openModal, setOpenModal]= useState([false,"bookmark"])
    const modal = useRef(null)
    const{setError,currentProfile,setSuccess}=useContext(Context)
    const isNative = DeviceCheck()
    const [newUsername,setNewUsername] = useState("")
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const [selfStatement,setSelfStatement] = useState(currentProfile&&currentProfile.selfStatement?currentProfile.selfStatement:"")
    const [isPrivate,setPrivacy] = useState(false)
    const [homeItems,setHomeItems] = useState([])
    const [hasMoreHome,setHasMoreHome]=useState(false)
    const dispatch = useDispatch()
    const [file,setFile]=useState(null)
    const [selectedImage,setSelectedImage]=useState()
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    let [pending,setPending] = useState(false)
    const [deleteDialog,setDeleteDialog] = useState(false);
  
    useLayoutEffect( ()=>{
        if(currentProfile){
            setProfile(currentProfile)
        }
        if(currentProfile&& currentProfile.profilePic){
            
            if(!currentProfile.profilePic.includes("http")){
            getDownloadPicture(currentProfile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else{
            setSelectedImage(currentProfile.profilePic)
            setPictureUrl(currentProfile.profilePic)
        }
    }
        
    },[currentProfile])


  
    const handleClickOpen = () => {
        setDeleteDialog(true);
    };
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
        setDeleteDialog(false);
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
          console.log(pictureUrl)
          
        }
 
    }
   
     if(!pending){
            return(
                // <IonContent>
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
                               className="bg-emerald-800 text-white h-18 w-24 mont-medium rounded-full text-2xl"
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                Update
                            </button>
                            </div>
                        <button 
                        className="rounded-full py-2 w-[10rem] mt-24 text-2xl mont-medium bg-orange-800 text-white"
                                onClick={handleClickOpen}
                                id="open-modal" expand="block"
                        > Delete</button>
                        <Dialog agree={handleAgree} 
                        onClose={handleClose}title={"Are you sure you want to delete your account?"}
                        text={"Deleting your account can't be reversed"}isOpen={deleteDialog}/>
                        {/* <DeleteDialog/>
         */}
                        </div>
            </div>
        //   </IonContent>
        )
    }else{
        return(<div>
            Something's wrong
        </div>)
    }


}

