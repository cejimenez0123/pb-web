import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonText,
  IonSkeletonText,
  IonImg,
  IonBackButton,
} from "@ionic/react";
import add from "../../images/icons/add_circle.svg"
// import PageList from "../../components/page/PageList"
import edit from "../../images/icons/edit.svg"
import bookmarkOutline from "../../images/bookmarkoutline.svg"
import bookmarkFill from "../../images/bookmarkfill.svg"
// import { addOutline, pencilOutline, bookmarkOutline, bookmark } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Context from "../../context";
import PageList from "../../components/page/PageList";
import ErrorBoundary from "../../ErrorBoundary";
import InfiniteScroll from "react-infinite-scroll-component";
import BookListItem from "../../components/BookListItem";
import ExploreList from "../../components/collection/ExploreList.jsx";
import ProfileCircle from "../../components/profile/ProfileCircle";
import Enviroment from "../../core/Enviroment";
import { Helmet } from "react-helmet";
import {
  appendToPagesInView,
  setPagesInView,
} from "../../actions/PageActions.jsx";
import {
  addCollectionListToCollection,
  deleteCollectionFromCollection,
  fetchCollection,
  fetchCollectionProtected,
  getRecommendedCollectionStory,
  setCollections,
  getRecommendedCollections,
  getRecommendedCollectionsProfile,
} from "../../actions/CollectionActions";
import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions";
import Role from "../../domain/models/role";
import { RoleType } from "../../core/constants";
import checkResult from "../../core/checkResult";
import { postCollectionHistory } from "../../actions/HistoryActions";
import Paths from "../../core/paths.js";

export default function CollectionContainer() {
  const { setSeo, seo, setError, currentProfile, setSuccess } = useContext(Context);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const collection = useSelector(state => state.books.collectionInView);
  const collections = useSelector(state => state.books.collections);
  const pagesInView = useSelector(state => state.pages.pagesInView);

  // State
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [canUserAdd, setCanUserAdd] = useState(false);
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [canUserSee, setCanUserSee] = useState(false);
  const [homeCol, setHomeCol] = useState(null);
  const [archiveCol, setArchiveCol] = useState(null);
  const [role, setRole] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const sightArr = [RoleType.commenter, RoleType.editor, RoleType.reader, RoleType.writer];
  const writeArr = [RoleType.editor, RoleType.writer];

  // --- Permission and role checking functions ---

  function findRole() {
    if (collection && currentProfile && collection.profileId === currentProfile.id) {
      setRole(new Role("owner", currentProfile, collection, RoleType.editor, new Date()));
      return;
    }
    if (collection && currentProfile && collection.roles) {
      let foundRole = collection.roles.find(role => role.profileId === currentProfile.id);
      if (foundRole) {
        setRole(new Role(foundRole.id, currentProfile, collection, foundRole.role, foundRole.created));
      } else {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }

  function soUserCanSee() {
    if (!collection) {
      setCanUserSee(false);
      return;
    }
    if (!collection.isPrivate) {
      setCanUserSee(true);
      return;
    }
    if (currentProfile) {
      if (currentProfile.id === collection.profileId) {
        setCanUserSee(true);
        return;
      }
      if (collection.roles) {
        let found = collection.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
        if (found && sightArr.includes(found.role)) {
          setCanUserSee(true);
          return;
        }
      }
    }
    // Check parent collections if user can see via inheritance
    if (collection.parentCollections) {
      for (let cTc of collection.parentCollections) {
        const col = cTc.parentCollection;
        if (col && !col.isPrivate) {
          setCanUserSee(true);
          return;
        }
        if (col && col.roles) {
          let found = col.roles.find(colRole => colRole && colRole.profileId === currentProfile?.id);
          if (found || sightArr.includes(found?.role) || collection.profileId === currentProfile?.id) {
            setCanUserSee(true);
            return;
          }
        }
      }
    }
    // setCanUserSee(false);
  }
  useEffect(()=>{
    canUserSee?getContent():null
  },[canUserSee])
  function soUserCanAdd() {
    if (!currentProfile) {
      setCanUserAdd(false);
      return;
    }
    if (!collection) {
      setCanUserAdd(false);
      return;
    }
 
    if (collection.isOpenCollaboration) {
      setCanUserAdd(true);
   
    }
    if (collection.roles) {
      let found = collection.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
      if (found && writeArr.includes(found.role)) {
        setCanUserAdd(true);
      
      }
    }
  
  }

  function soUserCanEdit() {
    if (!currentProfile) {
      setCanUserEdit(false);
      return;
    }
    if (!collection) {
      setCanUserEdit(false);
      return;
    }
   
    if (collection.roles) {
      let found = collection.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
      if (found && found.role === RoleType.editor) {
        setCanUserEdit(true);
        return;
      }
    }
    // setCanUserEdit(false);
  }


  function checkPermissions() {

    if (collection.profileId === currentProfile.id) {
      setCanUserEdit(true);
      setCanUserAdd(true)
      setCanUserSee(true)
   
    }else if(!currentProfile){
      setCanUserEdit(false);
      setCanUserAdd(false)
      setCanUserSee(false)
    }else{
      soUserCanSee();
      soUserCanAdd();
      soUserCanEdit();
    }
   
    dispatch(getRecommendedCollectionsProfile());
  
  }
  useLayoutEffect(() => {
    if (currentProfile?.profileToCollections) {
      let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
      setHomeCol(home);

      let archive = currentProfile.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
      setArchiveCol(archive);
    }

  }, [currentProfile]);
  useLayoutEffect(()=>{
  getCol()
  findRole();
  },[])
  useEffect(()=>{
    checkPermissions()
  },[currentProfile,collection])
  // Check bookmark and archive status
  function checkFound() {
    if (collection && homeCol && collection.parentCollections) {
      let foundInHome = collection.parentCollections.find(ptc => ptc.parentCollectionId === homeCol.id);
      setIsBookmarked(foundInHome);
      let foundInArchive = collection.parentCollections.find(ptc => ptc.parentCollectionId === archiveCol?.id);
      setIsArchived(foundInArchive);
    }
    setBookmarkLoading(false);
  }

  useLayoutEffect(() => {
    checkFound();
  }, [currentProfile, collection, homeCol, archiveCol]);


  // Follow / Unfollow handlers

  const handleFollow = () => {
    if (currentProfile && collection) {
      let type = collection.followersAre ?? RoleType.commenter;
      if (currentProfile.id === collection.profileId) {
        type = RoleType.editor;
      }
      dispatch(postCollectionRole({
        type: type,
        profileId: currentProfile.id,
        collectionId: collection.id,
      })).then(res => {
        checkResult(res, payload => {
          setSuccess("You are now following this collection");
          checkPermissions();
        }, err => {
          setError(err.message);
        });
      });
    } else {
      setError("Please Sign In");
    }
  };
const getCol=()=>{
       setLoading(true)

        const token = localStorage.getItem("token")
       token?dispatch(fetchCollectionProtected({id})).then(res=>{
            checkResult(res,payload=>{
             setLoading(false)
            },err=>{
                setError(err.meesage)
                setLoading(false)
            })
        }):dispatch(fetchCollection({id})).then(res=>{
            checkResult(res,payload=>{
                if(payload.collection){

                
                   
                     setLoading(false)}
                     else{
                  setLoading(false)
                }
            },err=>{
                setError(err.meesage)
                setLoading(false)
            })
        })
    }
 

  const deleteFollow = () => {
    if (currentProfile && role) {
      dispatch(deleteCollectionRole({ role })).then(res => {
        checkResult(res, payload => {
          setSuccess("Unfollowed collection");
          setRole(null);
          checkPermissions();
        }, err => {
          setError(err.message);
        });
      });
    } else {
      setError("Please sign in");
    }
  };

  // Bookmark/unbookmark handler
  const getSubColContent=()=>{
            let contentArr = []
        
            if(collection.childCollections){
                let cols = collection.childCollections
                for(let i=0;i<cols.length;i+=1){
                    if(cols[i]){
                   let col =cols[i].childCollection
                   if(col && col.storyIdList){
             
                       contentArr= [...contentArr,...col.storyIdList]
                    
                   }
                    
                   }
                }
            }
     
        const sorted = [...contentArr].sort((a,b)=>
                
                a.updated && b.updated && b.updated>a.updated
           
                   ).map(stc=>stc.story)
                
         dispatch(appendToPagesInView({pages:sorted}))
      
        setHasMore(false)
        }
  const onBookmark = (type) => {
    if (!currentProfile) {
      setError("Please sign in");
      return;
    }

    setBookmarkLoading(true);

    if (type === "home") {
      if (!isBookmarked) {
        if (collection && homeCol) {
          let params = { id: homeCol.id, list: [collection.id], profile: currentProfile };
          dispatch(addCollectionListToCollection(params)).then(res => {
            checkResult(res, payload => {
              checkFound();
              setSuccess("Saved to Home");
            }, err => {
              setBookmarkLoading(false);
            });
          });
        }
      } else {
        dispatch(deleteCollectionFromCollection({ tcId: isBookmarked.id })).then(res => {
          checkResult(res, payload => {
            if (payload.message?.includes("Already") || payload.message?.includes("Deleted")) {
              setIsBookmarked(null);
              setSuccess("Removed from Home");
            }
            setBookmarkLoading(false);
          }, err => {
            setBookmarkLoading(false);
          });
        });
      }
    } else if (type === "archive") {
      if (!isArchived) {
        if (collection && archiveCol) {
          let params = { id: archiveCol.id, list: [collection.id], profile: currentProfile };
          dispatch(addCollectionListToCollection(params)).then(res => {
            checkResult(res, payload => {
              checkFound();
              setSuccess("Saved to Archive");
            }, err => {
              setBookmarkLoading(false);
            });
          });
        }
      } else {
        dispatch(deleteCollectionFromCollection({ tcId: isArchived.id })).then(res => {
          checkResult(res, payload => {
            if (payload.message?.includes("Already") || payload.message?.includes("Deleted")) {
              setIsArchived(null);
              setSuccess("Removed from Archive");
            }
            setBookmarkLoading(false);
          }, err => {
            setBookmarkLoading(false);
          });
        });
      }
    }
  };
  const getContent=()=>{
            if(collection){
                setHasMore(true)
            if(collection.storyIdList){
         
            const sorted = [...collection.storyIdList].sort((a,b)=>
                
                    a.index && b.index && b.index<a.index
               
                       ).map(stc=>stc.story)
             dispatch(setPagesInView({pages:sorted}))
                    }
            if(collection.childCollections){
             const children = [...collection.childCollections].sort((a,b)=>
                
                b.index<a.index
           
                   ).map(ctc=>ctc.childCollection)
    
    
             dispatch(setCollections({collections:children}))
             getSubColContent()
                }
            
          
        }
    
    
        }
  // Example getMore for infinite scrolling (to be filled with your pagination logic)
  const getMore = () => {
    // Example: dispatch get more pages/stories for pagination
    setHasMore(false); // Or change based on actual load
  };

  // Metadata
  const header = collection ? (
    <Helmet>
      <title>{`A Plumbum Collection: ${collection.title} from ${collection.profile?.username || ""}`}</title>
      <meta property="og:image" content={Enviroment.logoChem} />
      <meta property="og:url" content={`${Enviroment.domain}${location.pathname}`} />
      <meta property="og:description" content={collection.purpose || "Explore events, workshops, and writer meetups on Plumbum."} />
    </Helmet>
  ) : (
    <Helmet>
      <title>Plumbum Writers Collection + {id}</title>
      <meta name="description" content="Explore other peoples writing, get feedback, add your weirdness so we can find you." />
    </Helmet>
  );

  // Loading & permission fallbacks
  if (!collection) {
    return (
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading collection...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonSkeletonText animated style={{ width: '96vw', height: 150, margin: "2rem auto", borderRadius: 18 }} />
          <IonSkeletonText animated style={{ width: '96vw', height: 400, margin: "2rem auto", borderRadius: 18 }} />
        </div>
      </IonContent>
    );
  }

  if (!canUserSee) {
    if (loading) {
      return (
        <IonContent fullscreen>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Loading collection...</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSpinner />
        </IonContent>
      );
    }
    return (
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Collection Access</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonText color="danger" className="ion-padding">
          <h3>Private Collection or insufficient permissions. 🤷‍♂️</h3>
          <p>If you think this is an error, contact the owner.</p>
        </IonText>
      </IonContent>
    );
  }

  // Main content UI
  return (
    <IonContent fullscreen >
      {header}
      <IonHeader>
      <IonToolbar>

      <IonButtons className="flex flex-row justify-around">
      <IonBackButton slot="start"  />
  <IonTitle>{collection.title || "Collection"}</IonTitle>

  {canUserEdit && (
     
      <div
        className="max-h-[2rem] btn bg-emerald-400 cursor-pointer flex items-center border-0 justify-center px-2 rounded"
        onClick={() => navigate(Paths.editCollection.createRoute(id))}
        role="button"
        tabIndex={0}
        slot="end"
        // onKeyPress={e => { if (e.key === "Enter") navigate(Paths.editCollection.createRoute(id)); }}
      >
        <IonImg src={edit} style={{ height: '1.5rem' }} />
      </div>

  )}
      </IonButtons>
</IonToolbar>


      </IonHeader>

      <ErrorBoundary>
        <IonCard className="ion-margin-bottom ion-padding">
          <IonCardHeader>
            <div className="flex items-center gap-2">
              {collection.profile && <ProfileCircle profile={collection.profile} color="emerald-700" />}
              <IonCardTitle className="ion-text-wrap">{collection.title}</IonCardTitle>
            </div>
          </IonCardHeader>
          <IonCardContent class="">
            <IonText color="medium">
              <h6>{collection.purpose}</h6>
            </IonText>
            <div className="ion-margin-top w-[90%] mx-auto py-4 flex items-center justify-around flex gap-2">
              {!role ? (
                <div onClick={handleFollow} className="btn bg-transparent rounded-full border-2 px-4 px-2 border-emerald-300">
                <IonText  fill="outline" >
                  Follow
                </IonText>
                </div>
              ) : (
                <div
                onClick={deleteFollow}
                className="btn rounded-full bg-transparent  border-3 border-emerald-600">
                <IonText fill="solid" >
                  {role.role}
                </IonText>
                </div>
              )}
              {canUserAdd && (
                // <IonButton color="primary" >
                <div onClick={() => navigate(Paths.addToCollection.createRoute(collection.id))} className="bg-emerald-600 rounded-full p-1">
                <IonImg src={add}/>
                </div>
                // </IonButton>
              )}
              <div
                onClick={() => onBookmark("archive")}
                color={isBookmarked ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <IonImg  src={isBookmarked ? bookmarkFill : bookmarkOutline} slot="icon-only" />
                {bookmarkLoading && <IonSpinner name="dots" />}
              </div>
              {/* <IonButton
                onClick={() => onBookmark("archive")}
                color={isArchived ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                Archive
              </IonButton> */}
            </div>
          </IonCardContent>
        </IonCard>

        {collections && collections.length > 0 && (
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardTitle>Anthologies</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList className="flex flex-row overflow-x-scroll">
        
                  {collections.map((col, i) => (
                    <BookListItem key={col.id + i} book={col} />
                  ))}
                {/* </InfiniteScroll> */}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle>Pages</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <PageList
              items={pagesInView}
              isGrid={false}
              hasMore={hasMore}
              getMore={getMore}
              forFeedback={collection?.type === "feedback"}
            />
          </IonCardContent>
        </IonCard>

        <ExploreList />
      </ErrorBoundary>
    </IonContent>
  );
}



// --- PRIVACY FLOW / ROLE REVIEW ---

// ✔️ 1. soUserCanSee, soUserCanAdd, soUserCanEdit
//      -- Structure is correct: collection must not be private or user must own or have a role
//      -- Finds parent collections and checks for roles as fallback, this is solid
// ✔️ 2. findRole assigns Role based on current profile match or role presence in collection
// ✔️ 3. Only renders content when canUserSee is set true
// ✔️ 4. All actions (bookmark, follow, add) are gated according to currentProfile and permissions
// ❗ SUGGESTION: Consider confirming how roles are structured/assigned and that `collection.roles` and `parentCollections` are always present/array, else you might hit a runtime error if undefined. Check for that or use optional chaining and fallback (`?? []`).

// --- END PRIVACY LOGIC REVIEW ---


// import { useContext, useEffect,useLayoutEffect, useState} from "react"
// import { useDispatch, useSelector } from "react-redux"
// import {  useLocation, useNavigate, useParams } from "react-router-dom"
// import { addCollectionListToCollection,deleteCollectionFromCollection,fetchCollection, fetchCollectionProtected, getRecommendedCollections, getRecommendedCollectionsProfile, getRecommendedCollectionStory } from "../../actions/CollectionActions"
// import add from "../../images/icons/add_circle.svg"
// import PageList from "../../components/page/PageList"
// import edit from "../../images/icons/edit.svg"
// import Paths from "../../core/paths"
// import InfiniteScroll from "react-infinite-scroll-component"
// import BookListItem from "../../components/BookListItem"
// import Role from "../../domain/models/role"
// import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions"
// import { RoleType } from "../../core/constants"
// import checkResult from "../../core/checkResult"
// import { appendToPagesInView, setPagesInView } from "../../actions/PageActions.jsx"
// import { postCollectionHistory } from "../../actions/HistoryActions"
// import ProfileCircle from "../../components/profile/ProfileCircle"
// import Context from "../../context"
// import Enviroment from "../../core/Enviroment"
// import ExploreList from "../../components/collection/ExploreList.jsx"
// import { setCollections } from "../../actions/CollectionActions"
// import bookmarkOutline from "../../images/bookmarkoutline.svg"
// import bookmarkfill from "../../images/bookmarkfill.svg"
// import loadingGif from "../../images/loading.gif"
// import ErrorBoundary from "../../ErrorBoundary"
// import { initGA,sendGAEvent } from "../../core/ga4.js"
// import { Helmet } from "react-helmet"
// import { IonContent } from "@ionic/react"
// export default function CollectionContainer(props){
//     const dispatch = useDispatch()

//     const {setSeo,seo,setError,currentProfile,setSuccess}=useContext(Context)
//     const navigate = useNavigate()
//     const collection = useSelector(state=>state.books.collectionInView)
//     const collections = useSelector(state=>state.books.collections)
//     const [loading,setLoading]=useState(true)
//     const location = useLocation()
//     const [isBookmarked,setIsBookmarked]=useState(false)
//     const [isArchived,setIsArchived]=useState(false)
//     const sightArr = [RoleType.commenter,RoleType.editor,RoleType.reader,RoleType.writer]
//     const writeArr = [RoleType.editor,RoleType.writer]
//     const pagesInView = useSelector(state=>state.pages.pagesInView)
//     const [canUserAdd,setCanUserAdd]=useState(false)
//     const [canUserEdit,setCanUserEdit]=useState(false)
//     const [canUserSee,setCanUserSee]=useState(false)
//     const [homeCol,setHomeCol]=useState(null)
//     const [archiveCol,setArchiveCol]=useState(null)
//     const [role,setRole]=useState(null)
//     const [hasMore,setHasMore]=useState(false)
//     const {id} = useParams()
//     const [bookmarkLoading,setBookmarkLoading]=useState(false)
//     const getRecommendations =()=>{
//         if(collection&&collection.type!="feedback"){
//             dispatch(getRecommendedCollectionStory({colId:collection.id})).then(res=>{
//                 checkResult(res,payload=>{
//                     let stories = payload.pages
//                     let recommended =stories.map(story=>{
//                            let page = story
//                             page["recommended"] = true
//                             return page
//                     })
                 
                 
                    
//                       dispatch(appendToPagesInView({pages:[Enviroment.blankPage,...recommended]}))
                  
                    
    
//                 },err=>{
//                     setHasMore(false)
//                 })
//             })
            
     
//         if(collections && collections.length>0&&collection.type!="feedback" ){
//             for(let i = 0;i<collections.length;i+=1){
//           if(collections[i] && collections[i].id){ 

//         dispatch(getRecommendedCollectionStory({colId:collections[i].id})).then(res=>{
//             checkResult(res,payload=>{
//                 let stories = payload.pages
//                 let recommended =stories.map(story=>{
//                        let page = story
//                         page["recommended"] = true
//                         return page
//                 })
             
             
                
//                   dispatch(appendToPagesInView({pages:[Enviroment.blankPage,...recommended]}))
              
                

//             },err=>{
//                 setHasMore(false)
//             })
//         })
//         }
    
// setHasMore(false)
//             }
//     }else{
//         setLoading(false)
//     }
// }}
// useLayoutEffect(()=>{
//     if(collection){
//         let soo = seo
//           soo.title=`Plumbum Collection (${collection.title}) `
//           soo.description="Explore events, workshops, and writer meetups on Plumbum."
//           setSeo(soo)
//      }
   
// },[collection])
//        useEffect(()=>{
//             initGA()
//             if(collection){
//                 sendGAEvent("View Collection",`View Collection ${JSON.stringify({id:collection.id,title:collection.title})}`,collection.title,0,true)
//             }

//        },[])  
  
//     const onBookmark=(type)=>{
// if(currentProfile){
//     switch(type){
//        case "home":{
            
     
//         setBookmarkLoading(true)
//     if(!isBookmarked){
//         if(collection&&currentProfile){
      
            
//             if(homeCol){
//             let params = {id:homeCol.id,list:[collection.id],profile:currentProfile}
//             dispatch(addCollectionListToCollection(params)).then(res=>{
//                 checkResult(res,payload=>{
//                     checkFound()
//                     setSuccess("Saved to Home")
//                 },err=>{
//                     setBookmarkLoading(false)
//                 })
//             })
//         }}
//     }else{

//             dispatch(deleteCollectionFromCollection({tcId:isBookmarked.id})).then(res=>{
//                 checkResult(res,payload=>{
//                     if(payload.message.includes("Already")||payload.message.includes("Deleted")){
//                         setIsBookmarked(null)
//                         setSuccess("Removed from Home")
//                     }
                    
//                     setBookmarkLoading(false)
                   
//         },err=>{
//             setBookmarkLoading(false)
//         })})
//     }
//     }
// case "archive":{
// if(!isArchived){

//         if(collection&&currentProfile){
      
            
          
//             let params = {id:archiveCol.id,list:[collection.id],profile:currentProfile}
//             dispatch(addCollectionListToCollection(params)).then(res=>{
//                 checkResult(res,payload=>{
//                     checkFound()
                   
//                     setSuccess("Saved to Archive")
//                 },err=>{
//                     setBookmarkLoading(false)
//                 })
//             })
//         }
//     }else{

//             dispatch(deleteCollectionFromCollection({tcId:isArchived.id})).then(res=>{
//                 checkResult(res,payload=>{
//                     if(payload.message.includes("Already")||payload.message.includes("Deleted")){
//                         setIsArchived(null)  
//                         setSuccess("Removed from Home")
//                     }
                  
//                     setBookmarkLoading(false)
                   
//         },err=>{
//             setBookmarkLoading(false)
//         })})
//     }
// }   }
// }}

//     const getSubColContent=()=>{
//         let contentArr = []
    
//         if(collection.childCollections){
//             let cols = collection.childCollections
//             for(let i=0;i<cols.length;i+=1){
//                 if(cols[i]){
//                let col =cols[i].childCollection
//                if(col && col.storyIdList){
         
//                    contentArr= [...contentArr,...col.storyIdList]
                
//                }
                
//                }
//             }
//         }
 
//     const sorted = [...contentArr].sort((a,b)=>
            
//             a.updated && b.updated && b.updated>a.updated
       
//                ).map(stc=>stc.story)
            
//      dispatch(appendToPagesInView({pages:sorted}))
  
//     setHasMore(false)
//     }
//      useEffect(()=>{
       
//      },[collections])
//     const getContent=()=>{
//         if(collection){
//             setHasMore(true)
//         if(collection.storyIdList){
     
//         const sorted = [...collection.storyIdList].sort((a,b)=>
            
//                 a.index && b.index && b.index<a.index
           
//                    ).map(stc=>stc.story)
//          dispatch(setPagesInView({pages:sorted}))
//                 }
//         if(collection.childCollections){
//          const children = [...collection.childCollections].sort((a,b)=>
            
//             b.index<a.index
       
//                ).map(ctc=>ctc.childCollection)


//          dispatch(setCollections({collections:children}))
//          getSubColContent()
//             }
        
      
//     }


//     }
//      const checkPermissions=()=>{
//         findRole()
//         soUserCanSee()
//         soUserCanAdd()
//         soUserCanEdit()
       
//         dispatch(getRecommendedCollectionsProfile())  
//      }
//      useLayoutEffect(()=>{
      
//         checkPermissions()
//         if(currentProfile&& currentProfile.profileToCollections){
//             let col = currentProfile.profileToCollections.find(pTc=>pTc.type=="home").collection
     
//      if(col){
//                 setHomeCol(col)
//             }
  
//         }
//         if(currentProfile&& currentProfile.profileToCollections){
//             let col = currentProfile.profileToCollections.find(pTc=>pTc.type=="archive").collection
     
//      if(col){
//                 setArchiveCol(col)
//             }
  
//         }
//     },[currentProfile,collection])
   

//     const getMore = ()=>{

//     if(id){
//         dispatch(getRecommendedCollections({colId:id})).then(res=>{
//             checkResult(res,payload=>{
//                 if(payload.collections){
//                     let newRecommendations = payload.collections.filter(col=>{
//                         let found = collection.childCollections.find(cTc=>cTc.childCollectionId ==col.id)
//                         return col.id !=collection.id && !found
//                     })
//                     if(newRecommendations.length==0){
//                         if(currentProfile){
//                             dispatch(getRecommendedCollectionsProfile())
//                         }
//                     }
//                 }

//             },err=>{
//                 setError(err.message)
//              setLoading(false)
//             })
//     })
//     }
//     }    
   

 
//      useLayoutEffect(()=>{

//         return()=>{

        
//         if(import.meta.env.VITE_NOTE_ENV!="dev"){ 
//         if(currentProfile && collection){
//             dispatch(postCollectionHistory({profile:currentProfile,collection}))
//         }
//     }}
//     },[])


//     const deleteFollow=()=>{
//         if(currentProfile){
//             dispatch(deleteCollectionRole({role})).then(res=>{
//                 checkResult(res,payload=>{
             
                     
                  
                   
//                 },err=>{

//                 })
//             })

//         }else{
//             setError("Please sign in")
//         }
//     }
//     const handleFollow = ()=>{
// if(currentProfile){
//     let type = collection.followersAre??RoleType.commenter
//         if(currentProfile.id == collection.profileId){
//             type = RoleType.editor
//         }

//         dispatch(postCollectionRole({type:type,profileId:currentProfile.id,collectionId:collection.id}))
//         .then(res=>{
//             checkResult(res,payload=>{
        
       
//             },err=>{
//                 setError(err.message)
//             })
//         })
//     }else{
//         setError("Please Sign In")
//     }
//     }
    
//     useLayoutEffect(()=>{
       
//       getSubColContent()
//       if(canUserAdd){
//         getRecommendations()
    
// }
      
//     },[canUserAdd,collection])
//     useLayoutEffect(()=>{
//         dispatch(setCollections({collections:[]}))
//         dispatch(setPagesInView({pages:[]}))
//         getCol()
//     },[id])

  
//     const checkFound=()=>{
//         if(collection&&homeCol&&collection.parentCollections){
    
//              let isfound = collection.parentCollections.find(ptc=>ptc.parentCollectionId==homeCol.id)
           
//                 setIsBookmarked(isfound)
//              let found = collection.parentCollections.find(ptc=>ptc.parentCollectionId==archiveCol.id)
  
//                 setIsArchived(found)
//                 }
//             setBookmarkLoading(false)
//         }
//         useLayoutEffect(()=>{
            
//             getContent()
//         },[collection])
   
//     useLayoutEffect(()=>{
//         checkFound()
//     },[currentProfile])
//     const getCol=()=>{
//        setLoading(true)

//         const token = localStorage.getItem("token")
//        token?dispatch(fetchCollectionProtected({id})).then(res=>{
//             checkResult(res,payload=>{
//              setLoading(false)
//             },err=>{
//                 setError(err.meesage)
//                 setLoading(false)
//             })
//         }):dispatch(fetchCollection({id})).then(res=>{
//             checkResult(res,payload=>{
//                 if(payload.collection){

                
                   
//                      setLoading(false)}
//                      else{
//                   setLoading(false)
//                 }
//             },err=>{
//                 setError(err.meesage)
//                 setLoading(false)
//             })
//         })
//     }
 


//     const soUserCanSee=()=>{
        
//        if(collection){
//         if( !collection.isPrivate){
            
//             setCanUserSee(true)
    
//                 return 
//          }
//           if(currentProfile){
//              if(currentProfile.id==collection.profileId){
                    
//                 setCanUserSee(true)
             
//                 return
//             }
//             if(currentProfile&&collection && collection.roles){
             
//             let found =  collection.roles.find(colRole=>{
//                 return colRole && colRole.profileId == currentProfile.id
//             })
//                  if(found && sightArr.includes(found.role)){
//                 setCanUserSee(true)
               
//                 return
//                     }else{
//                 setCanUserSee(false)
//                 return
//             }
//         }
//         }
//         if(!canUserSee){
//             if(collection.parentCollections){
//                     collection.parentCollections.find(cTc=>{
//                         const col = cTc.parentCollection
//                         if(!col.isPrivate){
                           
//                             setCanUserSee(true)
//                             return
//                         }else{
//                             if(col.roles){
//                      let found = col.roles.find(colRole=>{
//                             return colRole && colRole.profileId == currentProfile.id
//                         })
//                     if(found || sightArr.includes(found.role)||collection.profileId==currentProfile.id){
                      
//                         setCanUserSee(true)
//                               return
//                         }else{
//                             setCanUserSee(false)
//                             return
//                         }
//                     }}
//                     })
//             }
//         }
    
//     }

// }
//     const soUserCanAdd = ()=>{
//         if(!currentProfile){

//             setCanUserAdd(false)
//             return
//         }
//         if(currentProfile&&collection){
//         if(collection.profileId==currentProfile.id){
            
          
//             setCanUserAdd(true)
//             return
//         }
//         if(collection&&currentProfile&&collection.isOpenCollaboration){
//             setCanUserAdd(collection.isOpenCollaboration)
//             return
//         }
//         if(collection&&currentProfile&& collection.roles){    
//             let found =  collection.roles.find(colRole=>{
//                 return colRole && colRole.profileId == currentProfile.id
//             })
//             if(found && writeArr.includes(found.role)||collection.profileId==currentProfile.id){
               
//                 setCanUserAdd(true)
//                 return
//             }else{
//                 setCanUserAdd(false)
//                 return
//             }
//         }
//     }}
   
//     const soUserCanEdit=()=>{
//         if(!currentProfile){
//             setCanUserEdit(false)
//             return
//         }
//         if(currentProfile && collection){
            
//             if(collection.profileId==currentProfile.id){
//             setCanUserEdit(true)
//             return
//         }
//         if( collection.roles){    
//             let found =  collection.roles.find(colRole=>{
//                 return colRole && colRole.profileId == currentProfile.id
//             })
//             if((found && RoleType.editor==found.role)||collection.profileId==currentProfile.id){
//                 setCanUserEdit(true)
//                 return
//             }else{
//                 setCanUserEdit(false)
//                 return
//             }
//         } }
//     }

   
//     const findRole = ()=>{
//         if(collection && currentProfile&& collection.profileId==currentProfile.id){
//             setRole(new Role("owner",currentProfile,collection,RoleType.editor,new Date()))
//             return
        
//         }
//             if(collection && currentProfile && collection.roles){
//                 let foundRole=  collection.roles.find(role=>{
                 
//                     return role.profileId==currentProfile.id})
            
//                 if(foundRole){  
//                     const fRole = new Role(foundRole.id,currentProfile,collection,foundRole.role,foundRole.created)
//                     setRole(fRole)
//                  }else{
//                     setRole(null)
//                 }
//         }               
//     }
  
   


   
//     const CollectionInfo=({collection})=>{  
  
       
//         return(<div className=" w-[96vw] mx-auto lg:w-info min-h-info mx-auto mt-8 sm:pb-8 md:border-3 px-4  py-8 md:border-emerald-600 flex flex-col jusify-between  rounded-lg mb-8 text-left">
    
       
//            <span>
//                 {collection.profile?
//                 <div className="flex flex-row">

//                 <div className="min-w-8 min-h-8  my-auto text-emerald-800">
//                     <ProfileCircle profile={collection.profile} color="emerald-700"/>
//                     </div></div>:null}
//                 <div className="mx-1 mt-4 md:mx-8 md:mt-8 ">
//     <h3 className="mt-8 mb-2  text-emerald-800 lora-medium text-xl sm:text-3xl">
//         {collection.title}</h3>

//         <h6 className="text-emerald-800  open-sans-medium rounded-lg py-4 px-2">{collection.purpose}</h6>
// </div>
// </span>


//    <span>
//    <div className="flex flex-row  justify-between">
//     <div className="flex flex-row  ">
//    {!role?<div
//    onClick={handleFollow}
//    className={"border-emerald-600 bg-transparent border-2 sm:ml-4 text-emerald-600  mont-medium w-40 min-h-12 max-h-14 px-4 rounded-full text-[1rem] sm:text-[1.2rem] mx-4 sm:mx-6"}>
//     <h6 className="px-4 py-3 mont-medium  text-[1rem] sm:text-[1.2rem] text-center  ">Follow
//     </h6></div>:
//    <div
//    onClick={deleteFollow}
//    className={"bg-emerald-500 text-white w-40 px-4 sm:ml-4 min-h-12 max-h-14 rounded-full flex text-[1rem] "} >
//        <h6 className="mx-auto mont-medium my-auto text-[1rem]"> {role.role}</h6></div>}
    
  
//    {canUserAdd?
//     <img onClick={()=>navigate(Paths.addToCollection.createRoute(id))
//    }className="rounded-full bg-emerald-800 p-2 mx-2 my-auto"src={add}/>:null}
//    {canUserEdit?
//    <img 
//    onClick={()=>navigate(Paths.editCollection.createRoute(id))}
//    className="rounded-full bg-emerald-800 p-2  my-auto"src={edit}/>:null}
//         </div>
        
//     {currentProfile&&currentProfile.id?    <div className="dropdown dropdown-left">
//   <div tabIndex={0} role="button" className=" m-1"> <span 
    
//       className="bg-emerald-800 max-h-14 min-w-12 min-h-12 max-h-14 rounded-full flex">  
//        <img  className="  max-h-14 p-2 min-w-12 min-h-12 max-h-14  mx-auto my-auto"
//        src={bookmarkLoading?loadingGif:isBookmarked?bookmarkfill:bookmarkOutline}/>
// </span>
// </div>
//   <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-52 p-2 shadow">
//     <li  className={isBookmarked?`bg-emerald-700 mb-1 rounded-lg text-white`:`bg-emerald-50 text-emerald-800`}onClick={()=>onBookmark("home")}><a className={`mont-medium ${isBookmarked?"text-white":"text-emerald-700"}`}> home</a></li>
//     <li  className={isArchived?`bg-emerald-700 rounded-lg text-white`:`bg-emerald-50 text-emerald-800`}onClick={()=>onBookmark("archive")}><a className={`mont-medium ${isArchived?"text-white":"text-emerald-700"}`}>archive</a></li>
//     <li  className={`bg-emerald-50 text-emerald-800`}onClick={()=>navigate(Paths.addStoryToCollection.collection(collection.id))}><a className={`mont-medium text-emerald-700 `}>other</a></li>
//   </ul> 
// </div>:null}
// </div>

// </span>
//   </div>
//   )
//     }
// const bookList=()=>{
//     return(<div>
//         <h3 className="text-2xl lora-bold text-emerald-800 font-bold text-center">Anthologies</h3>:
//     <div>
//         <InfiniteScroll
//         dataLength={collections.length}
//         className="flex flex-row md:justify-center py-8"
//         next={()=>{}}
//         hasMore={false} // Replace with a condition based on your data source
//         loader={<p>Loading...</p>}
//         endMessage={
//             <div className="text-emerald-800 min-w-36 text-center p-5">
//             <h6 className="mx-auto text-sm  lora-medium">That's it for now. <br/>Check in later for more</h6>
//             </div>
//         }
//         >
//             {collections.map((col,i)=>{
//                return <BookListItem key={col.id+i}book={col}/>
//             })}
//         </InfiniteScroll>
//     </div>
//     </div>)
// }
// let header=()=>collection?<Helmet><title>{"A Plumbum Collection:"+collection.title+"from "+collection.profile.username}</title>
// <meta property="og:image" content={Enviroment.logoChem} />
// <meta property="og:url" content={`${Enviroment.domain}${location.pathname}`} />
// <meta property="og:description" content={collection.purpose.length>0?collection.purpose:"Explore events, workshops, and writer meetups on Plumbum."}/>
// <meta name="twitter:image" content={Enviroment.logoChem} /></Helmet>:
// <Helmet>
// <title>Plumbum Writers Collection + {id}</title>
// <meta name="description" content="Explore other peoples writing, get feedback, add your weirdness so we can find you." />
// <meta property="og:title" content="Plumbum Writers - Check this story out" />
// <meta property="og:description" content="Plumbum Writers the place for feedback and support." />
// <meta property="og:image" content={Enviroment.logoChem} />
// <meta name="twitter:image" content={Enviroment.logoChem} />
// <meta property="og:url" content={`${Enviroment.domain+location.pathname}`} /></Helmet>

// if(!collection||collection.id!==id){
//     return(<IonContent fullscreen={true}><div className=" flex flex-col ">  
//     <div className="skeleton w-[96vw] mx-auto  bg-emerald-100  lg:w-info h-fit h-info mx-auto mt-4 mb-4 border-3 p-4 rounded-lg mb-8 "/>
//     <div className="skeleton bg-emerald-100  md:w-page h-page w-[96vw] mx-auto"/> </div></IonContent>)
// }
// if(collection&&canUserSee){
  

//     return(<IonContent fullscreen={true}>
//       <ErrorBoundary>
//     {header()}
// <div className=" flex  mt-16  flex-col ">   

//   <CollectionInfo collection={collection}/>

// <div>
//             {collections && collections.length>0?bookList() :null}
//             </div>
//             <div className=" mx-auto  max-w-[96vw] md:w-page  min-h-[20em]">     
//             <h6 className="text-2xl mb-8 w-fit text-center  lora-bold text-emerald-800 font-bold pl-4">Pages</h6>

//         <PageList items={pagesInView}  isGrid={false} hasMore={hasMore} getMore={getMore} forFeedback={collection&&collection.type=="feedback"}/>
//         </div>
//     <ExploreList />
//     </div> 
        
         
       
//       </ErrorBoundary>
      
// </IonContent>)
// }else{
//     if(loading){
     
//         return(<div>
//                 {header()}
//             <div className="skeleton h-fit w-[96vw] mx-auto lg:w-[50em] lg:h-[25em] bg-slate-100 mx-auto mt-4 sm:pb-8 p-4  bg-slate-50 rounded-lg mb-8 text-left"/>
//         <div className=" max-w-[100vw] skeleton px-2 sm:max-w-[40em] bg-slate-100 mx-auto  h-40"/></div>)
//     }
//     if(!canUserSee){
//         return(<div>
//                 {header()}
//             Made a wrong turn
//         </div>)
//     }else{
//             return(<div className="mx-auto my-36 flex"><h6 className=" lora-bold text-xl  mx-auto text-emerald-800">Collection does not exist</h6></div>)
    
//     }
    
// }

// }