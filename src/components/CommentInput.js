
import { TextareaAutosize } from "@mui/material"
import { useSelector,useDispatch} from "react-redux"
import { appendComment, createComment,fetchCommentsOfPage } from "../actions/PageActions"
import { useState } from "react"
import {Button} from "@mui/material"
import checkResult from "../core/checkResult"

export default function CommentInput({page,parentComment,parentProfile}){
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [commentInput,setComment] = useState("")
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
    let commentAuthorDiv =(<div></div>)
    if(parentProfile){
        commentAuthorDiv=(<h6>{parentProfile.usernmae}</h6>)
    }
    return(<div style={{display: show?"":"none"}}className="comment-input">
    <div className="comment-input-header">
        {commentAuthorDiv}
    </div>
    <TextareaAutosize
    style={{width: "100%",padding:"1em"}}
    value={commentInput}
    minRows={2} 
    
    onChange={(e)=>{
       setComment(e.target.value)
}} />
    <div className="button-row">
        <Button disabled={!currentProfile} onClick={saveComment}>
            Reply
        </Button>
    </div>
</div>)
}