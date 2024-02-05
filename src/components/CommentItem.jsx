import { useDispatch, useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { Button, IconButton, MenuItem } from "@mui/material"
import CommentInput from "./CommentInput"
import { MoreHoriz} from "@mui/icons-material"
import { Dropdown, Menu } from "@mui/joy"
import { deleteComment } from "../actions/PageActions"
export default function CommentItem({page,comment}){
    let profileDiv = (<div></div>)
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const profilesInView = useSelector(state => state.users.profilesInView)
    const commentsInView = useSelector(state => state.pages.commentsInView)
    let p = profilesInView.find(profile=>profile.id == comment.profileId)
    const [profile,setProfile]= useState(p)
    let [comments,setComments]=useState([])
    const [editingComment,setEditingComment]=useState(false)
    const [showCommentInput,setShowCommentInput]=useState(false)
    useEffect(()=>{
        let list = commentsInView.filter(com=>com.parentCommentId == comment.id)
        setComments(list)
    },[])
    const clickDeleteComment = ()=>{
        if(comment){
            const params = {
                comment: comment
            }
            dispatch(deleteComment(params))
        }
      
    }
    if(profile){
        profileDiv=(<div className="comment-author">
            {profile.username}
        </div>)
    }
    function onClickReply(){
        setShowCommentInput(!showCommentInput)
    }
  
  
    const [openHoriz,setOpenHoriz]=useState(null)
    const hashtagHorizButton =()=>{
        if(currentProfile){
          
          return(<div><IconButton>
                <MoreHoriz/>
            </IconButton>
            <Menu>
                <MenuItem></MenuItem>
            </Menu></div>)
        }
    }
    const editHorizButton =()=>{
        if(comment && currentProfile && comment.profileId == currentProfile.id){
            return (<Dropdown>
                <IconButton onClick={(e)=>{
                if(Boolean(openHoriz)){
                    setOpenHoriz(null)
                }else{
                setOpenHoriz(e.currentTarget)}}}style={{border:""}}>
                    <MoreHoriz/>
                </IconButton>
                <Menu anchorEl={openHoriz}
                    open={Boolean(openHoriz)}>
                    <MenuItem onClick={clickDeleteComment}>Delete</MenuItem>
                    <MenuItem onClick={()=>{
                        setOpenHoriz(null)
                        setEditingComment(!editingComment)}}>Edit</MenuItem>
                </Menu>
                </Dropdown>)
        }else{
            return(<div></div>)
        }
    }
    useEffect(()=>{
        if(editingComment){
            setEditingComment(false)
        }
    },[comment])
    const commentInputDiv=()=>{
        if(showCommentInput || editingComment){
            return(<CommentInput editing={editingComment} page={page} parentComment={comment} parentProfile={profile}/>)
        }
    }
    return (<div className="comment-thread">
                <div className="comment">
                    <div className="comment-heading">
                    {profileDiv}
                    {editHorizButton()}
                    </div>
                    <div className="text">
                        {comment.text}
                    </div>
        <div className="btn-row">
        
        <Button onClick={onClickReply
        }>Reply</Button>
        </div>
        {commentInputDiv()}
        </div>

        <div className="replies">
            {comments.map(com=>{
                return(<CommentItem key={com.id} page={page} comment={com} />)
            })}
        </div>
    </div>)
}