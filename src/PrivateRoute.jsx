import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';

const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const loading = useSelector(state=>state.users.loading)
    const location = useLocation();
    const [formerPage,setFormerPage]=useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(() => {
      setFormerPage(location.pathname)
        if(!currentProfile){
          navigate(Paths.login())
        }else{
          if(loading){
        
            navigate(formerPage)
          }
        
        
      }
    }, [location.pathname]);
    useLayoutEffect(()=>{
      if(!currentProfile){
        dispatch(getCurrentProfile())
      }
    },[])
    if(!currentProfile){
      return <div style={{color:"white"}}>Loading...</div>
    }

      
    return children
    
  };
export default PrivateRoute;