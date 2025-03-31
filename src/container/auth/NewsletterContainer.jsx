import { useContext, useRef, useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"
import {Dialog,DialogTitle,DialogContent,DialogActions,Button} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import Context from "../../context"
function NewsletterContainer(props){
  const isNotPhone = useMediaQuery({
    query: '(min-width: 600px)'
  })
  const [formData, setFormData] = useState({
    fullName:"",
    igHandle:"",
    email:"",
    frequency:1,
    thirdPlace: "",
    eventInterests: [],
    newsletterContent: [],
    writingRole: [],
    otherInputs:{
      eventInterests: "",
    newsletterContent: "",
    writingRole: "",
    }

  });

  const navigate = useNavigate()
  const eventOptions = [
    "Workshops & Classes",
    "Open Mics & Readings",
    "Casual Writing Meetups",
    "Panel Discussions",
    "Other"
  ];

  const contentOptions = [
    "Writing prompts",
    "Literary event announcements",
    "Interviews with writers",
    "Book/poetry recommendations",
    "Opportunities (grants, fellowships, workshops)",
    "Other"
  ];

  const writingRoles = [
    "It’s my profession",
    "It’s my creative outlet",
    "It helps me process emotions",
    "It’s a way to connect with others",
    "Other"
  ];

  const handleOtherInputChange = (category, e) => {


      setFormData((prev) => ({
        ...prev,
        otherInputs: { ...prev.otherInputs, [category]: e.target.value }
      }));
      console.log(formData)
    }


  
    const [user,setUser]=useState(null)
      const selectRef = useRef()
    const {setError}=useContext(Context)

  

    const onClickApply = (e)=>{
        e.preventDefault()
     
        if(validateEmail(formData.email)){
formData["frequency"]=parseInt(formData["frequency"])
        authRepo.newsletter(formData).then(data=>{
            
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
const handleChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
  console.log(formData)
};
const handleCheckboxChange = (event, stateUpdater, field) => {
  const value = event.target.value;
  stateUpdater((prev) =>{
    console.log(prev)
 
  if(prev[field].includes(value)){
  prev[field]  =prev[field].filter((item) => item !== value)
  }else{
   prev[field]  = [...prev[field], value]

  }
  return prev


  
  })  
  handleChange(field, [...formData[field], value]);}
  let otherClassname ="input bg-transparent text-white border-white border-1 rounded-full mt-2 mb-4"
return (
  <>
    <div className="sm:pb-8">
    
  
      {/* <div> */}
      <div>
          <form
            onSubmit={(e) => onClickApply(e)}
            className="form-data shadow-sm sm:my-8 md:rounded-lg pb-30 bg-emerald-800 bg-opacity-70 flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] text-left mx-auto lg:mt-24"
          >
            <h6 className="text-white lora-bold text-sm">* Required</h6>
            <div className="w-full text-center text-white mb-8">
              <h3 className="mx-auto text-2xl text-white mont-medium my-8 w-fit">Newsletter Sign Up</h3>
              <h5 className="open-sans-medium  ">Keep up with our events, workshops, growth, and website development. </h5>
              <p className="open-sans-medium  ">Joining newsletter will not make you a user</p>

            </div>

            {/* Preferred Name */}
            <label className="input text-[0.8rem] rounded-full mont-medium  mt-4 text-white py-8 font-bold mb-4 lg:py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
              Preferred Name
              <input
                type="text"
                className="grow pl-4 text-white  w-full"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Jon Doe"
              />
            </label>

            {/* Email */}
            <label className="input mt-4 mb-2 rounded-full font-bold py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
              <h6 className="font-bold mont-medium flex min-w-[3.8em] text-[0.8rem]">* Email</h6>
              <input
                type="text"
                name="email"
                className="grow text-white mont-medium  pl-4 w-[100%]"
                value={formData.email}
                onChange={(e) => handleChange("email", e.currentTarget.value.trim())}
                placeholder=""
              />
            </label>
            {formData.email.length > 0 && !validateEmail(formData.email) ? (
              <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
            ) : null}
   <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%] bg-transparent text-white border border-green-100 text-white flex items-center ">
            <h6 className="font-bold  mont-medium text-[0.8rem]">IG Handle </h6> 
        <input
              type="text"
              className="grow  mont-medium  text-white mx-2 "
              value={formData.igHandle}
              
              onChange={(e) => handleChange("igHandle",e.currentTarget.value.trim())}
              placeholder="*****"
            />
          </label>
         
            <label className="block mt-4 lg:text-xl  text-white mont-medium font-semibold mb-2">
              What kinds of events help you grow as a writer or creative?
            </label>
            {eventOptions.map((option) => (
              <label key={option} className="flex open-sans=medium text-white items-center mb-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.eventInterests.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, setFormData, "eventInterests")}
                  className="mr-2 checkbox border-white border-1"
                />
                {option}
              </label>
            ))}
             {formData.eventInterests.includes("Other") && (
          <input
            type="text"
            placeholder="Specify"
            className={otherClassname}
            value={formData.otherInputs.eventInterests}
            onChange={(e) => handleOtherInputChange("eventInterests", e)}
            // onBlur={() => handleOtherBlur("eventInterests")}
          />
        )}

            {/* Newsletter Content */}
            <label className="block lg:text-xl mt-4  mb-4 mont-medium text-white font-semibold ">
              What type of content do you want from Plumbum’s newsletter?
            </label>
            {contentOptions.map((option) => (
              <label key={option} className="flex lg:text-[1rem] mb-1 text-white open-sans-medium items-center mb-2">
                <input
                  type="checkbox"
                  value={option}
                  
                  checked={formData.newsletterContent.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, setFormData, "newsletterContent")}
                  className="mr-2 checkbox border-white border-1"
                />
                {option}
              </label>
            ))}
     {formData.newsletterContent.includes("Other") && (
          <input
            type="text"
            className={otherClassname}
            placeholder="Specify Other"
            value={formData.otherInputs.newsletterContent}
            onChange={(e) => handleOtherInputChange("newsletterContent", e)}
            // onBlur={() => handleOtherBlur("newsletterContent")}
          />
        )}
      
            {/* Writing Role */}
            <label className="block mt-4 lg:text-xl  mb-4  mont-medium text-white font-semibold">
              What role does writing or storytelling play in your life?
            </label>
            {writingRoles.map((option) => (
              <label key={option} className="flex lg:text-[1rem] text-white items-center mb-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.writingRole.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, setFormData, "writingRole")}
                  className="mr-2 checkbox border-white border-1"
                />
                {option}
              </label>
            ))}
            
            {formData.writingRole.includes("Other") && (
          <input
            type="text"
            placeholder="Specify Other"
            className={otherClassname}
            value={formData.otherInputs.writingRole}
            onChange={(e) => handleOtherInputChange("writingRole", e)}
       
          />
        )}
            {/* Email Frequency */}
            <div className="mb-4 flex flex-row mt-8 justify-between">
              <label className="block text-white my-auto  mb-4  mont-medium lg:text-[1rem] font-semibold">
                Email Frequency
              </label>
              <select
                name="frequnecy"
                className="w-full bg-white select text-[0.8rem] text-emerald-700 mont-medium select-bordered "
                value={formData.frequency}
                ref={selectRef}
                onChange={(e) =>handleChange("frequency",e.target.value)}
              >
                <option className="text-emerald-700" value={1}>
                  daily
                </option>
                <option className="text-emerald-700" value={3}>
                  Every 3 days
                </option>
                <option className="text-emerald-700" value={7}>
                  Weekly
                </option>
                <option className="text-emerald-700" value={14}>
                  Every 2 Weeks
                </option>
                <option className="text-emerald-700" value={30}>
                  Monthly
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="mont-medium my-8 py-4 text-2xl text-white text-emerald-800 shadow-md mont-medium px-20 mx-auto rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:bg-green-400 font-bold border-none shadow-sm"
            >
              Subscribe
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
{/* <h6>
We’ll start onboarding beta users at the end of February, and we can’t wait to celebrate with you at our Launch Party! Details are on the way, so stay tuned through 
our instagram <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp</a> or through our parnters  
<a href="https://www.instagram.com/bxwriters?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="> @bxwriters.</a>
</h6> */}
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
)

}
export default NewsletterContainer
