import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  useState ,useLayoutEffect, useEffect} from "react";
import "../../styles/PageView.css"
import { fetchCommentsOfPage } from "../../actions/PageActions";
import PageViewItem from "../../components/page/PageViewItem";
import {Helmet} from "react-helmet"
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";
import { postStoryHistory } from "../../actions/HistoryActions";
import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
export default function PageViewContainer(props){
    const location = useLocation()
    const page = useSelector(state=>state.pages.pageInView)
    const pathParams = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [canUserSee,setCanUserSee]=useState(false)
    const [canUserEdit,setCanUserEdit]=useState(false)
    const loading = useSelector(state=>state.pages.loading)
    const comments = useSelector(state=>state.comments.comments)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
            if(currentProfile && page){
                if(import.meta.env.VITE_NODE_ENV!="dev"){
                    dispatch(postStoryHistory({profile:currentProfile,story:page}))
             
                }
                dispatch(getProfileHashtagCommentUse({profileId:currentProfile.id}))
            }
    },[])
    useEffect(()=>{
        soCanUserSee()
    },[page])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams))
        dispatch(fetchCommentsOfPage(pathParams))
    },[location.pathname])
    useLayoutEffect(()=>{
        setRootComments(comments?comments.filter(com=>com.parentId==null):[])
     },[comments])
     const soCanUserEdit=()=>{
        if(page&&currentProfile){
            if(page.authorId==currentProfile.id){
                setCanUserEdit(true)
                return
            }

        }
     }

     const soCanUserSee=()=>{
        if(page){
            if(!page.isPrivate){
                setCanUserSee(true)
                return
            }
            if(!page.isPrivate||(currentProfile && page && page.authorId==currentProfile.id)){
                setCanUserSee(true)
                return
            }
            if(page.betaReaders){
                console.log(page.betaReaders)
                return
            }
        }
     }
    useEffect(()=>{
        soCanUserSee()
        soCanUserEdit()
      
    },[currentProfile,page])
    const pageDiv = ()=>{
     if(page){

     
            return(<PageViewItem page={page} currentProfile={currentProfile} />)
     }else{
        return null
     }
    }
    let description =""
    if(page){
     description = page.data
    if(page.data.length>200){
        description = page.data.slice(0,200)
    }
}
    const title = ()=>{
        if(page){
            return<Helmet>
            <title>{page.title}</title>
            <meta
          name="description"
          content={description}
        />
            </Helmet>
        }else{
           return null
        }
    }
    return(<div className="  mx-auto">
  <div className=" max-w-[96vw]  my-8 md:w-page mx-auto">     
    {canUserSee?
    <>{title()}
    {pageDiv()}</>:<div className="skeleton  max-w-[96vw] mx-auto md:w-page h-page"/>}
    
    <CommentThread page={page} comments={rootComments}/>
    </div> 
   
</div>)

}