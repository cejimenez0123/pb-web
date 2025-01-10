import { useState,useLayoutEffect } from "react"

function PageWorkshopItem({index,page}){

    if(page){
    return(<div  className='text-emerald-800 shadow-sm  p-2  flex min-h-12 border-emerald-600 border-2 my-2 px-4 rounded-full'>
<h6 className='mx-auto my-auto '> {page.title==""?"Untitled":page.title}</h6>
      </div>)
    }else{
        return <div className="skeleton py-2 px-4 "/>
    }
}
export default PageWorkshopItem