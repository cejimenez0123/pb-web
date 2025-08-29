import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"
//import {Dialog,DialogTitle,DialogContent,DialogActions,Button} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import Dialog from "../../components/Dialog"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import Context from "../../context"
import clear from "../../images/icons/clear.svg"
import { initGA,sendGAEvent } from "../../core/ga4"
function NewsletterContainer(props){
  const isNotPhone = useMediaQuery({
    query: '(min-width: 600px)'
  })
  useLayoutEffect(()=>{
    initGA()
    sendGAEvent("View Newsletter Apply Page","View Newsletter Apply Page:","",0,false)
  },[])
  const [formData, setFormData] = useState({
    fullName:"",
    igHandle:"",
    email:"",
    frequency:1,
    thirdPlaces: [],
    thirdPlace:"",
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
    "Concerts",
    "Film Screenings",
    "Mixers",
    "Dance Nights",
    "Other"
  ];

  const contentOptions = [
    "Writing prompts",
    "Literary event announcements",
    "Interviews with writers",
    "Book/poetry recommendations",
    "Opportunities (grants, submissions, fellowships, workshops)",
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
    const {setErrorm,seo,setSeo}=useContext(Context)

  

    const onClickApply = (e)=>{
        e.preventDefault()
     sendGAEvent("Apply for Newsletter","Apply for Newsletter","Subscribe",0,false)
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
            console.log(e)
            setError(e.message)
          }
        })
    }else{
      setError("Please use valid email")
    }

  }
useEffect(()=>{
  if(location.pathname.includes("newsletter")){
    let soo = seo
    soo.title= "Plumbum (Newsletter Apply)"
    setSeo(soo)
  }
 
})
  
  

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
};{/* Third Place */}
const thirdPlacesInput=()=>{
  return(<>
<label className="block mt-4 lg:text-xl text-emerald-700 mont-medium font-semibold mb-2">
  Where do you hang out outside of work/school?
</label>
<div className="flex flex-col gap-2">
  <div className="flex">
    <input
      type="text"
      className="input bg-transparent text-emerald-700 border-emerald-300 border-1 rounded-full mt-2 mb-4 grow"
      value={formData.thirdPlace}
      onChange={(e) => handleChange("thirdPlace", e.target.value)}
      placeholder="Enter a location"
    />
    <button
      type="button"
      onClick={() => {
        if (formData.thirdPlace.trim() && !formData.thirdPlaces.includes(formData.thirdPlace.trim())) {
          setFormData((prev) => ({
            ...prev,
            thirdPlaces: [...prev.thirdPlaces, formData.thirdPlace.trim()],
            thirdPlace: "", // clear input after adding
          }));
        }
      }}
      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2 ml-2"
    >
      Add
    </button>
  </div>

  {/* Display the list of added third places */}
  {formData.thirdPlaces.length > 0 && (
    <div className="flex flex-wrap gap-2">
      {formData.thirdPlaces.map((place, index) => (
        <div
          key={index}
          className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full flex items-center justify-between"
        >
          <span>{place}</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              const updatedPlaces = formData.thirdPlaces.filter((item, idx) => idx !== index);
              setFormData((prev) => ({
                ...prev,
                thirdPlaces: updatedPlaces,
              }));
            }}
            className="ml-2 text-red-500 bg-transparent hover:text-red-600"
          >
            <img src={clear}/>
          </button>
        </div>
    
      ))}
    </div>
  )}
</div>
</>
)}
const openDialog=()=>{
    let dia = {...dialog}
}
const handleCheckboxChange = (event, stateUpdater, field) => {
  const value = event.target.value;
  
  stateUpdater((prev) => {
    const updatedArray = prev[field].includes(value)
      ? prev[field].filter((item) => item !== value)  // Remove value if already checked
      : [...prev[field], value];  // Add value if not already checked

    return { ...prev, [field]: updatedArray };  // Update the state with the new array
  });
};

  let otherClassname ="input bg-transparent text-white border-white border-1 rounded-full mt-2 mb-4"
return (
  <>
      <div className="sm:pb-8 ">
        
        <form
          onSubmit={(e) => onClickApply(e)}
          className="form-data shadow-sm sm:my-8 md:rounded-lg pb-30 bg-emerald-50 bg-opacity-70 flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] text-left mx-auto lg:mt-24"
        >
          <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>
          <div className="w-full text-center text-emerald-700 mb-8">
            <h3 className="mx-auto text-2xl text-emerald-700 mont-medium my-8 w-fit">Newsletter Sign Up</h3>
            <h5 className="mont-medium text-emerald-700">Keep up with our events, workshops, growth, and website development.</h5>
            <h6 className="mont-medium text-emerald-700">Joining the newsletter does not make you a user. You can join later. </h6>
          </div>

          {/* Preferred Name */}
          <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700 py-8 font-bold mb-4 lg:py-8 bg-transparent border border-emerald-300 text-emerald-700 flex items-center gap-2">
            Preferred Name
            <input
              type="text"
              className="grow pl-4 text-emerald-700 w-full"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Jon Doe"
            />
          </label>

          {/* Email */}
          <label className="input mt-4 mb-2 rounded-full font-bold py-8 bg-transparent border border-emerald-300 text-emerald-700 flex items-center gap-2">
            <h6 className="font-bold mont-medium flex min-w-[3.8em] text-[0.8rem]">* Email</h6>
            <input
              type="text"
              name="email"
              className="grow text-emerald-700 mont-medium pl-4 w-[100%]"
              value={formData.email}
              onChange={(e) => handleChange("email", e.currentTarget.value.trim())}
              placeholder=""
            />
          </label>
          {formData.email.length > 0 && !validateEmail(formData.email) ? (
            <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
          ) : null}

          {/* Instagram Handle */}
          <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%] bg-transparent text-emerald-700 border border-emerald-300 text-emerald-700 flex items-center ">
            <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle </h6> 
            <input
              type="text"
              className="grow mont-medium text-emerald-700 mx-2"
              value={formData.igHandle}
              onChange={(e) => handleChange("igHandle", e.currentTarget.value.trim())}
              placeholder="*****"
            />
          </label>

          {/* Event Interests */}
          <label className="block mt-4 lg:text-xl text-emerald-700 mont-medium font-semibold mb-2">
            What kinds of events help you grow as a writer or creative?
          </label>
          {eventOptions.map((option) => (
            <label key={option} className="flex open-sans-medium text-emerald-700 items-center mb-2">
              <input
                type="checkbox"
                value={option}
                checked={formData.eventInterests.includes(option)}
                onChange={(e) => handleCheckboxChange(e, setFormData,"eventInterests")}
                className="mr-2 checkbox border-emerald-300 border-1"
              />
              {option}
            </label>
          ))}
          {formData.eventInterests.includes("Other") && (
            <input
              type="text"
              placeholder="Specify"
              className="input bg-transparent text-emerald-700 border-emerald-300 border-1 rounded-full mt-2 mb-4"
              value={formData.otherInputs.eventInterests}
              onChange={(e) => handleOtherInputChange("eventInterests", e)}
            />
          )}

          {/* Newsletter Content */}
          <label className="block lg:text-xl mt-4 mb-4 mont-medium text-emerald-700 font-semibold">
            What type of content do you want from Plumbum’s newsletter?
          </label>
          {contentOptions.map((option) => (
            <label key={option} className="flex lg:text-[1rem] mb-1 text-emerald-700 open-sans-medium items-center mb-2">
              <input
                type="checkbox"
                value={option}
                checked={formData.newsletterContent.includes(option)}
                onChange={(e) => handleCheckboxChange(e, setFormData, "newsletterContent")}
                className="mr-2 checkbox border-emerald-300 border-1"
              />
              {option}
            </label>
          ))}
          {formData.newsletterContent.includes("Other") && (
            <input
              type="text"
              className="input bg-transparent text-emerald-700 border-emerald-300 border-1 rounded-full mt-2 mb-4"
              placeholder="Specify Other"
              value={formData.otherInputs.newsletterContent}
              onChange={(e) => handleOtherInputChange("newsletterContent", e)}
            />
          )}

          {/* Writing Role */}
          <label className="block mt-4 lg:text-xl mb-4 mont-medium text-emerald-700 font-semibold">
            What role does writing or storytelling play in your life?
          </label>
          {writingRoles.map((option) => (
            <label key={option} className="flex lg:text-[1rem] text-emerald-700 items-center mb-2">
              <input
                type="checkbox"
                value={option}
                checked={formData.writingRole.includes(option)}
                
  onChange={(e) => handleCheckboxChange(e, setFormData,"writingRole")}
                className="mr-2 checkbox border-emerald-300 border-1"
              />
              {option}
            </label>
          ))}
          {formData.writingRole.includes("Other") && (
            <input
              type="text"
              placeholder="Specify Other"
              className="input bg-transparent text-emerald-700 border-emerald-300 border-1 rounded-full mt-2 mb-4"
              value={formData.otherInputs.writingRole}
              
              onChange={(e) => handleOtherInputChange("writingRole", e)}
            />
          )}
{thirdPlacesInput()}
          {/* Email Frequency */}
          <div className="mb-4 flex flex-row mt-8 justify-between">
            <label className="block text-emerald-700 my-auto mb-4 mont-medium lg:text-[1rem] font-semibold">
              Email Frequency
            </label>
            <select
              name="frequency"
              className="w-full bg-white select text-[0.8rem] text-emerald-700 mont-medium select-bordered"
              value={formData.frequency}
              ref={selectRef}
              onChange={(e) => handleChange("frequency", e.target.value)}
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
            className={`mont-medium my-8 py-4 text-2xl  text-white shadow-md mont-medium px-20 mx-auto rounded-full ${validateEmail(formData.email)?"bg-gradient-to-r from-emerald-500 to-emerald-700":"bg-gradient-to-r from-purple-500 to-gray-400"} hover:bg-emerald-400 font-bold border-none shadow-sm`}
          >
            Subscribe
          </button>
        </form>

        <Dialog 
  open={user}
  onClose={handleClose}
  text={
    <div>
      {user ? (
        !user.message ? (
          <div id="welcome" className="p-8 lora-medium leading-[1.5em] overflow-scroll">
            <p>Thank You {user.preferredName}! You’re In—Welcome to the Journey!</p>
            <br />
            <h6>Congratulations! You’re officially on board as a beta user for Plumbum, where we’re redefining what it means to create, connect, and grow as a writer.</h6>
            <br />
            <h6>
              This is more than just an app. Together, we’re building a space where writers like you can test ideas, share stories, and discover the confidence to take your work to the next level.
            </h6>
            <br />
            <h6>
              Thank you for joining this exciting journey. Your insights and creativity will help shape Plumbum into a community where creativity thrives.
            </h6>
            <br />
            <h6>Let’s make our story, together!</h6>
            <br />
            <h6>
              - Sol Emilio Christian,<br />
              Founder of Plumbum
            </h6>
          </div>
        ) : (
          <div className="min-h-40 lora-medium min-w-36 flex">
            <div className="mx-auto my-auto">
              <p>User already applied</p>
              <br />
              <p>
                Message <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp</a>
                {' '}or email plumbumapp@gmail.com with:
              </p>
              <br />
              <p>Subject: I want to be an alpha user!</p>
              <br />
              <p>We may add you on early.</p>
            </div>
          </div>
        )
      ) : (
        <div className="flex">
          <p className="mx-auto my-auto">Error. Try again later</p>
        </div>
      )}
    </div>
  }
/>

</div>
  </>
)

}
export default NewsletterContainer
