// import { useContext, useEffect, useState } from "react"
// import authRepo from "../../data/authRepo"
// import validateEmail from "../../core/validateEmail"
// import {Dialog,DialogContent,DialogActions,Button} from "@mui/material"
// import { useMediaQuery } from "react-responsive"
// import { useLocation, useNavigate } from "react-router-dom"
// import Paths from "../../core/paths"
// import Context from "../../context"
// import ThankYou from "./ThankYou"
// function ApplyContainer(props){
//   const location = useLocation()
//   const {seo,setSeo,setError}=useContext(Context)
//   const isNotPhone = useMediaQuery({
//     query: '(min-width: 600px)'
//   })
//   const navigate = useNavigate()
//     const genres = [
//         "Fiction",
//         "Non-fiction",
//         "Poetry",
//         "Drama/Playwriting",
//         "Screenwriting",
//         "Flash Fiction",
//         "Memoir",
//         "Short Stories",
//         "Fantasy",
//         "Science Fiction",
//         "Horror",
//         "Mystery/Thriller",
//         "Romance",
//         "Young Adult",
//         "Children's Literature",
//         "Historical Fiction",
//         "Satire/Humor",
//         "Experimental/Hybrid Forms",
//         "Other"
//       ]; const [igHandle,setIgHandle]=useState("")

//     const [fullName,setFullName]=useState("")
//     const [email,setEmail]=useState("")
//     const [whyApply,setWhyApply]=useState("")
//     const [howFindOut,setHowFindOut]=useState("")
//     const [otherGenre, setOtherGenre] = useState("");
//     const [communityNeeds,setCommunityNeeds]=useState("")
//     const [workshopPreference,setWorkshopPreference]=useState("")
//     const [feedbackFrequency,setFeedbackFrequency]=useState("")
//     const [selectedGenres, setSelectedGenres] = useState([]);
//     const [comfortLevel,setComfortLevel]=useState(0)
//     const [platformFeatures,setPlatformFeatures]=useState("")
//     const [user,setUser]=useState(null)

//     const [betaTest,setBetaTester]=useState([])
//       useEffect(()=>{
//         if(location.pathname.includes("apply")){
//           let soo = seo
//           soo.title= "Plumbum (Apply)"
//           setSeo(soo)
//         }
       
//       },[])
    

//     const handleGenreSelection = (genre) => {
//         setSelectedGenres((prev) =>
//           prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
//         );
//       };

//     const handleChangeIgHandle = (text)=>{
//      setIgHandle(text)
//     }
//     const handleChangeFullName = (text)=>{
//       setFullName(text)
//     }
//     const handleChangeEmail = (text)=>{
//         setEmail(text.trim())
//     }
//     const handleChangeWhyApply =(text)=>{
//       setWhyApply(text)
//     }
//     const handleChangeHowFindOut = (text)=>{
//        setHowFindOut(text)
//     }
//     const onClickApply = (e)=>{
//         e.preventDefault()
//         if(validateEmail(email)){
//         const form = {
//             igHandle,
//             fullName,
//             email:email.toLowerCase(),
//             whyApply,
//             communityNeeds,
//             workshopPreference,
//             feedbackFrequency,
//             howFindOut,
//             comfortLevel,
//             platformFeatures,
//             genres: selectedGenres.includes("Other")
//               ? [...selectedGenres.filter((g) => g !== "Other"), otherGenre]
//               : selectedGenres,
         
//           };
      
//         if(location.pathname.includes("newsletter")){
//           authRepo.applyFromNewsletter(form).then(data=>{
//              console.log(data)
//           if(data.user){

//             setUser(data.user)
//           }
//         }).catch(err=>{
//       if(err.message.includes("403")){
//           setError("User Already Exists")
//       }else{
//           setError(err.message)
//       }
//        }
//         )}else{authRepo.apply(form).then(data=>{
//         console.log(data)
// if(data.user){
//   setUser(data.user)
//         }else{
          
//           setUser(data)
//         }}).catch(err=>{
//           if(err.message.includes("403")){
//             setError("User Already Exists")
//         }else{
//             setError(err.message)
//         }
//         })}}}
// const handleClose= ()=>{
//   setUser(null)
//   navigate(Paths.about())
// }
// setTimeout(()=>{

//   setError(null)



// },4001)

// return (
//   <>
//     <div className="sm:pb-8">
//     <form
//     onSubmit={(e) => onClickApply(e)}
//     className="form-data shadow-sm sm:my-8 md:rounded-lg pb-30 bg-transparent text-emerald-700   flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] mx-auto lg:mt-24"
//   >
//     <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>
//     <div className="w-full my-8 text-center">
//       <h3 className="mx-auto text-2xl text-emerald-700  lora-bold my-2 w-fit">Interest Form</h3>
//     <h6 className="text-md mont-medium">We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.</h6>
//     </div>
  
//     {/* Preferred Name */}
//     <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700  py-8 font-bold mb-4 lg:py-8  bg-transparent border border-emerald-700  flex items-center gap-2">
//       Preferred Name
//       <input
//         type="text"
//         className="grow pl-4 text-emerald-700  w-full  bg-transparent"
//         value={fullName}
//         onChange={(e) => handleChangeFullName(e.target.value)}
//         placeholder="Jon Doe"
//       />
//     </label>
  
//     {/* Email */}
//     <label className="input mt-4 mb-2 rounded-full font-bold py-8  bg-transparent border border-emerald-700  text-emerald-700  flex items-center gap-2">
//       *<h6 className="font-bold mont-medium text-[0.8rem]"> Email</h6>
//       <input
//         type="text"
//         className="grow text-emerald-700  mont-medium pl-4 w-full  bg-transparent"
//         value={email}
//         onChange={(e) => handleChangeEmail(e.target.value.trim())}
//       />
//     </label>
//     {email.length > 0 && !validateEmail(email) ? (
//       <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
//     ) : null}
  
//     {/* IG Handle */}
//     <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%]  bg-transparent text-emerald-700  border border-emerald-700  text-emerald-700  flex items-center">
//       <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle </h6>
//       <input
//         type="text"
//         className="grow mont-medium text-emerald-700  mx-2"
//         value={igHandle}
//         onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
//         placeholder="*****"
//       />
//     </label>
  
//     {/* Rephrased “Why are you applying?” */}
//     <label className="text-xl font-bold mont-medium text-emerald-700 ">Artist Statement</label>
//     <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
//       What would make a writing space meaningful for you?
//     </label>
//     <textarea
//       value={whyApply}
//       onChange={(e) => setWhyApply(e.target.value)}
//       className="textarea  bg-transparent open-sans-medium w-full text-l h-min-24 border border-emerald-700  text-emerald-700 "
//       placeholder="Tell us what you'd love to see or experience in a space for writers like you."
//     />
  
//     {/* Community Needs */}
//     <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
//       What do you look for in a writing community?
//     </label>
//     <textarea
//       value={communityNeeds}
//       onChange={(e) => setCommunityNeeds(e.target.value)}
//       className="textarea  bg-transparent open-sans-medium w-full text-l  h-min-24 border border-emerald-700  text-emerald-700 "
//     />
  
//     {/* Genres */}
//     <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//       What genres do you write in?
//     </label>
//     <div className="flex flex-wrap gap-3">
//       {genres.map((genre, index) => (
//         <label key={index} className="flex items-center ">
//           <input
//             type="checkbox"
//             value={genre}
//             onChange={(e) => handleGenreSelection(e.target.value)}
//             className="checkbox mx-1 border-black border-1"
//           />
//           <span className="text-emerald-700  open-sans-medium">{genre}</span>
//         </label>
//       ))}
//     </div>
//     {selectedGenres.includes("Other") && (
//       <input
//         type="text"
//         placeholder="Please specify"
//         value={otherGenre}
//         onChange={(e) => setOtherGenre(e.target.value)}
//         className=" bg-transparent border border-emerald-700 open-sans-medium py-2 text-emerald-700  text-[1rem] sm:text-xl input mt-4"
//       />
//     )}
  
//     {/* Comfort Level */}
//     <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//       How comfortable are you sharing your work with others?
//     </label>
//     <div className="flex flex-col items-center gap-4">
//       {/* Slider */}
//       <input
//         type="range"
//         min="1"
//         max="5"
//         step="1"
//         value={comfortLevel}
//         onChange={(e) => setComfortLevel(e.target.value)}
//         className="range bg-emeald-600 w-full"
//       />
//       {/* Dashes */}
//       <div className="flex justify-between w-[92%] text-sm text-emerald-700 ">
//         <span>|</span>
//         <span>|</span>
//         <span>|</span>
//         <span>|</span>
//         <span>|</span>
//       </div>
//       {/* Text Labels */}
//       <div className="flex justify-between w-[100%] text-sm text-emerald-700  mt-2">
//         <span className="w-[20%] open-sans-medium text-left">Very Uncomfortable</span>
//         <span className="w-[35%] open-sans-medium text-right">Very Comfortable</span>
//       </div>
//     </div>
  
//     {/* Feedback Frequency */}
//     <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//       How often do you seek feedback on your writing?
//     </label>
//     <select
//       value={feedbackFrequency}
//       onChange={(e) => setFeedbackFrequency(e.target.value)}
//       className="select  bg-transparent border rounded-full border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
//     >
//       {/* <option value="" className="open-sans-medium" disabled>
//         Select an option
//       </option> */}
//       <option defaultValue={true} value="daily">Daily</option>
//       <option value="weekly">Weekly</option>
//       <option value="monthly">Monthly</option>
//       <option value="occasionally">Occasionally</option>
//       <option value="rarely">Rarely</option>
//     </select>
  
//     {/* Workshop Preference */}
//     <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 mt-4">
//       Would you prefer in-person workshops, online, or both?
//     </label>
//     <select
  
//       value={workshopPreference}
//       onChange={(e) => setWorkshopPreference(e.target.value)}
//       className="select rounded-full open-sans-medium  bg-transparent border border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
//     >
//       <option value="in-person">In-person</option>
//       <option value="online">Online</option>
//       <option defaultValue={true} value="both">Both</option>
//     </select>
  
//     {/* How did you find out? */}
//     <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//       How did you find out about Plumbum?
//     </label>
//     <input
//       value={howFindOut}
//       onChange={(e) => handleChangeHowFindOut(e.target.value)}
//       className=" bg-transparent border open-sans-medium border-emerald-700  py-8 text-emerald-700 text-l sm:text-xl input"
//     />
  
//     {/* Platform Features */}
//     <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
//       What features would make a writing platform most valuable to you?
//     </label>
//     <textarea
//       value={platformFeatures}
//       onChange={(e) => setPlatformFeatures(e.target.value)}
//       className="textarea  bg-transparent w-full open-sans-medium text-l sm:text-xl h-min-24 border border-emerald-700  text-emerald-700 "
//     />
  
//     <button
//       type="submit"
//       className={`mont-medium my-8 py-4 text-2xl text-white mont-medium px-20 mx-auto rounded-full ${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-500":"bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`}
//     >
//       Apply
//     </button>
//   </form>

//               <Dialog className={
//                 "bg-emerald-50  w-[100%] mx-auto overscroll-none"
//               }
//               fullScreen={!isNotPhone&&user && user.preferredName}
//               PaperProps={{
//                 style: {
            
      
                
//                 },
//               }}
            
//               open={user}
//               onClose={()=>handleClose()}>
//         <div>
        
//         {user?<div>
     
//       <DialogContent>
   

//   {user?
//         <ThankYou user={user}/>:<div className="min-h-40 lora-medium min-w-36 flex"><div className="mx-auto my-auto"><p className=" ">User already applied</p>
//         <br/>
//         <p>Message  <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp </a>
//          or email plumbumapp@gmail.com with:</p>
//          <br/>
//          <p>Subject:I want to be an alpha user!</p>
//          <br/>
//          <p>We may add you on early.</p>
//           </div></div>}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose} ><span className="mont-medium">Until Later</span></Button>
     
//       </DialogActions></div>
//         :<DialogContent><div className="flex"><p className="mx-auto my-auto">Error. Try again later</p></div></DialogContent>}</div>
//               </Dialog>
//     </div>
    
//   </>
// );


// }
// export default ApplyContainer

import { useContext, useEffect, useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"
import Dialog from "../../components/Dialog"
import { useMediaQuery } from "react-responsive"
import { useLocation, useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import Context from "../../context"
import ThankYou from "./ThankYou"
function ApplyContainer(props){
  const location = useLocation()
  const {seo,setSeo,setError}=useContext(Context)
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

    const [betaTest,setBetaTester]=useState([])
      useEffect(()=>{
        if(location.pathname.includes("apply")){
          let soo = seo
          soo.title= "Plumbum (Apply)"
          setSeo(soo)
        }
       
      },[])
    

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
      
        if(location.pathname.includes("newsletter")){
          authRepo.applyFromNewsletter(form).then(data=>{
             console.log(data)
          if(data.user){

            setUser(data.user)
          }
        }).catch(err=>{
      if(err.message.includes("403")){
          setError("User Already Exists")
      }else{
          setError(err.message)
      }
       }
        )}else{authRepo.apply(form).then(data=>{
        console.log(data)
if(data.user){
  setUser(data.user)
        }else{
          
          setUser(data)
        }}).catch(err=>{
          if(err.message.includes("403")){
            setError("User Already Exists")
        }else{
            setError(err.message)
        }
        })}}}
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
    <form
    onSubmit={(e) => onClickApply(e)}
    className="form-data shadow-sm sm:my-8 md:rounded-lg pb-30 bg-transparent text-emerald-700   flex sm:mb-12 flex-col shadow-md py-4 px-6 md:max-w-[48rem] mx-auto lg:mt-24"
  >
    <h6 className="text-emerald-700 lora-bold text-sm">* Required</h6>
    <div className="w-full my-8 text-center">
      <h3 className="mx-auto text-2xl text-emerald-700  lora-bold my-2 w-fit">Interest Form</h3>
    <h6 className="text-md mont-medium">We’re building a space that’s nurturing, focused, and kind. This short application helps us make sure it’s the right fit — for you, and for the group.</h6>
    </div>
  
    {/* Preferred Name */}
    <label className="input text-[0.8rem] rounded-full mont-medium mt-4 text-emerald-700  py-8 font-bold mb-4 lg:py-8  bg-transparent border border-emerald-700  flex items-center gap-2">
      Preferred Name
      <input
        type="text"
        className="grow pl-4 text-emerald-700  w-full  bg-transparent"
        value={fullName}
        onChange={(e) => handleChangeFullName(e.target.value)}
        placeholder="Jon Doe"
      />
    </label>
  
    {/* Email */}
    <label className="input mt-4 mb-2 rounded-full font-bold py-8  bg-transparent border border-emerald-700  text-emerald-700  flex items-center gap-2">
      *<h6 className="font-bold mont-medium text-[0.8rem]"> Email</h6>
      <input
        type="text"
        className="grow text-emerald-700  mont-medium pl-4 w-full  bg-transparent"
        value={email}
        onChange={(e) => handleChangeEmail(e.target.value.trim())}
      />
    </label>
    {email.length > 0 && !validateEmail(email) ? (
      <h6 className="text-[0.8rem] mont-medium text-red-500">Please use a valid email</h6>
    ) : null}
  
    {/* IG Handle */}
    <label className="input mt-4 rounded-full mb-8 font-bold py-8 w-[100%]  bg-transparent text-emerald-700  border border-emerald-700  text-emerald-700  flex items-center">
      <h6 className="font-bold mont-medium text-[0.8rem]">IG Handle </h6>
      <input
        type="text"
        className="grow mont-medium text-emerald-700  mx-2"
        value={igHandle}
        onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
        placeholder="*****"
      />
    </label>
  
    {/* Rephrased “Why are you applying?” */}
    <label className="text-xl font-bold mont-medium text-emerald-700 ">Artist Statement</label>
    <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
      What would make a writing space meaningful for you?
    </label>
    <textarea
      value={whyApply}
      onChange={(e) => setWhyApply(e.target.value)}
      className="textarea  bg-transparent open-sans-medium w-full text-l h-min-24 border border-emerald-700  text-emerald-700 "
      placeholder="Tell us what you'd love to see or experience in a space for writers like you."
    />
  
    {/* Community Needs */}
    <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 font-bold mt-4">
      What do you look for in a writing community?
    </label>
    <textarea
      value={communityNeeds}
      onChange={(e) => setCommunityNeeds(e.target.value)}
      className="textarea  bg-transparent open-sans-medium w-full text-l  h-min-24 border border-emerald-700  text-emerald-700 "
    />
  
    {/* Genres */}
    <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
      What genres do you write in?
    </label>
    <div className="flex flex-wrap gap-3">
      {genres.map((genre, index) => (
        <label key={index} className="flex items-center ">
          <input
            type="checkbox"
            value={genre}
            onChange={(e) => handleGenreSelection(e.target.value)}
            className="checkbox mx-1 border-black border-1"
          />
          <span className="text-emerald-700  open-sans-medium">{genre}</span>
        </label>
      ))}
    </div>
    {selectedGenres.includes("Other") && (
      <input
        type="text"
        placeholder="Please specify"
        value={otherGenre}
        onChange={(e) => setOtherGenre(e.target.value)}
        className=" bg-transparent border border-emerald-700 open-sans-medium py-2 text-emerald-700  text-[1rem] sm:text-xl input mt-4"
      />
    )}
  
    {/* Comfort Level */}
    <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
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
        className="range bg-emeald-600 w-full"
      />
      {/* Dashes */}
      <div className="flex justify-between w-[92%] text-sm text-emerald-700 ">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      {/* Text Labels */}
      <div className="flex justify-between w-[100%] text-sm text-emerald-700  mt-2">
        <span className="w-[20%] open-sans-medium text-left">Very Uncomfortable</span>
        <span className="w-[35%] open-sans-medium text-right">Very Comfortable</span>
      </div>
    </div>
  
    {/* Feedback Frequency */}
    <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
      How often do you seek feedback on your writing?
    </label>
    <select
      value={feedbackFrequency}
      onChange={(e) => setFeedbackFrequency(e.target.value)}
      className="select  bg-transparent border rounded-full border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
    >
      {/* <option value="" className="open-sans-medium" disabled>
        Select an option
      </option> */}
      <option defaultValue={true} value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="occasionally">Occasionally</option>
      <option value="rarely">Rarely</option>
    </select>
  
    {/* Workshop Preference */}
    <label className="text-emerald-700  mont-medium text-l mb-2 pb-1 mt-4">
      Would you prefer in-person workshops, online, or both?
    </label>
    <select
  
      value={workshopPreference}
      onChange={(e) => setWorkshopPreference(e.target.value)}
      className="select rounded-full open-sans-medium  bg-transparent border border-emerald-700  text-emerald-700  w-full text-l sm:text-xl"
    >
      <option value="in-person">In-person</option>
      <option value="online">Online</option>
      <option defaultValue={true} value="both">Both</option>
    </select>
  
    {/* How did you find out? */}
    <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
      How did you find out about Plumbum?
    </label>
    <input
      value={howFindOut}
      onChange={(e) => handleChangeHowFindOut(e.target.value)}
      className=" bg-transparent border open-sans-medium border-emerald-700  py-8 text-emerald-700 text-l sm:text-xl input"
    />
  
    {/* Platform Features */}
    <label className="text-emerald-700  text-l mont-medium mb-2 pb-1 font-bold mt-4">
      What features would make a writing platform most valuable to you?
    </label>
    <textarea
      value={platformFeatures}
      onChange={(e) => setPlatformFeatures(e.target.value)}
      className="textarea  bg-transparent w-full open-sans-medium text-l sm:text-xl h-min-24 border border-emerald-700  text-emerald-700 "
    />
  
    <button
      type="submit"
      className={`mont-medium my-8 py-4 text-2xl text-white mont-medium px-20 mx-auto rounded-full ${validateEmail(email)?"bg-gradient-to-r from-emerald-400 to-emerald-500":"bg-gradient-to-r from-purple-400 to-gray-500"} hover:bg-green-400 font-bold border-none shadow-sm`}
    >
      Apply
    </button>
  </form>

              <Dialog 
              text={
        <div>
        
        {user?<div>
     
  
   

  {user?
        <ThankYou user={user}/>:<div className="min-h-40 lora-medium min-w-36 flex"><div className="mx-auto my-auto"><p className=" ">User already applied</p>
        <br/>
        <p>Message  <a href="https://www.instagram.com/plumbumapp?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@plumbumapp </a>
         or email plumbumapp@gmail.com with:</p>
         <br/>
         <p>Subject:I want to be an alpha user!</p>
         <br/>
         <p>We may add you on early.</p>
          </div></div>}
   </div>
        :<div className="flex"><p className="mx-auto my-auto">Error. Try again later</p></div>}</div>
        }/>
    </div>
    
  </>
);


}
export default ApplyContainer
