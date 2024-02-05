import "../styles/About.css"
import rickyBookshelf from "../images/ricky-bookshelf.jpg"
import book1 from "../images/book1.png"
import groupJpg from "../images/write-brooke-group.jpg"
import MediaQuery from "react-responsive"
import { Button } from "@mui/material"
import theme from "../theme"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import {useDispatch} from 'react-redux'
import { clickMe } from "../actions/UserActions"
export default function AboutContainer(props){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const forCreatives = ()=>{
        return(<div>
            <div className="box">

<h1>For Creatives</h1>
<p > 
Plumbum is for writers to help recreate the writers' workshop online.
Writers' workshop are a place to receive feedback on your work from people 
with the same goal as you of getting better at their craft.</p>
</div>
        </div>)
    }
const writingJourney = ()=>{
    return(<div>
        <div id="ready">
<p >
Ready to start your writing journey? 
Sign up today, start a page and write anything.
It's the place for your story on Plumbum.</p>
<Button onClick={()=>{navigate(Paths.login())}}  
    style={{

            padding:"0.5em 1em",
            backgroundColor:theme.palette.primary.dark,
            boxShadow:theme.attributes.boxShadow,

color:"#5CCA61",fontSize:"2em"}}>Sign Up</Button>
</div>
    </div>)
}
const detailsOfWorkshop=()=>{
    return (<div>
        <h3>What is a Writers' Workshop?</h3>
        <ul>
<p >
🔒It's a creative sanctuary. A place to receive feedback, control privacy,
and build community.</p>

<p > 📝 Tired of oversharing your work?
Plumbum allows you to control the visibility of your writing,
whether you want it to be a private diary or a public masterpiece.
</p >
<p >💬 Need constructive feedback to refine your craft?
    Join a community of fellow writers eager to share their insights and support your journey.
</p>
<p > 🌟 Create or join groups that resonate with your writing style,
    genre, or interests, connect with like-minded individuals who 
    appreciate your unique voice.
</p>
<p>📘 Organize all your related writing into books. 
    Reorganzing the work until you're satisfied.</p>
<p >
📚 Whether you're a seasoned novelist or just beginning your literary adventure.
Plumbum is great place to begin work and find support to complete work.
</p>

</ul>
    </div>)
}
    const groupImage = ()=>{
        return(<div id="image-container1">
<img src={groupJpg} id="group" alt="books"/>
        </div>)
    }
    return(<div id="about">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<div>
    <div  className="welcome">
    
    <div id="title">
        <h1><strong>Welcome to Plumbum</strong></h1>
    </div>
        <MediaQuery minWidth={"950px"}>
<div id="bookshelf">
<img  src={rickyBookshelf}alt="bookshelves" />


</div>
</MediaQuery>
</div>
<div>
<div id="for">
    {groupImage()}
    {forCreatives()}
</div>
</div>
<div className="details box">

    {detailsOfWorkshop()}
</div>
</div>
<div className="details box">
    {writingJourney()}
</div>

    <div className="request">
<p>Any request for more feautres, problems, encoragement, send to plumbumapp@gmail.com</p>
</div>
    </div>)
}
