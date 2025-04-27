

import React from 'react'
import "../../Dashboard.css"
import Paths from '../../core/paths'
import PageDataElement from '../page/PageDataElement'
import { useMediaQuery } from 'react-responsive'
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
        <div className={`   carousel  mx-2 rounded-box `+(isGrid?isPhone? ` w-grid-mobile-content max-h-grid-mobile-content  `:`w-grid-content max-h-grid-content`:isHorizPhone?`w-page-content max-h-page-content`:`w-page-mobile-content max-h-page-mobile-content`)}
   
    
        >

       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
        
        <div   className={`  carousel-item  flex flex-col ${isGrid?isPhone?`w-grid-mobile-content max-h-[20rem]`:`w-grid-content h-grid-mobile`:isHorizPhone?`w-page-content h-page-content`:`w-page-mobile-content h-page-mobile-content`} rounded-lg  mx-2 h-fit
        `}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ `mx-1  min-h-6 px-2 ${isPhone?" top-0 ":" h-8 bottom-0 sm:max-h-24 "} ${isGrid?isPhone?" text-emerald-800 text-ellipsis w-grid-mobile-content  ": `text-emerald-800  w-grid-content whitespace-nowrap no-underline text-ellipsis     text-right `:isHorizPhone?" text-emerald-800 w-page-content ":"w-page-mobile-content     text-emerald-800 "} mont-medium  no-underline text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>

        {isGrid?isPhone?null:isHorizPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
       <PageDataElement isGrid={isGrid} page={stc.story} /> 
      
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