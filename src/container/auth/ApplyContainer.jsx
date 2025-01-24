import { useContext, useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"
import {Dialog,DialogTitle,DialogContent,DialogActions,Button} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import Alert from "../../components/Alert"
import Context from "../../context"
function ApplyContainer(props){
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
      ]; const [igHandle,setIgHandle]=useState("")
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [whyApply,setWhyApply]=useState("")
    const [howFindOut,setHowFindOut]=useState("")
    const [otherGenre, setOtherGenre] = useState("");
    const [communityNeeds,setCommunityNeeds]=useState("")
    const [workshopPreference,setWorkshopPreference]=useState("")
    const [feedbackFrequency,setFeedbackFrequency]=useState("")
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [comfortLevel,setComfortLevel]=useState(0)
    const [platformFeatures,setPlatformFeatures]=useState("")
    const [user,setUser]=useState(null)
    const {error,setError}=useContext(Context)
    const [betaTest,setBetaTester]=useState([])
    const [igError,setIgError]=useState(false)
    const [nameError,setNameError]=useState(false)
    const [emailError,setEmailError]=useState(false)
    const [whyApplyError,setWhyApplyError]=useState(false)
    const [howFindError,setHowFindError]=useState(false)
    

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
      <Alert  />
    {/* <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
   {error?
  <div role="alert" className={`alert    
  ${"alert-warning"} animate-fade-out`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error}</span>
</div>:null}</div> */}
      <div>
        <form
          onSubmit={(e) => onClickApply(e)}
          className="form-data shadow-sm max-w-[40em] sm:my-8 rounded-lg pb-30 bg-emerald-700 bg-opacity-60 flex sm:mb-12 flex-col shadow-md py-4 px-12 lg:max-w-[48rem] text-left mx-auto lg:mt-24"
        >
          <h6 className="text-white lora-bold text-sm">* Required</h6>
          <div className="w-full text-center">
            <h3 className="mx-auto text-2xl lora-bold my-8 w-fit">Interest Form</h3>
          </div>
          
          {/* Preferred Name */}
          <label className="input text-[0.8rem] lora-bold mt-4 text-white py-8 font-bold mb-4 lg:py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
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
          <label className="input mt-4 mb-2 font-bold py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
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
          <label className="input mt-4 mb-8 font-bold py-8 w-[100%] bg-transparent text-white border border-green-100 text-white flex items-center gap-2">
            <h6 className="font-bold  lora-bold text-[0.8rem]">IG Handle</h6>
            <input
              type="text"
              className="grow  lora-bold text-white pl-4"
              value={igHandle}
              onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
              placeholder="*****"
            />
          </label>

          {/* Why do you write? */}
          <label className="text-xl font-bold lora-bold text-white">Artist Statement</label>
          <label className="text-white  lora-bold text-l mb-2 pb-1 font-bold mt-4">
             Why are you applying?
          </label>
          <textarea
            value={whyApply}
            onChange={(e) => setWhyApply(e.target.value)}
            className="textarea bg-transparent open-sans-medium w-[100%] text-l h-min-24 border border-green-100 text-white"
          />

          {/* Community Needs */}
          <label className="text-white lora-bold text-l mb-2 pb-1 font-bold mt-4">
            What do you look for in a writing community?
          </label>
          <textarea
            value={communityNeeds}
            onChange={(e) => setCommunityNeeds(e.target.value)}
            className="textarea bg-transparent open-sans-medium w-[100%] text-l sm:text-xl h-min-24 border border-green-100 text-white"
          />
<label className="text-white text-l lora-medium mb-2 pb-1 font-bold mt-4">
  What genres do you write in?
 </label>
<div className="flex flex-wrap gap-3">
   {genres.map((genre, index) => (
    <label key={index} className="flex items-center ">
      <input
        type="checkbox"
        value={genre}
        onChange={(e) => handleGenreSelection(e.target.value)}
        className="checkbox mx-1 border-white border-1"
      />
      <span className="text-white open-sans-medium">{genre}</span>
    </label>
  ))}
</div>
{selectedGenres.includes("Other") && (
  <input
    type="text"
    placeholder="Please specify"
    value={otherGenre}
    onChange={(e) => setOtherGenre(e.target.value)}
    className="bg-transparent border border-green-100 open-sans-medium py-2 text-white text-[1rem] sm:text-xl input mt-4"
  />
)}
<label className="text-white text-l lora-medium mb-2 pb-1 font-bold mt-4">
   How comfortable are you sharing your work with others?
</label>
<div className="flex flex-col items-center gap-4">
  {/* Slider */}
  <input
    type="range"
    min="1"
    max="5"
    step="1"
    value={comfortLevel}
    onChange={(e) => setComfortLevel(e.target.value)}
    className="range bg-emerald-50  [--range-shdw:orange] w-full"
  />

  {/* Dashes */}
  <div className="flex justify-between w-[100%] text-sm text-white">
    <span>|</span>
    <span>|</span>
    <span>|</span>
    <span>|</span>
    <span>|</span>
  </div>

  {/* Text Labels */}
  <div className="flex justify-between w-[100%] text-sm text-white mt-2">
    <span className="w-[20%] open-sans-medium text-left">Very Uncomfortable</span>
    
    <span className="w-[35%] open-sans-medium text-right">Very Comfortable</span>
  </div>
</div>


   
      <label className="text-white text-l lora-bold mb-2 pb-1 font-bold mt-4">
   How often do you seek feedback on your writing?
 </label> <select
  value={feedbackFrequency}
  onChange={(e) => setFeedbackFrequency(e.target.value)}
  className="select bg-transparent border border-green-100 text-white w-full text-l sm:text-xl"
>
  <option value="" className="open-sans-medium "disabled>
    Select an option
  </option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
  <option value="occasionally">Occasionally</option>
  <option value="rarely">Rarely</option>
</select>
          {/* In-person or Online Preference */}
          <label className="text-white lora-bold text-l mb-2 pb-1 font-bold mt-4">
            Would you prefer in-person workshops, online, or both?
          </label>
          <select
            value={workshopPreference}
            onChange={(e) => setWorkshopPreference(e.target.value)}
            className="select open-sans-medium bg-transparent border border-green-100 text-white w-full text-l sm:text-xl"
          >
            <option value="in-person">In-person</option>
            <option value="online">Online</option>
            <option value="both">Both</option>
          </select>

          {/* How did you find out? */}
          <label className="text-white text-l lora-bold mb-2 pb-1 font-bold mt-4">
            How did you find out?
          </label>
          <input
            value={howFindOut}
            onChange={(e) => handleChangeHowFindOut(e.target.value)}
            className="bg-transparent border open-sans-medium border-green-100 py-8 text-white text-l sm:text-xl input"
          />
          <label className="text-white text-l  lora-bold mb-2 pb-1 font-bold mt-4">
   What features would make a writing platform most valuable to you?
</label>
<textarea
  value={platformFeatures}
  onChange={(e) => setPlatformFeatures(e.target.value)}
  className="textarea bg-transparent w-[100%] open-sans-medium text-l sm:text-xl h-min-24 border border-green-100 text-white"
/>

          <button
            type="submit"
            className="mont-medium my-8 text-2xl mont-medium px-20 text-white mx-auto rounded-full bg-green-600 hover:bg-green-400 font-bold border-none shadow-sm"
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
export default ApplyContainer