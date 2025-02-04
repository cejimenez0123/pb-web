import { useState,useLayoutEffect,useEffect, useContext } from "react"
import { useSelector,useDispatch} from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import bookmarkFill from "../../images/bookmark_fill_green.svg"
import bookmarkAdd from "../../images/bookmark_add.svg"
import ReactGA from "react-ga4"
import { addStoryListToCollection,deleteStoryFromCollection } from "../../actions/CollectionActions"
import { setEditingPage } from "../../actions/PageActions"
import Paths from "../../core/paths"
import checkResult from "../../core/checkResult"
import loadingGif from "../../images/loading.gif"
import Context from "../../context"
import usePersistentCurrentProfile from "../../domain/usecases/useCurrentProfileCache"
import { getCurrentProfile } from "../../actions/UserActions"
import { debounce } from "lodash"
import { RoleType } from "../../core/constants"
export default function PageViewButtonRow({page,profile,setCommenting}){
    const {setSuccess,currentProfile,setError}=useContext(Context)
    const [likeFound,setLikeFound]=useState(null)
    const {id}=useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [canUserComment,setCanUserComment]=useState(false)
    const [loading,setLoading]=useState(false)
    const [bookmarked,setBookmarked]= useState(null)
    const [comment,setComment]=useState(false)
    useLayoutEffect(()=>{
        if(currentProfile && page){
            let found = currentProfile.likedStories.find(like=>like.storyId==page.id)
            let marked =currentProfile.profileToCollections.find(ptc=>{
                return ptc && ptc.type=="archive"&&ptc.collection.storyIdList.find(stc=>stc.storyId==page.id)})
          
            setBookmarked(marked)
            setLikeFound(found)
            setLoading(false)
        }else{
            setLikeFound(null)
            setBookmarked(null)
            setLoading(false)
        }
            
    },[])
    const onBookmarkPage = ()=>{
        setLoading(true)
        if(currentProfile&&currentProfile.profileToCollections){
            let ptc = currentProfile.profileToCollections.find(ptc=>ptc.type=="archive")
            if(ptc&&ptc.collectionId&&page&&page.id){{
                dispatch(addStoryListToCollection({id:ptc.collectionId,list:[page],profile:currentProfile})).then(res=>{
                    checkResult(res,payload=>{
                        setBookmarked({collectionId:ptc.collectionId})
                        setLoading(false)
                        setSuccess("Added Successfully")
                    },err=>{
                        setError("Error")
                        setLoading(false)
                    })
                })
       
            }
             }

}else{
    setLoading(false)
}}
const deleteStc=()=>{
    setLoading(true)
    if(bookmarked&&bookmarked.collectionId){
dispatch(deleteStoryFromCollection({id:bookmarked.collectionId,storyId:page.id})).then((res)=>{
checkResult(res,payload=>{
    setLoading(false)
    setBookmarked(null)
},err=>{
    setLoading(false)
})
})
}else{
    setLoading(false)
}}
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
    const soCanUserComment=()=>{
        let roles = [RoleType.commenter,RoleType.editor,RoleType.writer]
        if(currentProfile){
            if(currentProfile.id==page.authorId){
                setCanUserComment(true)
                return
            }
        if(page.commentable){
            setCanUserComment(true)
            return
        }
        if(page.betaReaders){
           let found = page.betaReaders.find(rTc=>rTc.profileId==currentProfile.id&&roles.includes(rTc.role))
            setCanUserComment(found)
            return
        }
    }
    }
    const handleApprovalClick = ()=>{
        if(currentProfile){
            if(likeFound ){
             dispatch(deletePageApproval({id:likeFound.id})).then(res=>{
                checkResult(res,payload=>{
                    setLoading(false)
                    setLikeFound(null)
                },err=>{
                    setLoading(false)
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
        setError("Please Sign Up")
        }
    }
    useLayoutEffect(()=>{
        soCanUserComment()
    },[page])
    const handleBookmark=debounce((e)=>{
      
            e.preventDefault()
             if(bookmarked){
                 deleteStc()
             }else{
                 onBookmarkPage()
         
             }
         
    },10)
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
       disabled={!canUserComment} 
        onClick={()=>{setComment(!comment)}}>
    <h6 className="text-xl">
        Discuss</h6>
    </div>
    </div>
    <div className="dropdown  flex-1/3 grow bg-emerald-700  text-center dropdown-top">
<div tabIndex={0} role="button" className="         text-white  text-center mx-auto py-2 bg-transparent  border-none  "> <h6 className="text-xl   border-none bg-transparent text-white mx-auto my-auto">Share</h6></div>
<ul tabIndex={0} className="dropdown-content bg-white text-emerald-800 menu bg rounded-box z-[1] w-52  shadow">
<li>
<a disabled={!profile} 
className=' text-emerald-800 '

onClick={()=>{
navigate(Paths.addStoryToCollection.story(page.id))

}}> 
                Add to Collection

</a></li>
 {currentProfile && currentProfile.id == page.authorId? <li> <a
            className=' text-emerald-800 '
           onClick={()=> {
            dispatch(setEditingPage({page}))
            navigate(Paths.editPage.createRoute(page.id))
           }}
        >
             Edit
            </a></li>:null}           
           <li> <a
            className=' text-emerald-800 '
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
<li> <button
onClick={handleBookmark}
className=" text-emerald-800 border-none flex bg-transparent"
disabled={!currentProfile}> 
{!loading?(bookmarked?
<img className="mx-auto" src={bookmarkFill}/>:<img className="mx-auto" src={bookmarkAdd}/> ):
<img className="max-h-6 mx-auto" src={loadingGif}/>}
</button></li>
</ul>
</div>
</div>)
}