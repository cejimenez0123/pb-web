import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getCurrentProfile,updateProfile} from "../actions/UserActions";
import useAuth from "../core/useAuth";
import { getProfileLibraries } from "../actions/LibraryActions";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";


function SettingsContainer(props) {  
    const navigate = useNavigate()
    const [openModal, setOpenModal]= useState(false)
    const librariesOfProfile = useSelector(state=>state.libraries.librariesInView)
    let currentProfile = useSelector(state=>state.users.currentProfile)
    let auth = useAuth()
    const [newUsername,setNewUsername] = useState("")
    const [newBookmarkLibId,setNewBookmarkLibId] = useState("")
    const [newHomeLibraryId,setNewHomeLibraryId] = useState("")
    
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
            bookmarkLibraryId: newBookmarkLibId
            
        }
        dispatch(updateProfile(params)).then((result) => {
            console.log(`UPdate Profile ${JSON.stringify(result)}`)
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
        setOpenModal(false)
    }
    const libraryList = ()=>{
        return (
            <div>

          <InfiniteScroll
          dataLength={librariesOfProfile.length}
         
          hasMore={hasMore}
          next={getLibrariesOfProfile}
          loader={<p>Loading...</p>}
          endMessage={<p>No more data to load.</p>}
          scrollableTarget="scrollableDiv"
          >
          {librariesOfProfile.map(library=>{

            return (<div key={library.id}>
                    <h5>{library.name}</h5>
                    <button type="button" onClick={()=>onSelectBookmarkLibrary(library)}>Select</button>
               </div>)
                })}
          </InfiniteScroll>
           
            </div>
        )
    }
    if(!pending){
            return(<div className="container">
                    <form>
                        <label className="">
                            Username:
                            <input value={newUsername} placeholder="username" type="text" className=""/>
                        </label>
                        <label id="self-statement" className="">
                            Self Statement:
                            <textarea placeholder="Self Statement"/>
                        </label>
                        <label id="bookmark-library" className="">
                            Bookmark Library:
                            <input type="text" value={shownBookmarkLibrary}onClick={
                                ()=>{
                                    setOpenModal(!openModal)
                                }
                            }className=""/>
                        </label>
                        <label id="bookmark-library" className="">
                            Home Library:
                            <input type="text" onClick={
                                ()=>{
                                    setOpenModal(!openModal)
                                }
                            }className=""/>
                        </label>
                        <Modal isOpen={openModal} onClose={()=>{
                                setOpenModal(false)}
                        }
                        title={"Your Libraries"}
                        
                        >
                            <div>
                            {libraryList()}
                            </div>
                        </Modal>
                        <button onClick={(e)=>handleOnSubmit(e)}type="submit" className="">
                            Update
                        </button>
                    </form>
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
