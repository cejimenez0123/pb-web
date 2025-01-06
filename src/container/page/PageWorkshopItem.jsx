import { useState,useLayoutEffect } from "react"

function PageWorkshopItem({index,page,checked,onChecked}){
    const [isChecked,setIsChecked]=useState(checked)
    useLayoutEffect(()=>{
        if(checked && page && checked.id == page.id){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }},[checked])
    return(<div  className='text-emerald-800 shadow-sm    min-h-8 border-emerald-600 border-2 my-2 px-4 rounded-full'>
    <div className=' h-fit my-auto pt-2 flex flex-row justify-between '> <h6 className='pt-1'> {page.title.length>=0?page.title:"Untitled"}</h6><div className='pb-1'><input type="radio" onChange={onChecked} name={`radio-${index}`} className="radio radio-success" checked={isChecked} /></div></div>
      </div>)
}
export default PageWorkshopItem