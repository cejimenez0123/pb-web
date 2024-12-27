import { Navigate,useNavigate,useLocation } from "react-router-dom";
import {useSelector} from "react-redux"
import PageSkeleton from "./components/PageSkeleton";
import { useEffect, useState } from "react";
import { useContext } from "react";
import Context from "./context";
const LoggedRoute = ({ loggedOut, children }) => {
  
  const navigate = useNavigate()
  const location = useLocation();
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const loading = useSelector(state=>state.users.loading)
  const [formerPage,setFormerPage]=useContext(Context)
  useEffect(()=>{
   
    if(currentProfile && !loading){     
      if(formerPage){
        navigate(formerPage)
      }
    }
  },[currentProfile,location,navigate])


  return children

};
  export default LoggedRoute