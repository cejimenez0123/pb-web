import {useNavigate,useLocation} from 'react-router-dom';
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useContext, useEffect, useLayoutEffect, useState } from 'react';
import loading from "./images/loading.gif"
import Context from './context';
const PrivateRoute = ({loggedIn, children }) => {
    const {currentProfile}= useContext(Context)
    const location = useLocation();
    let token =localStorage.getItem("token")

    const [formerPage,setFormerPage]=useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
   
    useLayoutEffect(() => {
     token = localStorage.getItem("token")
     console.log(token)
    if(token||currentProfile&&currentProfile.id){
      if(formerPage){
       navigate(formerPage)
      }
    }else{
  
        navigate(Paths.login())
    }
  
    }, [token,currentProfile]);
    useEffect(()=>{
     if(location.pathname){
      setFormerPage(location.pathname)
     }

    },[location.pathname])
  

   
    if(!currentProfile){
      return <div className='flex '>
        <img className='mx-auto my-24 max-h-36 max-w-36' src={loading}/></div>
    }

      
    return children
    
  };
export default PrivateRoute;