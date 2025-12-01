

import { useEffect, useState } from "react";
import { initGA,sendGAEvent } from "../core/ga4";
import Enviroment from "../core/Enviroment";
import Context from "../context";
import { useContext } from "react";
import Paths from "../core/paths";
import { useLayoutEffect } from "react"
import { IonContent, IonNavLink, IonText } from "@ionic/react";

import "../App.css"
import { useLocation, useNavigate } from "react-router-dom";

import CalendarEmbed from "../components/CalendarEmbed";
import { Capacitor } from "@capacitor/core";
import { useSelector } from "react-redux";
export default function CalendarContainer(){
  const location = useLocation()
  const {seo,setSeo}=useContext(Context)
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const navigate = useNavigate()
  const isNative = Capacitor.isNativePlatform()
  useLayoutEffect(()=>{

      let soo = seo
      soo.title= "Plumbum (NYC CALENDAR) - Your Writing, Your Community"
      soo.description="Explore events, workshops, and writer meetups on Plumbum."
      soo.url =Enviroment.domain+"/events"
      setSeo(soo)
    
   

  
  
  },[location.pathname])
  useEffect(()=>{
    initGA()
  
  },[])
  return (
    <IonContent fullscreen={true} className="ion-padding">
    <div className="mx-auto  m-4 pt-14   text-center">
<div className=" w-[90%] sm:max-w-[30rem] mx-auto">
      <h1 className="lora-bold text-emerald-800 text-opacity-70 mb-4">Plumbum Calendar</h1>
  
     {!currentProfile &&<div className="mb-8"><p className="mb-4 mx-auto  text-sm mont-medium text-emerald-600">
        Get weekly writing events in your inbox, or go deeper:<br/> apply to become a user and share your own writing and feedback on our site.
      </p>
    <div className="btn rounded-full 
  bg-gradient-to-r 
    from-emerald-300 
    to-blueSea
    hover:from-emerald-100 hover:to-emerald-200
    transition-all duration-300
    "><IonText className="text-xl  text-white" onClick={()=>navigate(Paths.newsletter())}>Join the Newsletter</IonText></div>
     <div><IonText>or</IonText>
     </div>
     <div className="btn rounded-full
      bg-gradient-to-r 
    from-emerald-300 
    to-blueSea
    hover:from-emerald-100 hover:to-emerald-200
    transition-all duration-300">
    <IonText onClick={()=>{navigate("/onboard")}} className="text-xl text-white">Apply to be a user</IonText> 
     </div>
      </div>}

      </div>
<div className="w-fit mx-auto">
      <CalendarEmbed  />
      </div>

   
     
    </div>
    </IonContent>
  );

}