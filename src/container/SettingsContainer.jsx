import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { uploadProfilePicture,updateProfile,deleteUserAccounts, fetchHomeCollection, updateHomeCollection, fetchArrayOfProfiles} from "../actions/UserActions";
import { btnStyle } from "../styles/styles";
import useAuth from "../core/useAuth";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import {    Button,
            TextField,
            FormGroup,
            TextareaAutosize,
            Checkbox,
            FormControlLabel,
            Dialog,
            DialogActions,
            DialogContent,
            styled,
            DialogContentText,
            DialogTitle,
            IconButton} from "@mui/material";
import "../styles/Setting.css"
import theme from "../theme"
import { fetchArrayOfPages, } from "../actions/PageActions";
import { fetchArrayOfBooks,} from "../actions/BookActions";
import { fetchArrayOfLibraries, } from "../actions/LibraryActions";
import checkResult from "../core/checkResult";
import { checkmarkStyle } from "../styles/styles";
import Paths from "../core/paths";
import { Clear } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import uuidv4 from "../core/uuidv4";
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
function SettingsContainer(props) {  
    const navigate = useNavigate()
    const [openModal, setOpenModal]= useState([false,"bookmark"])
    let auth = useAuth()
    const currentProfile=useSelector(state=>state.users.currentProfile)
    const [newUsername,setNewUsername] = useState("")
    const homeCollection = useSelector(state=>state.users.homeCollection)
    const [selfStatement,setSelfStatement] = useState("")
    const [profilePic,setProfilePic]=useState("")
    const [isPrivate,setPrivacy] = useState(false)
    const [homeItems,setHomeItems] = useState([])
    const [hasMoreHome,setHasMoreHome]=useState(false)
    const dispatch = useDispatch()
    let [pending,setPending] = useState(false)
    const [deleteDialog,setDeleteDialog] = useState(false);
    const [homePages,setHomePages] = useState([])
    const [homeBooks,setHomeBooks]=useState([])
    const [homeLibraries,setHomeLibraries]=useState([])
    const [homeProfiles,setHomeProfiles]=useState([])
    useEffect(()=>{
    // if(localStorage.getItem("loggedIn")==true){
        setUserInfo() 
    // }
   
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
        setHomeItems([])
       
       if(homeCollection){
            const pageParams = {pageIdList:homeCollection.pages}
            dispatch(fetchArrayOfPages(pageParams)).then(result=>checkResult(
                result,payload=>{
                    const {pageList}=payload
                    const list = pageList.filter(page=>page).map(page=>{return{ type:"page",page,id:page.id}})
                    setHomeItems(prevState=>[...prevState,...list])
                },err=>{

                }
            ))
            const bookParams = {bookIdList:homeCollection.books}
            dispatch(fetchArrayOfBooks(bookParams)).then(result=>checkResult(result,
                payload=>{
                    const {bookList}=payload
                    const list = bookList.filter(book=>book).map(book=>{return{type:"book",book,id:book.id}})
                    setHomeItems(prevState=>[...prevState,...list])
                },err=>{

                }))
            const libraryParams = {libraryIdList:homeCollection.libraries}
            dispatch(fetchArrayOfLibraries(libraryParams)).then(result=>
                checkResult(result,payload=>{
                    const {libraryList}=payload
                    const list = libraryList.filter(library=>library).map((library)=>{return {type:"library",library,id:library.id}})
                    setHomeItems(prevState=>[...prevState,...list])
                },err=>{

                }))
      
            const profileParams = {profileIdList:homeCollection.profiles}
            dispatch(fetchArrayOfProfiles(profileParams)).then(result=>
                checkResult(result,payload=>{
                    const {profileList} = payload
                    
                    const list = profileList.filter(profile=>profile).map(profile=>{return{ type:"profile",profile,id:profile.id}})
                    setHomeItems(prevState=>[...prevState,...list])
                },err=>{

                }))
        }
    }
    
    const fetchCollection = (profile)=>{
        if(homeCollection){
            setHomeCollection(homeCollection)

        }else{
            dispatch(fetchHomeCollection({profile:profile})).then(result=>
                checkResult(result,payload=>{
                    const {collection} = payload;
                    setHomeCollection(collection);
                },err=>{

                }))
        }
    }
    const setHomeCollection = ()=>{
        setHomePages([])
        setHomeBooks([])
        setHomeLibraries([])
        setHomeProfiles([])
        if(homeCollection){
            if(homeCollection.pages){setHomePages(homeCollection.pages)}
            if(homeCollection.books){ setHomeBooks(homeCollection.books)}
            if(homeCollection.libraries){setHomeLibraries(homeCollection.libraries)}
            if(homeCollection.profiles){setHomeProfiles(homeCollection.profiles)}
            fetchCollectionInfo(homeCollection)
        }
        
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
   
        setProfilePic(profile.profilePicture)
        setSelfStatement(profile.selfStatement)
        setPrivacy(profile.privacy)
        setPending(false)
        fetchCollection(profile)
    }
    const handleOnSubmit =(e)=>{
        e.preventDefault();
        if(currentProfile!=null){
        const params = {
            profile: currentProfile,
            username: newUsername,
            profilePicture: profilePic,
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
        const files = Array.from(e.target.files)
        const params = { file: files[0]
        }
        dispatch(uploadProfilePicture(params)).then((result) => {
            checkResult(result,(payload)=>{
                const {url}= payload
                setProfilePic(url)
            },(err)=>{
                window.alert(err.message)
                setSignUpError(true)
            })
    
        })
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
            return(<div style={{marginBottom:"2em"}}className="SettingsContainer">
                    <div  className="SettingForm">
                        <FormGroup>
                            <TextField  style={textfieldStyle} 
                                        className={"input text"}
                                        value={newUsername}
                                        onChange={(e)=>setNewUsername(e.target.value)
                                        }
                                         label="Username"/>
                                          <div className='file'>
                                <Button 
                                style={btnStyle}
                                
                                component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                   
                    Upload Picture
                    <VisuallyHiddenInput type="file"  name ='profile_picture'
                        onInput={(e)=>handleProfilePicture(e)}/>

                    </Button>
                    </div>
                            <img className="profile-pic" src={profilePic}/>
                            <label className="self-statement" id="self-statement" >
                                <h6>Self Statement:</h6>
                                <TextareaAutosize 
                                    style={{
                                        padding:"1em",
                                        borderRadius:textfieldStyle.borderRadius,
                                        color:theme.palette.primary.dark,
                                        backgroundColor:textfieldStyle.backgroundColor}}
                                    onChange={(e)=>{setSelfStatement(e.target.value)}}
                                    minRows={3}
                                    cols={30}
                                    value={selfStatement}
                                    
                                    placeholder="Self Statement"/>
                            </label>
                            <div style={{width:"100%"}}onClick={() => setOpenModal([!openModal[0],"bookmark"])}>
                  
                                    <FormControlLabel 
                                control={
                                    <Checkbox 
                                    style={checkmarkStyle}
                                        checked={isPrivate}
                                        onChange={()=>{
                                            setPrivacy(!isPrivate)
                                        }}
                                    />}
                                label="Private" 
                            />
                            </div>
                            <div style={{marginTop:"2em",marginBottom:"2em"}}>
                               <div><h5>Collection</h5></div> 
                            {collectionList()}
                            </div>
                    
                     
                            <Button 
                                style={{backgroundColor:theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText,
                                        padding:"1em",
                                        fontWeight:"bold",
                                        fontSize:"1em"}}
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                Update
                            </Button>
                        </FormGroup>
                        <Button className="delete"
                                onClick={handleClickOpen}
                                style={{marginTop: "4em",maxWidth:"10em",marginBottom: "5em",
                                        backgroundColor: theme.palette.error.main,
                                        color:theme.palette.error.contrastText}}
                        > Delete</Button>
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
