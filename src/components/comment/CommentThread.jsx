import ErrorBoundary from "../../ErrorBoundary.jsx"
import Comment from "./Comment"
import { IonList } from "@ionic/react"

export default function CommentThread({page,comments,level=0}){
   

    return(
        <div className="">
    
                     <IonList >
                        {comments.map(com=>{
                            return(<div 
                                key={com.id}
                                className={`pl-1 sm:rounded-[15%]  bg-cream `}>
                                    <Comment page={page} comment={com} level={level+1}/></div>)
                        })}
             </IonList>
      
                    </div>)
                            
                        }