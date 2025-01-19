import InfiniteScroll from "react-infinite-scroll-component"
import ErrorBoundary from "../../ErrorBoundary"

import Comment from "./Comment"
import { useMediaQuery } from "react-responsive"

export default function CommentThread({page,comments,level=0}){
   
let sm =useMediaQuery({
    query: '(max-width: 900px)'
  })
if(comments.length>0){
    return(
        <ErrorBoundary>
            {/*  */}
        <div className=" ">
               
                <div class="">
                  
                    <InfiniteScroll
                    
                    className="scroll  "
                      dataLength={comments.length}
                      
                  
                      loader={<div>
                          Loading...
                      </div>}
                     >
                        {comments.map(com=>{
                            return(<div 
                                key={com.id}
                                className={`ml-1 sm:rounded-full  `}>
                                    <Comment page={page} comment={com} level={level+1}/></div>)
                        })}
                      </InfiniteScroll>
        </div>
          
      
        </div>
        </ErrorBoundary>)

                            }else{
                                return null
                            }
                        }