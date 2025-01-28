import {useNavigate,useLocation } from "react-router-dom";
import {useSelector} from "react-redux"
import { useEffect, useState } from "react";
import { useContext } from "react";
import Context from "./context";
import Paths from "./core/paths";
const LoggedRoute = ({ loggedOut, children }) => {
  
  const navigate = useNavigate()
  const location = useLocation();
  const currentProfile = useSelector(state=>state.users.currentProfile)

  const {formerPage,setFormerPage}=useContext(Context)
  useEffect(()=>{
   
    if(currentProfile){     
      // if(formerPage){
      //   if(formerPage==Paths.login()){
          navigate(Paths.myProfile())
        // }else{
        //   navigate(formerPage)
        // }
    
      // }else{
      //   navigate(Paths.myProfile())
      // }
    }

  },[currentProfile])
  useEffect(()=>{
      setFormerPage(location.pathname)
  },[location.pathname])

  return children

};
  export default LoggedRoute