
import { TextareaAutosize } from "@mui/material"
import { useSelector,useDispatch} from "react-redux"
import { createComment,fetchCommentsOfPage } from "../actions/PageActions"
import { useState } from "react"
import {Button} from "@mui/material"

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
            if(result.error==null){
                const {payload} = result
                if(payload != null && payload.error==null){
                    const params = {page}
                    setComment("")
                    setShow(false)
                    dispatch(fetchCommentsOfPage(params))

                }
            }
        })
    }}
    let commentAuthorDiv =(<div></div>)
    if(parentProfile){
        commentAuthorDiv=(<h6>{parentProfile.usernmae}</h6>)
    }
    return(<div style={{display: show?"":"none"}} onBlur={()=>setShow(false)}className="comment-input">
    <div className="comment-input-header">
        {commentAuthorDiv}
    </div>
    <TextareaAutosize

    value={commentInput}
    minRows={3} 
    cols={85}
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