import {useNavigate,useLocation } from "react-router-dom";
import {useSelector} from "react-redux"
import { useEffect, useLayoutEffect,useState } from "react";
import { useContext } from "react";
import Context from "./context";
import Paths from "./core/paths";
const LoggedRoute = ({ loggedOut,currentProfile, children }) => {
 
  const navigate = useNavigate()
  const location = useLocation()
  const { formerPage,setFormerPage}=useContext(Context)
  useLayoutEffect(()=>{
   
    if(currentProfile){  
        
      if (location.pathname.includes("login")){
        navigate(Paths.myProfile())
      }else if(!formerPage.includes("login")&&!formerPage.includes("onboard")){
        navigate(formerPage)
      } else{
        navigate(Paths.myProfile())
      }
    }

  },[currentProfile])
  useEffect(()=>{
      setFormerPage(location.pathname)
  },[location.pathname])

  return children

};
  export default LoggedRoute