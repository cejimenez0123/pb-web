import "../styles/About.css"
import firstGroup from "../images/firstgroup.jpg"
import groupJpg from "../images/table.png"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import {useDispatch} from 'react-redux'
export default function AboutContainer(props){
    const md = useMediaQuery({
        query: '(min-width: 800px)'
      })
    const dispatch = useDispatch()
    const navigate = useNavigate()
   
    const forCreatives = ()=>{
        return(<div className="grid sm:grid-cols-2 gap-8">
    <div className="  relative overflow-hidden h-[15rem] sm:h-[20rem]  w-48 rounded-lg">
<img  className=" absolute top-[-52%] sm:top-[-20%] md:top-[-30%] lg:top-[-80%] rounded-lg" src={firstGroup}  alt="first group"/>
 </div>
           <div className="">
            <div className=" bg-[#23774ca6] text-white h-full rounded-lg p-4" >
<div  >
<h6 className="lora-medium font-bold text-[2rem]">For Creatives</h6>
<div >
<h6 className="text-[1rem]  open-sans-medium pt-4 text-left" > 
The idea for Plumbum came to me while I was walking to the gym during a university break.
The encouragement I got from friends who supported my goals was missing at home.
Finding mutual support in writing is challenging. 
There's not one kind of look for a writer. Creatives need a place to test their skills and gain confidence in and that is what Plumbum is for. 
</h6>
</div>
</div>
</div>
        </div> </div>)
    }
const writingJourney = ()=>{
    return(<div className="">
        <div id="ready">
<div  className="text-emerald-800 mt-8 open-sans-medium lg:text-white">
<h5 className="text-[1.2rem] open-sans-medium my-4">If you're a writer or enjoy reading, stay engaged with people with shared goals.
</h5>
<h5 className="text-[1.2rem] open-sans-medium my-4">We are taking applications for beta users for our release in February.
</h5>
<h3 className="text-[1.4rem] open-sans-medium  my-4 font-bold">Get started now!!</h3>
</div>
<div className="text-2xl flex text-white max-w-[30em] mx-auto my-12 bg-emerald-800 rounded-full  px-5 py-4" onClick={()=>{navigate(Paths.apply())}}  
   > <h5 className="mx-auto mont-medium  my-auto">Apply to Join Today</h5></div>
</div>
    </div>)
}
const detailsOfWorkshop=()=>{
    return (<div className={` py-2   lg:text-white text-emerald-700 max-w-[100vw]`}>
        <h2 className="lora-medium text-center text-emerald-800 lg:text-white text-4xl font-bold mt-4  py-4">From Writers Workshop to Plumbum</h2>
        <div className="">
        <h3 className={`lora-medium font-bold  text-2xl font-bold text-left `}>What is a Writers' Workshop?</h3>
      
<h6 className="py-4 text-left open-sans-medium text-[1.2rem]">
Peer critiques by like-minded writers
       </h6>

        <h3 className="lora-medium text-2xl text-left font-bold py-4">What is a Plumbum?</h3>
        <h6 className="text-left pb-4 pt-2 px-2 text-[1rem] open-sans-medium">Plumbum is the Latin word for lead, like a lead anvil or pipe. It's the root word for plumber. It's also a fun word we'd like to mean creativity and resilience. It's place to find support in your writing goals.
</h6>
        <ul className="text-left px-4">







    <li className="py-3 open-sans-medium text-[1rem]"><h6> 📝 Worried about publishing publicly, but still need people to read your stuff? 
        Plumbum lets you control visibility and share how you want.
    
    </h6></li >
<li className="py-3 open-sans-medium  text-[1rem]"><h6>💬 Looking for constructive feedback?
Be part of a community of writers who are eager to share their insights and support you.
</h6></li>
<li className="py-3 open-sans-medium  text-[1rem]"><h6>📘 Make collections to organize and reorganize everything you find, so you can tell the story you want. </h6></li>
<li className="py-3 open-sans-medium  text-[1rem]"><h6>
📚 Whether you're a seasoned novelist or just starting out. It's a great place to get started and get support.
</h6></li>

</ul>
</div>
    </div>)
}

    return(<div id="about" className="px-8 text-emerald-700 sm:text-white pt-8 py-24">
        
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,300&family=Roboto:wght@500&display=swap" rel="stylesheet"/>
<div>
    <div>
    <div  className="grid md:grid-cols-2 gap-8 mb-8">
    
    <div id="py-8 min-w-1/2 px-8">
        <h6 className="text-[4rem] lora-medium text-emerald-700 py-8 ">Welcome to <br/>Plumbum</h6>
  </div>

  <div className="  relative overflow-hidden h-[15rem] sm:h-[20rem]  w-48 rounded-lg">
<img  className=" absolute top-[-8em] sm:top-[-15em] md:top-[-35%] lg:top-[-75%] rounded-lg" src={groupJpg} alt="group pic"
 />
</div> 
</div>
</div>
<div>

    {forCreatives()}
  
</div>
<div className="details text-emerald-700 sm:text-white   box">

    {detailsOfWorkshop()}
</div>
</div>
<div className="details text-emerald-700  sm:text-white  box">
    {writingJourney()}
</div>

    <div className="request mt-12 text-emerald-700  ">
<h6>Any request for more feautures, problems, encoragement, send to plumbumapp@gmail.com.

</h6>
<h6 className="text-emerald-700 mt-12">Plumbum©</h6>
</div>
    </div>)
}