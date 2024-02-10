import { Navigate,useNavigate } from 'react-router-dom';
import {useSelector}  from "react-redux"
import PageSkeleton from './components/PageSkeleton';
const PrivateRoute = ({loggedIn, children }) => {
    const loading = useSelector(state=>state.users.loading)
    const navigate = useNavigate()
    const firstTime = ()=>{
      if(!loggedIn&&localStorage.getItem("loggedIn")===null || localStorage.getItem("loggedIn")===false){
        return <Navigate to="/login" />
      }else{
        return children
      }
    }
    if(loading){
      return(<PageSkeleton/>)
    }else{
    return firstTime()
    }
  };
export default PrivateRoute;