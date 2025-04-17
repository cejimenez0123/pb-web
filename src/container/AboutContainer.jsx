import "../styles/About.css"
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
import { useLayoutEffect } from "react"
import events from "../images/icons/event.svg"
// import table4 from "../images/workshop/table-4.jpg"
import table5 from "../images/workshop/table-5.jpg"
import { useEffect } from "react"
import table7 from "../images/workshop/table-7.jpg"
import books1 from "../images/workshop/books-1.jpg"
import { useContext } from "react"
import { initGA,sendGAEvent } from "../core/ga4" 
import Context from "../context"
import ScrollDown from "../components/ScrollDownButton"
import { Helmet } from "react-helmet"
import useScrollTracking from "../core/useScrollTracking"
let firstImages = [out,al,table3,duo,vemilo,khaos,books1,table7
]
let secImages = [out2,table1,vemilo2,table2,table5]
export default function AboutContainer(props){
    const {setSeo,currentProfile}=useContext(Context)
    const md = useMediaQuery({
        query: '(min-width: 750px)'
      })
    useScrollTracking({name:"About"})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useLayoutEffect(()=>{
        initGA()
        sendGAEvent("Page View","View About Page")
    },[])
  function apply(){
    sendGAEvent("Apply to be user","Click Apply","Apply to Join Today",0,false)
    navigate(Paths.apply())
  }
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

<a onClick={()=>apply()}className="text-left text-[1rem]">[→ Join the Beta]</a>
</div>
</div>
        </div> </div>)
    }
const whyMembership = ()=>{
    return(<div>
        <h1 className="lora-bold">Why Membership?</h1>
        <p>
          Too many places call themselves “the public square,” but they feel more like oceans—vast, anonymous, and impossible to hold. We’re building a teacup: something small enough to share, strong enough to hold heat, and made for real connection.
        </p>
        <br />
        <ul className="text-left">
          <li className="text-[1rem] my-1">
            <h6 className="open-sans-medium">
              <strong>People Who Care Only –</strong> No trolls. Just writers who give thoughtful feedback that builds you up.
            </h6>
          </li>
          <li className="text-[1rem] my-1">
            <h6 className="open-sans-medium">
              <strong>Compassionate Community –</strong> Writers can be passionate, but we also lead with compassion.
            </h6>
          </li>
          <li className="text-[1rem] my-1">
            <h6 className="open-sans-medium">
              <strong>NYC + Beyond –</strong> We’re rooted in the Bronx—a place that doesn’t fake it. We keep it real, and we want you to do the same.
            </h6>
          </li>
        </ul>
      </div>
      )
}
useLayoutEffect(()=>{
    setSeo({title:"Plumbum", description:"Your writing, your community", name:"Plumbum", type:""})
},[])
const applicationProcess=()=>{
    return(<div className="my-8">
    <h1 className="lora-bold  mb-4">How the Application Works</h1>
    <p>We’re building a space with intention. Here’s how to join.</p>
    <ol className="list-decimal list-inside open-sans-regular space-y-3 text-[1rem]">
      <li>
        <strong>Apply Online –</strong> Fill out a short form to tell us about your writing and what you're looking for.
      </li>
      <li>
        <strong>We Review –</strong> Our team reads every application. We’ll either invite you in now or let you know we’re keeping your application on file for the next round.
      </li>
      <li>
        <strong>You're In –</strong> If accepted, you'll get an email with a link to complete your registration and join the community.
      </li>
    </ol>
  </div>
  )
}
const writingJourney = ()=>{
    return(<div className="text-center leading-loose ">
        <div  >
        <h1 className="lora-bold">Why Plumbum Works?</h1>
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
    return (<div className={` py-2  leading-loose text-emerald-700 flex flex-col max-w-[100%]`}>
   
  <h1 className="lora-bold text-left text-emerald-800  text-emerald-800 text-4xl  mt-4  py-4">How It Works</h1>
  <ul className="list-disc open-sans-medium list-inside open-sans-regular space-y-3 text-[1rem]">
     <li>
    <strong>Get Feedback –</strong> Share your drafts and receive thoughtful, constructive responses from writers who care.
  </li>
  <li>
    <strong>Join Live Workshops –</strong> Hop into real-time sessions online or around NYC for direct feedback and collaboration.
  </li>
  <li>
    <strong>Share Your Work –</strong> Publish pieces-in-progress or notes-app gems in a space for experimentation.
  </li>
  <li>
    <strong>Find Fresh Voices –</strong> Discover new writers and connect through shared creativity and weirdness.
  </li>
  </ul>
    </div>)
}
const stayInLoop=()=>{
    return(<div className="p-3 flex flex-col">
        <h1 className="text-[3rem] mx-auto lora-bold">Stay in the Loop</h1>

<h2 className="mx-4 my-2 open-sans-medium text-l">Be the first to know about new features, workshops, and events.</h2>
<h2 className="mx-4 my-2 open-sans-medium  text-l">Follow the Journey</h2>
<a className="flex flex-row  my-4 mx-auto flex flex-col text-center" href="https://join.slack.com/t/plumbumwriters/shared_invite/zt-2zvkzyi02-dRlhqb0wvHAaU~~dUgh7hQ"><p className="open-sans-medium mx-4">Join the discussion on our slack</p><img  className="mx-auto w-[8em]" src={slack}/></a>
<p className="flex open-sans-medium flex-row  my-4 mx-auto text-center" onClick={()=>navigate(Paths.calendar())}>Check out the Calendar for NYC Writing Scene</p>
<img onClick={()=>navigate(Paths.calendar())} className="h-[8em] mx-auto w-[8em]"  src={events}/>
<div className="flex my-4 open-sans-medium  mx-auto text-l texg-left leading-loose tracking-loose">

<p><a href="https://www.instagram.com/plumbumapp">@plumbumapp</a> |<a href="https://www.instagram.com/bxwriters"> @bxwriters</a></p></div>
<a className="text-l" onClick={()=>navigate(Paths.newsletter())}><p>[→ Not ready yet? Get exclusive writing tips & events in our newsletter!]</p></a>
        </div>)
}
const userTestimonial=()=>{
    return(<div><h6 className="text-[1.8rem] lg:text-[2rem] lora-bold">Real Writers, <br/>Real Growth</h6>
    
<div className="px-4 my-4">
        <h6 className="lora-medium text-[1rem] lg:text-[1.2rem]"><em>"Plumbum.app Workshops have been impactful in helping me to build community and network with poets from across the New York City and the Tri-State area. I walk away from these workshops with quality feedback and so many new ways to think about my work. Plumbum’s goal of supporting writers with their craft is clear and quite effective with the supportive environment to match."</em></h6>
        — [Rob P. ]</div></div>)
}
// "Go participate. Go see every movie, the bad ones, the good ones. Watch movies with the sound off, then you can see how a movie is made. If you ever think a movie you're making is too long, it is. If you ever wonder, "Should I cut this?" the answer is "yes." And somebody has to like [the movie] beside the person you're fucking and your mother."



    return(<div id="about" className="px-8 text-emerald-700 sm:text-white pt-8 py-24">
<head>
  <meta charset="UTF-8" />
  <Helmet>
  <title>Plumbum (About) - Your Writing, Your Community</title>
  <meta name="description" content="Explore other peoples writing, get feedback, add your weirdness so we can find you." />
  <meta property="og:title" content="Plumbum Events - Connect and Grow" />
  <meta property="og:description" content="Explore events, workshops, and writer meetups on Plumbum." />
  <meta property="og:image" content="https://i.ibb.co/39cmPfnx/Plumnum-Logo.png" />
  <meta property="og:url" content="https://plumbum.app/" />
  </Helmet>
</head>

<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,300&family=Roboto:wght@500&display=swap" rel="stylesheet"/>
<div>
   
    <div  className="grid md:grid-cols-2  grid-cols-1 lg:gap-8 lg:mx-4 mb-8">

    <div className="pt-8 pb-4 min-w-1/2 md:px-8 mx-auto text-center ">
        <h2 className=" text-[3rem] md:text-[4rem]  mx-atuo lora-bold text-emerald-700 pt-8 pb-4">Plumbum</h2>
        <h2 className="lora-medium text-[1.3rem] md:text-[2rem]   mx-auto text-emerald-700 ">
Your Writing, Your Community</h2>
        <br/>
        <h4 className="lora-medium     mx-auto text-emerald-700 ">Get thoughtful feedback. Grow through workshops. Share your weirdness.</h4>
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
<div className="text-emerald-700">
  
    {whyMembership()}
</div>
<div className="text-emerald-700">
  
    {applicationProcess()}
</div>
   
</div>   <div className="text-[1rem] mx-auto text-center mt-12 text-emerald-700  ">
    <div className="text-center">
    {stayInLoop()}
    </div>
    
<div className="text-2xl flex text-white max-w-[35em] mx-auto my-12   bg-gradient-to-r from-emerald-400 to-emerald-600  rounded-full  px-5 py-4" onClick={()=>{navigate(Paths.apply())}} >
     <h5 className="mx-auto mont-medium text-xl tracking-wide my-auto">Become Part of our Writers' Circle</h5>
     </div>

<h6>Any requests for features, feedback, or encouragement<br/><a onClick={()=>navigate(Paths.feedback())}>click here</a>

</h6>
<h6 className="text-emerald-700 pb-8 mt-12">Plumbum©2025</h6>
</div>{!currentProfile?<ScrollDown text="↓Apply Below" visible={true}/>:null}</div> </div>)
}