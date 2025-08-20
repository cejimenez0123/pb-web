import {useNavigate,useLocation} from 'react-router-dom';
import Paths from './core/paths';
import { useDispatch } from 'react-redux';
import {  useContext, useEffect, useLayoutEffect, useState } from 'react';
import loading from "./images/loading.gif"
import Context from './context';
import getLocalStore from './core/getLocalStore';
import DeviceCheck from './components/DeviceCheck';
import { Preferences } from '@capacitor/preferences';
import { IonImg } from '@ionic/react';
const PrivateRoute = ({loggedIn,currentProfile, children }) => {
    
    const location = useLocation();
    const [token,setToken]=useState(null)
    const dispatch = useDispatch()
    const [formerPage,setFormerPage]=useState(null)
    const navigate = useNavigate()

   useEffect(()=>{
    let getToken=async ()=>{
      let tok = (await Preferences.get({key:"token"})).value
      console.log("private",tok)
      setToken(tok)
      }
   getToken().then()
   },[])
  
   useLayoutEffect(()=>{

    return async ()=>{
      if(token!="undefined"){
       
          if(formerPage){
           navigate(formerPage)
          }}else{
            navigate(Paths.login())
          }}},[token])
   
    useEffect(()=>{
     if(location.pathname){
      setFormerPage(location.pathname)
     }
    },[location.pathname])
  

   
    if(!token){
      return <div className='flex '>
        <IonImg className='mx-auto my-24 max-h-36 max-w-36' src={loading}/></div>
    }

      
    return children
    
  };
  
export default PrivateRoute;