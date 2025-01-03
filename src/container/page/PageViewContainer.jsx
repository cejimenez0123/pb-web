import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  useState ,useLayoutEffect, useEffect} from "react";
import "../../styles/PageView.css"
import { fetchCommentsOfPage } from "../../actions/PageActions";
import PageViewItem from "../../components/page/PageViewItem";
import checkResult from "../../core/checkResult";
import {Helmet} from "react-helmet"
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";

export default function PageViewContainer(props){

    const page = useSelector(state=>state.pages.pageInView)
    const pathParams = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const loading = useSelector(state=>state.pages.loading)
    const lookingWrong = <div><h1>Looking in all the wrong places</h1></div>
    const comments = useSelector(state=>state.comments.comments)
    const [rootComments,setRootComments]=useState([])
    useLayoutEffect(()=>{
            if(currentProfile){
                // dispatch()
            }
    },[])
    useLayoutEffect(()=>{
        dispatch(getStory(pathParams)).then(res=>checkResult(res,payload=>{

        },err=>{
            navigate(-1)
        }))
        dispatch(fetchCommentsOfPage(pathParams))
    },[currentProfile])
    useLayoutEffect(()=>{
        setRootComments(comments?comments.filter(com=>com.parentId==null):[])
     },[comments])


  

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
    return(<div className="  mx-auto">
  <div className=" max-w-[96vw]  my-8 sm:max-w-[42rem] mx-auto">     
    {title()}
    {pageDiv()}
    
    <CommentThread comments={rootComments}/>
    </div> 
   
</div>)

  

  
    
}
