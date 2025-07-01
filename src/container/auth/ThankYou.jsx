import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"


export default function ThankYou({user}){
    const navigate = useNavigate()
    return(<div id="welcome"className=" p-8 lora-medium leading-[1.5em] text-emerald-600 overflow-scroll">
    <p>Thank You {user.preferredName}! You’re In—Welcome to the Journey! </p>
<br/>
<h6  >Congratulations! You’re officially on board as a beta user for Plumbum, where we’re redefining what it means to create, connect, and grow as a writer.</h6>
<br/>
<h6>
This is more than just an app. Together, we’re building a space where writers like you can test ideas, share stories, and discover the confidence to take your work to the next level.
</h6>
<br/>
<h6>
We’ll start onboarding beta users for the mobile at the end of August 28th, we will have an open mic on August 9th. We can’t wait to celebrate with you at our Launch Party! Details are on the way, so stay tuned through 
our instagram <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp</a> or through our parnters  
<a href="https://www.instagram.com/bxwriters?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="> @bxwriters.</a>
</h6>
<br/>
<h6>Thank you for joining this exciting journey. Your insights and creativity will help shape Plumbum into a community where creativity thrives.
</h6>
<br/>
<h6>Let’s make our story, together!</h6>
<br/>
<h6>-Sol Emilio Christian, <br/>
Founder of Plumbum</h6>
<div className="flex flex-row justify-between mt-4 text-white">
<button onClick={()=>navigate(Paths.about())}className="bg-emerald-600 rounded-full">Go to About</button>
<button onClick={()=>navigate(Paths.discovery())} className="bg-emerald-600 rounded-full">Go to Discover</button>
</div>
 </div>)
}