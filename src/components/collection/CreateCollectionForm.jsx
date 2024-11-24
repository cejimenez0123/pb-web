import { useState } from "react"


export default function CreateCollectinForm(props){
    const [name,setName]=useState("")
    const [purpose,setPurpose]=useState("")
    const [isPrivate,setIsPrivate]=useState(true)
    const [writingIsOpen,setWritingIsOpen]=useState(false)

    return(<form class="border-white bg-transparent border rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
        <label className="text-white">
            Name of Collection
        </label>
        <input 
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        
        <label>
            Purpose
        </label>
        <textarea value={purpose} onChange={(e)=>setPurpose(e.target.value)}/>
        <label>
            Collection is Public <input type="checkbox"
            checked={isPrivate} onChange={(e)=>setIsPrivate(!isPrivate)}/>
        </label>
        
        <label>
            Anyone can add to collection
            <input  checked={writingIsOpen} onChange={(e)=>setWritingIsOpen(!writingIsOpen)}type="checkbox"/>
        </label>
<button className="bg-emerald-800">
    Submit
</button>
    </div>
  </form>)
}