import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useEffect, useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';

const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pending,setPending]=useState(false)
    const location = useLocation();
    const token = localStorage.getItem("token")
    const [formerPage,setFormerPage]=useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(() => {
        if(!pending||token){
            if(!token){
              navigate(Paths.login())
            }else{
              navigate(formerPage)
            }
    }
    }, [currentProfile]);
    useEffect(()=>{
      setFormerPage(location.pathname)
    },[location.pathname])
    useLayoutEffect(()=>{
      if(!currentProfile){
        dispatch(getCurrentProfile())
      }
    },[])
    if(!currentProfile||pending){
      return <div style={{color:"white"}}>Loading...</div>
    }

      
    return children
    
  };
export default PrivateRoute;