import {  useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  useState ,useLayoutEffect, useEffect, useContext} from "react";
import "../../styles/PageView.css"
import PageViewItem from "../../components/page/PageViewItem";
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";
import { postStoryHistory } from "../../actions/HistoryActions";
import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import { initGA} from "../../core/ga4.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { IonContent } from "@ionic/react";
export default function PageViewContainer(props){
    const {setSeo,seo,setSuccess,setError,currentProfile}=useContext(Context)

    const {id} = useParams()
 
    const page = useSelector(state=>state.pages.pageInView)
    useScrollTracking({name:page?JSON.stringify(page):id})


    const dispatch = useDispatch()
    const [pending,setPending]=useState(true)
    const [canUserSee,setCanUserSee]=useState(false)
    const [comments,setComments]=useState([])
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
    useEffect(()=>{ 
        if(page && page.comments){  
        soCanUserSee()
        setComments(!!page?page.comments:[])
        setRootComments(!!page?page.comments.filter(com=>com.parentId==null):[])
        }else{
            fetchStory()
        }
     },[currentProfile,page])
    useEffect(()=>{
    fetchStory()
  
    },[id])
    
    const fetchStory = ()=>{
        setPending(true)
        dispatch(getStory({id})).then(res=>{
            checkResult(res,payload=>{
                soCanUserSee()
                setPending(false)
            },err=>{
                setError(err.message)
            })
        })
    }


     const soCanUserSee=()=>{
        if(page){
            if(!page.isPrivate){
            setCanUserSee(true)
            return
            }
            if((currentProfile && page.authorId == currentProfile.id)||(page.collections && page.collections.find(col=>col && col.collection && col.collection.isPrivate==false||col.collection.roles.find(role=>role.profileId==currentProfile.id)))){
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

    const PageDiv = ({page})=>{
       
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

    return( <ErrorBoundary><IonContent fullscreen={true}>
       
    
    {canUserSee?
    <>
    <PageDiv page={page}/></>:pending?<div className="skeleton bg-slate-50  max-w-[96vw] mx-auto md:w-page h-page"/>:<div className="flex max-w-[96vw] max-w-[96vw] mx-auto md:w-page h-pag"><h1 className="mont-medium my-12 mx-auto">Took a Wrong turn</h1></div>}
    
    <CommentThread page={page} comments={rootComments}/>

    
</IonContent> </ErrorBoundary>)

}