import { PageType } from "../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPage} from "../actions/PageActions"
import { useEffect, useState } from "react";
import "../styles/PageView.css"
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchCommentsOfPage } from "../actions/PageActions";
import CommentItem from "../components/CommentItem";
import PageViewItem from "../components/PageViewItem";
import checkResult from "../core/checkResult";
export default function PageViewContainer({page}){
    const pathParams = useParams()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const commentsInView = useSelector(state => state.pages.commentsInView)
    const profilesInView = useSelector(state => state.users.profilesInView)
    const [hasMoreComments,setHasMoreComments]=useState(false)
    const loading = useSelector(state=>state.pages.loading)

    const [comments,setComments]= useState([])
    let pageDataElement = (<div>

    </div>)

    const getPage=()=>{
        const id =  pathParams["id"]
     
        dispatch(fetchPage(pathParams)).then(result=>{
            checkResult(result,payload=>{
                const {page}= payload
                fetchComments(page)
            },err=>{

            })
        })
    
    }
    useEffect(()=>{
        const {id}= pathParams
        if(page==null || page.id!=id){
            getPage()
        }else{
            setHasMoreComments(true)
            if(page){
                fetchComments(page)
            }
            
        }
    },[])
    useEffect(()=>{
        if(page){
            fetchComments(page)
        }
       
    },[])
    const fetchComments = (pageItem)=>{
        if(pageItem!=null){
            const params = {
                pageItem
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
    
  

    if(!loading && page!=null){

    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
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
    }}
    const commentList = ()=>{
    if(comments.length>0){
        return(<div className="comment-thread">
                <InfiniteScroll
                                dataLength={comments.length}
                next={fetchComments}
                hasMore={hasMoreComments} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={<p>No more data to load.</p>}
                            >
                            {comments.map(comment=>{
                                if(comment.parentCommentId==""||comment.parentCommentId==null){
                                let profile = (<div></div>)
                                let p = profilesInView.find(profile=>profile.id == comment.profileId)
                                if(p){
                                    profile=(<div className="comment-author">
                                        {p.username}
                                    </div>)
                                }
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
    return(<div className="center">
                <div id="page">
                    
                        
                        {pageDiv()}
                    
                        {commentList()}
                   
            </div>
        </div>)
    
    
}
