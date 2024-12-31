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
<img  className=" absolute top-[-9rem] sm:top-[-10rem] lg:top-[-18rem] rounded-lg" src={firstGroup}  alt="first group"/>
 </div>
   

           <div className="">
            <div className=" bg-[#23774ca6] text-white h-full rounded-lg p-4" >
<div  >
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
        </div> </div>)
    }
const writingJourney = ()=>{
    return(<div className="">
        <div id="ready">
<h6  className="text-emerald text-lg poppins sm:text-white">
If you're a writer or enjoy reading, 
you're of discerning taste; We are taking applications for betausers for our release in February.
Join now!</h6>
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
A creative sanctuary where like minded writers can offer peer critique
       </h6>

        <h3 className="poppins text-2xl text-left font-bold py-4">What is a Plumbum?</h3>
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
<img  className=" absolute top-[-9rem] sm:top-[-10rem] lg:top-[-18rem] rounded-lg" src={groupJpg} alt="group pic"
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