
import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import logo from "../images/icon.ico"
let domain = import.meta.env.VITE_DOMAIN
if(import.meta.env.VITE_NODE_ENV=="dev"){
  domain=import.meta.env.VITE_DEV_DOMAIN
}
export default function LinksContainer(props){

    


    return(<div className="flex py-8">
        <div className="card  mx-auto">
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Support how you can!</p></h2>
            <ul className="md:mx-auto mx-4">
            <li>
            <li>
               <LinkNode url={"https://partiful.com/e/Q3VhybwsrmLldD1bhRZD"}
      
                    title={"The Bronx Circle of Thought RSVP March 8"}
                    description={"A philosophical discusson to help center ourselves in a chaotic world."}/>
                    </li>
         

         
                
                <li className="">
                    <LinkNode url={"https://join.slack.com/t/plumbumwriters/shared_invite/zt-2zvkzyi02-dRlhqb0wvHAaU~~dUgh7hQ"}
                    title={"Join our slack community"}
                    image={"https://www.svgrepo.com/show/315526/slack.svg"}
                    description={"Our slack community, our middle ground. A space for feedback, while we work on devleopment."}/>
               </li>
       
               <li>
               <LinkNode url={"https://plumbum.app"+Paths.newsletter()}
               image={logo}
                    title={"Join the newsletter"}
                    description={"Keep up with events, before you apply."}/>
                    </li>
                <li>
                    <LinkNode url={"https://plumbum.app"+Paths.apply()}
                    image={logo}
                    title={"Apply to be a user today"}
                    description={"Become a user and support us from the ground."}/>
                    
                </li>
               <li>
               <LinkNode url={"https://ko-fi.com/plumbumwriters"}
image={"https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a01229bf8a18f97a3c1_favion-p-500.png"}
                    title={"Donate. Support Development with Kofi."}
                    description={"Holding data costs money. Any support is appreicated at any amount."}/>
               </li>
           
             
               <LinkNode url={"https://plumbum.app"+Paths.discovery()}
               image={logo}
                    title={"Discover Plumbum"}
                    description={"Check some recent shared work"}/>
                    </li>
         
               <li>
               <LinkNode url={"https://plumbum.app"}
               image={logo}
                    title={"About Plumbum"}
                    description={"Why Plumbum? Why now?"}/>
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
            </ul>
        </div>
    </div>)
}