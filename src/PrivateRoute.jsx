
import { useEffect, useState, useContext } from "react";
import { IonContent, IonImg, useIonRouter } from "@ionic/react";
import loadingGif from "./images/loading.gif";
import Paths from "./core/paths";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
 
  const {currentProfile,loading}=useSelector(state=>state.users)
  let router = useIonRouter()
  const pathName = router.routeInfo.pathname
  let loggedInPathNames = [Paths.login()]
  let loggedOutPathnames = [Paths.home,Paths.myProfile]
  useEffect(()=>{
    if(currentProfile&&loggedInPathNames.includes(pathName)){
      router.push(Paths.myProfile,"root")
    }
    if(!currentProfile&&loggedOutPathnames.includes(pathName)){
      router.push(Paths.login(),"root")
    }
  },[pathName,currentProfile])

  


  return <>{children}</>;
};

export default PrivateRoute;