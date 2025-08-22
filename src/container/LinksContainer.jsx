
import { useContext, useLayoutEffect } from "react";
import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import logo from "../images/icon.ico"
import events from "../images/icons/event.svg"
import { initGA, sendGAEvent } from "../core/ga4";
import Context from "../context";
import flare from "../images/icons/flare.svg"
import pen from "../images/icons/pen.svg"
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
    


    return(<div className="flex flex-col py-8">
     
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Support how you can!</p></h2>
            <ul className="md:mx-auto w-page-mobile-content md:w-page-content  mx-4">
            <li>

    <LinkNode url={"https://partiful.com/e/tMPilbVLft4gveSDg37M"}
    image={flare}
         title={"Plumbum x BXWriters Mixer Thursday Aug. 28th"}
         description={"Mixer to bring the heart to tech, and the impact to art. Everyone is welcomed to form new connections."}/>
         </li> 
      
    
          
                <li>  
               <LinkNode image={events}
       url={"https://plumbum.app"+Paths.calendar()}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                    <li>
                    <LinkNode url={"https://plumbum.app"+Paths.apply()}
                    image={logo}
                    title={"Apply to be a user today"}
                    description={"Become a user and support us from the ground."}/>
                    
                </li>
                    <li>
               <LinkNode url={"https://plumbum.app"+Paths.newsletter()}
               image={logo}
                    title={"Join the newsletter"}
                    description={"Keep up with events, before you apply."}/>
                    </li>
              
          
                    {/* <li className="">
                    <LinkNode url={"https://join.slack.com/t/plumbumwriters/shared_invite/zt-2zvkzyi02-dRlhqb0wvHAaU~~dUgh7hQ"}
                    title={"Join our slack community"}
                    image={"https://www.svgrepo.com/show/315526/slack.svg"}
                    description={"Our slack community, our middle ground. A space for feedback, while we work on devleopment."}/>
               </li> */}
               <li>
               <LinkNode url={"https://www.lulu.com/shop/sol-emilio/good-hell/paperback/product-45q8j8v.html?q=good+hell&page=1&pageSize=4"}
                    title={"Purchase literature written by the founder."}
                    description={"Paperback of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li>
              
               <li>
               <LinkNode url={"https://www.lulu.com/shop/sol-emilio/good-hell/ebook/product-v8j5pk5.html?q=good+hell&page=1&pageSize=4"}
                    title={"Purchase literature written by the founder."}
                    description={"Ebook of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li> 
       
           
               <li>
               <LinkNode url={"https://ko-fi.com/plumbumwriters"}
image={"https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion-p-500.png"}
                    title={"Donate. Support Development with Kofi."}
                    description={"Holding data costs money. Any support is appreicated at any amount."}/>
               </li>
           
               <li>
               <LinkNode url={"https://plumbum.app"+Paths.discovery()}
               image={logo}
                    title={"Discover Plumbum"}
                    description={"Check some recent shared work"}/>
                    </li>
         
               
       
            </ul>
    
    </div>)
}