import { Navigate,useNavigate} from 'react-router-dom';
import {useSelector}  from "react-redux"
import PageSkeleton from './components/PageSkeleton';
const PrivateRoute = ({loggedIn, children }) => {
    const loading = useSelector(state=>state.users.loading)
    const currentProfile = useSelector(state=>state.users.currentProfile)
   const navigate = useNavigate()
    // useEffect(() => {
    //   if (loggedIn && localStorage.getItem('loggedIn') === null) {
    //       // console.log('This is the initial load');
    //   } else {
    //       if(localStorage.getItem('loggedIn') === true){
            
    //          navigateBack()
    //       }
    //   }
    // }, []);
    const navigateBack = ()=>{
      navigate(-1)
    }
    const firstTime = ()=>{
      if (loggedIn && localStorage.getItem('loggedIn') === null) {
        if((!currentProfile&&!loggedIn)|| localStorage.getItem("loggedIn")===false){
          return <Navigate to="/login" />
        }else{
          return children
        }
    } else {
        if(localStorage.getItem('loggedIn') === true){
          
           navigateBack()
        }
    }
   
    }
    if(loading){
      return(<div>
        <PageSkeleton/>
      </div>)
    }else{
      return loggedIn? children : firstTime()
    }
    
  };
export default PrivateRoute;