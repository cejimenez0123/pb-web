import { PageType } from "../core/constants";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPage} from "../actions/PageActions"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProfiles } from "../actions/UserActions";
import "../styles/PageView.css"
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchCommentsOfPage } from "../actions/PageActions";
import CommentItem from "../components/CommentItem";
import PageViewItem from "../components/PageViewItem";
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
            if(result.error!=null){
                fetchComments()
            }})
    
    }
    useEffect(()=>{
        const {id}= pathParams
        if(page==null || page.id!=id){
            getPage()
        }else{
            setHasMoreComments(true)
            fetchComments()
        }
    },[])
    useEffect(()=>{
        fetchComments()
    },[])
    const fetchComments = ()=>{
        if(page!=null){
            const params = {
                page
            }
            dispatch(fetchCommentsOfPage(params)).then(result=>{
                if(result.error==null){
                    setComments(commentsInView)
                    setHasMoreComments(false)
                }
            })
        }
    }
    
    useEffect(()=>{
        fetchComments()
    },[])

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

    return(<div className="center">
                <div id="page">
                    
                        <PageViewItem page={page} currentProfile={currentProfile} />
                    
                    
                        {commentList()}
                   
            </div>
        </div>)
    
    
}
