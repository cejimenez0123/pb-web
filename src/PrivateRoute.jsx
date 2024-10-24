import { Navigate,useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import PageSkeleton from './components/PageSkeleton';
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';
import { get } from 'lodash';
import Context from './context';
const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const loading = useSelector(state=>state.users.loading)
    const location = useLocation();
    const [formerPage,setFormerPage]=useContext(Context)
  
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
      setFormerPage(location.pathname)
        if(!currentProfile){
          navigate(Paths.login())
        }else{
          if(loading){
            navigate(formerPage)
          }
        
        
      }
    }, [currentProfile, navigate, location]);
    useEffect(()=>{
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