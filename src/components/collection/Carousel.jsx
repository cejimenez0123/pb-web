

import  { useContext } from 'react'
import "../../Dashboard.css"
import PageDataElement from '../page/PageDataElement'
import { sendGAEvent } from '../../core/ga4'
import Context from '../../context'
export default function Carousel({book,isGrid}){
      const {isPhone,isHorizPhone}=useContext(Context)
     
    const description = (story) => {
      if (!story.description || story.description.length === 0) return null;
    
      return (
        <div className="md:pt-4 p-1">
          {story.needsFeedback? (
            <label className="text-emerald-800">Feedback Request:</label>
          ):null}
          <h6
            className={`overflow-hidden ${
              isGrid
                ? isPhone
                  ? "max-h-20 m-1 p-1 w-grid-mobile-content text-white"
                  : isHorizPhone
                  ? "w-page-mobile-content text-white"
                  : "w-page-content text-emerald-700 text-white"
                : isHorizPhone
                ? "text-emerald-800"
                : ""
            }`}
          >
            {story.description}
          </h6>
        </div>
      );}
    
    

     if(book&&book.storyIdList){
      
        return(
        <div  className={`   carousel  rounded-lg carousel-center  pb-2 `}
   
    
        >

       {book.storyIdList.map((stc,i)=>{
        if(stc && stc.story){

      
        return(
       
        <div  onTouchStartCapture={()=>{
          sendGAEvent("Opened Page from Book",`Saw  ${JSON.stringify({id:stc.story.id,title:stc.story.title})} in book ${JSON.stringify({id:book.id,title:book.title})}`,"",0,false)
        }} className={` carousel-item flex-col flex overflow-clip max-w-[100vw] max-h-[20em]
        `}
         id={stc.id} key={stc.id}

>

<h5  

className={ ` min-h-10 pt-3  max-w-[15em] px-4 text-emerald-800 top-0  no-underline  text-ellipsis  whitespace-nowrap overflow-hidden  text-left`}>
 {stc.story.title}</h5>
 
        {isGrid?isPhone?null:isHorizPhone?null:description(stc.story):isPhone?null:description(stc.story)}

       <PageDataElement isGrid={isGrid} page={stc.story} /> 
        </div>)}else{
            return <span className='skeleton'/>
        }})}

    
    
      </div>)
    }else{
        return(<div className='skeleton rounded-box'/>)
    }
}