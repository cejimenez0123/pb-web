import { useSelector } from "react-redux"
import { useState,useLayoutEffect } from "react"
import CommentInput from "./CommentInput"
import CommentThread from "./CommentThread"
import moreHoriz from "../../images/icons/more_horiz.svg"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
export default function Comment({comment}){
    const comments = useSelector(state=>state.comments.comments)
    const [branches,setBranches]=useState([])
    const [replyInput,setReplyInput]=useState(false)
    const navigate = useNavigate()
    useLayoutEffect(()=>{
       let branches = comments.filter(com=>{return com.parentId==comment.id})
     
       setBranches(branches)
    },[comments])
    return(
        <div class="bg-green-400 border-b border-white text-left" id="comment-1">
            {/* <div class="comment-heading bg-green-400  text-slate-800"> */}
           <div className="comment-body  p-4  text-slate-800">
           <a onClick={()=>navigate(Paths.profile.createRoute(comment.profile.id))} class="comment-author text-sm mr-4">{comment.profile.username}</a>
           <h6 className="text-sm md:text-lg">{comment.content}</h6>
            
                   
                </div>
                <div class=" flex flex-row pb-2 justify-between">
                    
                    <a className="text-sm mt-4 ml-4"> Was comment helpful?</a>
                  
                   
                    <a onClick={()=>setReplyInput(!replyInput) }
                    className="justify-self-end btn rounded-full p-2 btn-info text-white mx-2 text-center">Reply</a>
                  
                </div>
                {replyInput?<CommentInput parentComment={comment}/>:null}
                <div>
                    <CommentThread comments={branches}/>
                    </div>
            </div>         
           
)
}