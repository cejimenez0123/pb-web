import { Navigate,useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import PageSkeleton from "./components/PageSkeleton";
import { useEffect } from "react";

const LoggedRoute = ({ loggedOut, children }) => {
  const navigate = useNavigate()

  const currentProfile = useSelector(state=>state.users.currentProfile)
  const loading = useSelector(state=>state.users.loading)
  if(currentProfile){
    navigate("/discovery")
  }else{
    if(loading){
      return(<div>
        <PageSkeleton/>
      </div>)
    }else{
      return children 
  }
  }

};
  export default LoggedRoute