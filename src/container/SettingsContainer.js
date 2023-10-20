import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getCurrentProfile,updateProfile} from "../actions/UserActions";
import useAuth from "../core/useAuth";
import { getProfileLibraries } from "../actions/LibraryActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { Button,TextField,FormGroup,TextareaAutosize,Checkbox,FormControlLabel } from "@mui/material";
import "../styles/Setting.css"
import theme from "../theme"
function SettingsContainer(props) {  
    const navigate = useNavigate()
    const [openModal, setOpenModal]= useState([false,"bookmark"])
    const librariesOfProfile = useSelector(state=>state.libraries.librariesInView)
    let currentProfile = useSelector(state=>state.users.currentProfile)
    let auth = useAuth()
    const [newUsername,setNewUsername] = useState("")
    const [newBookmarkLibId,setNewBookmarkLibId] = useState("")
    const [newHomeLibraryId,setNewHomeLibraryId] = useState("")
    const [nameHomeLibrary,setHomeLibraryName]=useState("")
    const [selfStatement,setSelfStatement] = useState("")
    const [isPrivate,setPrivacy] = useState(false)
    const [shownBookmarkLibrary, setShownBookmarkLibrary] = useState("")
    const [authState,setAuthState]=useState(auth)
    const dispatch = useDispatch()
    const [hasMore,setHasMore]=useState(true)
    let [pending,setPending] = useState(false)
    
    useEffect(()=>{
            if(currentProfile!=null){
                setPending(true)
                if(newUsername.length<=0){
                    setNewUsername(currentProfile.username)
                }
                if(newBookmarkLibId.length<=0){
                    setNewBookmarkLibId(currentProfile.bookmarkLibraryId)

                }
                
                setPrivacy(currentProfile.privacy)
                getLibrariesOfProfile()
                setPending(false)
              
            }else{
                
                setPending(true)
                if(authState.user==null){
                    navigate("/login")


                }else{
                    const params = {userId: authState.user.uid}
                    dispatch(getCurrentProfile(params))
                  
            }
               
                
            }
           

    },[])
    const handleOnSubmit =(e)=>{
        e.preventDefault();
        if(currentProfile!=null){
        const params = {
            profile: currentProfile,
            username: newUsername,
            bookmarkLibraryId: newBookmarkLibId,
            homeLibraryId: newHomeLibraryId,
            selfStatement: selfStatement,
            privacy: isPrivate
            
        }
        dispatch(updateProfile(params)).then((result) => {
            
        }).catch((err) => {
            
        });
    }
    }   
    const getLibrariesOfProfile = ()=>{
        if(currentProfile!=null){
        const params = {profile: currentProfile}
        dispatch(getProfileLibraries(params)).then((result) => {

          const lib =  librariesOfProfile.find((lib)=>{return lib.id == newBookmarkLibId})
            setShownBookmarkLibrary(lib.name)
        }).catch((err) => {
            
        });
        }
    }
    const onSelectBookmarkLibrary=(library)=>{
        setNewBookmarkLibId(library.id)
        setShownBookmarkLibrary(library.name)
        setOpenModal([false,"bookmark"])
    }
    const onSelectHomeLibrary=(library)=>{
        setNewHomeLibraryId(library.id)
        setHomeLibraryName(library.name)
        setOpenModal([false,"home"])
    }
    const libraryList = ()=>{
        return (
            <div className="library-list">

          <InfiniteScroll
          dataLength={librariesOfProfile.length}
         
          hasMore={hasMore}
          next={getLibrariesOfProfile}
          loader={<p>Loading...</p>}
          endMessage={<p>No more data to load.</p>}
          scrollableTarget="scrollableDiv"
          >
          {librariesOfProfile.map(library=>{

            return (<div className="library-item" key={library.id}>
                    <h5>{library.name}</h5>
                    <Button type="button" onClick={()=>{
                        switch(openModal[1]){
                            case "home":{
                                onSelectHomeLibrary(library)
                            }
                            case "bookmark":{
                                onSelectBookmarkLibrary(library)
                            }
                        }
                    }}>Select</Button>
               </div>)
                })}
          </InfiniteScroll>
           
            </div>
        )
    }
    if(!pending){
            return(<div className="container">
                    <div className="settings">
                        <FormGroup className="form">
                            <TextField  style={{backgroundColor:theme.palette.secondary.contrastText}}
                                        className={"input text"}
                                        value={newUsername}
                                         label="Username"/>
                            <label className="self-statement" id="self-statement" >
                                <h6>Self Statement:</h6>
                                <TextareaAutosize 
                                    onChange={(e)=>{setSelfStatement(e.target.value)}}
                                    minRows={3}
                                    cols={30}
                                    style={{padding:"1em"}}
                                    placeholder="Self Statement"/>
                            </label>
                            <div style={{width:"100%"}}onClick={() => setOpenModal([!openModal[0],"bookmark"])}>
                            <TextField 
                                style={{backgroundColor:theme.palette.secondary.contrastText,width:"100%"}}       
                                className={"input text"}
                                label="Bookmark Library" 
                                type="text" value={shownBookmarkLibrary}
                                InputProps={{
                                    readOnly: true, // Make the TextField read-only
                                }}
                            />
                            </div>
                            <div style={{width:"100%"}}onClick={() => setOpenModal([!openModal[0],"home"])}>
                                <TextField 
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    className={"input text"}
                                    style={{backgroundColor:theme.palette.secondary.contrastText,width:"100%"}}
                                    label="Home Library" 
                                    type="text" />
                            </div>
                            <FormControlLabel 
                                control={
                                    <Checkbox 
                                        checked={isPrivate}
                                        onChange={()=>{
                                            setPrivacy(!isPrivate)
                                        }}
                                    />}
                                label="Private" 
                            />
                            <Modal 
                                isOpen={openModal[0]} 
                                onClose={()=>{
                                    setOpenModal([false,"bookmark"])}
                                }
                                title={"Your Libraries"}
                            >
                                <div>
                                    {libraryList()}
                                </div>
                            </Modal>
                            <Button 
                                style={{backgroundColor:theme.palette.secondary.main,
                                        color:theme.palette.secondary.contrastText}}
                                variant="outlined" 
                                onClick={(e)=>handleOnSubmit(e)}
                            >
                                Update
                            </Button>
                        </FormGroup>
                        <Button className="delete"
                            style={{backgroundColor: theme.palette.error.main,color:theme.palette.error.contrastText}}
                        > Delete</Button>
                        </div>
            </div>)
    }else{
        return(<div>

        </div>)
    }


}



const Modal = ({ isOpen, onClose, title, children }) => {
  const modalStyle = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '1',
  };

  const contentStyle = {
    backgroundColor: '#fff',
    margin: '10% auto',
    padding: '20px',
    borderRadius: '5px',
    width: '80%',
    maxWidth: '600px',
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2>{title}</h2>
        {children}
        <button type="button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsContainer
