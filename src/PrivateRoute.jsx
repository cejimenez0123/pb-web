import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { IonImg } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import loading from "./images/loading.gif";
import Paths from "./core/paths";
import Context from "./context";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setError } = useContext(Context) || {};

  const [token, setToken] = useState(undefined); // undefined = loading, null = no token

  useEffect(() => {
    const checkAuth = async () => {
 
        const stored = await Preferences.get({ key: "token" });
        const tok = stored.value;

        if (!tok) {
            try {   
          navigate(Paths.login(), { replace: true });
          setToken(null);
          return;

      } catch (err) {
        console.error("Error reading token:", err);
        setError?.("Error checking login state");
        navigate(Paths.login(), { replace: true });
        setToken(null);
      }}else{
        setToken(tok)
      }
    };

    checkAuth();
  }, [navigate]);

  // 🌀 Show loading indicator while verifying token
  if (token === undefined) {
    return (
      <div className="flex">
        <IonImg className="mx-auto my-24 max-h-36 max-w-36" src={loading} />
      </div>
    );
  }

  // 🔒 If token invalid, navigation will have already redirected
  // if (!token) return null;

  // ✅ If everything good, render children
  return children;
};

export default PrivateRoute;

// import {useNavigate,useLocation} from 'react-router-dom';
// import Paths from './core/paths';
// import { useDispatch } from 'react-redux';
// import {  useContext, useEffect, useLayoutEffect, useState } from 'react';
// import loading from "./images/loading.gif"
// import Context from './context';
// import getLocalStore from './core/getLocalStore';
// import DeviceCheck from './components/DeviceCheck';
// import { Preferences } from '@capacitor/preferences';
// import { IonImg } from '@ionic/react';
// const PrivateRoute = ({loggedIn,currentProfile, children }) => {
    
//     const location = useLocation();
//     const [token,setToken]=useState(null)
//     const dispatch = useDispatch()
//     const [formerPage,setFormerPage]=useState(null)
//     const navigate = useNavigate()
  
//    useEffect(()=>{
//     let getToken=async ()=>{
//       let tok = (await Preferences.get({key:"token"})).value
//       setToken(tok)
//       return tok??null
//       }
//     const check=async ()=>{
//      let tok = await getToken()
//       if(!tok){
//         navigate(Paths.login())
//       }
           
//           }
//         check()},[])
   
//     useEffect(()=>{
//      if(location.pathname){
//       setFormerPage(location.pathname)
//      }
//     },[location.pathname])
  

   
//     if(!token){
//       return <div className='flex '>
//         <IonImg className='mx-auto my-24 max-h-36 max-w-36' src={loading}/></div>
//     }

      
//     return children
    
//   };
  
// export default PrivateRoute;