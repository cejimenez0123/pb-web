import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  
  IonContent,

  IonList,
  IonText,
  IonSkeletonText,


  useIonRouter,
 
} from "@ionic/react";

import { useDispatch, useSelector } from "react-redux";

import PageList from "../../components/page/PageList";
import ErrorBoundary from "../../ErrorBoundary";
import {BookListItem,BookListItemShadow} from "../../components/collection/BookListItem";
import ExploreList from "../../components/collection/ExploreList.jsx";
import {
  addCollectionListToCollection,
  deleteCollectionFromCollection,
  fetchCollection,
  fetchCollectionProtected,
  setCollections,
} from "../../actions/CollectionActions";

import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions";
import Role from "../../domain/models/role";
import { RoleType } from "../../core/constants";
import { useParams } from "react-router";
import Context from "../../context.jsx";
import useScrollTracking from "../../core/useScrollTracking.jsx";
import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult.js";
import { setPagesInView } from "../../actions/PageActions.jsx";
import ProfileCircle from "../../components/profile/ProfileCircle.jsx";
import Enviroment from "../../core/Enviroment.js";
import CollectionActions from "../../components/collection/CollecitonActions.jsx";
import {motion} from 'framer-motion'
import SectionHeader from "../../components/SectionHeader.jsx";
import computePermissions from "../../core/compusePermissions.jsx";
import { postCollectionHistory } from "../../actions/HistoryActions.js";
import getBackground from "../../core/getbackground.jsx";
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 🔥 key for smooth loading
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
// Layout system
// const WRAP = "w-full max-w-5xl md:max-w-[52em] mx-auto px-4 sm:px-6 lg:px-8";    // main horizontal alignment
const SECTION = "pt-8 sm:pt-10 lg:pt-12 "; // sections
const BLOCK = "py-4 sm:py-5";             // inner blocks
const GAP = "gap-4 sm:gap-6";             // flex/grid gaps// vertical spacing between sections
// const HEADER = "flex items-center justify-between mb-4"; 
// const TITLE = "lora-bold text-[1.5rem] sm:text-2xl lg:text-3xl dark:text-cream";
// const SUBTEXT = "text-gray-600 text-sm sm:text-base";
const WRAP  = "w-full overflow-y-auto max-w-5xl bg-base-surface dark:bg-base-bgDark md:max-w-[52em] mx-auto";
const TITLE = "lora-bold text-[1.5rem] sm:text-2xl lg:text-3xl text-text-primary dark:text-cream";
const SUBTEXT = "text-text-secondary dark:text-gray-400 text-sm sm:text-base";
const CARD  = "bg-base-bg dark:bg-base-surfaceDark rounded-2xl p-4 shadow-sm border border-border-default dark:border-white/10";
const TAB_WRAP = "pt-6 sm:pt-12 md:max-w-[48em] bg-base-surface dark:bg-base-bgDark mx-auto";
// Actions
const ACTION_ROW = "flex flex-col sm:flex-row items-stretch sm:items-center gap-3";
const BUTTON_FULL = "h-12 rounded-full btn transition";

// Lists / content
const LIST = "flex flex-col gap-4";
const H_SCROLL = "flex gap-4 overflow-x-auto lg:grid lg:grid-cols-3 lg:overflow-visible";

// Tabs
// const TAB_WRAP = "pt-6 sm:pt-12 md:max-w-[48em] bg-base-surface dark:bg-base-bgDark mx-auto";
export default function CollectionContainer() {


  const { setError, setSuccess, setSeo, seo } = useContext(Context);
  const [sentHistory,setSentHistory]=useState(false)
  const currentProfile = useSelector(state => state.users.currentProfile);
    const collection = useSelector(state => state.books.collectionInView);
  const dispatch = useDispatch();
  const router = useIonRouter()

   const writeArr = [RoleType.editor, RoleType.writer];
   const {id}=useParams()
   const {canSee,canAdd,canEdit,role} = computePermissions(collection,currentProfile, {
  getAccessList: (c) => c.roles??[],
  getAccessRole: (r) => r.role,
  isPrivate: (c) => c.isPrivate,
  isOpen: (c) => c.isOpenCollaboration,
  canWriteRoles: [RoleType.writer, RoleType.editor],
  canEditRoles: [RoleType.editor],
});
useEffect(() => {
  if (!sentHistory && currentProfile?.id && collection?.id) {
    setSentHistory(true);

    dispatch(
      postCollectionHistory({
        profile: currentProfile,
        collection,
      })
    );
  }
}, [currentProfile?.id, collection?.id]);

  const collections = useSelector(state => state.books.collections);

  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  
  const [homeCol, setHomeCol] = useState(null);
  const [archiveCol, setArchiveCol] = useState(null);
  const [foundRole, setRole] = useState(role);
  const [hasMore, setHasMore] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
 
 useScrollTracking({
  contentType: "collection",
  contentId: collection?.id,
  authorId: collection?.profileId,
  enableCompletion: false,
});
  const [tab,setTab]=useState("pages")
 useEffect(() => {
  if (!collection?.id || !canSee) return;

  setSeo((prev) => ({
    ...prev,
    title: `${collection.title} — Collection`,
    description:
      collection.purpose ||
      `A curated collection by ${collection.profile?.username || "a creator"}`,
  }));
}, [collection?.id, canSee]);
useEffect(() => {
  if (!collection || !homeCol || !archiveCol) return;

  // Bookmark
  const foundInHome = collection.parentCollections?.find(
    (ptc) => ptc.parentCollectionId === homeCol.id
  );
  setIsBookmarked(foundInHome || null);

  // Archive
  const foundInArchive = collection.parentCollections?.find(
    (ptc) => ptc.parentCollectionId === archiveCol.id
  );
  setIsArchived(foundInArchive || null);

  setBookmarkLoading(false);
}, [collection, homeCol, archiveCol]);

  useLayoutEffect(() => {
    if (currentProfile?.profileToCollections) {
      let home = currentProfile.profileToCollections.find(pTc => pTc.type === "home")?.collection || null;
      setHomeCol(home);

      let archive = currentProfile.profileToCollections.find(pTc => pTc.type === "archive")?.collection || null;
      setArchiveCol(archive);
    }

  }, [currentProfile]);
useEffect(() => {
  if (!id) return;
  getCol(id);
}, [id, currentProfile?.id]);


  
  function checkFound() {
    if (collection && homeCol && collection.parentCollections) {
      let foundInHome = collection.parentCollections.find(ptc => ptc.parentCollectionId === homeCol.id);
      setIsBookmarked(foundInHome);
      let foundInArchive = collection.parentCollections.find(ptc => ptc.parentCollectionId === archiveCol?.id);
      setIsArchived(foundInArchive);
    }
    setBookmarkLoading(false);
  }


const className=" h-12 rounded-full w-[100%]  border border-sky-100 border-1 bg-blue text-cream hover:bg-teal btn transition"


  
  const actionLock = useRef(false);

const handleFollow = async () => {
  if (actionLock.current) return;
  actionLock.current = true;


  try {
    if (currentProfile && collection) {
      let type = collection.followersAre ?? RoleType.commenter;

      if (currentProfile?.id === collection?.profileId) {
        type = RoleType.editor;
      }

      const res = await dispatch(
        postCollectionRole({
          type,
          profileId: currentProfile.id,
          collectionId: collection.id,
        })
      );

      checkResult(
        res,
        (payload) => {
     
          setSuccess("You are now following this collection");
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Please Sign In");
    }
  } finally {
    actionLock.current = false;
  
  }
};

useEffect(() => {
  if (!collection?.storyIdList?.length || !canSee) return;

  getContent();
}, [collection?.id, canSee]);
// useEffect(() => {
//   dispatch(setCollections({ collections: [] }));
//   dispatch(setPagesInView({ pages: [] }));
// }, [id]);
useEffect(() => {
  dispatch(setCollections({ collections: [] }));
  dispatch(setPagesInView({ pages: [] }));
}, []);
const getCol = async (id) => {
 
  try {

    if (currentProfile) {
      dispatch(fetchCollectionProtected({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
               
              setLoading(false);
     
              // computePermissions(payload.collection,currentProfile)
              dispatch(setPagesInView({pages:payload.collection?.storyIdList.map(str=>str.story)}))
            
             
       
            },
            (err) => {
             setLoading(false);
              
              if (err.status === 403) {
       
                setError("Access Denied: You do not have permission to view this collection.");
               
              } else {
                     
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
        
                dispatch(setPagesInView({pages:payload.collection?.storyIdList.map(str=>str.story)}))
                // setCanUserSee(true)
                //
              
              } 
            },
            (err) => {
               setLoading(false);
              if (err.status === 403) {
         
                setError("Access Denied: You do not have permission to view this collection.");
                // setCanUserSee(false);
                
              } else {
                //  console.log(err)
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
    if(currentProfile?.id == collection.profile?.id){
setError("This is yours, delete it silly")
return
    }
    if (currentProfile && role) {
      // setRole(null);
      dispatch(deleteCollectionRole({id, role })).then(res => {
        checkResult(res, payload => {
          setSuccess("Unfollowed collection");
      
        
        }, err => {
          //  console.log(err)
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
          
        
    
    
        
  
  
 const isReady = collection !== null;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   const baseClasses = "w-full sm:w-auto flex-1 sm:flex-none py-3 rounded-full btn h-12 flex items-center justify-center transition";
  if (!canSee) {
  return (
    <IonContent  style={{ "--background": 
    prefersDark ?
     Enviroment.palette.base.backgroundDark 
    ?? Enviroment.palette.base.bg : 
    Enviroment.palette.base.background

  }} fullscreen>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Access Denied</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonText color="danger" className="ion-padding text-center px-4">
        <h3>403 — Access Denied</h3>
        <p>You don’t have permission to view this collection.</p>
      </IonText>
    </IonContent>
  );
}

return (
  <ErrorBoundary>
    <IonContent
       style={{...getBackground()
  }}
      scrollY={true}
      fullscreen
      className="pb-24 pt-12"
    >
       <div
    className={` bg-cream pb-26 dark:bg-base-bgDark transition-opacity duration-300 ${
      collection ? "opacity-100" : "opacity-0"
    }`}
  >
  <div>
    {collection &&
      <div className={`${WRAP} bg-base-surface  dark:bg-base-bgDark `}>
<div>
      <div className="px-4">
        <div className={`${SECTION} bg-base-surface  dark:bg-base-bgDark  `}>
           <IonText className="lora-bold">
<h1 className={TITLE}>
    {collection && collection.title ? collection.title:(
      <IonSkeletonText animated style={{ width: '50%', height: '2rem' }} />
    ) }
  </h1>
</IonText>
          </div>

          {/* Collection Purpose */}
            <div className={BLOCK+" bg-base-surface dark:bg-base-bgDark "}>
          {collection?.purpose? (
            <p className="text-soft dark:text-cream text-sm min-h-8 sm:text-base">
              {collection.purpose}
            </p>
          ): <p className="text-soft dark:text-cream min-h-8 text-sm ">
              {""}
            </p>}
</div>
          {/* Action Buttons */}
         <div className={`${SECTION}  bg-base-surface dark:bg-base-bgDark  ${ACTION_ROW}`}>

            
            <div className={`my-4 flex-1  ${GAP} min-w-[10rem] h-12 rounded-full  flex items-center justify-center transition`}>
           
        <div
      className={`${baseClasses} btn  ${
        role
          ? "bg-soft border border-2 border-soft dark:bg-base-surfaceDark text-cream hover:bg-blue-500"
          : "bg-blue border border-1 border-blue dark:bg-base-surfaceDark text-cream hover:bg-sky-400"
      }`}
      onClick={()=>role ? deleteFollow(role) : handleFollow()}
 
    >
      {role ? "Following" : "Follow"}
    </div>


<CollectionActions handleArchive={handleArchive} 
 collection={collection}
 role={foundRole}
 isTheArchive={collection?.id == archiveCol?.id}
 isTheHome={collection?.id == homeCol?.id}
 canUserEdit={canEdit}
 isBookmarked={isBookmarked}
 isArchived={isArchived}
 handleBookmark={handleBookmark}
 router={router}

  />
         </div>   
          </div>

 {canAdd && <div className={BLOCK}>
   <div


   onClick={()=>router.push(Paths.addToCollection.createRoute(collection.id))}
className={BUTTON_FULL+" transition w-[100%] border-blue border-1 text-cream border  dark:bg-base-surfaceDark  bg-base-surface dark:bg-base-bgDark  bg-blue dark:text-cream hover:bg-teal"}
    
    >
      Add to Collection
    </div>
          </div>
}
       </div>
          {/* Tabs */}
       <div className={SECTION}>
            <CollectionTabs
              tab={tab}
              setTab={setTab}
              pages={<PageTab collections={collections}  />}
              members={<MemberTab collection={collection} />}
              about={<AboutTab collection={collection} currentProfile={currentProfile} />}
            />
          </div>
        </div>
           </div>
   }</div>
   </div>
   <div className='min-h-[28rem]'>
  <ExploreList collection={collection} />
</div>
      
     
    </IonContent>
  </ErrorBoundary>
);
}




const PageTab = ({ collections }) => {
  const currentProfile = useSelector(state => state.users.currentProfile);
  const collection = useSelector(state => state.books.collectionInView);
  const pagesInView = useSelector(state => state.pages.pagesInView);
  const isOwner = collection?.profileId === currentProfile?.id;
  const router = useIonRouter();

  const hasAnthologies = collections?.length > 0 ;

  return (
    <div className="bg-base-surface dark:bg-base-bgDark">
   

      {(!hasAnthologies && currentProfile.id==collection.profileId)?null:(hasAnthologies ? (<>
      <SectionHeader title={"Anthologies"} />
        <div className="grid gap-4 grid-cols-1 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="flex flex-row"
            variants={containerVariants}
            initial="hidden"
            animate="show"

          >
            {collections.filter(col => col).map(col => (
              <motion.div key={col.id} variants={itemVariants}>
                <div className="w-64 sm:w-72 lg:w-80">
                  <BookListItem book={col} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div></>
      ) : (
        <div className="flex flex-col items-center mx-auto justify-center bg-base-surface dark:bg-transparent rounded-lg p-4 text-center py-6">
          <p className="mb-2 dark:text-cream text-gray-700">No anthologies yet.</p>
          {(isOwner || collection.isOpenCollaboration) && (
            <div
              onClick={() => router.push(Paths.addToCollection.createRoute(collection?.id))}
              className="px-4 py-2 btn bg-softBlue dark:bg-transparent border-softBlue border-1 border rounded-full dark:text-cream text-emerald-800"
            >
              Add Your First Anthology
            </div>
          )}
        </div>
      ))}

      <div className={SECTION}>
      <SectionHeader title={"Pages"}/>
      {pagesInView?.length > 0 ? (
        <div className="w-full px-4">
          <PageList
            items={pagesInView}
            isGrid={false}
            hasMore={false}
            getMore={() => {}}
            forFeedback={false}
          />
        </div>
      ) : (
        <div className="py-8 text-center px-4 text-gray-500">
          {(isOwner || collection.isOpenCollaboration) ? (
            <div>
              <p className={"text-soft dark:text-cream"}>No pages yet.</p>
              <div
                onClick={() => router.push(Paths.addToCollection.createRoute(collection.id))}
                className="mt-4 px-4 py-2 bg-soft text-cream dark:bg-transparent border border-soft border-1 rounded-full shadow hover:bg-emerald-700"
              >
                Add Your First Page
              </div>
            </div>
          ) : (
            <p>This collection has no pages yet.</p>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
const MemberTab = ({ collection }) => {
  const router = useIonRouter()

  const roles = [...collection?.roles?.filter(role=>role.profile.id!=collection.profile.id), collection.profile ? { role: "owner", profile: collection.profile } : null].filter(r => r).sort((a, b) => a.role.localeCompare(b.role))
  return (
    <>
    <div style={{...getBackground()}}className={`${WRAP} px-4 ${SECTION}`}>
    
<SectionHeader title={"Contributors"}/>
        {
   
            <div style={{...getBackground()}}className="flex flex-col  pt-4 px-4 min-h-[14rem]">
              {
          
                roles.map((role, i) => {
           
               return<div key={i} onClick={()=>router.push(Paths.profile.createRoute(role.profile.id))} className="  w-[100%] my-1 rounded-full border px-4 border-1 bg-base-bg border-soft">
                  <div className="flex flex-row justify-between  w-[100%]">
                  <div className="py-4 pr-4 "><ProfileCircle profile={role.profile} includeUsername={true}/></div><div className="my-auto dark:text-cream">{role.role}</div>
                  </div>
                </div>
})}
            </div>
     
        }

 </div>
     
    </>
  );
};

const AboutTab = ({ collection,currentProfile}) => {
  const [locationName,setLocationName]=useState("")
useEffect(() => {
  if (!currentProfile || !location?.latitude) return;

  let cancelled = false;

  (async () => {
    const city = await fetchCity(location);
    if (!cancelled) {
      registerUser(currentProfile.id, {
        longitude: location.longitude,
        latitude: location.latitude,
        city
      });
    }
  })();

  return () => { cancelled = true };
}, [location?.latitude]); // 👈 only trigger when actually meaningful

  
  if (!collection) return null;


  return (
<div className={`${WRAP} px-4 ${SECTION}`}>
   
    <SectionHeader title={"Purpose"}/>

<p className="text-sm text-gray-700 dark:text-cream leading-relaxed mt-4 font-sans">
  {collection.purpose}
</p>

 
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
        <IonList style={{ backgroundColor: Enviroment.palette.base.background}}>
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


        </div>
      )}
    </div>
  );
}



function CollectionTabs({ tab, setTab, pages, members, about }) {
  return (
    <div className={` ${TAB_WRAP}`}>
      <div className="flex justify-center lg:justify-start mb-4 overflow-x-auto">
        <div className="inline-flex rounded-full border border-emerald-600">
          {["pages", "members", "about"].map((t) => (
            <button
              key={t}
              className={`px-4 py-2 font-semibold text-sm transition-colors whitespace-nowrap rounded-full ${
                tab === t
                  ? "bg-emerald-700 text-white"
                  : "bg-transparent text-soft hover:bg-emerald-50"
              }`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "pages" && pages}
          {tab === "members" && members}
          {tab === "about" && about}
        </motion.div>
      </div>
    </div>
  );
}
function CollectionContainerShadow() {
  return (
    <div className="animate-pulse bg-base-bg rounded-xl shadow-lg p-6 flex flex-col gap-6 max-w-[50em] mx-auto">
      
      {/* Title */}
      <div className="h-8 w-1/2 bg-gray-300 rounded-md mb-4"></div>

      {/* Purpose */}
      <div className="h-4 w-full bg-gray-200 rounded-md mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-4"></div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="h-12 w-32 bg-gray-300 rounded-full"></div>
        <div className="h-12 w-32 bg-gray-300 rounded-full"></div>
      </div>

      {/* Add Button */}
      <div className="h-12 w-full bg-gray-300 rounded-full mb-4"></div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
        <div className="h-8 w-20 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content Placeholder */}
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}