

import { useEffect, useState } from "react";
import { initGA,sendGAEvent } from "../core/ga4";
import Enviroment from "../core/Enviroment";
import Context from "../context";
import { useContext } from "react";
import Paths from "../core/paths";
import { useLayoutEffect } from "react"
import { IonContent, IonNavLink, IonText, useIonRouter } from "@ionic/react";

import "../App.css"

import CalendarEmbed from "../components/CalendarEmbed";
import { Capacitor } from "@capacitor/core";
import { useSelector } from "react-redux";
export default function CalendarContainer(){

  const {seo,setSeo}=useContext(Context)
  const isClip = import.meta.env.MODE == "clip"
  const currentProfile = isClip?null:useSelector(state=>state.users.currentProfile)

  const router = useIonRouter()
  const isNative = Capacitor.isNativePlatform()
  useLayoutEffect(()=>{


    setSeo({
      title: "Plumbum — Events & Writing Calendar",
      description:
        "Browse writing events, workshops, and meetups on the Plumbum calendar.",
      name: "Plumbum",
      type: "website",
    });
  
  },[])
  useEffect(()=>{
    initGA()
  
  },[])
  return (
    <IonContent fullscreen={true} scrollY={true} className="">
    <div className="mx-auto  m-4 pt-14   text-center">
<div className=" w-[90%] sm:max-w-[30rem] mx-auto">
      <h1 className="lora-bold text-emerald-800 text-opacity-70 mb-4">Plumbum Calendar</h1>
  
     {!currentProfile &&<div className="mb-8"><p className="mb-4 mx-auto  text-sm mont-medium text-emerald-600">
        Get weekly writing events in your inbox, or go deeper:<br/> apply to become a user and share your own writing and feedback on our site.
      </p>
    <div><IonText className="text-xl text-emerald-700" onClick={()=>router.push(Paths.newsletter())}>Join the Newsletter</IonText></div>
     <IonText>or</IonText>
     <div>
    <IonText onClick={()=>{router.push("/onboard")}} className="text-xl text-emerald-700">Apply to be a user</IonText> 
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