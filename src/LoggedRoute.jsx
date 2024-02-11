import { Navigate,useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import PageSkeleton from "./components/PageSkeleton";
import { useEffect } from "react";

const LoggedRoute = ({ loggedOut, children }) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (loggedOut && localStorage.getItem('loggedIn') === null) {
        // console.log('This is the initial load');
    } else {
        if(localStorage.getItem('loggedIn') === true){
          
           navigateBack()
        }
    }
  }, []);
  const navigateBack = ()=>{
    navigate(-1)
  }
  const loading = useSelector(state=>state.users.loading)
  if(loading){
    return(<div>
      <PageSkeleton/>
    </div>)
  }else{
    return loggedOut? children : navigateBack();
  }};
  export default LoggedRoute