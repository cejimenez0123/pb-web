import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useEffect, useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';
import checkResult from './core/checkResult';
import loading from "./images/loading.gif"
import usePersistentCurrentProfile from './domain/usecases/useCurrentProfileCache';
const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pending,setPending]=useState(true)
    const location = useLocation();
    usePersistentCurrentProfile(()=>dispatch(getCurrentProfile()))
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
    useLayoutEffect(()=>{
      setPending(true)

        dispatch(getCurrentProfile()).then(res=>{
          checkResult(res,payload=>{
    
            setPending(false)
          },err=>{
          setPending(false)
            if(formerPage){
              navigate(formerPage)
            }else{
              navigate(Paths.login())
            }
          
          })
        })
    
    },[])
   
    if(pending){
      return <div className='flex '><img className='mx-auto my-24 max-h-36 max-w-36' src={loading}/></div>
    }

      
    return children
    
  };
export default PrivateRoute;