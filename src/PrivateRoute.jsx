import {useNavigate,useLocation} from 'react-router-dom';
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useContext, useEffect, useLayoutEffect, useState } from 'react';
import loading from "./images/loading.gif"
import Context from './context';
const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useContext(Context)
    const [pending,setPending]=useState(true)
    const location = useLocation();
    // usePersistentCurrentProfile(()=>dispatch(getCurrentProfile()))
    const [formerPage,setFormerPage]=useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
   
    useLayoutEffect(() => {
    if(currentProfile&&currentProfile.id){
        setPending(false)
    }else{
      if(!pending){
        navigate(Paths.login())
      }
    
    }
    }, [currentProfile]);
    useEffect(()=>{
     if(location.pathname){
      setFormerPage(location.pathname)
     }

    },[location.pathname])
  

   
    if(!currentProfile){
      return <div className='flex '><img className='mx-auto my-24 max-h-36 max-w-36' src={loading}/></div>
    }

      
    return children
    
  };
export default PrivateRoute;