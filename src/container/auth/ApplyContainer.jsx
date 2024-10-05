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
                
                <form onSubmit={(e)=>onClickApply(e)} className="form-data shadow-sm flex mb-12 pb-8 flex-col lg:rounded bg-dark py-4 px-12 lg:max-w-[48rem] text-left mx-auto lg:mt-24">
                <p className="text-green-100">* Required</p>
                <div className="w-full text-center"><h1 className="mx-auto text-green-100 w-fit">Interest Form</h1></div>
                <label className="input mt-4 mb-8 lg:py-8 bg-dark border border-green-100  text-green-100 flex items-center gap-2">
  Full Name
  <input type="text" className="grow pl-4 text-green-100 w-full" 
         value={fullName}
         
         onChange={(e) => handleChangeFullName(e.target.value)}
        placeholder='Jon Doe' />
</label>     
<label className="input mt-4 mb-8 lg:py-8 bg-dark border border-green-100 text-green-100  flex items-center gap-2">
  * E-mail
  <input type="text" className="grow text-green-100 pl-4 w-full" 
         value={email}
         
         onChange={(e) => handleChangeEmail(e.target.value.trim())}
        placeholder='' />
</label>  
                <label className="input mt-4 mb-8 lg:py-8 w-[100%] bg-dark border border-green-100 text-green-100 flex items-center gap-2">
  IG Handle
  <input type="text" className="grow text-green-100 pl-4 " 
         value={igHandle}
         
         onChange={(e) => handleChangeIgHandle(e.target.value.trim())}
        placeholder='*****' />
</label>   
<label className="text-xl font-bold text-green-100">Artist Statement</label>
<label className="text-green-100 text-l mb-2 pb-1 font-bold mt-4">
    * Why are you applying?</label> 
<textarea value={whyApply}onChange={(e)=>handleChangeWhyApply(e.target.value)}className="textarea bg-dark w-[100%] text-xl h-min-24 border border-green-100 text-green-100 "/> 
<label className="text-green-100 text-l mb-2 pb-1 font-bold mt-4"
>* How did you find out?</label>
<input value={howFindOut} onChange={(e)=>handleChangeHowFindOut(e.target.value)} 
className="bg-dark border border-green-100 lg:py-8 text-green-100 text-xl input"></input>
<button type="submit" className=" hover:bg-green-400 font-bold border border-green-700 shadow-sm mt-4 mb-8 bg-green-700  btn-lg ">
                    Apply
                </button>
                </form>
               
            </div>
        </div>
    
    </>)
}
export default ApplyContainer