import InfiniteScroll from "react-infinite-scroll-component"
import ErrorBoundary from "../../ErrorBoundary"

import Comment from "./Comment"

export default function CommentThread({comments}){
   

if(comments.length>0){
    return(
        <ErrorBoundary>
        <div className="bg-emerald-700">
               
                <div class="replies">
                  
                    <InfiniteScroll
                    
                    className="scroll"
                      dataLength={comments.length}
                      
                  
                      loader={<div>
                          Loading...
                      </div>}
                     >
                        {comments.map(com=>{
                            return<Comment comment={com}/>
                        })}
                      </InfiniteScroll>
        </div>
          
      
        </div>
        </ErrorBoundary>)

                            }
    return (<div className="h-24 bg-green-400  rounded-b-lg">
        <p className="font-bold my-8">Refer to others for review</p>
    </div>)
}
