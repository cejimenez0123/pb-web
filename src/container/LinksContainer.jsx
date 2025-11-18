
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
     useLayoutEffect(()=>{
          initGA()
          let soo = seo
          soo.title= "Plumbum (Links) - Your Writing, Your Community"
          soo.description="Explore events, workshops, and writer meetups on Plumbum."
          setSeo(soo)
     },[])
    


    return(<ErrorBoundary><IonContent fullscreen={true}>
     
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Click links below to discover more!</p></h2>
            <ul className={`md:mx-auto  w-page-mobile-content grid gap-2 grid-cols-2 md:flex md:flex-col lg:w-page-content mx-auto md:mx-4`}>
                
                
       
                <li>  
                      <LinkNode image={pen}
       url={"https://partiful.com/e/qo5cLum123X7apnBJijV"}
                    title={"Dec 20th Writers Workshop"}
                    description={`Join us for Writers Workshop`}/>
                    </li>
                     <li>  
                      <LinkNode image={flare}
       url={"https://groups.ccny.cuny.edu/UMAAN/rsvp_boot?id=1934546"}
                    title={"Dec. 3rd Open Mic"}
                    description={`Spark Open Mic @ CCNY
Step up, express yourself, and share your creativity in a space where you can truly be you.`}/>
                    </li>
                    <li>
                         <LinkNode image={cafe}
                         url={"https://partiful.com/e/W2Y9L0eVcJyzhlmKYLaL?source=share"}
                    title={"Dec. 6th CAFETATO: THE UPTOWN COFFEE RAVE"}
                         description={"NO SACCARINE, SUGAR"}/>
                    </li>
                    <li>
                   
               <LinkNode image={events}
       url={"https://plumbum.app"+Paths.calendar()}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                    <li>
                   
               <LinkNode image={events}
       url={"https://plumbum.app"+Paths.calendar()}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                    <li>
                     <LinkNode image={etsy}
       url={"https://www.etsy.com/shop/PlumbumWriters?ref=dashboard-header"}
                    title={"Plumbum Merch on Etsy"}
                    description={"Support development, events, and cups of coffee by purchasing merch inspired by the founder, Sol Emilio."}/>
                    </li>
                   <li>
               <LinkNode url={"https://plumbum.app"+Paths.discovery()}
               image={logo}
                    title={"Discover Plumbum"}
                    description={"Check some recent shared work"}/>
                    </li>
                    <li>
                    <LinkNode url={"https://plumbum.app"+Paths.apply()}
                    image={logo}
                    title={"Apply to be a user today"}
                    description={"Become a user and support us from the ground."}/>
                    
                </li>
               <li>
               <LinkNode url={"https://www.lulu.com/shop/sol-emilio/good-hell/paperback/product-45q8j8v.html?q=good+hell&page=1&pageSize=4"}
                    image={"https://assets.lulu.com/cover_thumbs/4/5/45q8j8v-front-shortedge-384.jpg"}
                    title={"Purchase literature written by the founder."}
                    description={"Paperback of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li> 
            </ul>
    
    </IonContent></ErrorBoundary>)
}