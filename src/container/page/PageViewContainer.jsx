import { PageType } from "../../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  useState ,useLayoutEffect, useEffect} from "react";
import "../../styles/PageView.css"
import { fetchCommentsOfPage } from "../../actions/PageActions";
import PageViewItem from "../../components/page/PageViewItem";
import checkResult from "../../core/checkResult";
import {Helmet} from "react-helmet"
import PropTypes from "prop-types"
import LinkPreview from "../../components/LinkPreview";
import PageSkeleton from "../../components/PageSkeleton";
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";

export default function PageViewContainer(props){
    PageViewContainer.propTypes = {
        page: PropTypes.object.isRequired
    }
    const page = useSelector(state=>state.pages.pageInView)
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const loading = useSelector(state=>state.pages.loading)
    const lookingWrong = <div><h1>Looking in all the wrong places</h1></div>
    const comments = useSelector(state=>state.comments.comments)
    const [pageDataElement,setPageDataElement]=useState(<div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams))
        dispatch(fetchCommentsOfPage(pathParams))
    },[currentProfile])
    useLayoutEffect(()=>{
        setRootComments(comments.filter(com=>com.parentId==null))
     },[comments])


  
useLayoutEffect(()=>{


    if(!loading && page!=null){

    switch(page.type){
        case PageType.text:
            setPageDataElement(<div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>)
        break;
        case PageType.link: setPageDataElement(<div><LinkPreview url={page.data}/></div>)
        break;
        case PageType.picture:
            setPageDataElement(<img className='dashboard-data' src={page.data} alt={page.title}/>)
        break;
        case PageType.video:
           setPageDataElement(<video src={page.data}/>)
        break;
        default:
            setPageDataElement(<div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>)
        break;
    }}else{
        if(loading){
        return <PageSkeleton/>
        }else{
            return lookingWrong
        }
    }
},[page])
    
    const pageDiv = ()=>{
        if(page){
            return(<PageViewItem page={page} currentProfile={currentProfile} />)
        }else{
            return(<div className="empty"><h6>This page doesn't exist</h6></div>)
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
           return(<div>
        
           </div>) 
        }
    }
    const present = (<div className="center">
        
    {title()}
<div id="page">
    {pageDiv()}
    <CommentThread comments={rootComments}/>
    
   
</div>
</div>)

    const checkPermission=()=>{
        if(page){
          if(page.privacy){
            if(currentProfile!==null){
                if(currentProfile.id == page.profileId || page.writers.includes(currentProfile.userId)
            ||page.editors.includes(currentProfile.userId)
            ||page.commenters.includes(currentProfile.userId)
            ||page.readers.includes(currentProfile.userId)){
            
                return present
            }else{
                return lookingWrong
            }
        }else{
            return lookingWrong
        }
    }else{
            return present
        }
        
    }
        return <PageSkeleton/>
    }

    return checkPermission()    
    
}
