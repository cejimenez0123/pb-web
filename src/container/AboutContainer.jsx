import "../styles/About.css"
import firstGroup from "../images/firstgroup.jpg"
import groupJpg from "../images/table.png"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import {useDispatch} from 'react-redux'
import slack from "../images/icons/slack.svg"
import BookCarousel from "../components/collection/BookCarousel"
import al from "../images/workshop/al-1.jpg"
import duo from "../images/workshop/Duo-1.jpg"
import vemilo from "../images/workshop/vemilo-1.jpg"
import vemilo2 from "../images/workshop/vemilo.jpg"
import khaos from "../images/workshop/khaos-1.jpg"
import out from "../images/workshop/out-1.jpg"
import out2 from "../images/workshop/out-2.jpg"
import table1  from "../images/workshop/table-1.jpg"
import table2  from "../images/workshop/table-2.jpg"
import table3  from "../images/workshop/table-3.jpg"
// import table4 from "../images/workshop/table-4.jpg"
// import table5 from "../images/workshop/table-5.jpg"
import table7 from "../images/workshop/table-7.jpg"
// import books1 from "../images/workshop/books-1.jpg"
import { useContext, useEffect } from "react"
import { Helmet } from 'react-helmet-async';
import Context from "../context"
let firstImages = [out,al,table3,duo,vemilo,khaos,,table7
]
let secImages = [out2,table1,vemilo2,table2]
export default function AboutContainer(props){
    const {setSeo}=useContext(Context)
    const md = useMediaQuery({
        query: '(min-width: 750px)'
      })
    const dispatch = useDispatch()
    const navigate = useNavigate()
   
    const findCreatives=() =>{
        return(<div className="grid sm:grid-cols-2 gap-8">
   
           
            <div className="  text-emerald-800 h-[100%] rounded-lg p-4" >
          <div className="text-center" >
            <h2 className="lora-medium font-bold text-center w-fit text-[2rem]">Find Your Creative Community</h2>
<div className="text-left">
<h2 className="text-left text-[1rem] leading-loose  open-sans-medium">Plumbum is a space for writers to share work, 
    get feedback, and connect with like-minded creatives. 
    Whether you're refining your next piece or just starting out, 
    you'll find support, inspiration, and the right audience here.</h2>

<a onClick={()=>navigate(Paths.apply())}className="text-left text-[1rem]">[→ Join the Beta]</a>
</div>
</div>
{/* <div className="text-center" >
<h6 className="lora-medium font-bold text-center w-fit text-[2rem]">For Creatives</h6>
<div >
<h6 className="text-[1rem] leading-loose open-sans-medium pt-4 text-left" > 
The idea for Plumbum came to me while I was walking to the gym during a university break.
The encouragement I got from friends who supported my goals was missing at home.
Finding mutual support in writing is challenging. 
There's not one kind of look for a writer. Creatives need a place to test their skills and gain confidence in and that is what Plumbum is for. 
</h6>
</div> */}

{/* </div> */}
        </div> </div>)
    }
useEffect(()=>{
    setSeo({title:"Plumbum", description:"Your writing, your community", name:"Plumbum", type:""})
},[])
const writingJourney = ()=>{
    return(<div className="text-center">
        <div  >
        <h1 className="lora-bold">Why Plumbum?</h1>
<br/>
<ul className="text-left">
<li className="text-[1rem] my-1"><h6 className="open-sans-medium"> <strong> Writer-Driven Feedback –</strong> Get real, constructive responses from fellow writers.</h6></li>
<li className="text-[1rem]  my-1"><h6 className="open-sans-medium"><strong> Curated Discovery –</strong> Curate your space and discover others curated collections and add them to your space of inspiration.  </h6></li>
<li className="text-[1rem]  my-1"><h6 className="open-sans-medium"><strong> Workshops & Events –</strong> Take your craft further with live workshops and community gatherings.
</h6></li>
</ul>
<div className="text-left">
<a onClick={()=>navigate(Paths.discovery())}className="text-[1rem]">[→ Explore More]</a>
</div>
</div>

    </div>)
}
const howItWorks=()=>{
    return (<div className={` py-2  leading-loose lg:text-white text-emerald-700 flex flex-col max-w-[100%]`}>
     <h2 className="lora-bold text-center text-emerald-800 text-emerald-800 text-4xl  mt-4  py-4">  How It Works</h2> 
<ul className="px-4  open-sans-medium mx-auto">
<li className="text-[1rem]"><h6 className="text-emerald-800"><strong>Share Your Writing – </strong>Upload your work and shape it with thoughtful feedback.</h6></li>
<li className="text-[1rem]"><h6 className="text-emerald-800"><strong>Give & Get Feedback – </strong>Support others and grow through collaborating in global and local online workshops.</h6></li>
<li className="text-[1rem]"><h6 className="text-emerald-800"><strong>Discover & Connect – </strong>Find new voices, build your audience, and improve your craft</h6></li>
</ul>       
    </div>)
}
const stayInLoop=()=>{
    return(<div className="p-3 flex flex-col">
        <h1 className="text-[3rem] mx-auto lora-bold">Stay in the Loop</h1>

<h2 className="mx-4 my-2 open-sans-medium text-l">Be the first to know about new features, workshops, and events.</h2>
<h2 className="mx-4 my-2 open-sans-medium  text-l">Follow the Journey</h2>
<a className="flex flex-row  my-4 mx-auto text-center" href="https://join.slack.com/t/plumbumwriters/shared_invite/zt-2zvkzyi02-dRlhqb0wvHAaU~~dUgh7hQ"><p className="open-sans-medium mx-4">Join the discussion on our slack</p><img  className="mx-auto" src={slack}/></a>
<a className="flex flex-row text-emerald-800 active:text-cyan-800 my-4 mx-auto text-center" onClick={()=>navigate(Paths.calendar())}><p className="open-sans-medium mx-4">Check out the Calendar for NYC Writing Scene</p></a>
<div className="flex my-4 open-sans-medium  mx-auto text-l texg-left leading-loose tracking-loose">

<p><a href="https://www.instagram.com/plumbumapp">@plumbumapp</a> |<a href="https://www.instagram.com/bxwriters"> @bxwriters</a></p></div>
<a className="text-l" onClick={()=>navigate(Paths.newsletter())}><p>[→ Subscribe to Our Newsletter]</p></a>
        </div>)
}
const userTestimonial=()=>{
    return(<div><h6 className="text-[1.8rem] lg:text-[2rem] lora-bold">Real Writers, <br/>Real Growth</h6>
    
<div className="px-4 my-4">
        <h6 className="lora-medium text-[1rem] lg:text-[1.2rem]"><em>"Plumbum.app Workshops have been impactful in helping me to build community and network with poets from across the New York City and the Tri-State area. I walk away from these workshops with quality feedback and so many new ways to think about my work. Plumbum’s goal of supporting writers with their craft is clear and quite effective with the supportive environment to match."</em></h6>
        — [Rob P. ]</div></div>)
}

    return(<div id="about" className="px-8 text-emerald-700 sm:text-white pt-8 py-24">
     
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,300&family=Roboto:wght@500&display=swap" rel="stylesheet"/>
<div>
   
    <div  className="grid md:grid-cols-2  grid-cols-1 lg:gap-8 lg:mx-4 mb-8">

    <div className="pt-8 pb-4 min-w-1/2 md:px-8 mx-auto text-center ">
        <h2 className=" text-[2.5rem] md:text-[4rem]  mx-atuo lora-bold text-emerald-700 pt-8 pb-4">Plumbum</h2>
        <br/>
        <h2 className="lora-medium text-[1.5rem] md:text-[2rem]  mx-auto text-emerald-700 ">Your Writing</h2> <h2 className="lora-medium text-[1.5rem] md:text-[2rem]   mx-auto text-emerald-700 ">Your Community</h2>
        </div> 


  <div className={`  ${md?"":"hidden"}   overflow-hidden max-h-[20rem]   rounded-lg`}>

<BookCarousel images={secImages}/>


    {findCreatives()}
  

</div>
<div className="  ">
    <BookCarousel images={firstImages}/>
</div>
<div className=" text-emerald-700  ">

    {howItWorks()}
</div>

<div className="text-emerald-700 ">
    {writingJourney()}
</div>
<div className="text-emerald-700">
  
    {userTestimonial()}
</div>

   
</div>   <div className="text-[1rem] mx-auto text-center mt-12 text-emerald-700  ">
    <div className="text-center">
    {stayInLoop()}
    </div>
<div className="text-2xl flex text-white max-w-[30em] mx-auto my-12   bg-gradient-to-r from-emerald-400 to-emerald-600  rounded-full  px-5 py-4" onClick={()=>{navigate(Paths.apply())}} >
     <h5 className="mx-auto mont-medium text-xl tracking-wide my-auto">Apply to Join Today</h5>
     </div>

<h6>Any requests for features, feedback, or encouragement<br/><a onClick={()=>navigate(Paths.feedback())}>click here</a>

</h6>
<h6 className="text-emerald-700 pb-8 mt-12">Plumbum©2025</h6>
</div></div> </div>)
}