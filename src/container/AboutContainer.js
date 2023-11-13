import "../styles/About.css"
import bookshelf from "../images/bookshelf.PNG"
import book1 from "../images/book1.png"
export default function AboutContainer(props){

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

<div>
<div>
    <section className="box">
        <div id="image-container1">
<img src={book1} id="book1" alt="books"/>
</div>

<div className="details">
<h1>For Creatives</h1>
<p > 
Plumbum is for writers to help recreate the writers' workshop online.
Writers' workshop are a place to receive feedback on your work from people 
with the same goal as you of getting better at their craft.</p>
</div>
</section>
<section >
<ul>
<p className="details">
It's a creative sanctuary. A place to receive feedback, control privacy,
and build community.</p>

<p className="details"> 📝 Tired of oversharing your work?
Plumbum allows you to control the visibility of your writing,
whether you want it to be a private diary or a public masterpiece.
</p >
<p className="details">💬 Need constructive feedback to refine your craft?
    Join a community of fellow writers eager to share their insights and support your journey.
</p>
<p className="details"> 🌟 Create or join groups that resonate with your writing style,
    genre, or interests, connect with like-minded individuals who 
    appreciate your unique voice.
</p>
<p className="details">📘 Organize all your related writing into books. Reorganzing the work until you're satisfied.</p>
<p className="details">
📚 Whether you're a seasoned novelist or just beginning your literary adventure.
Plumbum is great place to begin work and find support to complete work.
</p>

</ul>


<p id="ready">
Ready to start your writing journey? 
Sign up today, start a page and write anything.
It's the place for your story on Plumbum.</p>

</section>
<div className="request">
<p>Any request for more feautres, problems, encoragement, send to plumbumapp@gmail.com</p>
</div>
</div>
    </div>
    </div>)
}
