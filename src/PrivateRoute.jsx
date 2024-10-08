import { Navigate,useNavigate} from 'react-router-dom';
import {useSelector}  from "react-redux"
import PageSkeleton from './components/PageSkeleton';
import Paths from './core/paths';
const PrivateRoute = ({loggedIn, children }) => {
    const loading = useSelector(state=>state.users.loading)
    const profile = useSelector(state=>state.users.currentProfile)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const navigate = useNavigate()
  
   if(currentProfile){
    return children
   }else{
    navigate(Paths.login())
   }
    
  };
export default PrivateRoute;