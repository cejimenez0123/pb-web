
import { TextareaAutosize } from "@mui/material"
import { useSelector,useDispatch} from "react-redux"
import { appendComment, createComment,fetchCommentsOfPage, updateComment } from "../actions/PageActions"
import { useEffect, useState } from "react"
import {Button} from "@mui/material"
import checkResult from "../core/checkResult"

export default function CommentInput({editing,page,parentComment,parentProfile}){
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [commentInput,setComment] = useState("Remember the sandwich method.\n Compliment.Critique.Compliment")
    const [show,setShow]=useState(true)
    const saveComment=()=>{
        if(currentProfile && page && commentInput.length >0){
            let id = ""
            if(parentComment){
                id = parentComment.id
            }
        const params =  {profileId: currentProfile.id,
              text:commentInput,
              pageId:page.id,
              parentCommentId:id,
        }
        dispatch(createComment(params)).then(result=>{
            checkResult(result,payload=>{
                setComment("")
                setShow(false)
                const comment = payload
                const params = {comment}
                dispatch(appendComment(params))
            },(err)=>{
                window.alert(err)
            })
    
        })
    }}
    useEffect(()=>{
        if(editing){
            setComment(parentComment.text)
        }
    },[editing])
    let commentAuthorDiv =(<div></div>)
    if(parentProfile){
        commentAuthorDiv=(<h6>{parentProfile.usernmae}</h6>)
    }
    const clickUpdateComment = ()=>{
        const params = {
            comment: parentComment,
            newText: commentInput
        }
        dispatch(updateComment(params))
    }
    const input = ()=>{
        
    return(<div style={{display: show?"":"none"}}className="p-2 bg-green-600">
    <div className="text-slate-800">
        {commentAuthorDiv}
    </div>
<textarea
  
  className="textarea w-[96svw] bg-green-400 text-slate-800 sm:w-96 mx-auto textarea-bordered "
  
  value={commentInput}

  
  onChange={(e)=>{
     setComment(e.target.value)
}}></textarea>
    <div className="button-row">
       {editing? <button className="bg-green-400 text-slate-800"onClick={clickUpdateComment}>Update</button>:<button className="bg-green-200 text-slate-800" disabled={!currentProfile} onClick={saveComment}>
            Disabled
        </button>}
    </div>
</div>)}
    return input()
}