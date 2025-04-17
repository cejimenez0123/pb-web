import { useSelector } from "react-redux"
import { useState,useLayoutEffect, useEffect } from "react"
import CommentInput from "./CommentInput"
import CommentThread from "./CommentThread"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useDispatch } from "react-redux"
import { deleteHashtagComment, createHashtagComment } from "../../actions/HashtagActions"
import checkResult from "../../core/checkResult"
import horiz from "../../images/icons/more_horiz.svg"
import { deleteComment } from "../../actions/PageActions.jsx"
export default function Comment({page,comment,level}){
    const comments = useSelector(state=>state.comments.comments)
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [branches,setBranches]=useState([])
    const [replyInput,setReplyInput]=useState(false)
    const hashtags = useSelector(state=>state.hashtags.profileHashtagComments)
    const [isHelpful,setIsHelpful]= useState(null)
    const [updateComment,setUpdateComment]=useState(null)
    useEffect(()=>{
        let hs = hashtags.find(hash=>{
            if(hash.commentId == comment.id){
                return hash.hashtag.name=="helpful"
            }else{
                return false
            }})
        
       setIsHelpful(hs)
    },[hashtags])

    const navigate = useNavigate()
    const handleIfHelpful = ()=>{
        if(currentProfile){
     dispatch(createHashtagComment({name:"helpful",profileId:currentProfile,commentId:comment.id})).then(res=>checkResult(res,payload=>{
        const {hashtag}=payload
        setIsHelpful(hashtag)
     
     },err=>{
        window.alert(err.message)
     }))}
    }
    const handleDeleteComment =()=>{
        dispatch(deleteComment({comment}))
    }
    
    const handleDeleteHelpful = ()=>{
        if(isHelpful){
            if(isHelpful.id){
                dispatch(deleteHashtagComment({hashtagCommentId:isHelpful.id})).then(res=>{
                    checkResult(res,payload=>{
                        setIsHelpful(null)
                    },err=>{
                        
                    })
                })
            }
        }
    }
    const closeInput =()=>{
        setUpdateComment(null)
        setReplyInput(false)
    }
    useLayoutEffect(()=>{
       let branches = comments.filter(com=>{return com.parentId==comment.id})
     
       setBranches(branches)
    },[comments])
    
    return(<div className="max-w-[99%] ml-1">


        <div class=" text-left   sm:min-w-[30em] max-w-[100%] py-1 sm:my-4 " id={`comment-${comment.id}`}>
        <div className={replyInput||updateComment?"bg-emerald-500 rounded-t-lg rounded-b-lg":""}>
{/* <div className=" p-1 border-emerald-500 border-b-2 border-l-2 rounded-lg md:border-2 sm:rounded-[20%]  "> */}
        
           <div className="  bg-emerald-700 shadow-md  text-white rounded-lg sm:px-8 sm:rounded-[18%] ">
          <div className="flex flex-row py-2 sm:pl-4 pr-4 sm:pr-12 justify-between"> 
          <a onClick={()=>navigate(Paths.profile.createRoute(comment.profile.id))}
           className=" text-[0.8rem] mx-4 open-sans-medium text-white my-auto mr-4">{comment.profile.username}</a>
          
          {currentProfile && currentProfile.id == comment.profileId?     <div className="dropdown dropdown-left">
<div tabIndex={0} role="button" className="my-auto"><img src={horiz}/></div>
  <ul tabIndex={0} className="dropdown-content mont-medium menu bg-slate-100  text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
    <li onClick={()=>setUpdateComment(comment)}><a>Update</a></li>
    <li className="my-2" onClick={handleDeleteComment}><a>Delete</a></li>
  </ul>
</div>:null}
          </div> <h6 className="text-[0.8rem] md:text-[0.9rem] open-sans-medium mx-3 py-3 pl-[1.7em] my-1">{comment.content}</h6>
           <div class=" flex flex-row py-2 sm:pl-2 pr-6 items-end justify-between">
                    
                    {isHelpful?<a onClick={handleDeleteHelpful} className="text-[0.8rem] mont-medium text-emerald-300 sm:text-sm mont-bold  mt-2 mb-2 ml-6">Glad it helped!</a>:<a onClick={handleIfHelpful}className="text-[0.8rem] sm:text-sm mont-medium text-white mt-4 ml-8"> Was comment helpful?</a>}
                  
                    <h6 
                   onClick={()=>setReplyInput(!replyInput) }
                
                  
                    className="  place-self-end bottom-0  mt-8 sm:flex sm:flex-row text-[0.9rem] mont-medium md:px-4   font-bold sm:text-[1rem] mr-2 rounded-full sm:bg-emerald-600 py-2  text-white sm:mx-2 sm:text-center   sm:my-auto  no-underline  mont-medium ">
                        {!replyInput?"Reply":"Close"}</h6>
      
                </div>
                   
                </div>
                </div> 
                {replyInput||updateComment?<CommentInput page={page} parentComment={comment} defaultComment={updateComment} handleClose={closeInput}/>:null}
                </div>
                <div>
                    <CommentThread page={page} comments={branches} level={level+1}/>
                    </div>
          {/* </div>         */}
            </div>  
)
}