import { useSelector } from "react-redux"
import { useState,useLayoutEffect, useEffect } from "react"
import CommentInput from "./CommentInput"
import CommentThread from "./CommentThread"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useDispatch } from "react-redux"
import { deleteHashtagComment, createHashtagComment } from "../../actions/HashtagActions"
import checkResult from "../../core/checkResult"
export default function Comment({comment,level}){
    const comments = useSelector(state=>state.comments.comments)
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [branches,setBranches]=useState([])
    const [replyInput,setReplyInput]=useState(false)
    const hashtags = useSelector(state=>state.hashtags.profileHashtagComments)
    const [isHelpful,setIsHelpful]= useState(null)
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
     dispatch(createHashtagComment({name:"helpful",profileId:currentProfile,commentId:comment.id})).then(res=>checkResult(res,payload=>{
        const {hashtag}=payload
        setIsHelpful(hashtag)

     },err=>{
        window.alert(err.message)
     }))
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
    useLayoutEffect(()=>{
       let branches = comments.filter(com=>{return com.parentId==comment.id})
     
       setBranches(branches)
    },[comments])
    
    return(<div className="max-w-[99%] ml-1">


        <div class=" text-left   sm:min-w-[30em] max-w-[100%] py-1 sm:my-4 " id={`comment-${comment.id}`}>
<div className=" p-1 sm:border-emerald-500 sm:border-2 sm:rounded-full ">
           <div className=" sm:rounded-full bg-emerald-700 text-white rounded-lg sm:px-8 sm:rounded-full  py-4 ">
           <a onClick={()=>navigate(Paths.profile.createRoute(comment.profile.id))} class=" text-[0.8rem] sm:sm mx-4 text-white  mr-4">{comment.profile.username}</a>
           <h6 className="text-[0.8rem] md:text-md  mx-3 p-3">{comment.content}</h6>
           <div class=" flex flex-row sm:pb-2 justify-between">
                    
                    {isHelpful?<a onClick={handleDeleteHelpful} className="text-[0.8rem] sm:text-sm text-orange-400  mt-4 ml-6">Glad it helped!</a>:<a onClick={handleIfHelpful}className="text-[0.8rem] sm:text-sm text-white mt-4 ml-8"> Was comment helpful?</a>}
                  
                   <div 
                   onClick={()=>setReplyInput(!replyInput) }
                   className="justify-self-end  flex flex-row text-[0.7rem] font-bold sm:text-[0.8rem] mr-2 rounded-full sm:text-[1rem] bg-emerald-100  text-white mx-2 text-center">
                    <h6 
                    className="text-emerald-700 my-auto underline-none px-3 ">Reply</h6>
            </div>      
                </div>
                   
                </div>
                </div> 
                {replyInput?<CommentInput parentComment={comment}/>:null}
                <div>
                    <CommentThread comments={branches} level={level+1}/>
                    </div>
          </div>        
            </div>  
)
}