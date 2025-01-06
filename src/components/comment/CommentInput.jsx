
import { useSelector,useDispatch} from "react-redux"
import { appendComment, createComment,updateComment } from "../../actions/PageActions"
import { useEffect, useState } from "react"
import checkResult from "../../core/checkResult"

export default function CommentInput({page,defaultComment,parentComment,parentProfile}){
    const dispatch = useDispatch()
    const pageInView = useSelector(state=>state.pages.pageInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [commentInput,setComment] = useState("Remember the sandwich method.\n Compliment.Critique.Compliment")
    const [show,setShow]=useState(true)
    const saveComment=()=>{
        if(currentProfile && pageInView && commentInput.length >7){
            let id = ""
            if(parentComment){
                id = parentComment.id
            }
        const params =  {profile: currentProfile,
              text:commentInput,
              storyId:pageInView.id,
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

const clickUpdateComment = ()=>{
    const params =  {profile: currentProfile,
        text:commentInput,
        storyId:page.id,
        parentCommentId:id,
  }
    dispatch(updateComment(params))
}
    const input = ()=>{
        
    return(<div style={{display: show?"":"none"}}className=" p-2">
<textarea
  
  className="textarea w-[96%] mb-2 p-2 bg-transparent border-emerald-600 border-1 md:max-w-[50em] sm:max-w[40em] max-w-[100vw] text-slate-800 sm:w-96 mx-auto textarea-bordered "
  

  value={commentInput}

  
  onChange={(e)=>{
     setComment(e.target.value)
}}></textarea>
    <div className="flex flex-row-reverse mx-4">
       {currentProfile? 
        defaultComment?
            <button 
            className="bg-emerald-400 text-white hover:bg-emerald-500"
       onClick={clickUpdateComment}>Update</button>
       :
       
       <button  
       onClick={saveComment}   className="bg-emerald-800 text-white  mx-4 hover:bg-emerald-500"> {parentComment?"Reply":"Save Comment"}</button>:
       <button className="bg-emerald-200 text-white-800" 
       disabled={!currentProfile} onClick={saveComment}>
            Disabled
        </button>}
    </div>
</div>)}
    return input()
}