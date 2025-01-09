import { useState,useLayoutEffect } from "react"

function PageWorkshopItem({index,page,checked,onChecked}){
    const [isChecked,setIsChecked]=useState(checked)
    useLayoutEffect(()=>{
        if(checked && page && checked.id == page.id){
        setIsChecked(true)
    }else{
        setIsChecked(false)
    }},[checked])
    if(page){
    return(<div  className='text-emerald-800 shadow-sm   flex min-h-8 border-emerald-600 border-2 my-2 py-2 px-4 rounded-full'>
<h6 className='mx-auto my-auto'> {page.title.length>=0?page.title:"Untitled"}</h6>
      </div>)
    }else{
        return <div className="skeleton py-2 px-4 "/>
    }
}
export default PageWorkshopItem