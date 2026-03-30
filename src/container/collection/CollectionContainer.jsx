import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  
  IonContent,

  IonSpinner,
  
  IonCardContent,
  IonList,
  IonText,
  IonSkeletonText,
  IonImg,

  useIonRouter,
 
} from "@ionic/react";
import edit from "../../images/icons/edit.svg"

import { AnimatePresence, motion } from "framer-motion";
import add from "../../images/icons/add_circle.svg"
import archive from "../../images/icons/archive.svg"

import { useDispatch, useSelector } from "react-redux";

import PageList from "../../components/page/PageList";
import ErrorBoundary from "../../ErrorBoundary";
import {BookListItem,BookListItemShadow} from "../../components/BookListItem";
import ExploreList from "../../components/collection/ExploreList.jsx";
import bookmarkOutline from "../../images/bookmark_add.svg"
import bookmarkFill from "../../images/bookmark_fill_green.svg"
import {
  addCollectionListToCollection,
  deleteCollectionFromCollection,
  fetchCollection,
  fetchCollectionProtected,
} from "../../actions/CollectionActions";
import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions";
import Role from "../../domain/models/role";
import { RoleType } from "../../core/constants";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { useParams } from "react-router";
import Context from "../../context.jsx";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult.js";
import { setPagesInView } from "../../actions/PageActions.jsx";
import ProfileCircle from "../../components/profile/ProfileCircle.jsx";
import Enviroment from "../../core/Enviroment.js";

export default function CollectionContainer() {

  const { setError, setSuccess, setSeo, seo } = useContext(Context);
  
  const currentProfile = useSelector(state => state.users.currentProfile);
    const collection = useSelector(state => state.books.collectionInView);
  const dispatch = useDispatch();
  const router = useIonRouter()
 const [canUserAdd, setCanUserAdd] = useState(false);
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [canUserSee, setCanUserSee] = useState(false);
   const {id}=useParams()


  const collections = useSelector(state => state.books.collections);

  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
 
  const [homeCol, setHomeCol] = useState(null);
  const [archiveCol, setArchiveCol] = useState(null);
  const [role, setRole] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const writeArr = [RoleType.editor, RoleType.writer];
 useScrollTracking({
  contentType: "collection",
  contentId: collection?.id,
  authorId: collection?.profileId,
  enableCompletion: false,
});
  const [tab,setTab]=useState("pages")
  useEffect(() => {
  if (!collection || !canUserSee) return;

  setSeo({
    ...seo,
    title: `${collection.title} — Collection`,
    description:
      collection.purpose ||
      `A curated collection by ${collection.profile?.displayName || "a creator"}`,
  });
}, [collection]);
  function findRole(col,profile) {


    if ((col&& profile) && col.profileId == profile.id) {
      setRole(new Role("owner", profile, col, RoleType.editor, new Date()));
      setCanUserAdd(true)
      setCanUserSee(true)
      return;
    }


    if (col && profile && col.roles) {
      let foundRole = col.roles.find(role => role.profileId === profile.id);
      if (foundRole) {
        setRole(new Role(foundRole.id, profile, col, foundRole.role, foundRole.created));
        setCanUserSee(true);
       
      if(writeArr.includes(foundRole.role)){
setCanUserAdd(true)
       setCanUserSee(true)
       return
  }}}
   if(!col.isPrivate){
setCanUserSee(true)
return
}
}
  
  function soUserCanAdd() {
    if (!currentProfile || !collection) {
      setCanUserAdd(false);
      return;
    }
    if (collection.isOpenCollaboration) {
      setCanUserAdd(true);
      return;
    }
    if (collection.roles) {
      let found = collection.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
      if (found && writeArr.includes(found.role)) {
        setCanUserAdd(true);
        return;
      }
    }
    setCanUserAdd(false);
  }
  
  function soUserCanEdit() {
    if (!currentProfile || !collection) {
      setCanUserEdit(false);
      return;
    }
    if (collection.roles) {
      let found = collection.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
     
      if (found && (found.role === RoleType.editor)||collection.profileId==currentProfile.id) {
        setCanUserEdit(true);
        return;
      }
    }

  }
  
 
  

  useLayoutEffect(() => {
    if (currentProfile?.profileToCollections) {
      let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
      setHomeCol(home);

      let archive = currentProfile.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
      setArchiveCol(archive);
    }

  }, [currentProfile]);
useEffect(() => {
  getCol(id);
  
}, [id,currentProfile]); 

  useEffect(()=>{
    collection && currentProfile && findRole(collection,currentProfile)
    soUserCanEdit()
 
  },[currentProfile,collection])
  
  function checkFound() {
    if (collection && homeCol && collection.parentCollections) {
      let foundInHome = collection.parentCollections.find(ptc => ptc.parentCollectionId === homeCol.id);
      setIsBookmarked(foundInHome);
      let foundInArchive = collection.parentCollections.find(ptc => ptc.parentCollectionId === archiveCol?.id);
      setIsArchived(foundInArchive);
    }
    setBookmarkLoading(false);
  }





  const handleFollow = () => {
    if (currentProfile && collection) {
      let type = collection.followersAre ?? RoleType.commenter;
      if (currentProfile.id === collection.profileId) {
        type = RoleType.editor;
      }
    if(!collection && !collection.id){return }
      dispatch(postCollectionRole({
        type: type,
        profileId: currentProfile.id,
        collectionId: collection.id,
      })).then(res => {
        checkResult(res,({collection} )=> {
          
            setRole({role:"commenter"})
          setSuccess("You are now following this collection");
          findRole(collection,currentProfile)
        }, err => {
          console.log(err)
          setError(err.message);
        });
      });
    } else {
      setError("Please Sign In");
    }
  };
useEffect(()=>{
canUserSee&& getContent()

},[collection])
const getCol = async (id) => {
 
  try {

    if (currentProfile) {
      dispatch(fetchCollectionProtected({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
               
              setLoading(false);
              soUserCanEdit()
              dispatch(setPagesInView({pages:payload.collection?.storyIdList.map(str=>str.story)}))
              setCanUserSee(true)
             
       
            },
            (err) => {
             setLoading(false);
              
              if (err.status === 403) {
           console.log(err)
                setError("Access Denied: You do not have permission to view this collection.");
                setCanUserSee(false);
                soUserCanAdd()
                soUserCanEdit()
              } else {
                         console.log(err)
                setError(err.message || "Failed to load collection.");
              }
              setLoading(false);
            }
          );
        })
        .catch((e) => {
                 
          setError("An unexpected error occurred.");
          setLoading(false);
        });
    } else {

      dispatch(fetchCollection({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
             
               setLoading(false);
              if (payload.collection) {
                soUserCanEdit()
                dispatch(setPagesInView({pages:payload.collection?.storyIdList.map(str=>str.story)}))
                setCanUserSee(true)
                // setLoading(false);
              
              } 
            },
            (err) => {
               setLoading(false);
              if (err.status === 403) {
         
                setError("Access Denied: You do not have permission to view this collection.");
                setCanUserSee(false);
                
              } else {
                 console.log(err)
                setError(err.message || "Failed to load collection.");
              }
              // setLoading(false);
            }
          );
        })
        .catch((e) => {
          
          setError("An unexpected error occurred.");
          setLoading(false);
        });
    }
  } catch (error) {
    console.error(error);
    setError("Unexpected error occurred while fetching the collection.");
    setLoading(false);
  }
};




  const deleteFollow = () => {
    if (currentProfile && role) {
      setRole(null);
      dispatch(deleteCollectionRole({id, role })).then(res => {
        checkResult(res, payload => {
          setSuccess("Unfollowed collection");
      
        
        }, err => {
           console.log(err)
          setError(err.message);
        });
      });
    } else {
      setError("Please sign in");
    }
  };

  
       
  const handleBookmark = (type) => {
    if (!currentProfile) {
      setError("Please sign in");
      return;
    }

    setBookmarkLoading(true);


      if (!isBookmarked) {
        // console.log()
        setIsBookmarked(true)
        if (collection && homeCol) {
          let params = { id: homeCol.id, list: [collection.id], profile: currentProfile };
          dispatch(addCollectionListToCollection(params)).then(res => {
            checkResult(res, payload => {
              checkFound();
              setSuccess("Saved to Home");
              setBookmarkLoading(false)
            }, err => {
              setBookmarkLoading(false);
            });
          });
        }
      } else {
        setIsBookmarked(false)
        dispatch(deleteCollectionFromCollection({ tcId: isBookmarked.id })).then(res => {
          checkResult(res, payload => {
            if (payload.message?.includes("Already") || payload.message?.includes("Deleted")) {
              setIsBookmarked(null);
              setSuccess("Removed from Home");
                     setBookmarkLoading(false)
            }
            setBookmarkLoading(false);
          }, err => {
            setBookmarkLoading(false);
                   setBookmarkLoading(false)
          });
        });
      }
    }
  
  const handleArchive=()=>{
     if (!isArchived) {
        if (collection && collection.id && archiveCol) {
  
          setIsArchived(true)
          let params = { id: archiveCol.id, list: [collection.id], profile: currentProfile };
          dispatch(addCollectionListToCollection(params)).then(res => {
            checkResult(res, payload => {
              setBookmarkLoading(false)
              
              setSuccess("Saved to Archive");
            }, err => {
              setBookmarkLoading(false);
            });
          });
        }
      } else {
        setIsArchived(null)
        dispatch(deleteCollectionFromCollection({ tcId: isArchived.id })).then(res => {
          checkResult(res, payload => {
            if (payload.message?.includes("Already") || payload.message?.includes("Deleted")) {
              setBookmarkLoading(false)
              setSuccess("Removed from Archive");
            }
            setBookmarkLoading(false);
          }, err => {
            setBookmarkLoading(false);
          });
        });
  }}
  const getContent=()=>{
          
        setHasMore(true)
         if(collection && collection.storyIdList&&collection.storyIdList.length){
            const sorted = [...collection.storyIdList].filter(s=>s.story).sort((a,b)=>
                
                    a.index && b.index && b.index<a.index
               
                      ).map(stc=>stc.story)
                      
                      if(sorted.length===collection.storyIdList.length){
             dispatch(setPagesInView({pages:sorted}))
                      }       
            
            }
          }
          
        
    
    
        
          const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
       router.goBack()
    } else {
      router.push(Paths.discovery,"back");
    }
  };
  // Example getMore for infinite scrolling (to be filled with your pagination logic)
  const getMore = () => {
    // Example: dispatch get more pages/stories for pagination
    setHasMore(false); // Or change based on actual load
  };

  // Metadata
 
const FollowBtn=()=>     {return!role ? (
                <div onClick={handleFollow} className="btn flex-1 bg-transparent rounded-full border-2 px-4 px-2 border-emerald-300">
                <IonText  fill="outline" >
                  Join Community
                </IonText>
                </div>
              ) : (
                <div
                onClick={deleteFollow}
                className="btn rounded-full flex-1 bg-transparent  border-3 border-blueSea">
                <IonText fill="solid" >
               Following
                </IonText>
                </div>
              )}
    const SaveBtn=()=> {return<div
              className="p-2"
                onClick={() => handleBookmark()}
                color={isBookmarked? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <img className="w-[2.8em] h-[2.8em]" src={isBookmarked ? bookmarkFill : bookmarkOutline} />
                {bookmarkLoading && <IonSpinner name="dots" />}
              </div>}
      const ArchiveBtn=()=> {return<div
              className={` flex  w-[3rem] my-auto h-[3rem] ${isArchived?"border border-soft border-2 bg-soft rounded-full p-2":"bg-blueSea w-[3rem] h-[3rem] p-2 rounded-full  "}`}
                onClick={() => handleArchive()}
                color={isArchived ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <IonImg  style={{height:"2.5em",width:"2.5em",filter:"invert(100%)"}}  className=" my-auto mx-auto" src={archive} />
                {bookmarkLoading && <IonSpinner name="dots" />}
              </div>}
const EditBtn=()=>{
   
  return canUserEdit?<div 
      className={` border border-soft border-2 bg-soft rounded-full w-[3rem] my-auto h-[3rem]  p-2  rounded-full  `}
             onClick={()=>router.push(Paths.editCollection.createRoute(id))}>
        <IonImg   style={{height:"2.5em",width:"2.5em",filter:"invert(100%)"}} className="pb-1" src={edit}/></div>
:null
}

  if (loading||collection?.id!=id) {
    return (
      <IonContent>
<div>
       
        <div className="ion-padding max-w-[50em] mx-auto">
          <IonSkeletonText animated style={{ width: '100%', height: 150, margin: "2rem auto", borderRadius: 18 }} />
          <IonSkeletonText animated style={{ width: '100%', height: 400, margin: "2rem auto", borderRadius: 18 }} />
        </div>
      </div>
      </IonContent>
    );
  }

  if (!canUserSee) {
  return (
    <IonContent fullscreen>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Access Denied</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonText color="danger" className="ion-padding">
        <h3>403 — Access Denied</h3>
        <p>You don’t have permission to view this collection.</p>
      </IonText>
    </IonContent>
  );
}
  // Main content UI
  return (
         <ErrorBoundary>





  <IonContent style={{"--background":"#f8f6f1"}} scrollY={true} fullscreen className="pb-24 pt-12">

    {/* <div className=""> */}
        
    <div className="pt-8  mx-auto" >
 
      
          
          
        <IonCardContent style={{maxWidth:"50em",margin:"auto"}}className="ion-padding">
         <div> <IonText className="lora-bold"><h1>{collection?.title}</h1></IonText>
        
</div>
            <IonText color="medium w-full bg-emerald-100 min-h-6 bg-red-200">
              <h6>{collection.purpose}</h6>
            </IonText>
            <div className="my-4 p-4 flex flex-row gap-4">
      <FollowBtn/>       <SaveBtn/><ArchiveBtn/> 
<EditBtn/>
      </div>
      <div 
        onClick={(e) => {
    e.stopPropagation();

    if (!collection || !collection.id) return;

    router.push(Paths.addToCollection.createRoute(collection.id));
  }}
      className="p-4 w-[100%] text-center shadow-sm border border-1 border-soft my-4 rounded-full">
                  <h5 className="mx-auto">Add to Collection</h5>
      </div>
      <CollectionTabs tab={tab} setTab={setTab} pages={<PageTab collections={collections}/>}
                      members={<MemberTab collection={collection}/>}
                      about={<AboutTab collection={collection}/>}
                      />
   
            <div className="ion-margin-top w-[100%] mx-auto py-4 flex items-center justify-around flex gap-2">
   

              
            </div>
          </IonCardContent>
          </div>


        <ExploreList collection={collection} />
       
</IonContent>
        </ErrorBoundary>
  );
}

function CollectionTabs({ tab, setTab, pages, members, about }) {
  const variants = {
    enter: (direction) => ({
      x: direction === "pages" ? 20 : -20,
      opacity: 0,
      position: "absolute",
      width: "100%", // ✅ FIXED (was 100vw)
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%", // ✅ FIXED
    },
    exit: (direction) => ({
      x: direction === "pages" ? -20 : 20,
      opacity: 0,
      position: "absolute",
      width: "100%", // ✅ FIXED
    }),
  };


  return (
    <div className="sm:pt-12 bg-cream">
      
      {/* Tabs */}
      <div className="flex justify-center lg:justify-start lg:mx-12 mb-2">
        <div className="flex rounded-full border overflow-clip min-h-12 sm:w-[40em] w-[100%]  lg:w-[30em] border-emerald-600">
          
          <button
            className={`px-4 py-2 transition-colors w-[33%] ${
              tab === "pages"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("pages")}
          >
            Pages
          </button>

          <button
            className={`px-4 py-2 transition-colors w-[33%] ${
              tab === "members"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("members")}
          >
            Members
          </button>

          <button
            className={`px-4 py-2 transition-colors w-[33%] ${
              tab === "about"
                ? "bg-emerald-700 text-white"
                : "text-emerald-700 bg-transparent"
            }`}
            onClick={() => setTab("about")}
          >
            About
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-cream relative overflow-hidden" style={{ contain: "layout" }}>
    {/* <AnimatePresence mode="wait" initial={false}> */}
       <motion.div
  // key={tab}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}

            key={tab || "pages"} // ✅ SAFER KEY
            // custom={tab}
            variants={variants}
   
            exit="exit"
  
            className="w-full"
          >
            {tab === "pages" && pages}
            {tab === "members" && members}
            {tab === "about" && about}
          </motion.div>
        {/* </AnimatePresence> */}
      </div>
    </div>
  );
}

const PageTab = ({ collections }) => {
    const currentProfile = useSelector(state => state.users.currentProfile);
    const collection = useSelector(state => state.books.collectionInView);
  const pagesInView = useSelector(state => state.pages.pagesInView);
  const [isOwner,setIsOwner]=useState(collection?.profileId==currentProfile?.id)
  const router = useIonRouter()
  return (
    <div className="py-4">
      {/* <div className="mx-auto my-4 rounded-xl bg-cream pt-12 px-4 pb-4"> */}
       { collections && collections.length > 0  ? <><h2 className="text-[2em] lora-bold text-soft  px-1 pb-2">
          Anthologies
        </h2>
      
     
   

{collections && collections.length > 0 ? (
  <IonList style={{ backgroundColor: "#f4f4e0" }}>
    <div className="flex flex-row bg-cream min-h-[14rem] overflow-x-scroll">
      {collections
        .filter((col) => col)
        .map((col, i) => (
          <div key={i} className="mx-3">
            <BookListItem book={col} />
          </div>
        ))}
    </div>
  </IonList>
) : (
  <div className="flex flex-row gap-3 overflow-x-scroll min-h-[14rem] px-3">
    {/* Skeleton placeholders
    {[1, 2, 3, 4].map((i) => (
      <BookListItemShadow key={i} />
    ))} */}

    {/* CTA if owner */}
    {/* {isOwner && ( */}
      <div className="min-w-[16rem] flex flex-col items-center justify-center bg-cream rounded-lg p-4 shadow text-center">
        <p className="mb-2 text-gray-700">No anthologies yet.</p>
        <button
          onClick={() => router.push(Paths.addToCollection.createRoute(collection?.id))}
          className="px-4 py-2  text-emerald-800   "
        >
          Add Your First Anthology
        </button>
      </div>
    {/* // )} */}
  </div>
)}</>: isOwner && <button
          onClick={() => router.push(Paths.addToCollection.createRoute(collection?.id))}
          className="px-4 py-2 btn bg-softBlue rounded-full text-emerald-800   "
        >
          Add Your First Anthology
        </button>}
  <h2 className="text-[2em] lora-bold text-soft  px-1 pb-2">
          Pages
        </h2> 
        
 {pagesInView.length>0 ? (
  
        <PageList
          items={pagesInView}
          isGrid={false}
          hasMore={false}
          getMore={() => {}}
          forFeedback={false}
        />
      ) : (
        <div className="py-8 text-center text-gray-500">
          {isOwner ? (
            <div>
              <p>No pages yet.</p>
              <button
                onClick={()=>router.push(Paths.addToCollection.createRoute(collection.id))}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700"
              >
                Add Your First Page
              </button>
            </div>
          ) : (
            <p>This collection has no pages yet.</p>
          )}
        </div>
      )}
       
 
   </div>
  );
};


const MemberTab = ({ collection }) => {
  const router = useIonRouter()
  return (
    <>
     
        <h5 className="text-[1.2em]  pt-4 lora-bold text-emerald-800 px-1 pb-2">
         Contributors
        </h5>

        {collection.roles.length > 0 && (
          <IonList style={{ backgroundColor: "#f4f4e0" }}>
            <div className="flex flex-col bg-cream pt-4 min-h-[14rem] overflow-x-scroll">
              {collection.roles
          
                .map((role, i) => {
           
               return<div onClick={()=>router.push(Paths.profile.createRoute(role.profileId))} className="  w-[100%] my-1 rounded-full border px-4 border-1 border-soft">
                  <div className="flex flex-row justify-between  w-[100%]">
                  <div className="py-4 "><ProfileCircle profile={role.profile}/></div><div className="my-auto">{role.role}</div>
                  </div>
                </div>
})}
            </div>
          </IonList>
        )}

 
     
    </>
  );
};

const AboutTab = ({ collection}) => {
  const [locationName,setLocationName]=useState("")
  useEffect(()=>{
    
  async function city(){
     let address 
    
   if( collection?.location && collection?.location?.city?.length==0){
    address = await fetchCity(prof.location)
      setLocationName(address)
   }
  
  
  }
  city()
  },[collection])

  // const hashTags = prof?.hashtags ?? [];
  if (!collection) return null;


  return (
    <div className="space-y-6">
    <div>
        <p className="text-sm text-gray-700 leading-relaxed">
          <p className="text-xs text-gray-400 uppercase">Purpose</p>
          {  collection.purpose}
        </p>
        </div>

  
        <div>
         {collection?.location &&<> <p className="text-xs text-gray-400 uppercase">Location</p>
          <p className="text-sm text-gray-700 mt-1">{collection.location.city}</p></>}
        </div>
   

      </div>)
    }


     

 function AnthologiesPlaceholder({ collections, isOwner, collection }) {
  const router = useIonRouter();

  return (
    <div className="py-4">
      

      {collections && collections.length > 0 ? (
        <IonList style={{ backgroundColor: Enviroment.palette.cream}}>
          <div className="flex flex-row bg-cream min-h-[14rem] overflow-x-scroll">
            {collections
              .filter((col) => col)
              .map((col, i) => (
                <div key={i} className="mx-3">
                  <BookListItem book={col} />
                </div>
              ))}
          </div>
        </IonList>
      ) : (
        <div className="flex flex-row gap-3 overflow-x-scroll min-h-[14rem] px-3">
          {[1, 2, 3, 4].map((i) => (
            <BookListItemShadow key={i} />
          ))}

          {isOwner && (
            <div className="min-w-[16rem] flex flex-col items-center justify-center bg-cream rounded-lg p-4 shadow text-center">
              <p className="mb-2 text-gray-700">No anthologies yet.</p>
              <button
                onClick={() => router.push(Paths.addToCollection.createRoute(collection?.id))}
                className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700"
              >
                Add Your First Anthology
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}