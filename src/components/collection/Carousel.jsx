

import React from 'react'
import "../../Dashboard.css"
import PageDataElement from '../page/PageDataElement'
import { useMediaQuery } from 'react-responsive'
import adjustScreenSize from '../../core/adjustScreenSize'
import { sendGAEvent } from '../../core/ga4'
export default function Carousel({book,isGrid}){
      const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
      const desription=(story)=>{
        return story.description && story.description.length>0?<div className='  md:pt-4 p-1'>
        {story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
        <h6 className={`overflow-hidden ${isGrid?isPhone?`max-h-20 m-1 p-1 w-grid-mobile-content text-white  `:`${isHorizPhone?`w-grid-mobile-content`:`w-grid-content text-emerald-700`} text-white `:isHorizPhone?"  text-emerald-800 ": ``}`}>
            {story.description}
              </h6>
    </div>:null }  
  
    
     if(book){
      
        return(
        <div className={`   carousel px-1 mx-auto rounded-box  `+adjustScreenSize(isGrid,true,""," ","",""," h-[100%] md:h-fit ")}
   
    
        >

       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
       
        <div  onTouchStartCapture={()=>{
          sendGAEvent("Opened Page from Book",`Saw ${JSON.stringify({id:stc.story.id,title:stc.story.title})}`,"",0,false)
        }} className={` carousel-item flex-col flex

        ${adjustScreenSize(isGrid,true," px-2 "," ","","","")} 
         overflow-hidden
              mx-2 
        `}
         id={stc.id} key={stc.id}

>

<h5  id="desc"className={ ` min-h-8  pt-2 px-2 bg-emerald-700 top-0 mont-medium  no-underline text-slate-100 text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>
 
        {isGrid?isPhone?null:isHorizPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
        
       <div className={`rounded-lg overflow-hidden `}>
       <PageDataElement isGrid={isGrid} page={stc.story} /> 
      </div>
  
        </div>)}else{
            return null
        }})}

    
       <span className='flex flex-row justify-center'>


      </span>
      </div>)
    }else{
        return(<div className='skeleton rounded-box'/>)
    }
}