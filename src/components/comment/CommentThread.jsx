import InfiniteScroll from "react-infinite-scroll-component"
import ErrorBoundary from "../../ErrorBoundary.jsx"

import Comment from "./Comment"
import { useMediaQuery } from "react-responsive"
import { IonList } from "@ionic/react"

export default function CommentThread({page,comments,level=0}){
   
if(comments.length>0){
    return(
        <ErrorBoundary>
                     <IonList>
                        {comments.map(com=>{
                            return(<div 
                                key={com.id}
                                className={`ml-1 sm:rounded-[15%]   `}>
                                    <Comment page={page} comment={com} level={level+1}/></div>)
                        })}
             </IonList>
        </ErrorBoundary>)

                            }else{
                                return null
                            }
                        }