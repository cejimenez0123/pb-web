import { Navigate,useNavigate} from 'react-router-dom';
import {useSelector}  from "react-redux"
import PageSkeleton from './components/PageSkeleton';
const PrivateRoute = ({loggedIn, children }) => {
    const loading = useSelector(state=>state.users.loading)
    const currentProfile = useSelector(state=>state.users.currentProfile)

  
    // const firstTime = ()=>{
    //   if( localStorage.getItem("token")==false||localStorage.getItem("token")==undefined){
    //      return <Navigate to="/login" />
    //     }else{
    //       return children
    //     }
    
   
    // }
    // if(loading){
    //   return(<div>
    //     <PageSkeleton/>
    //   </div>)
    // }else{
    //   return loggedIn? children : firstTime()
    // }
    return children
    
  };
export default PrivateRoute;