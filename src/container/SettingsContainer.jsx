import { useLayoutEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { updateProfile,deleteUserAccounts, fetchHomeCollection, updateHomeCollection, deletePicture} from "../actions/UserActions";
import {uploadProfilePicture} from "../actions/ProfileActions"
import getDownloadPicture from "../domain/usecases/getDownloadPicture";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import {    Button,
    
            Dialog,
            DialogActions,
            DialogContent,
    
            DialogContentText,
            DialogTitle,
            IconButton} from "@mui/material";
import "../styles/Setting.css"
import theme from "../theme"

import checkResult from "../core/checkResult";
import { checkmarkStyle } from "../styles/styles";
import Paths from "../core/paths";
import { Clear } from "@mui/icons-material";

import uuidv4 from "../core/uuidv4";

function SettingsContainer(props) {  
    const navigate = useNavigate()
    const [openModal, setOpenModal]= useState([false,"bookmark"])
    const [errorMessage, setErrorMessage] = useState('');
    const currentProfile=useSelector(state=>state.users.currentProfile)
    const [newUsername,setNewUsername] = useState(currentProfile.username)
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const [selfStatement,setSelfStatement] = useState(currentProfile.selfStatement)
    const [isPrivate,setPrivacy] = useState(false)
    const [homeItems,setHomeItems] = useState([])
    const [hasMoreHome,setHasMoreHome]=useState(false)
    const dispatch = useDispatch()
    const [file,setFile]=useState(null)
    const [selectedImage,setSelectedImage]=useState()
    const [pictureUrl,setPictureUrl]=useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s")
    let [pending,setPending] = useState(false)
    const [deleteDialog,setDeleteDialog] = useState(false);
    const [homePages,setHomePages] = useState([])
    const [homeBooks,setHomeBooks]=useState([])
    const [homeLibraries,setHomeLibraries]=useState([])
    const [homeProfiles,setHomeProfiles]=useState([])
   
    useLayoutEffect( ()=>{
        if(!currentProfile.profilePic.includes("http")){
            getDownloadPicture(currentProfile.profilePic).then(url=>{
               
                setPictureUrl(url)
            })
        }else{
            setPictureUrl(currentProfile.profilePic)
        }
        
        
    },[])
   
    const setUserInfo = () => {
        
        if(currentProfile){

        
        setProfile(currentProfile)
        }else{
            navigate(
            Paths.login()
            )
        }
    }
    
    const fetchCollectionInfo =()=>{
       
    }

  
    const handleClickOpen = () => {
        setDeleteDialog(true);
    };
    const handleAgree = () => {
        dispatch(deleteUserAccounts()).then(()=>{
            navigate("/")
        })
    }
    const handleClose = () => {
        setDeleteDialog(false);
    };

   
    
    const setProfile = (profile)=>{
        setPending(true)
        if(newUsername.length<=0){
            setNewUsername(profile.username)
        }
   
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
        dispatch(updateHomeCollection({
            profile:currentProfile,
            pages:homePages,
            books:homeBooks,
            libraries:homeLibraries,
            profiles:homeProfiles})).then(result=>checkResult(result,payload=>{
                window.alert("Updated Collection")
            },err=>{
                
            }))
    } 
    const DeleteDialog = ()=> <Dialog
    open={deleteDialog}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Are you sure you want to delete your account?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Deleting your account can't be reversed
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Disagree</Button>
      <Button onClick={handleAgree} autoFocus>
        Agree
      </Button>
    </DialogActions>
  </Dialog>  
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
            setErrorMessage('Please upload a valid image file.');
           
            return;
          }
          setFile(file)
          setErrorMessage('');
          setPictureUrl(URL.createObjectURL(file))
          
        }
 
    }
    const collectionList = ()=>{
        return (
            <div className="collection">
                <InfiniteScroll
                    dataLength={homeItems.length}
                    hasMore={hasMoreHome}
                    next={()=>fetchCollectionInfo(homeCollection)}
                    loader={<p>Loading...</p>}
                    endMessage={<p>No more data to load.</p>}
                    scrollableTarget="scrollableDiv"
          >
            {homeItems.map((item)=>{
            return <div key={item.id+`_${uuidv4()}`}>{homeItem(item)}</div>
            })}
          </InfiniteScroll>
           
            </div>
        )
    }
    const textfieldStyle = {backgroundColor:theme.palette.primary.extraLight,borderRadius:"8px",width:"100%" }
    if(!pending){
            return(<div >
                    <div  className="my-4 max-w-96 mx-auto p-3">
                      <label className="text-left">Username:
                            <input type="text"  style={textfieldStyle} 
                                        className={"input text-white bg-transparent border border-white "}
                                        value={newUsername}
                                        onChange={(e)=>setNewUsername(e.target.value)
                                        }
                                         label="Username"/></label>
                                          <div className='file'>
                   
                        <input
    className="file-input my-8 mx-auto max-w-48"
        type="file"
        accept="image/*"
        onInput={(e)=>handleProfilePicture(e)}/>
             
        <div style={{ marginTop: '20px' }}>
          
          <img
          className="mx-auto"
            src={pictureUrl}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
          />
        </div>
        
      
    
                    </div>
                    
                            <label className="text-left mt-4 " id="" >
                                <h6 >Self Statement:</h6>
                               
                                    <textarea
                                    onChange={(e)=>{setSelfStatement(e.target.value)}}
                                  
                                    value={selfStatement}
                                    className="textarea min-w-72 w-full bg-transparent text-white border border-white p-4 min-h-36 my-2"
                                    placeholder="Self Statement"/>
                            </label>
                            <div className="text-left">
                            {isPrivate?<button onClick={()=>setPrivacy(false)}className=" text-white btn text-bold">You are Private</button>:
                            <button 
                            onClick={()=>setPrivacy(true)}
                            className="btn  text-bold text-white">You are Public</button>}
   </div>
  <div className="mt-8">

                            <button
                               className="bg-emerald-800 text-white"
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                Update
                            </button>
                            </div>
                        <button className="delete"
                                onClick={handleClickOpen}
                                // style={{marginTop: "4em",maxWidth:"10em",marginBottom: "5em",
                                //         backgroundColor: theme.palette.error.main,
                                //         color:theme.palette.error.contrastText}}
                        > Delete</button>
                        <DeleteDialog/>
        
                        </div>
            </div>)
    }else{
        return(<div>
            Something's wrong
        </div>)
    }


}





export default SettingsContainer
