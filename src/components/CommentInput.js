
import { TextareaAutosize } from "@mui/material"
import { useSelector,useDispatch} from "react-redux"
import { appendComment, createComment,fetchCommentsOfPage, updateComment } from "../actions/PageActions"
import { useEffect, useState } from "react"
import {Button} from "@mui/material"
import checkResult from "../core/checkResult"

export default function CommentInput({editing,page,parentComment,parentProfile}){
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
       {editing? <Button onClick={clickUpdateComment}>Update</Button>:<Button disabled={!currentProfile} onClick={saveComment}>
            Reply
        </Button>}
    </div>
</div>)}
    return input()
}