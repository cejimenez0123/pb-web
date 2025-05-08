

import { useEffect, useState } from "react";
import { debounce } from "lodash";
import validateEmail from "../core/validateEmail";
import authRepo from "../data/authRepo";
import { initGA,sendGAEvent } from "../core/ga4";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button } from "@mui/material";
import Enviroment from "../core/Enviroment";
import Context from "../context";
import { useContext } from "react";
import Paths from "../core/paths";
import { useMediaQuery } from "react-responsive"
import { useLayoutEffect } from "react"
import { Helmet } from "react-helmet";
import NewsletterContainer from "./auth/NewsletterContainer";
import ApplyContainer from "./auth/ApplyContainer";
import "../App.css"
import ScrollDownButton from "../components/ScrollDownButton";
import { useLocation, useNavigate } from "react-router-dom";

import Collapsible from "../components/Collapsible";
import CalendarEmbed from "../components/CalendarEmbed";
export default function CalendarContainer(){
  const location = useLocation()
  const {seo,setSeo}=useContext(Context)
  const navigate = useNavigate()
  useLayoutEffect(()=>{
    let soo = seo
    soo.title = "Plumbum NYC CALENDAR"
    soo.url = Enviroment.domain+location.pathname
    soo.description = "Explore events, workshop together, and join other writers."
    soo.image = Enviroment.logoChem
    setSeo(soo)
  },[])
  useEffect(()=>{
    initGA()
  
  },[])
  return (
    <div className="mx-auto m-4 w-fit text-center">

      <h1 className="lora-bold text-emerald-800 text-opacity-70 mb-4">Plumbum Calendar</h1>
  
      <p className="mb-4 mx-auto max-w-page text-sm mont-medium text-emerald-600">
        Get weekly writing events in your inbox, or go deeper:<br/> apply to become a user and share your own writing and feedback on our site.
      </p>
  
      <CalendarEmbed />
  
      <div className="mt-6 space-y-4">
        <Collapsible buttonText="📰 Join the weekly newsletter">
          <NewsletterContainer />
          <p className="text-xs mt-2 text-emerald-500">
            We’ll send you a weekly list of events and updates.
          </p>
        </Collapsible>
  
        <Collapsible buttonText="✍️ Apply to post & get feedback">
          <h6 className="text-sm mont-medium text-emerald-700 mb-2">
          Join a rhythm of shared writing — post your work, receive feedback, and connect in small, supportive groups.
          </h6>
     <ApplyContainer/>
        
        </Collapsible>
      </div>
      <h1 className="btn mont-medium border  border-emerald-600 bg-emerald-600 hover:bg-green-500 hover:border-blue-600 text-2xl py-2 px-8 text-white rounded-full" onClick={()=>navigate(Paths.feedback())}>Submit an Event</h1>
      <ScrollDownButton/>
    </div>
  );

}