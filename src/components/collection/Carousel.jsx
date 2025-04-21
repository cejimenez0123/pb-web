

import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import "../../Dashboard.css"
import { deletePageApproval } from '../../actions/PageActions'
import { createPageApproval } from '../../actions/PageActions'
import {useDispatch, useSelector} from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import addCircle from "../../images/icons/add_circle.svg"
import bookmarkFillGreen from "../../images/bookmark_fill_green.svg"
import bookmarkfill from "../../images/bookmarkfill.svg"
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import loadingGif from "../../images/loading.gif"
import bookmarkoutline from "../../images/bookmarkadd.svg"
import bookmarkadd from "../../images/bookmark_add.svg"
import PageDataElement from '../page/PageDataElement'
import ProfileCircle from '../profile/ProfileCircle'
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import Context from '../../context'
import { debounce } from 'lodash'
import { useMediaQuery } from 'react-responsive'
export default function Carousel({book,isGrid}){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const desription=(story)=>{
        return story.description && story.description.length>0?<div className=' md:pt-4 p-1'>
        {story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
        <h6 className={`${isGrid?isPhone?"max-h-20 m-1 p-1 w-grid-mobile-content text-white":"text-white w-grid-content px-2":isPhone?"  text-emerald-800":" w-page-content text-emerald-700 "} p-2 open-sans-medium text-left `}>
            {story.description}
        </h6>
    </div>:null }   
    if(book){
      
        return(
            
          
        <div className={`carousel  ${isGrid?isPhone?"h-fit w-grid-mobile":"h-[32em] w-grid ":isPhone?" w-[98%] h-[24rem] ":" w-page "} rounded-box pt-2 

         ${isPhone?"":""} ${isGrid?isPhone?` w-grid-mobile p-1 bg-emerald-700  `:`w-grid  bg-emerald-700 `:isPhone?"":  ` max-w-[94.5vw]   md:w-page`}`}>
     
       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
       
        <div  className={`  carousel-item  flex flex-col ${isPhone?"rounded-lg ":""}  ${isGrid?isPhone?"w-grid-mobile-content mx-1 max-h-[18rem] px-2 overflow-hidden   ":"max-h-full overflow-hidden max-w-grid":isPhone?" w-[99%] mx-1  ":"  "}`}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ ` px-2 min-h-8' ${isPhone?" top-0 ":" h-8 bottom-0 "} ${isGrid?isPhone?" text-white text-ellipsis   ": "text-white  w-grid h-18 whitespace-nowrap no-underline text-ellipsis   pr-4 pl-2 text-right text-white":isPhone?" text-emerald-800 max-w-[98vw] ":"text-emerald-800 sm:w-page "} mont-medium  no-underline text-ellipsis  whitespace-nowrap overflow-hidde  text-left`}>
 {stc.story.title}</h5>

        {isGrid?isPhone?null:desription(stc.story):isPhone?null:desription(stc.story)}
        {isGrid?(!isPhone?desription(stc.story):isPhone?null:null):null}
        <span onClick={()=>navigate(Paths.page.createRoute(stc.storyId))}className={`${isGrid?isPhone?'w-grid-mobile-content  overflow-hidden':"  h-[28em] w-[36em]":isPhone?"overflow-hidden":""}`}>
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