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
  IonRow,
} from "@ionic/react";
import add from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  getRecommendedCollectionStory,
  setCollections,
  getRecommendedCollections,
  getRecommendedCollectionsProfile,
} from "../../actions/CollectionActions";
import { deleteCollectionRole, postCollectionRole } from "../../actions/RoleActions";
import Role from "../../domain/models/role";
import { RoleType } from "../../core/constants";
import checkResult from "../../core/checkResult";

import Paths from "../../core/paths.js";
import DeviceCheck from "../../components/DeviceCheck.jsx";
import { Preferences } from "@capacitor/preferences";

export default function CollectionContainer() {
  const {  setError, currentProfile, setSuccess } = useContext(Context);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const collection = useSelector(state => state.books.collectionInView);
  const collections = useSelector(state => state.books.collections);
  const pagesInView = useSelector(state => state.pages.pagesInView);
const isNative = DeviceCheck()
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
  }


  function checkPermissions() {

    if (currentProfile && collection.profileId === currentProfile.id) {
      setCanUserEdit(true);
      setCanUserAdd(true)
      setCanUserSee(true)
      dispatch(getRecommendedCollectionsProfile());
      return
    }else if(!currentProfile){
      setCanUserEdit(false);
      setCanUserAdd(false)
      setCanUserSee(false)
      return
    }else if(currentProfile&&collection){
      soUserCanSee();
      soUserCanAdd();
      soUserCanEdit();
      dispatch(getRecommendedCollectionsProfile());
      return
    }else{
      setCanUserEdit(false);
      setCanUserAdd(false)
      setCanUserSee(false)
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
  getCol()
  },[location.pathname])
  useEffect(()=>{
    checkPermissions()
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
      setRole({role:"commenter"})
      dispatch(postCollectionRole({
        type: type,
        profileId: currentProfile.id,
        collectionId: collection.id,
      })).then(res => {
        checkResult(res, payload => {
          setSuccess("You are now following this collection");
          findRole()
        }, err => {
          setError(err.message);
        });
      });
    } else {
      setError("Please Sign In");
    }
  };
const getCol=async ()=>{
       setLoading(true)

        const token =await Preferences.get("token")
       token?dispatch(fetchCollectionProtected({id})).then(res=>{
            checkResult(res,payload=>{
             setLoading(false)
         
             findRole()
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
    useEffect(()=>{
      canUserSee?getContent():null
    },[canUserSee,collection])

  const deleteFollow = () => {
    if (currentProfile && role) {
      setRole(null);
      dispatch(deleteCollectionRole({ role })).then(res => {
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

        setIsBookmarked(true)
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
        setIsBookmarked(false)
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
 


  if (!collection) {
    return (
      <IonContent fullscreen scrollY>
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
        <IonContent fullscreen={true} >
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
      <IonContent fullscreen={true}>
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
    <IonContent 
    fullscreen={true}  scrollY>
  
      <IonHeader >
  
<IonToolbar  >
  <IonButtons  slot="start">
    <IonBackButton defaultHref="/discovery" />

  </IonButtons>

  <IonTitle>Collection</IonTitle>

  <IonButtons slot="end">
    {/* Action buttons or icons */}

    {canUserEdit ? ( 
     <IonButton slot="end"> 
   <IonImg slot="end"
   className="btn max-h-[2rem] btn bg-emerald-400 cursor-pointer max-w-[3rem] flex items-center border-0 justify-center px-2 rounded"
    
onClick={() => navigate(Paths.editCollection.createRoute(id))}
   src={edit} />
    </IonButton> 
 ):null}
    
  </IonButtons>
</IonToolbar>




      </IonHeader>

      <ErrorBoundary>
        <IonCard className="ion-margin-bottom ion-padding">
          <IonCardHeader className="mx-auto bg-red-100">
            <div className="flex items-center px-4 gap-2">
              {collection.profile && <ProfileCircle profile={collection.profile} color="emerald-700" />}
              <IonCardTitle className="ion-text-wrap">{collection.title}</IonCardTitle>
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
            
              )}
              <div
              className=""
                onClick={() => onBookmark("archive")}
                color={isArchived ? "warning" : "medium"}
                disabled={bookmarkLoading}
              >
                <IonImg  src={isArchived ? bookmarkFill : bookmarkOutline} />
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
          </div>
        </IonCard>

        {collections && collections.length > 0 && (
          <IonCard className="ion-padding">
            <IonCardHeader>
              <IonCardTitle>Anthologies</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList className="flex flex-row min-h-[14rem] overflow-x-scroll">
                  {collections.map((col, i) => (
                    <IonItem key={i} className="mx-3">
                    <BookListItem key={col.id + i} book={col} />
                    </IonItem>
                  ))}
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
