
import { useState,useEffect } from "react"
import info from "../images/icons/info.svg"
import { IonImg } from "@ionic/react";

function InfoTooltip({text=" This is a tooltip"}){
    const [focus,setFocus]=useState(false)
      const handleToggle = (e) => {
    e.stopPropagation(); 
        setFocus((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = () => {
      setFocus(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

    return( 

        <div     onClick={handleToggle}
          onFocusCapture={handleToggle}
     className="relative h-fit my-auto w-fit mx-2 group" >

    <IonImg className="  h-10 w-10"
    alt="info"
     style={{ filter: "invert(1)" }}
    src={info}
    />

<div
        className={`absolute bg-slate-100 h-10 w-10 open-sans-medium text-sm text-black p-2 bottom-full mb-2 rounded-lg min-w-24 shadow-lg transition-opacity duration-200 ${
          focus ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >   {text}
      </div>
  
  </div>
  )
}
export default InfoTooltip