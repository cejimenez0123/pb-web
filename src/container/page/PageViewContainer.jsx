import { PageType } from "../../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPage} from "../../actions/PageActions"
import { useEffect, useState ,useLayoutEffect} from "react";
import "../../styles/PageView.css"
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchCommentsOfPage } from "../../actions/PageActions";
import CommentItem from "../../components/CommentItem";
import PageViewItem from "../../components/PageViewItem";
import checkResult from "../../core/checkResult";
import {Helmet} from "react-helmet"
import PropTypes from "prop-types"
import LinkPreview from "../../components/LinkPreview";
import PageSkeleton from "../../components/PageSkeleton";
export default function PageViewContainer({page}){
    PageViewContainer.propTypes = {
        page: PropTypes.object.isRequired
    }
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const commentsInView = useSelector(state => state.pages.commentsInView)
    const [hasMoreComments,setHasMoreComments]=useState(false)
    const loading = useSelector(state=>state.pages.loading)
    const lookingWrong = <div><h1>Looking in all the wrong places</h1></div>
    const [comments,setComments]= useState([])
    let pageDataElement = (<div>

    </div>)

    const getPage=()=>{
     
        dispatch(fetchPage(pathParams)).then(result=>{
            checkResult(result,payload=>{
                const {page}= payload
                fetchComments(page)
            },err=>{

            })
        })
    
    }

    useLayoutEffect(()=>{
        getPage()
    },[])
    useEffect(()=>{
        setComments(commentsInView)
    },[commentsInView])
    const fetchComments = (pageItem)=>{
        if(pageItem!=null){
            const params = {
                page:pageItem
            }
            dispatch(fetchCommentsOfPage(params)).then(result=>{
                checkResult(result,payload=>{
                    const {comments} = payload
                    setComments(comments)
                    setHasMoreComments(false)
                },()=>{

                })
                   
            
            })
        }
    }
    useEffect(()=>{
        if(commentsInView[0]!=null && page != null && commentsInView[0].pageId==page.id){
            setComments(commentsInView)
            setHasMoreComments(false)
        }else{
            fetchComments()
        }
    },[commentsInView])
    
  

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
    if(comments && comments.length>0){
        return(<div className="comment-thread">
                <InfiniteScroll
                                dataLength={comments.length}
                next={fetchComments}
                hasMore={hasMoreComments} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={<div className="no-more-data"><p>No more data to load.</p></div>}
                            >
                            {comments.map(comment=>{
                                if(comment.parentCommentId==""||comment.parentCommentId==null){
                                return (<CommentItem page={page} comment={comment}/>)
                            
                
                            }else{
                                return
                            }})}
                        </InfiniteScroll>
        </div>)
    }else{
        return(<div className="empty">
            <h1> 0 Comments</h1>
        </div>)
    }}
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
        if(page && !page.privacy){
        return present
    }else{
        if(page && currentProfile){
            if(page.writers.includes(currentProfile.userId)
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

    }

}

    return checkPermission()    
    
}
