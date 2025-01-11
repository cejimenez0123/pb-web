import { useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"


function ApplyContainer(props){
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
            // ... other form data
          };
        authRepo.apply(form).then(data=>{
          
            alert(data.message)
        }).catch(e=>alert("error:"+e.message))
    }else{
        window.alert("Please use valid email")
    }

    }


return (
  <>
    <div className="sm:pb-8">
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
              className="grow pl-4 text-white open-sans-medium w-full"
              value={fullName}
              onChange={(e) => handleChangeFullName(e.target.value)}
              placeholder="Jon Doe"
            />
          </label>

          {/* Email */}
          <label className="input mt-4 poppins mb-2 font-bold py-8 bg-transparent border border-green-100 text-white flex items-center gap-2">
            <h6 className="font-bold lora-bold text-[0.8rem]">* E-mail</h6>
            <input
              type="text"
              className="grow text-white pl-4 w-[100%]"
              value={email}
              onChange={(e) => handleChangeEmail(e.target.value.trim())}
              placeholder=""
            />
          </label>
          {email.length>0 && !validateEmail(email) ?
            (<h6 className="text-[0.8rem] text-red-500">Please use a valid email</h6>
          ):null}

          {/* IG Handle */}
          <label className="input poppins mt-4 mb-8 font-bold py-8 w-[100%] bg-transparent text-white border border-green-100 text-white flex items-center gap-2">
            <h6 className="font-bold  lora-bold text-[0.8rem]">IG Handle</h6>
            <input
              type="text"
              className="grow open-sans-medium text-white pl-4"
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
            className="mont-medium my-8 text-2xl mont-medium px-16 text-white mx-auto rounded-full bg-cyan-800 hover:bg-green-400 font-bold border-none shadow-sm"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  </>
);


}
export default ApplyContainer