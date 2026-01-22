import ErrorBoundary from "../../ErrorBoundary.jsx"
import Comment from "./Comment"
import { IonList } from "@ionic/react"

export default function CommentThread({page,comments,level=0}){
   

    return(
        <div className="bg-cream">
    
                     <div className="pl-1  "style={{"--backgorund":"#f4f4e0"}} >
                        {comments.map(com=>{
                            return(<div 
                                key={com.id}
                                className={`  `}>
                                    <Comment page={page} comment={com} level={level+1}/>
                                    </div>
                                    )
                        })}
             </div>
      
                    </div>)
                            
                        }