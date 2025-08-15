import {useNavigate,useLocation} from 'react-router-dom';
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useContext, useEffect, useLayoutEffect, useState } from 'react';
import loading from "./images/loading.gif"
import Context from './context';
import getLocalStore from './core/getLocalStore';
import DeviceCheck from './components/DeviceCheck';
const PrivateRoute = ({loggedIn, children }) => {
    const {currentProfile}= useContext(Context)
    const location = useLocation();
    const [token,setToken]=useState(null)

    const [formerPage,setFormerPage]=useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
   const isNative = DeviceCheck()
   useLayoutEffect(()=>{

    return async ()=>{
      let tok = await getLocalStore("token",isNative)
      setToken(tok)
    }
   },[])
    useLayoutEffect(async () => {
    
if(token){
    if(currentProfile&&currentProfile.id){
      if(formerPage){
       navigate(formerPage)
      }}
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