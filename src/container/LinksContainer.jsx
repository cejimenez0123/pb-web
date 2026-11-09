

import LinkNode from "../components/LinkNode";
import Paths from "../core/paths";
import events from "../images/icons/event.svg"
import pen from "../images/icons/pen.svg"
import anvil from "../images/icons/anvil.png"
import { IonContent } from "@ionic/react";
import ErrorBoundary from "../ErrorBoundary";
import styles from "../styles/style";
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

 const showThirdSaturdayNode = isThirdSaturday();


    return(
     <IonContent fullscreen={true} scrollY={true} >
      <ErrorBoundary>
     <main className={[styles.pageShell.base,styles.pageShell.scroll].join(" ")}>
      <div className={styles.pageShell.body}>
            <h2 className={styles.text.heading}>Keep up with us!<p>Click links below to discover more!</p></h2>
            <ul className={``}>
                
                
       
             

                   <li>  
                      <LinkNode image={pen}
                      title={"Writers Workshop"}
                        description={"Get Feedback on your work. Meet writers. Once the mind is clear, heal mind-body at the Coffee Rave."}
                      links={
                        

                         [{name:"RSVP Here",url:"https://partiful.com/e/eAAolN77P7pHyQUqCciC?c=uXLJq8rL"}]
                        
                        
                      
                      } />
                      </li>  
                           <li>
                   
               <LinkNode image={anvil}
               name={"Founder's Cohort"}
       links={[{name:"Fill this out",url:"https://tally.so/r/44zJ55"}]}
                    title={"Founder's Cohort"}
                    description={"Capped at 200 members. Be part of Plumbum, and access exlusive benifits as we grow."}/>
                    </li> 
         
                    <li>
                   
               <LinkNode image={events}
               name={"Calendar"}
       links={[{name:"View Calendar",url:"https://plumbum.app"+Paths.calendar()}]}
                    title={"NYC Writing Calendar"}
                    description={"Need a place to be, find it in real life through our calendar of NYC and Virtual events."}/>
                    </li>
                 
               
               <li>
               <LinkNode links={[{name:"Buy Today!",url:"https://www.lulu.com/shop/sol-emilio/good-hell/paperback/product-45q8j8v.html?q=good+hell&page=1&pageSize=4"}]}
                  
                    image={"https://assets.lulu.com/cover_thumbs/4/5/45q8j8v-front-shortedge-384.jpg"}
                    title={"Purchase literature written by the founder."}
                    description={"Paperback of Good Hell: An Young Aritst's Survival and Coming of Age in New York. "}

/>
               </li> 
            </ul>
            </div>
            </main>
    </ErrorBoundary>
    </IonContent>
)
}