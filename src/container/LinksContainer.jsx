
import { useContext, useLayoutEffect } from "react";
import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import logo from "../images/icon.ico"
import events from "../images/icons/event.svg"
import { initGA} from "../core/ga4";
import Context from "../context";
import flare from "../images/icons/flare.svg"
import pen from "../images/icons/pen.svg"
import { IonContent } from "@ionic/react";
import etsy from "../images/logo/ETSY.png"
import ErrorBoundary from "../ErrorBoundary";
import cafe from "../images/icons/coffee.png" 
let domain = import.meta.env.VITE_DOMAIN
if(import.meta.env.VITE_NODE_ENV=="dev"){
  domain=import.meta.env.VITE_DEV_DOMAIN
}
export default function LinksContainer(props){
     const {seo,setSeo}=useContext(Context)
     useLayoutEffect(() => {


  setSeo(prev => ({
    ...prev,
    title: "Plumbum Writing Events & Workshops | NYC & Online",
    description:
      "Discover upcoming writing workshops, readings, and community events on Plumbum. Find writer meetups in NYC and online."
  }))
}, [])

    


    return(<ErrorBoundary>
     <IonContent fullscreen={true} scrollY={true} style={{"--padding-bottom":"6rem"}}>
     
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Click links below to discover more!</p></h2>
            <ul className={`md:mx-auto  w-page-mobile-content grid gap-2 grid-cols-2 md:flex md:flex-col lg:w-page-content mx-auto md:mx-4`}>
                
                
       
                <li>  
                      <LinkNode image={pen}
                      name={"Writers Workshop"}
       url={"https://partiful.com/e/uj6kSckORSweohDsmBr9?c=mCUwl7I5"}
                    title={"Feb 21st. Writers Workshop"}
                    description={`Join us for Writers Workshop`}/>
                    </li>
                    <li>
                <LinkNode image={pen}
                      name={"Coffee Rave"}
       url={"https://partiful.com/e/5nPDt7vRSokpl7HqIege?c=ySPK0QZm"}
                    title={"Feb 21st. CaFeTato"}
                    description={`Cafe, dance, vibe out in the BX`}/>
                    </li>
                
             
                    <li>
                   
               <LinkNode image={events}
               name={"Calendar"}
       url={"https://plumbum.app"+Paths.calendar()}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                    <li>
                     <LinkNode image={etsy}
                     name={"etsy"}
       url={"https://www.etsy.com/shop/PlumbumWriters?ref=dashboard-header"}
                    title={"Plumbum Merch on Etsy"}
                    description={"Support development, events, and cups of coffee by purchasing merch inspired by the founder, Sol Emilio."}/>
                    </li>
                   <li>
               <LinkNode url={"https://plumbum.app"+Paths.discovery}
               image={logo}
                    title={"Discover Plumbum"}
                    description={"Check some recent shared work"}/>
                    </li>
                    <li>
                    <LinkNode url={"https://plumbum.app/onboard"}
                    image={logo}
                    title={"Apply to be a user today"}
                    description={"Become a user and support us from the ground."}/>
                    
                </li>
               <li>
               <LinkNode url={"https://www.lulu.com/shop/sol-emilio/good-hell/paperback/product-45q8j8v.html?q=good+hell&page=1&pageSize=4"}
                    name="lulu"
                    image={"https://assets.lulu.com/cover_thumbs/4/5/45q8j8v-front-shortedge-384.jpg"}
                    title={"Purchase literature written by the founder."}
                    description={"Paperback of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li> 
            </ul>
    
    </IonContent>
</ErrorBoundary>)
}