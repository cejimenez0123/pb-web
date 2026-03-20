import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,

  IonSpinner,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonText,
  IonSkeletonText,
  IonImg,
  IonBackButton,
  IonItem,
  useIonRouter,
 
} from "@ionic/react";

import { AnimatePresence, motion } from "framer-motion";
import add from "../../images/icons/add_circle.svg"
import archive from "../../images/icons/archive.svg"
import edit from "../../images/icons/edit.svg"
import { useDispatch, useSelector } from "react-redux";

import PageList from "../../components/page/PageList";
import ErrorBoundary from "../../ErrorBoundary";
import BookListItem from "../../components/BookListItem";
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

export default function CollectionContainer() {

  const { setError, setSuccess, setSeo, seo } = useContext(Context);
  
  const currentProfile = useSelector(state => state.users.currentProfile);
  const dispatch = useDispatch();
  const router = useIonRouter()
 const [canUserAdd, setCanUserAdd] = useState(false);
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [canUserSee, setCanUserSee] = useState(false);
   const {id}=useParams()

  const collection = useSelector(state => state.books.collectionInView);
  const collections = useSelector(state => state.books.collections);

  const [loading, setLoading] = useState(true);
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


    if (col&& profile && col.profileId == profile.id) {
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
  useEffect(()=>{
  getCol(id)
  
  },[id])

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
  setLoading(true);
  try {
    const token = (await Preferences.get({ key: "token" })).value;

    if (token && token !== "undefined") {
      dispatch(fetchCollectionProtected({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
              setLoading(false);
            soUserCanEdit()
                  dispatch(setPagesInView({pages:payload.collection.storyIdList.map(str=>str.story)}))
              setCanUserSee(true)
            },
            (err) => {
            
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
                   console.log("POPP",e)
          setError("An unexpected error occurred.");
          setLoading(false);
        });
    } else {

      dispatch(fetchCollection({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
              if (payload.collection) {
       
                dispatch(setPagesInView({pages:payload.collection.storyIdList.map(str=>str.story)}))
                setCanUserSee(true)
                setLoading(false);
                  soUserCanEdit()
              } 
            },
            (err) => {
              if (err.status === 403) {
                 console.log(err)
                setError("Access Denied: You do not have permission to view this collection.");
                setCanUserSee(false);
                
              } else {
                 console.log(err)
                setError(err.message || "Failed to load collection.");
              }
              setLoading(false);
            }
          );
        })
        .catch((e) => {
                  console.log("POPPX",e)
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
        if (collection && archiveCol) {
  
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
         if(collection.storyIdList&&collection.storyIdList.length){
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
              className={`${isArchived?"border border-soft border-2 bg-soft rounded-full w-[3rem] h-[3rem] p-2":"bg-blueSea w-[3rem] rounded-full h-[3rem] p-2 my-auto"}`}
                onClick={() => handleArchive()}
                color={isArchived ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <img className="w-[2em] h-[2em] pt-1 mx-auto" src={archive} />
                {bookmarkLoading && <IonSpinner name="dots" />}
              </div>}


  if (loading) {
    return (
      <IonContent>
<div>
        <IonHeader >
          <IonToolbar>
            <IonTitle>Loading collection...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding mx-auto">
          <IonSkeletonText animated style={{ width: '96vw', height: 150, margin: "2rem auto", borderRadius: 18 }} />
          <IonSkeletonText animated style={{ width: '96vw', height: 400, margin: "2rem auto", borderRadius: 18 }} />
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





  <IonContent style={{"--background":"#f4f4e0"}} scrollY={true} fullscreen className="pb-24 pt-12">
    <IonHeader>
      <IonToolbar>

        <IonButtons slot="start">
          
            <IonBackButton
            mode="ios"
              defaultHref={Paths.discovery}
              onClick={handleBack}
            />
           
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <div className="">
        
    <div className="pt-8">
 
          <IonCardHeader className="mx-auto ">
            <div className="flex items-center justify-between px-4 gap-2">
              <div>
                <IonCardTitle className="ion-text-wrap lora-medium">{collection?.title}</IonCardTitle></div>
                 {canUserEdit &&<div><IonImg
                 onClick={() => router.push(Paths.editCollection.createRoute(id))}
                  src={edit} className="bg-blueSea min-w-12 max-h-12 rounded-full p-2 btn"/>
            </div>}
           </div>
          </IonCardHeader>
          <div className="mx-auto px-6 ">
        <IonCardContent className="ion-padding">
            <IonText color="medium w-full bg-emerald-100 min-h-6 bg-red-200">
              <h6>{collection.purpose}</h6>
            </IonText>
            <div className="my-4 p-4 flex flex-row gap-4">
      <FollowBtn/>       <SaveBtn/><ArchiveBtn/>
      </div>
      
      <CollectionTabs tab={tab} setTab={setTab} pages={<PageTab collections={collections}/>}
                      members={<div/>}
                      about={<div/>}
                      />
   
            <div className="ion-margin-top w-[100%] mx-auto py-4 flex items-center justify-around flex gap-2">
   
              {canUserAdd && (
             
                <div onClick={() => router.push(Paths.addToCollection.createRoute(collection.id))} className="bg-emerald-600 rounded-full w-[2.9rem] p-1">
                <IonImg src={add}/>
                </div>
            
              )}
         
              
            </div>
          </IonCardContent>
          </div>


        <ExploreList collection={collection} />
        </div>
        </div>
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

//   return (<div className="bg-cream">
//   {tab === "pages" && pages}
//   {tab === "members" && members}
//   {tab === "about" && about}
// </div>)
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
  const pagesInView = useSelector(state => state.pages.pagesInView);

  return (
    <>
      <div className="mx-auto my-4 rounded-xl bg-cream pt-12 px-4 pb-4">
        <h5 className="text-xl text-emerald-800 px-1 pb-2">
          Anthologies
        </h5>

        {collections && collections.length > 0 && (
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
        )}

        <div className="sm:w-[50rem] mx-auto">
          <PageList
            items={pagesInView || []}
            isGrid={false}
            hasMore={false} // ✅ FIXED (no undefined)
            getMore={() => {}} // ✅ FIXED
            forFeedback={false} // ✅ FIXED
          />
        </div>
      </div>
    </>
  );
};