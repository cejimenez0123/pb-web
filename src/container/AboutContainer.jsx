import "../styles/About.css"
import firstGroup from "../images/firstgroup.jpg"
import groupJpg from "../images/table.png"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import {useDispatch} from 'react-redux'
export default function AboutContainer(props){
    const md = useMediaQuery({
        query: '(max-width: 1000px)'
      })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const forCreatives = ()=>{
        return(<div className="grid sm:grid-cols-2 gap-8">
    <div className="  relative overflow-hidden h-[15rem] sm:h-[20rem]  w-48 rounded-lg">
<img  className=" absolute top-[-9rem] sm:top-[-20%] md:top-[-30%] lg:top-[-30%] rounded-lg" src={firstGroup}  alt="first group"/>
 </div>
           <div className="">
            <div className=" bg-[#23774ca6] text-white h-full rounded-lg p-4" >
<div  >
<h6 className="poppins  font-bold text-[2rem]">For Creatives</h6>
<div >
<h6 className="text-[1rem]  poppins pt-4 text-left" > 
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
<div  className="text-emerald mt-8 poppins sm:text-white">
<h5 className="text-[1.2rem]">If you're a writer or enjoy reading, stay engaged with people with shared goals.
</h5>
<h5 className="text-[1.2rem]">We are taking applications for beta users for our release in February.
</h5>
<h3 className="text-[1.4rem]">Get started now!!</h3>
</div>
<button className="text-2xl text-white bg-emerald-800 rounded-full my-8 px-5 py-3" onClick={()=>{navigate(Paths.apply())}}  
   >Apply to Join Today</button>
</div>
    </div>)
}
const detailsOfWorkshop=()=>{
    return (<div className={`poppins   max-w-screen`}>
        <h2 className="poppins text-center text-4xl font-bold mt-4  py-4">From Writers Workshop to Plumbum</h2>
        <div className="">
        <h3 className={`poppins  font-bold  text-2xl font-bold text-left ${md?"text-emerald-700":"text-white"}`}>What is a Writers' Workshop?</h3>
      
<h6 className="py-4 text-left poppins text-[1.2rem]">
Peer critiques by like-minded writers
       </h6>

        <h3 className="poppins text-2xl text-left font-bold py-4">What is a Plumbum?</h3>
        <h6 className="text-left py-4 text-[1.2rem] poppins">Plumbum is the Latin word for lead, like a lead anvil or pipe. It's the root word for plumber.
</h6>
        <ul className="text-left">







    <li className="py-3 text-[1.2rem]"><h6> 📝 Worried about publishing publicly, but still need people to read your stuff? 
        Plumbum lets you control visibility and share how you want.
    
    </h6></li >
<li className="py-3 text-[1.2rem]"><h6>💬 Looking for constructive feedback?
Be part of a community of writers who are eager to share their insights and support you.
</h6></li>
<li className="py-3 text-[1.2rem]"><h6>📘 Make collections to organize and reorganize everything you find, so you can tell the story you want. </h6></li>
<li className="py-3 text-[1.2rem]"><h6>
📚 Whether you're a seasoned novelist or just starting out. It's a great place to get started and get support.
</h6></li>

</ul>
</div>
    </div>)
}
    // const groupImage = ()=>{
    //     return<div className="relative min-w-42 mx-auto bg-red-100 w-fit overflow-hidden h-60 sm:h-full rounded-lg  ">
    //     <img src={firstGroup} className="object-cover absolute top-[-6em] sm:top-[-12em] rounded-lg sm:h-[20em] sm:h-[35em]  "/>
    //   </div>
   
    // }
    return(<div id="about" className="px-8 text-emerald-700 sm:text-white pt-8 py-24">
        
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,300&family=Roboto:wght@500&display=swap" rel="stylesheet"/>
<div>
    <div>
    <div  className="grid md:grid-cols-2 gap-8 mb-8">
    
    <div id="py-8 min-w-1/2 px-8">
        <h6 className="text-[4rem] text-emerald-700 py-8 ">Welcome to Plumbum</h6>
  </div>

  <div className="  relative overflow-hidden h-[15rem] sm:h-[20rem]  w-48 rounded-lg">
<img  className=" absolute top-[-9rem] sm:top-[-15rem] md:top-[-40%] lg:top-[-60%] rounded-lg" src={groupJpg} alt="group pic"
 />
</div> 
   

{/* max-height: 10em !important;
    max-width: 10em !important;

    overflow: hidden;
    border-radius: 0.5rem;
}
img[alt="bookshelves"]{
    object-fit: cover;
    height: 20em;
    width: 100%;
 
    border-radius: 0.5rem;
} */}
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
<h6>Any request for more feautres, problems, encoragement, send to plumbumapp@gmail.com.

</h6>
<h6 className="text-emerald-700 mt-12">Plumbum©</h6>
</div>
    </div>)
}