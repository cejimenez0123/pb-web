
import { useContext, useLayoutEffect } from "react";
import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import logo from "../images/icon.ico"
import events from "../images/icons/event.svg"
import clinic from "../images/icons/clinic.png"
import { initGA} from "../core/ga4";
import Context from "../context";
import flare from "../images/icons/flare.svg"
import pen from "../images/icons/pen.svg"
import form from "../images/icons/form.png"
import { IonContent } from "@ionic/react";
import bxFuture from "../images/events/bxfutures.png"
import ErrorBoundary from "../ErrorBoundary";
import cafe from "../images/icons/coffee.png" 
let domain = import.meta.env.VITE_DOMAIN
if(import.meta.env.VITE_NODE_ENV=="dev"){
  domain=import.meta.env.VITE_DEV_DOMAIN
}
function isThirdSaturday(date = new Date()) {
  const day = date.getDay(); // 6 = Saturday
  const dateOfMonth = date.getDate();

  // Must be Saturday AND between 15–21
  return day === 6 && dateOfMonth >= 15 && dateOfMonth <= 21;
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

 const showThirdSaturdayNode = isThirdSaturday();


    return(<ErrorBoundary>
     <IonContent fullscreen={true} scrollY={true} style={{"--padding-bottom":"6rem"}}>
     
            <h2 className="text-xl lora-bold mx-auto mt-12 text-emerald-700 mb-8 text-center">Keep up with us!<p>Click links below to discover more!</p></h2>
            <ul className={`md:mx-auto  w-page-mobile-content grid gap-2 grid-cols-2 md:flex md:flex-col lg:w-page-content mx-auto md:mx-4`}>
                
                
       
                <li>  
                      {/* <LinkNode image={pen}
                      name={"Writers Workshop"}
                      links={
                         showThirdSaturdayNode?[{name:"To Be Read Spreadsheet",url:"https://docs.google.com/spreadsheets/d/1bPnD3ufcoBYkttmdZJLEnc2K_662yktJ_tzK2w9ueVM/edit?usp=sharing"},{name:"RSVP Here",url:"https://partiful.com/e/fQ5D7Qsk6OXzl0FYNbt3?c=LiATxtWz"}]:
                        
                        [
                      
                      ]} */}
  <LinkNode image={form}
  title={"Las Lineas Film Festival Open Mic"}
                      links={[{name:"Apply too",url:"https://forms.gle/USFXSyZSJ8t9QEsk7"}]}
                      description={"Limited Slots to perform!"}/>
 
                 
                    {/* title={"March 21st. Writers Workshop"}
                    description={`Join us for our Writers Workshop. We will read Sonia Sanchez and give feedback.`}/> */}
                     </li>
                     <li>  
                      <LinkNode image={bxFuture}
                      name={"Plumbum x Bronx Frame Creative Tech Mixer"}
                      links={[{name:"RSVP Here",url:"https://posh.vip/e/plumbum-x-bronx-frame-create-tech-mixer"}]}
  
                    title={"May 1st. Mixer"}
                    description={`Creative and Tech mixer, bring the heart to tech, and the impact to art. Connect with the next generation of creators.`}/>
                    </li>
                  <LinkNode image={clinic}
                  name={""}
                  links={[{name:"Book a Session",url:"https://calendly.com/solemilio-decibao"},
             
                  ]}
                  title={"Creative Writing Clinics "}
                  description={"Connect with our founder, Sol Emilio, to discuss your writing and explore the support that fits your project."}/>
             
                    <li>
                   
               <LinkNode image={events}
               name={"Calendar"}
       links={[{name:"View Calendar",url:"https://plumbum.app"+Paths.calendar()}]}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                 
                   <li>
               <LinkNode links={[{name:"Discover Plumbum",url:"https://plumbum.app"+Paths.discovery}]}
               image={logo}
                    title={"Discover Plumbum"}
                    description={"Check some recent shared work"}/>
                    </li>
                    <li>
                    <LinkNode links={[{name:"Apply to be a user today",url:`https://plumbum.app/${Paths.onboard}`}]}
                    image={logo}
                    title={"Apply to be a user today"}
                    description={"Become a user and support us from the ground."}/>
                    
                </li>
               <li>
               <LinkNode links={[{name:"Purchase literature written by the founder.",url:"https://www.lulu.com/shop/sol-emilio/good-hell/paperback/product-45q8j8v.html?q=good+hell&page=1&pageSize=4"}]}
                  
                    image={"https://assets.lulu.com/cover_thumbs/4/5/45q8j8v-front-shortedge-384.jpg"}
                    title={"Purchase literature written by the founder."}
                    description={"Paperback of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li> 
            </ul>
    
    </IonContent>
</ErrorBoundary>)
}