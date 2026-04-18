

import { useEffect, } from "react";
import { initGA, } from "../core/ga4";
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
const WRAP = "max-w-[42rem] mx-auto px-4";
const PAGE_Y = "pt-16 pb-10";
const STACK_LG = "space-y-8";
const STACK_MD = "space-y-4";
const STACK_SM = "space-y-2";
const SectionLabel = ({ children }) => (
  <p className="text-xs text-gray-400 uppercase tracking-wide">{children}</p>
);
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
    <IonContent f        style={{ "--background": Enviroment.palette.base.background}} fullscreen={true}  className="">
   <div className={`${WRAP} ${PAGE_Y} ${STACK_LG} text-center`}>
 
<div className={STACK_SM}>
  {/* <h1 className="lora-bold text-emerald-800 text-opacity-70"> */}
  <SectionLabel>  Plumbum Calendar</SectionLabel>
  {/* </h1> */}

  {!currentProfile && (
    <div className={STACK_SM}>
      <p className="text-sm text-emerald-600 max-w-md mx-auto">
        Get weekly writing events in your inbox, or go deeper:
        apply to become a user and share your writing and feedback.
      </p>

      <div className="flex flex-col items-center gap-2">
        {/* <IonText
          className="text-lg text-emerald-700"
          onClick={() => router.push(Paths.newsletter())}
        >
          Join the Newsletter
        </IonText> */}

        {/* <IonText className="text-xs text-gray-400">or</IonText> */}

        <IonText
          onClick={() => router.push("/onboard")}
          className="text-lg text-emerald-700"
        >
          Apply to be a user
        </IonText>
      </div>
    </div>
  )}
</div>
      </div>
<div className="w-fit pb-36 mx-auto">
      <CalendarEmbed  variant={isNative?"ios":""} />
      </div>
   
    </IonContent>
  );

}