import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';

const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pending,setPending]=useState(false)
    const location = useLocation();
    const [formerPage,setFormerPage]=useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(() => {
        if(!pending||currentProfile){
         setFormerPage(location.pathname)
            if(!currentProfile){
              navigate(Paths.login())
            }else{
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