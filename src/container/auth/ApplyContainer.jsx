import { useState } from "react"





function ApplyContainer(props){
    const [igHandle,setIgHandle]=useState("")
    const [fullName,setFullName]=useState("")
    const handleChangeIgHandle = (text)=>{
        setIgHandle(text)
    }
    const handleChangeFullName = (text)=>{
        setFullName(text)
    }
    return(<>
        <div className="bg-red"> 
            <div>
                <form className="form-data flex flex-col lg:rounded bg-green-100 py-4 px-12 lg:max-w-[28rem] text-left mx-auto lg:mt-24">
                <label className="input mt-4 mb-8 lg:py-8 bg-dark border border-green-100  flex items-center gap-2">
  Full Name
  <input type="text" className="grow pl-4 w-full" 
         value={props.fullName}
         
         onChange={(e) => props.handleChangeFullName(e.target.value)}
        placeholder='*****' />
</label>     
                <label className="input mt-4 mb-8 lg:py-8 w-[100%] bg-dark border border-slate-100 flex items-center gap-2">
  IG Handle
  <input type="text" className="grow pl-4 " 
         value={props.igHandle}
         
         onChange={(e) => props.handleChangeIgHandle(e.target.value.trim())}
        placeholder='*****' />
</label>   
<label className="text-xl font-bold text-green-600">Artist Statement</label>
<label className="text-green-600 text-l font-bold mt-4">Why are you applying?</label> 
<textarea className="textarea bg-dark w-[100%] h-min-24 text-green-100 "/> 
<label className="text-l font-bold text-green-600


">How did you find out?</label>
<input className="bg-dark text-green-100 input"></input>
<button className="btn btn-active btn-lg ">
                    Apply
                </button>
                </form>
               
            </div>
        </div>
    
    </>)
}
export default ApplyContainer