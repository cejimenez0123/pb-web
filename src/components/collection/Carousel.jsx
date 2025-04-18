
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
        
    if(book){
      
        return(
            
          
        <div className={`carousel  ${isGrid?"h-[18em] w-grid-mobile ":"w-[98%] h-[29rem]"} rounded-box pt-2 

         ${isPhone?"":""} ${isGrid?isPhone?` w-grid-mobile p-1 bg-emerald-700  `:`w-grid  bg-emerald-700 `:isPhone?"":  ` max-w-[94.5vw]   md:w-page`}`}>
     
       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
            // carousel-item
        <div  className={`  carousel-item  flex flex-col ${isPhone?"rounded-lg overflow-hidden":""}  ${isGrid?isPhone?"w-grid-mobile-content max-h-[17em] px-2    ":"max-h-full max-w-grid":" max-w-[95vw]   md:w-[49.5em] "}`}
         id={stc.id} key={stc.id}

>
<h5  id="desc"className={ `${isPhone?"top-0 max-h-20  ":" h-8 bottom-0 "} ${isGrid?isPhone?" text-white h-12 overflow-hidden text-ellipsis    ": "text-white  w-grid h-18 whitespace-nowrap overflow-hidden no-underline text-ellipsis   pr-4 pl-2 text-right text-white":"text-emerald-800"} mont-medium  no-underline text-ellipsis  whitespace-nowrap overflow-hidde  text-left`}><span className='px-2'>{stc.story.title}</span></h5>
    {stc.story.description && stc.story.description.length>0?<div className=' md:pt-4 p-1'>
            {stc.story.needsFeedback?<label className='text-emerald-800'>Feedback Request:</label>:null}
            <h6 className={`${isGrid?isPhone?"max-h-16 m-1 p-1 w-grid-mobile-content text-white":"text-white w-grid-content px-2":"  text-emerald-800"} p-2 open-sans-medium text-left `}>
                {stc.story.description}
            </h6>
        </div>:null}
        <span onClick={()=>navigate(Paths.page.createRoute(stc.storyId))}className={`${isGrid?isPhone?'w-grid-mobile-content  overflow-hidden':" h-[28em] w-[36em]":""}`}>
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