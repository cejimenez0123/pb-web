import { useState,useEffect } from "react";
import { initGA,sendGAEvent } from "../core/ga4";
export default function Collapsible({children,buttonText,sendGA=sendGAEvent}){
    const [isOpen, setIsOpen] = useState(false);
    useEffect(()=>{
      if(isOpen){
        
      }
    },[isOpen])
    const handleOpen=()=>{
    initGA()
      sendGA(`${isOpen?"Closing":"Opening"} Collapsible ${buttonText}`,"View Collapse",buttonText,0,false) 
  
      setIsOpen(!isOpen)
        }
    return (
      <div className="w-full max-w-[100vw] lg:max-w-[50em] mx-auto">
        <div
          onClick={() => {handleOpen()
            
            }}
          className={` text-white px-4 py-2 mont-medium text-emerald-800 mb-4 collapse-arrow ${isOpen ? 'collapse-open' : ''}rounded-lg mt-8 transition-transform duration-300 hover:bg-emerald-200`}
        >
            <h3 className="text-lg collapse-title  mont-medium text-emerald-800   font-semibold">        {buttonText?buttonText:isOpen ? 'Hide Content' : 'Show Content'}</h3></div>
  
  
        
        <div
          className={`overflow-hidden transition-max-h duration-500 ease-in-out ${isOpen ? 'h-full' : 'max-h-0'}`}
        >
          <div className="p-2  overflow-hidden w-fit rounded-lg">
           {children}
          </div>
        </div>
      </div>
    );
  };