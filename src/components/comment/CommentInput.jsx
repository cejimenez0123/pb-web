
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
        if(commentInput.length>7){
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
                const comment = payload
                const params = {comment}
                dispatch(appendComment(params))
            },(err)=>{
                window.alert(err)
            })
    
        })
    }}else{
        setError("Comment must be at least 7 characters")
    }},10)
useLayoutEffect(()=>{
  
},[])
const clickUpdateComment = ()=>{
    const params =  {
        newText:commentInput,
        comment:defaultComment,
       
  }
    dispatch(updateComment(params))
    handleClose()
}
    const input = ()=>{
        
    return(<div style={{display: show?"":"none"}}className="bg-emerald-100 rounded-b-lg p-2">
<textarea
  
  className="textarea  mb-2 mx-auto min-h-30 open-sans-medium p-2 bg-transparent border-emerald-700 border-opacity-60 border-2  text-emerald-800 w-[100%] mx-auto textarea-bordered "
  

  value={commentInput}

  
  onChange={(e)=>{
     setComment(e.target.value)
}}></textarea>
    <div className="flex rounded-full flex-row-reverse ">
       {currentProfile? 
        defaultComment?
            <button 
            className="bg-emerald-400 text-white hover:bg-emerald-500"
       onClick={clickUpdateComment}>Update</button>
       :
       
       <button  
       onClick={(e)=>saveComment(e)}   className="bg-emerald-800 rounded-full text-white mont-medium sm:mx-4 hover:border-0 text-[1rem] hover:bg-gradient-to-r hover:to-emerald-400 hover:from-emerald-800"> {parentComment?"Reply":"Save"}</button>:
       <button className="bg-emerald-200 text-white-800" 
       disabled={!currentProfile} onClick={saveComment}>
            Disabled
        </button>}
    </div>
</div>)}
    return input()
}