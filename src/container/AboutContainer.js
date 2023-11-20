import "../styles/About.css"
import bookshelf from "../images/bookshelf.PNG"
import book1 from "../images/book1.png"
import MediaQuery from "react-responsive"
import { Button } from "@mui/material"
import theme from "../theme"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
export default function AboutContainer(props){
    const navigate = useNavigate()
    return(<div id="about">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap" />
<div className="welcome">
    <div>
<h1 id="welcome"><strong>Welcome to Plumbum</strong></h1>
</div>
<div id="bookshelf">
<img  src={bookshelf}alt="bookshelves" />
</div>
</div>
<MediaQuery maxWidth={"1000px"}>
<div className="details">

<h1>For Creatives</h1>
<p > 
Plumbum is for writers to help recreate the writers' workshop online.
Writers' workshop are a place to receive feedback on your work from people 
with the same goal as you of getting better at their craft.</p>
</div>
</MediaQuery>
<div>
<div>
    <section className="box">
        <div id="image-container1">
<img src={book1} id="book1" alt="books"/>
</div>
<MediaQuery minWidth={"1000px"}>
<div className="details">

<h1>For Creatives</h1>
<p > 
Plumbum is for writers to help recreate the writers' workshop online.
Writers' workshop are a place to receive feedback on your work from people 
with the same goal as you of getting better at their craft.</p>
</div>
</MediaQuery>
</section>
<section >
<ul>
<p className="details">
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

<div id="ready">
<p >
Ready to start your writing journey? 
Sign up today, start a page and write anything.
It's the place for your story on Plumbum.</p>
<Button onClick={()=>{navigate(Paths.login())}}  style={{border:`1px #5CCA61 solid`,padding:"0.5em 1em",color:"#5CCA61",fontSize:"2em"}}>Sign Up</Button>
</div>
</section>
<div className="request">
<p>Any request for more feautres, problems, encoragement, send to plumbumapp@gmail.com</p>
</div>
</div>
    </div>
    </div>)
}
