import { useState } from "react"
import authRepo from "../../data/authRepo"





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
            email,
            whyApply,
            howFindOut
        }
        authRepo.apply(form).then(data=>{
            console.log(data)
            alert(data.message)
        })
        
    }
    return(<>
        <div className=""> 
            <div>
                
                <form onSubmit={(e)=>onClickApply(e)} className="form-data shadow-sm flex mb-12 pb-8 flex-col lg:rounded bg-transparent py-4 px-12 lg:max-w-[48rem] text-left mx-auto lg:mt-24">
                <p className="text-green-100">* Required</p>
                <div className="w-full text-center"><h1 className="mx-auto  poppins w-fit">Interest Form</h1></div>
                <label className="input poppins mt-4 py-8 font-bold mb-8 lg:py-8 bg-transparent border border-green-100  text-slate-800 flex items-center gap-2">
  Preferred Name
  <input type="text" className="grow pl-4  text-slate-800 w-full" 
         value={fullName}
         
         onChange={(e) => handleChangeFullName(e.target.value)}
        placeholder='Jon Doe' />
</label>     
<label className="input mt-4 poppins mb-8 font-bold  py-8 bg-transparent border border-green-100  text-slate-800  flex items-center gap-2">
  * E-mail
  <input type="text" className="grow text-slate-800 pl-4 w-full" 
         value={email}
         
         onChange={(e) => handleChangeEmail(e.target.value.trim())}
        placeholder='' />
</label>  
                <label className="input poppins mt-4 mb-8 font-bold py-8 w-[100%] bg-transparent text-slate-800 border border-green-100 text-slate-800 flex items-center gap-2">
  IG Handle
  <input type="text" className="grow text-slate-800 pl-4 " 
         value={igHandle}
         
         onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
        placeholder='*****' />
</label>   
<label className="text-xl font-bold poppins text-green-100">Artist Statement</label>
<label className="text-green-100  poppins text-l mb-2 pb-1 font-bold mt-4">
    * Why are you applying?</label> 
<textarea value={whyApply}onChange={(e)=>handleChangeWhyApply(e.target.value)}className="textarea bg-transparent w-[100%] text-xl h-min-24 border border-green-100 text-slate-800 "/> 
<label className="text-green-100 text-l poppins mb-2 pb-1 font-bold mt-4"
>* How did you find out?</label>
<input value={howFindOut}onChange={(e)=>handleChangeHowFindOut(e.target.value)} 
className="bg-transparent border border-green-100 py-8 text-slate-800 text-xl input text-slate-800"></input>
<button type="submit" className=" poppins hover:bg-green-400 font-bold border border-green-700 shadow-sm mt-4 mb-8 bg-green-700  btn-lg ">
                    Apply
                </button>
                </form>
               
            </div>
        </div>
    
    </>)
}
export default ApplyContainer