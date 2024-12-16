import { PageType } from "../../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState ,useLayoutEffect} from "react";
import "../../styles/PageView.css"
import { fetchCommentsOfPage } from "../../actions/PageActions";
import PageViewItem from "../../components/page/PageViewItem";
import checkResult from "../../core/checkResult";
import {Helmet} from "react-helmet"
import PropTypes from "prop-types"
import LinkPreview from "../../components/LinkPreview";
import PageSkeleton from "../../components/PageSkeleton";
import { getStory } from "../../actions/StoryActions";
import ReactGA from "react-ga4"
import CommentThread from "../../components/comment/CommentThread";
import { comment } from "postcss";

export default function PageViewContainer({page}){
    PageViewContainer.propTypes = {
        page: PropTypes.object.isRequired
    }
 
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const loading = useSelector(state=>state.pages.loading)
    const lookingWrong = <div><h1>Looking in all the wrong places</h1></div>
    const comments = useSelector(state=>state.comments.comments)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams))
        dispatch(fetchCommentsOfPage(pathParams))
    },[currentProfile])
    useLayoutEffect(()=>{
        setRootComments(comments.filter(com=>com.parentId==null))
     },[comments])
   let pageDataElement =(<div></div>)

  

    if(!loading && page!=null){

    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.link: pageDataElement = <div><LinkPreview url={page.data}/></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashboard-data' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }}else{
        if(loading){
        return <PageSkeleton/>
        }else{
            return lookingWrong
        }
    }
  
        const commentList = ()=>{
            
        
        return <CommentThread comments={rootComments}/>
    // if(commentsInView && commentsInView.length>0){
   
    //     return(<div className="comment-thread">
    //             <InfiniteScroll
    //                             dataLength={commentsInView.length}
    //             next={fetchComments}
    //             hasMore={hasMoreComments} // Replace with a condition based on your data source
    //             loader={<p>Loading...</p>}
    //             endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
    //                         >
    //                         {commentsInView.map(comment=>{
    //                             if(comment.parentCommentId==""||comment.parentCommentId==null){
    //                             return (<CommentItem page={page} comment={comment}/>)
                            
                
    //                         }else{
    //                             return
    //                         }})}
    //                     </InfiniteScroll>
    //     </div>)
    // }else{
    //     return(<div className="bg-emerald-700 min-h-24 rounded-b-lg py-4">
    //         <h2 className="text-4xl"> No comments yet</h2>
    //     </div>)
    // }
}
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
    {commentList()}
    
   
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
