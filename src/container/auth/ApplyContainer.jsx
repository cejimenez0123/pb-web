import { useState } from "react"
import authRepo from "../../data/authRepo"
import validateEmail from "../../core/validateEmail"


function ApplyContainer(props){
   
    const [igHandle,setIgHandle]=useState("")
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [whyApply,setWhyApply]=useState("")
    const [howFindOut,setHowFindOut]=useState("")
    const [igError,setIgError]=useState(false)
    const [nameError,setNameError]=useState(false)
    const [emailError,setEmailError]=useState(false)
    const [whyApplyError,setWhyApplyError]=useState(false)
    const [howFindError,setHowFindError]=useState(false)
    const handleChangeIgHandle = (text)=>{
     setIgHandle(text)
    }
    const handleChangeFullName = (text)=>{
      setFullName(text)
    }
    const handleChangeEmail = (text)=>{
        setEmail(text)
    }
    const handleChangeWhyApply =(text)=>{
      setWhyApply(text)
    }
    const handleChangeHowFindOut = (text)=>{
       setHowFindOut(text)
    }
    const onClickApply = (e)=>{
        e.preventDefault()
        const form = {
            igHandle,
            fullName,
            email:email.toLowerCase(),
            whyApply,
            howFindOut
        }
        authRepo.apply(form).then(data=>{
          
            alert(data.message)
        }).catch(e=>alert("error:"+e.message))
        
    }
    return(<>
        <div className="pb-8"> 
            <div>
                
                <form onSubmit={(e)=>onClickApply(e)} className="form-data shadow-sm  pb-24 bg-emerald-700 bg-opacity-60 flex mb-12  flex-col shadow-md lg:rounded-lg py-4 px-12 lg:max-w-[48rem] text-left mx-auto lg:mt-24">
                <h6 className="text-white text-sm">* Required</h6>
                <div className="w-full text-center"><h3 className="mx-auto text-2xl poppins w-fit">Interest Form</h3></div>
                <label className="input poppins mt-4 text-white py-8 font-bold mb-8 lg:py-8 bg-transparent border border-green-100  text-white flex items-center gap-2">
  Preferred Name
  <input type="text" className="grow pl-4 text-white w-full" 
         value={fullName}
         
         onChange={(e) => handleChangeFullName(e.target.value)}
        placeholder='Jon Doe' />
</label>     
<label className="input mt-4 
poppins mb-2 font-bold  py-8 bg-transparent border border-green-100  text-white flex items-center gap-2">
  * E-mail
  <input type="text" className="grow  text-white pl-4 w-full" 
         value={email}
         
         onChange={(e) => handleChangeEmail(e.target.value.trim())}
        placeholder='' />
</label>  
{validateEmail(email)?<div className="h-[0.8rem]"></div>:<h6 className="text-[0.8rem]">Please use a valid email</h6>}
<label className="input 
poppins mt-4 mb-8 
font-bold py-8 w-[100%] 
bg-transparent text-white border border-green-100 text-white flex items-center gap-2">
  IG Handle
  <input type="text" className="grow text-white pl-4 " 
         value={igHandle}
         
         onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
        placeholder='*****' />
</label>   
<label className="text-xl font-bold poppins text-white">Artist Statement</label>
<label className="text-white  poppins text-l mb-2 pb-1 font-bold mt-4">
    * Why are you applying?</label> 
<textarea value={whyApply}onChange={(e)=>handleChangeWhyApply(e.target.value)}className="textarea bg-transparent w-[100%] text-xl h-min-24 border border-green-100 text-white "/> 
<label className="text-wbjte text-l poppins mb-2 pb-1 font-bold mt-4"
>* How did you find out?</label>
<input value={howFindOut}onChange={(e)=>handleChangeHowFindOut(e.target.value)} 
className="bg-transparent border border-green-100 py-8 text-white text-xl input "></input>
<button type="submit" className=" poppins my-8 text-2xl px-12 text-white mx-auto rounded-full bg-emerald-800 hover:bg-green-400 font-bold border border-green-700 shadow-sm">
                    Apply
                </button>
                </form>
               
            </div>
        </div>
    
    </>)
}
export default ApplyContainer