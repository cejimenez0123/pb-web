import { useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { Button } from "@mui/material"

export default function CommentItem({comment}){
    let profile = (<div></div>)
    const profilesInView = useSelector(state => state.users.profilesInView)
    const commentsInView = useSelector(state => state.pages.commentsInView)
    let p = profilesInView.find(profile=>profile.id == comment.profileId)
    let [comments,setComments]=useState([])
    useEffect(()=>{
        let list = commentsInView.filter(com=>com.parentCommentId == comment.id)
        setComments(list)
    },[comment])
    
    if(p){
        profile=(<div className="comment-author">
            {p.username}
        </div>)
    }
    return (<div className="comment-thread">
                <div className="comment">
                    <div className="text">
                        {comment.text}
                    </div>
        <div className="btn-row">
        {profile}
        <Button>Reply</Button>
        </div>
        </div>
        <div className="replies">
            {comments.map(com=>{
                return(<CommentItem comment={com} />)
            })}
        </div>
    </div>)
}