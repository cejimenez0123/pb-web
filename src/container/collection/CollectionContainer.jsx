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
  IonItem,
  useIonRouter,
 
} from "@ionic/react";
import add from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import { useDispatch, useSelector } from "react-redux";

import Context from "../../context";
import PageList from "../../components/page/PageList";
import ErrorBoundary from "../../ErrorBoundary";
import BookListItem from "../../components/BookListItem";
import ExploreList from "../../components/collection/ExploreList.jsx";
import ProfileCircle from "../../components/profile/ProfileCircle";
import bookmarkOutline from "../../images/bookmark_add.svg"
import bookmarkFill from "../../images/bookmark_fill_green.svg"
import {
  appendToPagesInView,
  setPagesInView,
} from "../../actions/PageActions.jsx";
import {
  addCollectionListToCollection,
  deleteCollectionFromCollection,
  fetchCollection,
  fetchCollectionProtected,
} from "../../actions/CollectionActions";
import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions";
import Role from "../../domain/models/role";
import { RoleType } from "../../core/constants";
import checkResult from "../../core/checkResult"
import Paths from "../../core/paths.js";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

export default function CollectionContainer() {
  const {  setError, setSuccess } = useContext(Context);
  const currentProfile = useSelector(state => state.users.currentProfile);
  const dispatch = useDispatch();
  const router = useIonRouter()

   const id = router.routeInfo?.pathname.split("/")[2]
   console.log(id)
  const isNative = Capacitor.isNativePlatform()
  const collection = useSelector(state => state.books.collectionInView);
  const collections = useSelector(state => state.books.collections);
  const pagesInView = useSelector(state => state.pages.pagesInView);
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
  const writeArr = [RoleType.editor, RoleType.writer];
   
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
console.log("DID",router.routeInfo)
    if (token && token !== "undefined") {
      dispatch(fetchCollectionProtected({ id }))
        .then((res) => {
          checkResult(
            res,
            (payload) => {
              setLoading(false);
            soUserCanEdit()
              
              setCanUserSee(true)
            },
            (err) => {
            
              if (err.status === 403) {
                setError("Access Denied: You do not have permission to view this collection.");
                setCanUserSee(false);
                soUserCanAdd()
                soUserCanEdit()
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
              if (payload.collection) {
                setCanUserSee(true)
                setLoading(false);
                  soUserCanEdit()
              } else {
                setError("Collection not found.");
                setLoading(false);
              }
            },
            (err) => {
              if (err.status === 403) {
                setError("Access Denied: You do not have permission to view this collection.");
                setCanUserSee(false);
                
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
          setError(err.message);
        });
      });
    } else {
      setError("Please sign in");
    }
  };

  
       
  const onBookmark = (type) => {
    if (!currentProfile) {
      setError("Please sign in");
      return;
    }

    setBookmarkLoading(true);

    if (type === "home") {
      if (!isBookmarked) {

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
    } else if (type === "archive") {
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
      }
    }
  };
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
      router.push(-1);
    } else {
      router.push(Paths.discovery());
    }
  };
  // Example getMore for infinite scrolling (to be filled with your pagination logic)
  const getMore = () => {
    // Example: dispatch get more pages/stories for pagination
    setHasMore(false); // Or change based on actual load
  };

  // Metadata
 
    if (loading||!collection) {
      return (
  <div>
              <IonHeader> 
      <IonToolbar>
        {/* <IonButtons>
                      {isNative?<IonBackButton
                       
      defaultHref={Paths.discovery()}
      onClick={handleBack}
    />:null } */}
<IonButton>Back</IonButton>
        {/* </IonButtons> */}
      
              <IonTitle>Loading collection...</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSpinner />
   </div>
      );
    }

  if (!collection) {
    return (
<div>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading collection...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonSkeletonText animated style={{ width: '96vw', height: 150, margin: "2rem auto", borderRadius: 18 }} />
          <IonSkeletonText animated style={{ width: '96vw', height: 400, margin: "2rem auto", borderRadius: 18 }} />
        </div>
      </div>
    );
  }

  if (!canUserSee) {

    return (
      <ErrorBoundary>

            <IonHeader> 
      <IonToolbar>
        {/* <IonButtons>
   
              {isNative?<IonBackButton
                       
      defaultHref={Paths.discovery()}
      onClick={handleBack}
    />:null } */}
    <IonButton>Back</IonButton>

        {/* </IonButtons> */}
        </IonToolbar>      





      </IonHeader>
      
       <IonText color="danger" className="ion-padding">
  <h3>403 — Access Denied</h3>
  <p>You don’t have permission to view this collection.</p>
  <p>If you believe this is a mistake, please contact the collection owner.</p>
</IonText>

      {/* </IonContent> */}
      </ErrorBoundary>
    );
  }

  // Main content UI
  return (
         <ErrorBoundary>


  <IonHeader >
  <IonToolbar>

    {/* Left-aligned back button */}
    <IonButtons slot="start">
              {isNative?<IonBackButton
                       
      defaultHref={Paths.discovery()}
      onClick={handleBack}
    />:null }
    </IonButtons>

  

  </IonToolbar>
</IonHeader>
  <IonContent>
 <IonCard className="">
          <IonCardHeader className="mx-auto ">
            <div className="flex items-center justify-between px-4 gap-2">
              <div>{collection.profile && <ProfileCircle profile={collection.profile} color="emerald-700" />}
              <IonCardTitle className="ion-text-wrap">{collection.title}</IonCardTitle></div>
                 {canUserEdit &&<div><IonImg
                 onClick={() => router.push(Paths.editCollection.createRoute(id))}
                  src={edit} className="bg-blueSea max-w-12 max-h-12 rounded-full p-2 btn"/>
            </div>}
           </div>
          </IonCardHeader>
          <div className="mx-auto px-6">
          <IonCardContent  class="  ion-padding">
            <IonText color="medium w-full bg-emerald-100 min-h-6 bg-red-200">
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
                className="btn rounded-full bg-transparent  border-3 border-blueSea">
                <IonText fill="solid" >
                  {role.role}
                </IonText>
                </div>
              )}
              {canUserAdd && (
             
                <div onClick={() => router.push(Paths.addToCollection.createRoute(collection.id))} className="bg-emerald-600 rounded-full p-1">
                <IonImg src={add}/>
                </div>
            
              )}
              <div
              className=""
                onClick={() => onBookmark("archive")}
                color={isArchived ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <img className="w-[3em] h-[3em]" src={isArchived ? bookmarkFill : bookmarkOutline} />
                {bookmarkLoading && <IonSpinner name="dots" />}
              </div>
              
            </div>
          </IonCardContent>
          </div>
        </IonCard>

        {collections && collections.length > 0 && (
          <IonCard className="ion-padding pt-12">
            <IonCardHeader>
              <IonCardTitle><h5 className="text-xl  px-4 pb-2">Anthologies</h5></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList className="flex flex-row min-h-[14rem] overflow-x-scroll">
                  {collections.filter(col=>col).map((col, i) => (
                    <IonItem key={i} className="mx-3">
                    <BookListItem key={i} book={col} />
                    </IonItem>
                  ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
<div className="sm:w-[50rem] mx-auto">

            <PageList
              items={pagesInView}
              isGrid={false}
              hasMore={hasMore}
              getMore={getMore}
              forFeedback={collection?.type === "feedback"}
        />
</div>
        <ExploreList />
</IonContent>
        </ErrorBoundary>
  );
}
