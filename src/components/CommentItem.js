import { useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { Button } from "@mui/material"
import CommentInput from "../components/CommentInput"
export default function CommentItem({page,comment}){
    let profileDiv = (<div></div>)
  
    const profilesInView = useSelector(state => state.users.profilesInView)
    const commentsInView = useSelector(state => state.pages.commentsInView)
    let p = profilesInView.find(profile=>profile.id == comment.profileId)
    const [profile,setProfile]= useState(p)
    let [comments,setComments]=useState([])
    const [showCommentInput,setShowCommentInput]=useState(false)
    useEffect(()=>{
        let list = commentsInView.filter(com=>com.parentCommentId == comment.id)
        setComments(list)
    },[comment])
    
    if(profile){
        profileDiv=(<div className="comment-author">
            {profile.username}
        </div>)
    }
    function onClickReply(){
        setShowCommentInput(!showCommentInput)
    }
    let commentInputDiv = (<div></div>)
    if(showCommentInput){
        commentInputDiv=(<CommentInput page={page} parentComment={comment} parentProfile={profile}/>)
    }
    return (<div className="comment-thread">
                <div className="comment">
                    <div className="text">
                        {comment.text}
                    </div>
        <div className="btn-row">
        {profileDiv}
        <Button onClick={onClickReply
        }>Reply</Button>
        </div>
        {commentInputDiv}
        </div>
        <div className="replies">
            {comments.map(com=>{
                return(<CommentItem page={page} comment={com} />)
            })}
        </div>
    </div>)
}