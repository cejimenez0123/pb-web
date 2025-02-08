import { useContext, useRef, useState } from "react"
import authRepo from "../data/authRepo"
import validateEmail from "../core/validateEmail"
import {Dialog,DialogTitle,DialogContent,DialogActions,Button} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../core/paths"
import Context from "../context"
function NewsletterContainer(props){
  const isNotPhone = useMediaQuery({
    query: '(min-width: 600px)'
  })
  const navigate = useNavigate()
    const genres = [
        "Fiction",
        "Non-fiction",
        "Poetry",
        "Drama/Playwriting",
        "Screenwriting",
        "Flash Fiction",
        "Memoir",
        "Short Stories",
        "Fantasy",
        "Science Fiction",
        "Horror",
        "Mystery/Thriller",
        "Romance",
        "Young Adult",
        "Children's Literature",
        "Historical Fiction",
        "Satire/Humor",
        "Experimental/Hybrid Forms",
        "Other"
      ]; 
    const [igHandle,setIgHandle]=useState("")
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [whyApply,setWhyApply]=useState("")
    const [howFindOut,setHowFindOut]=useState("")
    const [frequency,setFrequency]=useState(1)
    const [user,setUser]=useState(null)
      const selectRef = useRef()
    const {setError}=useContext(Context)
 

    

    const handleGenreSelection = (genre) => {
        setSelectedGenres((prev) =>
          prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
      };

    const handleChangeIgHandle = (text)=>{
     setIgHandle(text)
    }
    const handleChangeFullName = (text)=>{
      setFullName(text)
    }
    const handleChangeEmail = (text)=>{
        setEmail(text.trim())
    }
    const handleChangeWhyApply =(text)=>{
      setWhyApply(text)
    }
    const handleChangeHowFindOut = (text)=>{
       setHowFindOut(text)
    }
    const onClickApply = (e)=>{
        e.preventDefault()
        if(validateEmail(email)){
        const form = {
            igHandle,
            fullName,
            email:email.toLowerCase(),
            whyApply,
            communityNeeds,
            workshopPreference,
            feedbackFrequency,
            howFindOut,
            comfortLevel,
            platformFeatures,
            genres: selectedGenres.includes("Other")
              ? [...selectedGenres.filter((g) => g !== "Other"), otherGenre]
              : selectedGenres,
         
          };
        authRepo.apply(form).then(data=>{
        
if(data.user){
  setUser(data.user)
}

        }).catch(e=>{

          if(e.status==409){
            setUser({message:"User has already applied"})
          }else{
            setError(e.message)
          }
        })
    }else{
      setError("Please use valid email")
    }

    }

const handleClose= ()=>{
  setUser(null)
  navigate(Paths.about())
}
setTimeout(()=>{

  setError(null)



},4001)
return (
  <>
    <div className="sm:pb-8">
    
  
      <div>
        <form
          onSubmit={(e) => onClickApply(e)}
          className="form-data shadow-sm  sm:my-8 md:rounded-lg pb-30 bg-emerald-700 bg-opacity-80 flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] text-left mx-auto lg:mt-24"
        >
          <h6 className="text-white lora-bold text-sm">* Required</h6>
          <div className="w-full text-center">
            <h3 className="mx-auto text-2xl text-white lora-bold my-8 w-fit">Interest Form</h3>
          </div>
          
          {/* Preferred Name */}
          <label className="input text-[0.8rem] rounded-full lora-bold mt-4 text-white py-8 font-bold mb-4 lg:py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
            Preferred Name
            <input
              type="text"
              className="grow pl-4 text-white  w-full"
              value={fullName}
              onChange={(e) => handleChangeFullName(e.target.value)}
              placeholder="Jon Doe"
            />
          </label>

          {/* Email */}
          <label className="input mt-4 mb-2 rounded-full font-bold py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
            <h6 className="font-bold lora-bold text-[0.8rem]">* E-mail</h6>
            <input
              type="text"
              className="grow text-white lora-bold pl-4 w-[100%]"
              value={email}
              onChange={(e) => handleChangeEmail(e.target.value.trim())}
              placeholder=""
            />
          </label>
          {email.length>0 && !validateEmail(email) ?
            (<h6 className="text-[0.8rem] lora-bold text-red-500">Please use a valid email</h6>
          ):null}

          {/* IG Handle */}
          <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%] bg-transparent text-white border border-green-100 text-white flex items-center ">
            <h6 className="font-bold  lora-bold text-[0.8rem]">IG Handle </h6>
            <input
              type="text"
              className="grow  lora-bold text-white mx-2 "
              value={igHandle}
              onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
              placeholder="*****"
            />
          </label>

          <div className="mb-4 flex flex-row justify-between">
          <label className="block text-white mont-medium text-[1.5rem] font-semibold mb-2">
            Email Frequency
          </label>
          <select
            className="w-full bg-white select text-emerald-700 mont-medium select-bordered "
            value={frequency}
            ref={selectRef}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option className="text-emerald-700" value={1}>daily</option>
            <option  className="text-emerald-700" value={2}>Every 3 days</option>
            <option  className="text-emerald-700" value={3}>Weekly</option>
            <option  className="text-emerald-700" value={14}>Every 2 Weeks</option>
            <option  className="text-emerald-700" value={30}>Monthly</option>

          </select>
        </div>

    
        <button 
            type="submit"
            className="mont-medium my-8 py-4 text-2xl text-white text-emerald-800  mont-medium px-20  mx-auto rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 hover:bg-green-400 font-bold border-none shadow-sm"
          >
            Apply
          </button>
        </form>
      </div>
     
              <Dialog className={
                "bg-emerald-50  w-[100%] mx-auto overscroll-none"
              }
              fullScreen={!isNotPhone&&user && user.preferredName}
              PaperProps={{
                style: {
            
      
                
                },
              }}
            
              open={user}
              onClose={()=>handleClose()}>
        <div>
        {user?<div>
     
      <DialogContent>
   

  {user && !user.message?
        <div id="welcome"className=" p-8 lora-medium leading-[1.5em] overflow-scroll">
           <p>Thank You {user.preferredName}! You’re In—Welcome to the Journey! </p>
<br/>
<h6  >Congratulations! You’re officially on board as a beta user for Plumbum, where we’re redefining what it means to create, connect, and grow as a writer.</h6>
<br/>
<h6>
This is more than just an app. Together, we’re building a space where writers like you can test ideas, share stories, and discover the confidence to take your work to the next level.
</h6>
<br/>
<h6>
We’ll start onboarding beta users at the end of February, and we can’t wait to celebrate with you at our Launch Party! Details are on the way, so stay tuned through 
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

        </div>:<div className="min-h-40 lora-medium min-w-36 flex"><div className="mx-auto my-auto"><p className=" ">User already applied</p>
        <br/>
        <p>Message  <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp </a>
         or email plumbumapp@gmail.com with:</p>
         <br/>
         <p>Subject:I want to be an alpha user!</p>
         <br/>
         <p>We may add you on early.</p>
          </div></div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} ><span className="mont-medium">Until Later</span></Button>
     
      </DialogActions></div>
        :<DialogContent><div className="flex"><p className="mx-auto my-auto">Error. Try again later</p></div></DialogContent>}</div>
              </Dialog>
    </div>
  </>
);


}
export default NewsletterContainer