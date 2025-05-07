

import React, { useContext } from 'react'
import "../../Dashboard.css"
import PageDataElement from '../page/PageDataElement'

import { sendGAEvent } from '../../core/ga4'
import adjustScreenSize from '../../core/adjustScreenSize'
import Context from '../../context'
import ProfileCircle from '../profile/ProfileCircle'
import { useNavigate } from 'react-router-dom'
import Paths from '../../core/paths'
export default function Carousel({book,isGrid}){
      const {isPhone,isHorizPhone}=useContext(Context)
      const navigate = useNavigate()
      const desription=(story)=>{
        return story.description && story.description.length>0?<div className='  md:pt-4 p-1'>
        {story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
        <h6 className={`overflow-hidden ${isGrid?isPhone?`max-h-20 m-1 p-1 w-grid-mobile-content text-white  `:`${isHorizPhone?`w-page-mobile-content`:`w-page-content text-emerald-700`} text-white `:isHorizPhone?"  text-emerald-800 ": ``}`}>
            {story.description}
              </h6>
    </div>:null }  
    let descSize = adjustScreenSize(isGrid,false," max-h-[4em] "," max-h-[4em] ","","","","  ")
  let size = adjustScreenSize(isGrid,true," h-[100%] ","   "," "," py-2  overflow-hidden rounded-lg ","")
    
     if(book){
      
        return(
        <div id="Carousel" className={`   carousel px-1 mx-auto    ${size} rounded-lg carousel-start overflow-y-hidden pb-2 `}
   
    
        >

       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
       
        <div  onTouchStartCapture={()=>{
          sendGAEvent("Opened Page from Book",`Saw  ${JSON.stringify({id:stc.story.id,title:stc.story.title})} in book ${JSON.stringify({id:book.id,title:book.title})}`,"",0,false)
        }} className={` carousel-item flex-col flex
           rounded-lg overflow-hidden 
           ${size}
           ${book?" ":""}
        `}
         id={stc.id} key={stc.id}

>

<h5  id="desc"
onClick={()=>{
  navigate(Paths.page.createRoute(stc.story.id))
  sendGAEvent("Opened Page from Book",`Navigated to ${JSON.stringify({id:stc.story.id,title:stc.story.title})} from book ${JSON.stringify({id:book.id,title:book.title})}`,"",0,false)
       
}}
className={ ` min-h-10  ${descSize} pt-3 px-2   text-emerald-700 top-0 mont-medium  no-underline  text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>
 
        {isGrid?isPhone?null:isHorizPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
  
       <PageDataElement isGrid={isGrid} page={stc.story} /> 
  
        </div>)}else{
            return <span className='skeleton'/>
        }})}

    
    
      </div>)
    }else{
        return(<div className='skeleton rounded-box'/>)
    }
}