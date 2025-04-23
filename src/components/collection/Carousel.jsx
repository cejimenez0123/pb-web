

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
            
       
        <div className={`carousel  rounded-lg
         ${isGrid?isPhone?` w-grid-mobile-content h-grid-mobile-content mx-auto rounded-lg  p-1 bg-emerald-700`:`w-grid-content bg-emerald-700`:isHorizPhone?`w-page-cotent  px-2`:`w-page-mobile-content h-page-mobile-content rounded-box pt-2`}`}
         >

       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
        
        <div  className={`  carousel-item  flex flex-col rounded-lg  
         ${isGrid?isPhone?" mx-1 mx-2 overflow-hidden   ":
         `overflow-hidden  `:
         isHorizPhone?" mx-1  ":
         "   overflow-hidden"}`}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ `mx-1  min-h-6 ${isPhone?" top-0 ":" h-8 bottom-0 sm:max-h-24 "} ${isGrid?isPhone?" text-white text-ellipsis w-grid-mobile-content  ": `text-white   w-grid-content whitespace-nowrap no-underline text-ellipsis     text-right text-white`:isHorizPhone?" text-emerald-800 w-page-content ":"w-page-mobile-content    overflow-hidden text-emerald-800 "} mont-medium  no-underline text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>

        {isGrid?isPhone?null:isHorizPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
        {isGrid?(!isPhone?desription(stc.story):isPhone?null:null):null}
        <span
         onClick={()=>navigate(Paths.page.createRoute(stc.storyId))}
          >
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