import { useState,useLayoutEffect,useEffect } from "react"
import { useSelector,useDispatch} from "react-redux"
import { useNavigate } from "react-router-dom"
import { IconButton } from "@mui/material"
import { BookmarkBorder as BookmarkBorderIcon } from "@mui/icons-material"
import ReactGA from "react-ga4"
import { setEditingPage } from "../../actions/PageActions"
import Paths from "../../core/paths"
export default function PageViewButtonRow({page,profile,setCommenting}){

    const [likeFound,setLikeFound]=useState(null)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [bookmarked,setBookmarked]= useState(false)
    const [comment,setComment]=useState(false)
    useLayoutEffect(()=>{
        if(currentProfile && page){
            let found = currentProfile.likedStories.find(like=>like.storyId==page.id)
            setLikeFound(found)
        }else{
            setLikeFound(null)
        }
            
    },[currentProfile,page])
    const copyShareLink=()=>{
        ReactGA.event({
            category: "Page View",
            action: "Copy Share Link",
            label: page.title, 
            value: page.id,
            nonInteraction: false
          });
        navigator.clipboard.writeText(`https://plumbum.app/page/${page.id}`)
                                .then(() => {
                                    // Successfully copied to clipboard
                                    alert('Text copied to clipboard');
                                  })
    }
    const handleApprovalClick = ()=>{
        if(currentProfile){
            if(likeFound ){
             dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
                checkResult(res,payload=>{
                    setLikeFound(null)
                },err=>{
    
                })
            })
        }else{
            if(page ){
    
            
            const params = {story:page,
                profile:currentProfile,
                            }
            dispatch(createPageApproval(params))
            }
        }
     }else{
        window.alert("Please Sign Up")
        }
    }
   useEffect(()=>{

    setCommenting(comment)
   },[comment])
    return(<div className='flex-row flex text-white'>
    <div   onClick={handleApprovalClick} className={`${likeFound?"bg-emerald-400":"bg-emerald-700"} text-center  grow flex-1/3`}>
     <div 
   
        
      className={`
      text-xl    text-white  text-center mx-auto py-2 bg-transparent  border-none  `}
    
     >
        <h6 className="text-xl"> Yea{likeFound?"h!":""}</h6>
     </div>
     </div>
     <div className="flex-1/3 grow bg-emerald-700  border-white border-l-2 border-r-2 border-t-0 border-b-0  text-center ">
    <div
    className="  text-white  py-2 border-none bg-transparent rounded-none  "
       disabled={!profile} 
        onClick={()=>{setComment(!comment)}}>
    <h6 className="text-xl">
        Discuss</h6>
    </div>
    </div>
    <div className="dropdown  flex-1/3 grow bg-emerald-700  text-center dropdown-top">
<div tabIndex={0} role="button" className="         text-white  text-center mx-auto py-2 bg-transparent  border-none  "> <h6 className="text-xl   border-none bg-transparent text-white mx-auto my-auto">Share</h6></div>
<ul tabIndex={0} className="dropdown-content bg-white text-emerald-700 menu bg rounded-box z-[1] w-52  shadow">
<li>
<a disabled={!profile} 
className=' text-green-600 '

onClick={()=>{
navigate(Paths.addStoryToCollection.createRoute(page.id))

}}> 
                Add to Collection

</a></li>
 {currentProfile && currentProfile.id == page.authorId? <li> <a
            className=' text-green-600 '
           onClick={()=> {
            dispatch(setEditingPage({page}))
            navigate(Paths.editPage.createRoute(page.id))
           }}
        >
             Edit
            </a></li>:null}           
           <li> <a
            className=' text-green-600 '
           onClick={()=>copyShareLink()}
        >
              Copy Share Link
            </a></li>
           <li> {(currentProfile && currentProfile.id == page.profileId )?
<a onClick={()=>{
    dispatch(setPageInView({page}))
    dispatch(setEditingPage({page}))
    navigate(Paths.editPage.createRoute(page.id))}}>Edit</a>:<div></div>}
</li>
<li> <IconButton onClick={()=>{}}
className=" text-green-600 "
disabled={!currentProfile}> 
{bookmarked?<BookmarkIcon/>:<BookmarkBorderIcon/>}
</IconButton></li>
</ul>
</div>
</div>)
}