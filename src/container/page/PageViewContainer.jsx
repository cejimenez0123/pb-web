import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  useState ,useLayoutEffect, useEffect, useContext} from "react";
import "../../styles/PageView.css"
import { fetchCommentsOfPage } from "../../actions/PageActions.jsx";
import PageViewItem from "../../components/page/PageViewItem";
import { Helmet } from 'react-helmet-async';
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";
import { postStoryHistory } from "../../actions/HistoryActions";
import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import Enviroment from "../../core/Enviroment.js";
import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult.js";
export default function PageViewContainer(props){
    const {currentProfile}=useContext(Context)
    const location = useLocation()
    const page = useSelector(state=>state.pages.pageInView)
    const pathParams = useParams()
   const {id}=pathParams
    const dispatch = useDispatch()

    const [canUserSee,setCanUserSee]=useState(false)
    const comments = useSelector(state=>state.comments.comments)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
        if(currentProfile){
            dispatch(getProfileHashtagCommentUse({profileId:currentProfile.id}))
        }

        return()=>{

        
            if(currentProfile && page){
                if(import.meta.env.VITE_NODE_ENV!="dev"){
                    dispatch(postStoryHistory({profile:currentProfile,story:page}))
             
                }
            }}
    },[])
    useLayoutEffect(()=>{   soCanUserSee() },[currentProfile,page])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams)).then(res=>{
            checkResult(res,payload=>{
                soCanUserSee()
            },err=>{

            })
        })
        dispatch(fetchCommentsOfPage(pathParams))
    },[id,currentProfile])
    useLayoutEffect(()=>{
        setRootComments(comments?comments.filter(com=>com.parentId==null):[])
     },[comments])


     const soCanUserSee=()=>{
        if(page){
  
            if(!page.isPrivate){
                setCanUserSee(true)
                return
            }
            if(currentProfile){
                
                if(page.authorId==currentProfile.id){
                setCanUserSee(true)
                return
                }
            if(page.betaReaders){
                console.log(page.betaReaders)
                return
            }}
        }
     }

    const pageDiv = ()=>{
     if(page){

     
            return(<PageViewItem page={page} currentProfile={currentProfile} />)
     }else{
        return (<div><dib className="skeleton w-[96vw] mx-auto md:w-page bg-emerald-50 h-page"/></div>)
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
                <title>{page.title} | Plumbum</title>
        <meta name="description" content={page.description || "Read this amazing story on Plumbum."} />
        <meta name="keywords" content={page.hashtags?page.hashtags.map((tag) => tag.name).join(", "):page.title} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={Enviroment.domain+Paths.page.createRoute(page.id)} />
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
           
           
            </Helmet>
        }else{
           return null
        }
    }
    return(<div className="  mx-auto">
        {/* <ErrorBoundary > */}
  <div className=" max-w-[96vw]  my-8 md:w-page mx-auto">     
    {canUserSee?
    <>{title()}
    {pageDiv()}</>:<div className="skeleton bg-slate-50  max-w-[96vw] mx-auto md:w-page h-page"/>}
    
    <CommentThread page={page} comments={rootComments}/>
    </div> 
    {/* </ErrorBoundary> */}
</div>)

}