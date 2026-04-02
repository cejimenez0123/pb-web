
import { useEffect, useState, useContext } from "react";
import { IonContent, IonImg, useIonRouter } from "@ionic/react";
import loadingGif from "./images/loading.gif";
import Paths from "./core/paths";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
 
  const {currentProfile,loading}=useSelector(state=>state.users)
  let router = useIonRouter()
  const pathName = router.routeInfo.pathname

  useEffect(()=>{
    if(currentProfile&&pathName=="/login"){
      router.push(Paths.myProfile,"root")
    }
  },[pathName,currentProfile])

  
  // if (!currentProfile&&!(pathName=="/login")) {
  //   return (
  //     <IonContent>
  //     <div className="flex">
  //       <IonImg className="mx-auto my-24 max-h-36 max-w-36" src={loadingGif} />
  //     </div>
  //     </IonContent>
  //   );
  // }

  return <>{children}</>;
};

export default PrivateRoute;