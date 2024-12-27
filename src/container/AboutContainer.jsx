import "../styles/About.css"
import firstGroup from "../images/firstgroup.jpg"
import groupJpg from "../images/table.png"
import MediaQuery from "react-responsive"
import { Button } from "@mui/material"
import theme from "../theme"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import {useDispatch} from 'react-redux'
export default function AboutContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const forCreatives = ()=>{
        return(<div className="text-emerald-600 sm:text-white">
            <div className="box " >
<div id="for-creatives" >
<h6 className="poppins  font-bold text-[2rem]">For Creatives</h6>
<div >
<h6 className="text-[1.2rem]  poppins pt-4 text-left" > 
Plumbum began during a university reprieve while walking to the gym.
At home, I missed the encouragement I got from friends who shared my objectives. 
Finding mutual support can be challenging when others do not share your interests. 
Creatives need a place to test ideas before they launch, and that is what Plumbum is for. 
</h6>
</div>
</div>
</div>
        </div>)
    }
const writingJourney = ()=>{
    return(<div className="">
        <div id="ready">
<h6  className="text-emerald sm:text-white">
Join us! If you're a writer or enjoy reading, 
you're of discerning taste; share and save ideas and inspiration.
 Plumbum is the place for your story.
</h6>
<button className="text-2xl text-white bg-emerald-800 rouned-lg mt-4" onClick={()=>{navigate(Paths.apply())}}  
   >Apply to Join Today</button>
</div>
    </div>)
}
const detailsOfWorkshop=()=>{
    return (<div id="" className="poppins   max-w-screen">
        <h2 className="poppins text-center text-4xl font-bold   py-4">From Writers Workshop to Plumbum</h2>
        <div className="">
        <h3 className="poppins  text-white font-bold text-left">What is a Writers' Workshop?</h3>
      
<h6 className="py-4 text-left poppins text-[1.2rem]">
A creative sanctuary where like minded writers can offer peer critique
       </h6>

        <h3 className="poppins text-left font-bold py-4">What is a Plumbum?</h3>
        <h6 className="text-left py-4 text-[1.2rem] poppins">Plumbum is the latin word for Lead, like a lead anvil or pipe. It's the root word of plumber</h6>
        <ul className="text-left">
        <li className="py-3 text-[1.2rem]"><h6> 📝 Tired of oversharing your work? We understand your work is meaningful.
    Plumbum allows you to control visibility, share how you want, with who you want.
    </h6></li >
<li className="py-3 text-[1.2rem]"><h6>💬 Need constructive feedback to refine your craft?
    Join a community of people passionate about literature eager to share their insights and support your journey.
</h6></li>
<li className="py-3 text-[1.2rem]"><h6>📘 Organize all your related writing into books. 
    Reorganzing the work until you're satisfied. </h6></li>
<li className="py-3 text-[1.2rem]"><h6>
📚 Whether you're a seasoned novelist or just beginning your literary adventure.
Plumbum is great place to begin work and find support to complete work.
</h6></li>

</ul>
</div>
    </div>)
}
    const groupImage = ()=>{
        return<div className="relative   overflow-hidden h-60 sm:h-full rounded-lg  ">
        <img src={firstGroup} className="object-cover absolute top-[-6em] sm:top-[-12em] rounde-lg h-[20em] sm:h-[35em] w-full "/>
      </div>
   
    }
    return(<div id="about" className="px-8 text-emerald-600 sm:text-white py-8">
        
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,300&family=Roboto:wght@500&display=swap" rel="stylesheet"/>
<div>
    <div  className="welcome">
    
    <div id="title py-8">
        <h6 className="text-[4rem] text-emerald-600">Welcome to Plumbum</h6>
    </div>
        <MediaQuery minWidth={"1000px"}>
   
<div id="bookshelf w-24 h-24 rounded-lg object-cover">
<img  className="rounded-lg" src={groupJpg}alt="bookshelves" />


</div>
</MediaQuery>
</div>
<div>
<div id="for" className=" text-white">
    {groupImage()}
    {forCreatives()}
</div>
</div>
<div className="details text-emerald-600 sm:text-white   box">

    {detailsOfWorkshop()}
</div>
</div>
<div className="details text-emerald-600 sm:text-white  box">
    {writingJourney()}
</div>

    <div className="request mt-12 text-emerald-700  ">
<h6>Any request for more feautres, problems, encoragement, send to plumbumapp@gmail.com.

</h6>
<h6 className="text-emerald-700 mt-12">Plumbum©</h6>
</div>
    </div>)
}