import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentProfile } from "../actions/UserActions";
import { UseSelector } from "react-redux/es/hooks/useSelector";
import useAuth from "../core/useAuth";
import { getProfileLibraries } from "../actions/LibraryActions";
function SettingsContainer() {  
    const [openModal, setOpenModal]= useState(false)
    const librariesOfProfile = useSelector(state=>state.libraries.librariesInView)
    let currentProfile = useSelector(state=>state.users.currentProfile)
    let auth = useAuth()
    const [authState,setAuthState]=useState(auth)
    const dispatch = useDispatch()
    let [pending,setPending] = useState(false)

    useEffect(()=>{
            if(currentProfile==null){
                setPending(true)
                const params = {userId: authState.user.uid}
                dispatch(getCurrentProfile(params))
                dispatch(getCurrentLibraries(params))
            }else{
                setPending(false)
            }
           

    },[])
    const libraryList = ()=>{
        return (
            <div>

          
            {librariesOfProfile.map(libraires=>{

                return (<div>
                    
                    {libr}
                    </div>)
            })}
            </div>
        )
    }
    if(!pending){
            return(<div className="container">
                    <form>
                        <label className="">
                            Username:
                            <input type="text" className=""/>
                        </label>
                        <label id="self-statement" className="">
                            Self Statement:
                            <textarea/>
                        </label>
                        <label id="bookmark-library" className="">
                            <input type="text" onClick={
                                ()=>{
                                    setOpenModal(!openModal)
                                }
                            }className=""/>
                        </label>
                        <Modal isOpen={openModal} onClose={
                                setOpenModal(false)
                        }
                        title={"Your Libraries"}
                        
                        >
                            <div>

                            </div>
                        </Modal>
                        <button type="submit" className="">
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
