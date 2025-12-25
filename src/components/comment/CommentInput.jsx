
import { useSelector,useDispatch} from "react-redux"
import { appendComment, createComment,updateComment } from "../../actions/PageActions.jsx"
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import checkResult from "../../core/checkResult"
import { debounce } from "lodash"
import critiqueTipsByGenre from "../../core/writingTips"
import Context from "../../context"

export default function CommentInput({parentComment,page,defaultComment,handleClose}){
    const dispatch = useDispatch()
    
    const {setError}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
   const [defaultContent,setDefaultContent]=useState(state=>{
        if(page&&page.hashtags){
        let tips = null
        page.hashtags.find(hashtag=>{
            tips = critiqueTipsByGenre[hashtag.hashtag.name]
           return tips
        })

        if(tips && tips.length>0){
            let index = Math.floor(Math.random() * tips.length)
            if(tips){
               return tips[index]
                
            }
        }}
        return defaultComment?defaultComment.content:""
})
    const [commentInput,setComment] = useState(defaultContent)
    const [show,setShow]=useState(true)
    const saveComment=debounce((e)=>{
        e.preventDefault()
     
        if(currentProfile && page ){
            let id = ""
            if(parentComment){
                id = parentComment.id
            }
        const params =  {profile: currentProfile,
              text:commentInput,
              storyId:page.id,
              parentCommentId:id,
        }
    
        dispatch(createComment(params)).then(result=>{
            checkResult(result,payload=>{
                setComment("")
                setShow(false)
                handleClose()
              
              
            },(err)=>{
            setError(err)
            })
    
        })
    
    }},10)

const clickUpdateComment = ()=>{
    const params =  {
        newText:commentInput,
        comment:defaultComment,
       
  }
    dispatch(updateComment(params))
    handleClose()
}
    const input = ()=>{
        
    return(<div style={{display: show?"":"none"}}className="p-2">
        <div className="text-left">Your Note:</div>
<textarea
  placeholder="Write your comment here..."
  className="textarea  bg-slate-50 mb-2 mx-auto min-h-36  p-2  text-emerald-800 w-[100%] mx-auto  "
  

  value={commentInput}

  
  onChange={(e)=>{
     setComment(e.target.value)
}}></textarea>
    <div className="flex rounded-full   flex-row-reverse ">
       {currentProfile? 
        defaultComment?
            <button 
            className="bg-emerald-400 text-white btn hover:bg-emerald-500"
       onClick={clickUpdateComment}>Update</button>
       :
       
       <p
       onClick={(e)=>saveComment(e)} 
   
     className="bg-sky-600 border-sky-500 text-[1rem] text-white w-[10em] btn hover:bg-emerald-500"
         > 
       {parentComment?"Reply":"Save"}</p>:
       <button className="text-emerald-800" 
       disabled={!currentProfile} onClick={saveComment}>
            Disabled
        </button>}
    </div>
</div>)}
    return input()
}