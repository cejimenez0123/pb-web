import { useSelector } from "react-redux"
import { useState,useLayoutEffect } from "react"
import CommentInput from "./CommentInput"
import CommentThread from "./CommentThread"
export default function Comment({comment}){
    const comments = useSelector(state=>state.comments.comments)
    const [branches,setBranches]=useState([])
    const [replyInput,setReplyInput]=useState(false)
    useLayoutEffect(()=>{
       let branches = comments.filter(com=>{return com.parentId==comment.id})
     
       setBranches(branches)
    },[comments])
    return(
        <div class="bg-green-400 border-b border-white text-left" id="comment-1">
            {/* <div class="comment-heading bg-green-400  text-slate-800"> */}
           <div className="comment-body  p-4 text-lg text-slate-800">
           {comment.content}
            
                   
                </div>
                <div class="flex flex-row mx-8 pb-2 justify-between">
                    
                    <a className="text-l ml-4"> Was comment helpful?</a>
                  
                    <span><a href="#" class="comment-author mr-4">{comment.profile.username}</a>
                    <a onClick={()=>setReplyInput(!replyInput) }className="justify-self-end text-l">Reply</a>
                    </span>
                </div>
                {replyInput?<CommentInput parentComment={comment}/>:null}
                <div>
                    <CommentThread comments={branches}/>
                    </div>
            </div>         
           
)
}