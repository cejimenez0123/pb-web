import { Navigate,useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import PageSkeleton from "./components/PageSkeleton";
import { useEffect } from "react";

const LoggedRoute = ({ loggedOut, children }) => {
  const navigate = useNavigate()


  // const loading = useSelector(state=>state.users.loading)
  // if(loading){
  //   return(<div>
  //     <PageSkeleton/>
  //   </div>)
  // }else{
    return children 
// }
};
  export default LoggedRoute