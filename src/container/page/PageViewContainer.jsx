import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useLayoutEffect, useEffect, useContext } from "react";
import "../../styles/PageView.css";
import PageViewItem from "../../components/page/PageViewItem";
import { getStory } from "../../actions/StoryActions";
import CommentThread from "../../components/comment/CommentThread";
import { postStoryHistory } from "../../actions/HistoryActions";
import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
import ErrorBoundary from "../../ErrorBoundary";
import Context from "../../context";
import { initGA } from "../../core/ga4.js";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import checkResult from "../../core/checkResult.js";
import { IonContent } from "@ionic/react";
import { setComments } from "../../actions/PageActions.jsx";

export default function PageViewContainer() {
  const { setSeo, seo, setError, currentProfile } = useContext(Context);
  const { id } = useParams();
  const dispatch = useDispatch();
  const page = useSelector((state) => state.pages.pageInView);
  const comments = useSelector((state) => state.comments.comments);

  const [pending, setPending] = useState(true);
  const [canUserSee, setCanUserSee] = useState(false);
  const [rootComments, setRootComments] = useState([]);
  const [errorStatus, setErrorStatus] = useState(null);

  useScrollTracking({ name: page ? JSON.stringify(page) : id });

  useLayoutEffect(() => {
    initGA();
  }, []);

  useLayoutEffect(() => {
    if (currentProfile) {
      dispatch(getProfileHashtagCommentUse({ profileId: currentProfile.id }));
    }
    return () => {
      if (currentProfile && page && import.meta.env.VITE_NODE_ENV !== "dev") {
        dispatch(postStoryHistory({ profile: currentProfile, story: page }));
      }
    };
  }, [currentProfile, page]);

  useEffect(() => {
    if (comments?.length) {
      setRootComments(comments.filter((c) => c && c.parentId == null));
    }
  }, [comments]);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    setPending(true);
    setErrorStatus(null);

    try {
      const res = await dispatch(getStory({ id }));

      checkResult(
        res,
        (payload) => {
          if (payload?.story) {
            if (payload.story.comments?.length) {
              dispatch(setComments({ comments: payload.story.comments }));
            }
            setCanUserSee(true);
            setPending(false);
          } else {
            throw new Error("Story not found");
          }
        },
        (err) => {
          // Handle forbidden specifically
          if (err?.response?.status === 403) {
            setCanUserSee(false);
            setErrorStatus(403);
          } else {
            setError(err.message || "Failed to load story");
            setErrorStatus(err?.response?.status || 500);
          }
          setPending(false);
        }
      );
    } catch (error) {
      if (error?.response?.status === 403) {
        setErrorStatus(403);
        setCanUserSee(false);
      } else {
        setError(error.message);
        setErrorStatus(500);
      }
      setPending(false);
    }
  };

  useLayoutEffect(() => {
    if (page) {
      setSeo({
        ...seo,
        title: page.title,
        description: page.description,
      });
    }
  }, [page]);

  const PageDiv = ({ page }) =>
    page ? (
      <PageViewItem page={page} currentProfile={currentProfile} />
    ) : (
      <div className="skeleton w-[96vw] mx-auto md:w-page bg-emerald-50 h-page" />
    );

  return (
    <ErrorBoundary>
      <IonContent fullscreen>
        <div className="ion-padding" style={{ paddingTop: "6rem", paddingBottom: "5rem" }}>
          {pending ? (
            <div className="skeleton bg-slate-50 max-w-[96vw] mx-auto md:w-page h-page" />
          ) : errorStatus === 403 ? (
            <div className="flex max-w-[96vw] mx-auto md:w-page h-page">
              <h1 className="mont-medium my-12 mx-auto text-center text-emerald-800">
                🚫 You don’t have permission to view this story.
              </h1>
            </div>
          ) : canUserSee ? (
            <>
              <PageDiv page={page} />
              <CommentThread page={page} comments={rootComments} />
            </>
          ) : (
            <div className="flex max-w-[96vw] mx-auto md:w-page h-page">
              <h1 className="mont-medium my-12 mx-auto">Took a wrong turn</h1>
            </div>
          )}
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

// import {  useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {  useState ,useLayoutEffect, useEffect, useContext} from "react";
// import "../../styles/PageView.css"
// import PageViewItem from "../../components/page/PageViewItem";
// import { getStory } from "../../actions/StoryActions";
// import CommentThread from "../../components/comment/CommentThread";
// import { postStoryHistory } from "../../actions/HistoryActions";
// import { getProfileHashtagCommentUse } from "../../actions/HashtagActions";
// import ErrorBoundary from "../../ErrorBoundary";
// import Context from "../../context";
// import { initGA} from "../../core/ga4.js";
// import useScrollTracking from "../../core/useScrollTracking.jsx";
// import checkResult from "../../core/checkResult.js";
// import { IonContent } from "@ionic/react";
// import { appendComment, setComments } from "../../actions/PageActions.jsx";
// export default function PageViewContainer(props){
//     const {setSeo,seo,setSuccess,setError,currentProfile}=useContext(Context)
//     const {id} = useParams()
 
//     const page = useSelector(state=>state.pages.pageInView)
//     const comments = useSelector(state=>state.comments.comments)
//     useScrollTracking({name:page?JSON.stringify(page):id})
//     const dispatch = useDispatch()
//     const [pending,setPending]=useState(true)
//     const [canUserSee,setCanUserSee]=useState(false)
    
//     const [rootComments,setRootComments]=useState([])
   
//     useLayoutEffect(()=>{
//         initGA()
    
//            },[])
//     useLayoutEffect(()=>{
//         if(currentProfile){
//             dispatch(getProfileHashtagCommentUse({profileId:currentProfile.id}))
//         }

//         return()=>{
//             if(currentProfile && page){
//                 if(import.meta.env.VITE_NODE_ENV!="dev"){
//                     dispatch(postStoryHistory({profile:currentProfile,story:page}))
             
//                 }
//             }}
//     },[])
//     useEffect(()=>{
//         console.log(comments)
//         if(comments&&comments.length){
//         setRootComments(comments.length?comments.filter(com=>com && com.parentId==null):[])
//         }
//      },[comments])
//     useEffect(()=>{
//     fetchStory()
  
//     },[id])
//     useEffect(()=>{
//         soCanUserSee()
//     },[page])
//     const fetchStory = ()=>{
//         setPending(true)
//         dispatch(getStory({id})).then(res=>{
//             checkResult(res,(payload)=>{
                
//                 if(payload && payload.story && payload.story.comments && payload.story.comments.length>0){
//                 dispatch(setComments({comments:payload.story.comments}))
               
//                 }
//                 setPending(false)
//             },err=>{
//                 setError(err.message)
//             })
//         })
//     }


//      const soCanUserSee=()=>{
//         if(page){
//             if(!page.isPrivate){
//                 setCanUserSee(true)
//                 setPending(false)
//                 return
//             }
//             if(currentProfile){

//             if(page.authorId == currentProfile.id){
//                setCanUserSee(true)
//                setPending(false)
//                 return
//             }
//             if(page.collections){
//                 let col = page.collections.find(col=>col.collection.isPrivate==false)
//                 console.log(col)
//                 if(col){
//                     setCanUserSee(true)
//                     setPending(false)
//                     return
//                 }
//                let role =  page.collections.find(col=>col.collection.roles.find(role=>role.profileId==currentProfile.id))
//                 if(role){
//                     setCanUserSee(true)
//                     setPending(false)
//                     return
//                 }
//             }
       
                
//             if(page.betaReaders){
//                 let found = page && page.betaReaders?page.betaReaders.find(role=>currentProfile && role.profileId==currentProfile.id):null
//                 setCanUserSee(found)
//                 setPending(false)
//                 return
//             }}}}

//     const PageDiv = ({page})=>{
       
//      if(page){

     
//             return(<PageViewItem page={page} currentProfile={currentProfile} />)
//      }else{
//         return (<div><dib className="skeleton w-[96vw] mx-auto md:w-page bg-emerald-50 h-page"/></div>)
//      }
//     }

 

// useLayoutEffect(()=>{
//     if(page){
//         let soo = seo
//         soo.title = page.title
//         soo.description = page.description
//         setSeo(soo)
//     }
// },[])

//     return( <ErrorBoundary>
//         <IonContent fullscreen={true}>
       
//     <div className="ion-padding" style={{paddingTop:"6rem",paddingBottom:"5rem"}}>
//     {canUserSee?
//     <>
//     <PageDiv page={page}/><CommentThread page={page} comments={rootComments}/></>:pending?<div className="skeleton bg-slate-50  max-w-[96vw] mx-auto md:w-page h-page"/>:<div className="flex max-w-[96vw] max-w-[96vw] mx-auto md:w-page h-pag"><h1 className="mont-medium my-12 mx-auto">Took a Wrong turn</h1></div>}
//     </div>
    

    
// </IonContent> </ErrorBoundary>)

// }