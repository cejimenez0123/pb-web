
import { useLayoutEffect } from "react";
import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import logo from "../images/icon.ico"
import events from "../images/icons/event.svg"
import workshop from "../images/writerswork.png"
import { initGA, sendGAEvent } from "../core/ga4";
import philosophy from "../images/philosophy.png"
let domain = import.meta.env.VITE_DOMAIN
if(import.meta.env.VITE_NODE_ENV=="dev"){
  domain=import.meta.env.VITE_DEV_DOMAIN
}
export default function LinksContainer(props){
     useLayoutEffect(()=>{
          initGA()
          // sendGAEvent("View Links Page","Page View Links","Link Page",0,true)
     },[])
    


    return(<div className="flex py-8">
        <div className="card  mx-auto">
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Support how you can!</p></h2>
            <ul className="md:mx-auto mx-4">
            <li>

    <LinkNode url={"https://partiful.com/e/66swqidgRvXSDm7FH3sO"}
    image={workshop}
         title={"Writers Workshop Sat. April 19th:Poets being Human"}
         description={"Feedback focused writers' workshop. Every frustration has a character of truth."}/>
         </li>
         {/* <li>

<LinkNode url={"https://partiful.com/e/r8u4FeGRvOCa12SNp6d6"}
image={philosophy}
     title={"The Bronx Philosophy Circle:Sat. April 12th"}
     description={"Public PHilosophy for community building and well being."}/>
     </li> */}
           <li>


               <LinkNode url={"https://plumbum.app"}
               image={logo}
                    title={"About Plumbum"}
                    description={"Why Plumbum? Why now?"}/>
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
              
          
                    <li className="">
                    <LinkNode url={"https://join.slack.com/t/plumbumwriters/shared_invite/zt-2zvkzyi02-dRlhqb0wvHAaU~~dUgh7hQ"}
                    title={"Join our slack community"}
                    image={"https://www.svgrepo.com/show/315526/slack.svg"}
                    description={"Our slack community, our middle ground. A space for feedback, while we work on devleopment."}/>
               </li>
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
        </div>
    </div>)
}