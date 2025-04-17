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
import { initGA,sendGAEvent } from "../../core/ga4.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
export default function PageViewContainer(props){
    const {setSeo,seo,setSuccess,setError,currentProfile}=useContext(Context)
    const location = useLocation()
    const pathParams = useParams()
    const {id}=pathParams
    const page = useSelector(state=>state.pages.pageInView)
    useScrollTracking({name:page?JSON.stringify(page):id})


    const dispatch = useDispatch()
    const [pending,setPending]=useState(true)
    const [canUserSee,setCanUserSee]=useState(false)
    const [canUserEdit,setCanUserEdit]=useState(false)
    const comments = useSelector(state=>state.comments.comments)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
        initGA()
    
           },[])
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
    useLayoutEffect(()=>{   
        soCanUserSee() 
     },[currentProfile,page])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams)).then(res=>{
            checkResult(res,payload=>{
                soCanUserSee()

            },err=>{
console.log(" XCZX",err)
            })
        })
        dispatch(fetchCommentsOfPage(pathParams))
    },[location.pathname,id,currentProfile])

    useLayoutEffect(()=>{
        setRootComments(comments?comments.filter(com=>com.parentId==null):[])
     },[comments])


     const soCanUserSee=()=>{
        if(page){
            if(!page.isPrivate){
                setCanUserSee(true)
                setPending(false)
                return
            }
            if(currentProfile){
                
                if(page.authorId==currentProfile.id){
                setCanUserSee(true)
                setPending(false)
                return
                }
            if(page.betaReaders){
                let found = page && page.betaReaders?page.betaReaders.find(role=>currentProfile && role.profileId==currentProfile.id):null
                setCanUserSee(found)
                setPending(false)
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

 

useLayoutEffect(()=>{
    if(page){
        let soo = seo
        soo.title = page.title
        soo.description = page.description
        setSeo(soo)
    }
},[])

    return(<div className="  mx-auto"> 
        <ErrorBoundary >
        <Helmet>
      {page?<><title>{"A Plumbum+Story:"+page.title+" from "+page.author.username}</title>
       <meta property="og:image" content={"https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O"} />
      <meta property="og:url" content={`${Enviroment.domain}${location.pathname}`} />
      <meta property="og:description" content={page.description.length>0?page.description:"Explore events, workshops, and writer meetups on Plumbum."}/>
      <meta name="twitter:image" content={`https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O`} /></>:
      <>
  <title>Plumbum Writers-Story:{id}</title>
  <meta name="description" content="Explore other peoples writing, get feedback, add your weirdness so we can find you." />
  <meta property="og:title" content="Plumbum Writers - Check this story out" />
  <meta property="og:description" content="Plumbum Writers the place for feedback and support." />
  <meta property="og:image" content="https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O" />
  <meta property="og:url" content="https://plumbum.app/events" /></>
}  </Helmet>

  <div className=" max-w-[96vw]  my-8 md:w-page mx-auto">     
    {canUserSee?
    <>
    {pageDiv()}</>:pending?<div className="skeleton bg-slate-50  max-w-[96vw] mx-auto md:w-page h-page"/>:<div className="flex max-w-[96vw] max-w-[96vw] mx-auto md:w-page h-pag"><h1 className="mont-medium my-12 mx-auto">Took a Wrong turn</h1></div>}
    
    <CommentThread page={page} comments={rootComments}/>
    </div> 
    </ErrorBoundary>
</div>)

}