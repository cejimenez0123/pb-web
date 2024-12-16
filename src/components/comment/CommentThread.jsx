import InfiniteScroll from "react-infinite-scroll-component"
import ErrorBoundary from "../../ErrorBoundary"

import Comment from "./Comment"

export default function CommentThread({comments}){
   

if(comments){
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
    return (<div>
        Loading...
    </div>)
}
