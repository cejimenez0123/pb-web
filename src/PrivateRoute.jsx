import {useNavigate,useLocation} from 'react-router-dom';
import {useSelector}  from "react-redux"
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useEffect, useLayoutEffect, useState } from 'react';
import { getCurrentProfile } from './actions/UserActions';
import checkResult from './core/checkResult';

const PrivateRoute = ({loggedIn, children }) => {
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [pending,setPending]=useState(true)
    const location = useLocation();

    const [formerPage,setFormerPage]=useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useLayoutEffect(() => {
      const token = localStorage.getItem("token")
      
    if(token){
      if(pending){
        navigate(formerPage)
      }
     
    }else{
      navigate(Paths.login())
     
    }
    }, [currentProfile]);
    useEffect(()=>{
      setFormerPage(location.pathname)
    },[location.pathname])
    useLayoutEffect(()=>{
      if(!currentProfile){
        dispatch(getCurrentProfile()).then(res=>{
          checkResult(res,payload=>{
            setPending(false)
          },err=>{
            setPending(false)
            navigate(formerPage)
          })
        })
      }else{
        setPending(false)
      }
    },[])
    if(pending){
      return <div style={{color:"white"}}>Loading...</div>
    }

      
    return children
    
  };
export default PrivateRoute;