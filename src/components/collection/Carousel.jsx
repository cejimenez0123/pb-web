

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
            {/* ${isHorizPhone?`w-grid-mobile-content `:`w-grid-mobile-content `} */}
        </h6>
    </div>:null }   
    if(book){
      
        return(
            
          
        <div className={`carousel  ${isGrid?isPhone?"h-fit w-grid-mobile-content":`h-[32em] ${isHorizPhone?"w-grid-content px-2":"w-grid-mobile"} `:isPhone?" w-page-mobile h-[24rem] ":" w-page "} rounded-box pt-2 

         ${isPhone?"":""} ${isGrid?isPhone?` w-grid-mobile p-1 bg-emerald-700  `:`w-grid  bg-emerald-700 `:isPhone?"":  ` max-w-[94.5vw]   md:w-page`}`}>
     
       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
       
        <div  className={`  carousel-item  flex flex-col rounded-lg   ${isGrid?isPhone?"w-grid-mobile-content mx-1 h-grid-mobile-content mx-2 overflow-hidden   ":`overflow-hidden ${isHorizPhone?"w-grid":"w-grid-mobile"} `:isHorizPhone?" w-page h-page mx-1  ":" w-page-mobile h-page-mobile "}`}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ `mx-1  min-h-6 ${isPhone?" top-0 ":" h-8 bottom-0 sm:max-h-24 "} ${isGrid?isPhone?" text-white text-ellipsis w-grid-mobile-content ": `text-white   w-grid-content h-18 whitespace-nowrap no-underline text-ellipsis     text-right text-white`:isHorizPhone?" text-emerald-800 w-page ":"w-page-mobile text-emerald-800 "} mont-medium  no-underline text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>

        {isGrid?isPhone?null:isHorizPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
        {isGrid?(!isPhone?desription(stc.story):isPhone?null:null):null}
        <span onClick={()=>navigate(Paths.page.createRoute(stc.storyId))}className={`${isGrid?isPhone?'w-grid-mobile-content  overflow-hidden':`${isHorizPhone?"w-grid-content":""} `:isPhone?"overflow-hidden":""}`}>
       <PageDataElement isGrid={isGrid} page={stc.story} /> 
       </span>
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