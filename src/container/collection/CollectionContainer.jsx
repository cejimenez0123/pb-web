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
import CollectionActions from "../../components/collection/CollecitonActions.jsx";

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
const [permissionsLoading, setPermissionsLoading] = useState(true);
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
function computePermissions(collection, profile) {
  // Default state
  let canSee = false;
  let canAdd = false;
  let canEdit = false;
  let role = null;

  if (!collection) {
    return { canSee, canAdd, canEdit, role };
  }
  if(collection && !profile&& collection.isPrivate==true){
    canSee=false
    router.goBack()
    return
  }
  // ------------------ OWNER ------------------
  if (profile && collection.profileId === profile.id) {
    role = new Role("owner", profile, collection, RoleType.editor, new Date());

    return {
      canSee: true,
      canAdd: true,
      canEdit: true,
      role,
    };
  }

  // ------------------ ROLE-BASED ------------------
  let foundRole = null;

  if (profile && collection.roles?.length) {
    foundRole = collection.roles.find(
      (r) => r?.profileId === profile.id
    );

    if (foundRole) {
      role = new Role(
        foundRole.id,
        profile,
        collection,
        foundRole.role,
        foundRole.created
      );

      // Can always see if they have a role
      canSee = true;

      // Write permissions
      if (writeArr.includes(foundRole.role)||collection.isOpenCollaboration) {
        canAdd = true;
      }

      // Edit permissions
      if (foundRole.role === RoleType.editor) {
        canEdit = true;
      }

      return { canSee, canAdd, canEdit, role };
    }
  }

  // ------------------ OPEN COLLAB ------------------
  if (collection.isOpenCollaboration) {
    canAdd = true;
  }

  // ------------------ PUBLIC ACCESS ------------------
  if (!collection.isPrivate) {
    canSee = true;
  }

  // ------------------ FINAL RETURN ------------------
  return {
    canSee,
    canAdd,
    canEdit,
    role,
  };
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

 useEffect(() => {
  if (!collection) return;

  setPermissionsLoading(true);

  const perms = computePermissions(collection, currentProfile);

  setCanUserAdd(perms?.canAdd);
  setCanUserEdit(perms?.canEdit);
  setCanUserSee(perms?.canSee);
  setRole(perms?.role);

  setPermissionsLoading(false);
}, [collection, currentProfile]);
  
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
          computePermissions(collection,currentProfile)
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
     
              computePermissions(payload.collection,currentProfile)
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
                setCanUserSee(true)
                //
              
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
 const FollowBtn = () => {
  const baseClasses =
    "flex-1 py-3 rounded-full btn h-10 flex items-center justify-center transition-all duration-150";
  // Enviroment.palette.states.
  return !role ? (
    <button
      onClick={handleFollow}
      className={`${baseClasses}  bg-blue text-button-primary-text border-2 border-emerald-300 hover:bg-states-success`}
    >
        <label
      tabIndex={0}
      // className="btn h-12 px-5 rounded-full bg-blueSea text-white hover:bg-cyan-500 flex items-center justify-center gap-2 transition"
    > Join Community</label>
    </button>
  ) : (
    <button
      onClick={deleteFollow}
      className={`${baseClasses} bg-button-primary-bg text-white bg-border-2 border-soft hover:bg-blue-50`}
    >
     <label
      tabIndex={0}
      // className="btn h-12 px-5 rounded-full bg-blueSea text-white hover:bg-cyan-500 flex items-center justify-center gap-2 transition"
    >Following</label>
    </button>
  );
};

 
  if (!canUserSee) {
  return (
    <IonContent fullscreen>
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

const AddButton=({disabled, loading,className})=>{
  // return     canUserAdd && <div 

  return <div className={`mt-4 rounded-full  transition-all duration-200 ${className} ${canUserAdd 
      ? `bg-white shadow-sm border border-soft cursor-pointer opacity-100` 
      : `bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed`}`}>
  <button onClick={(e) => {
    if (!canUserAdd) return;
    e.stopPropagation();
    router.push(Paths.addToCollection.createRoute(collection.id));

  }} className="w-[100%] rounded-full bg-soft hover:bg-card-highlight text-white h-10 btn">
    Add to Collection
  </button>
</div>
 
 
}
if(!collection)return <CollectionContainerShadow/>
return (
  <ErrorBoundary>
    <IonContent
      style={{ "--background": Enviroment.palette.base.background }}
      scrollY={true}
      fullscreen
      className="pb-24 pt-12"
    >
      <div className="pt-8 mx-auto sm:max-w-[50em]  ">

        {/* Collection Container */}
        {/* <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6"> */}

          {/* Collection Title */}
          <div className="px-4 py-4">
           <IonText className="lora-bold">
  <h1 className="text-[1.6rem] sm:text-2xl">
    {collection && collection.title ? collection.title:(
      <IonSkeletonText animated style={{ width: '50%', height: '2rem' }} />
    ) }
  </h1>
</IonText>
          </div>

          {/* Collection Purpose */}
             <div className="px-4 py-4">
          {collection?.purpose? (
            <p className="text-gray-600 text-sm min-h-8 sm:text-base">
              {collection.purpose}
            </p>
          ): <p className="text-gray-600 min-h-8 text-sm ">
              {""}
            </p>}
</div>
          {/* Action Buttons */}
          <div className="flex flex-wrap px-4 sm:flex-nowrap items-center justify-between gap-3">

            {/* Follow / Join Button */}
               {/* <div className="> */}
            <div className="my-4 flex-1  min-w-[10rem] h-12 rounded-full  flex items-center justify-center transition">
            <FollowBtn />
</div>
<CollectionActions handleArchive={handleArchive} 
 collection={collection}
 role={role}
 isTheArchive={collection?.id == archiveCol?.id}
 isTheHome={collection?.id == homeCol?.id}
 canUserEdit={canUserEdit}
 isBookmarked={isBookmarked}
 isArchived={isArchived}
 handleBookmark={handleBookmark}
 router={router}

  />
            
          </div>

          {/* Add to Collection */}
          <div className="px-4 ">
          <AddButton
            disabled={!canUserAdd}
            loading={permissionsLoading}
            className=" h-12 rounded-ful w-[100%] bg-button-primary text-button-primary-text hover:bg-button-accent-hover transition"
          /></div>

          {/* Tabs */}
          <div className="mt-4">
            <CollectionTabs
              tab={tab}
              setTab={setTab}
              pages={<PageTab collections={collections}  />}
              members={<MemberTab collection={collection} />}
              about={<AboutTab collection={collection} />}
            />
          </div>
        </div>

        {/* Explore List */}
        <div className="mt-6">
          <ExploreList collection={collection} />
        </div>
      {/* </div> */}
    </IonContent>
  </ErrorBoundary>
);
}


const PageTab = ({ collections }) => {
    const currentProfile = useSelector(state => state.users.currentProfile);
    const collection = useSelector(state => state.books.collectionInView);
    console.log(collection)
  const pagesInView = useSelector(state => state.pages.pagesInView);
  const [isOwner,setIsOwner]=useState(collection?.profileId==currentProfile?.id)
  const router = useIonRouter()
  return (
    <div className=" bg-base-surface">
    {/* {Enviroment.palette.text.} */}
        <><h2 className="text-[1.4rem] bg-base-surface  my-8 px-4 lora-bold text-text-brand ">
          Anthologies
        </h2>
      
{collections && collections?.length > 0 ? (

    <div className="flex flex-row bg-base-surface min-h-[14rem] overflow-x-scroll">
      {collections
        .filter((col) => col)
        .map((col, i) => (
          <div key={i} className="mx-3">
            <BookListItem book={col} />
          </div>
        ))}
    </div>
  // </IonList>
) : (
  <div className="flex flex-row gap-3 overflow-x-scroll py-8 ">
   

      {(isOwner || collection.isOpenCollaboration)? <button
          onClick={() => router.push(Paths.addToCollection.createRoute(collection?.id))}
          className="px-4 py-2 btn bg-softBlue rounded-full mx-auto text-emerald-800   "
        >
          Add First Anthology
        </button>:<div className=" flex flex-col items-center mx-auto justify-center bg-base-surface rounded-lg p-4  text-center">
        <p className="mb-2 text-gray-700">No anthologies yet.</p>
       
      </div>}

  </div>
)}</> 
  <h2 className="text-[2em] lora-bold text-soft mx-auo px-4 pb-2">
          Pages
        </h2> 
        
 {pagesInView?.length>0 ? (
  <div className="px-4 max-w-[50em] mx-auto">
        <PageList
          items={pagesInView}
          isGrid={false}
          hasMore={false}
          getMore={() => {}}
          forFeedback={false}
        />
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          {(isOwner || collection.isOpenCollaboration)? (
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

  const roles = [...collection.roles.filter(role=>role.profile.id!=collection.profile.id), collection.profile ? { role: "owner", profile: collection.profile } : null].filter(r => r).sort((a, b) => a.role.localeCompare(b.role))
  return (
    <>
     <div className="px-4"> 
       <h2 className="text-[1.4rem] my-8 lora-bold text-soft ">
      
         Contributors
        </h2>

        {
          <IonList style={{ backgroundColor: Enviroment.palette.base.surface}}>
            <div className="flex flex-col bg-base-surface pt-4 min-h-[14rem] overflow-x-scroll">
              {
          
                roles.map((role, i) => {
           
               return<div key={i} onClick={()=>router.push(Paths.profile.createRoute(role.profile.id))} className="  w-[100%] my-1 rounded-full border px-4 border-1 bg-base-bg border-soft">
                  <div className="flex flex-row justify-between  w-[100%]">
                  <div className="py-4 "><ProfileCircle profile={role.profile}/></div><div className="my-auto">{role.role}</div>
                  </div>
                </div>
})}
            </div>
          </IonList>
        }

 </div>
     
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
    <div className=" my-8 ">
    <h5 className="text-gray-400 uppercase font-medium text-[1.4rem]">Purpose</h5>
<p className="text-sm text-gray-700leading-relaxed mt-4 font-sans">
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


// // Tabs
function CollectionTabs({ tab, setTab, pages, members, about }) {
  return (
    <div className="bg-base-surface pt-6 sm:pt-12">
      <div className="flex justify-center lg:justify-start  mb-4">
        <div className="flex rounded-full border overflow-hidden w-full  border-emerald-600">
          {["pages", "members", "about"].map((t) => (
            <button
              key={t}
              className={`flex-1 py-2 px-4 font-semibold text-sm transition-colors ${
                tab === t ? "bg-emerald-700 text-white" : "bg-transparent text-emerald-700 hover:bg-emerald-50"
              }`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden ">
        <motion.div
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // className="w-full"
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
    <div className="animate-pulse bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6 max-w-[50em] mx-auto">
      
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