import ErrorBoundary from "../../ErrorBoundary.jsx"
import Comment from "./Comment"
import { IonList } from "@ionic/react"

export default function CommentThread({page,comments,level=0}){
   

    return(
        <div className="bg-emerald-100 h-[100vh]">
    
                     <IonList>
                        {comments.map(com=>{
                            return(<div 
                                key={com.id}
                                className={`ml-1 sm:rounded-[15%]   `}>
                                    <Comment page={page} comment={com} level={level+1}/></div>)
                        })}
             </IonList>
      
                    </div>)
                            
                        }