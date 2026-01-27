import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonImg,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/react";
import CollectionToCollection from "../../domain/models/CollectionToCollection";
import { useContext, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { deleteCollection, deleteCollectionFromCollection, deleteStoryFromCollection, fetchCollectionProtected, patchCollectionContent } from "../../actions/CollectionActions";
import Paths from "../../core/paths";
import addIcon from "../../images/icons/add_circle.svg";
import deleteIcon from "../../images/icons/delete.svg";
import "../../styles/EditBook.css";
import { setDialog } from "../../actions/UserActions";
import SortableList from "../../components/SortableList";
import StoryToCollection from "../../domain/models/storyToColleciton";
import { Preferences } from "@capacitor/preferences";
import { RoleType } from "../../core/constants";
import arrowDown from "../../images/icons/arrow_down.svg"
import Context from "../../context";
import RoleForm from "../../components/role/RoleForm";
import ErrorBoundary from "../../ErrorBoundary";
import { Capacitor } from "@capacitor/core";
import { useParams } from "react-router";
import HashtagForm from "../../components/hashtag/HashtagForm";

const EditCollectionContainer = () => {


  const {setError,setSuccess}=useContext(Context)
  const dispatch = useDispatch();
  const router = useIonRouter()
     const params = useParams()
       const { id } = params;
  const [pending,setPending]=useState(true)
  const isNative = Capacitor.isNativePlatform()
  const [isOpen, setIsOpen] = useState(false);
   const colInView = useSelector((state) => state.books.collectionInView);
 const [newPages, setNewPages] = useState([]);
 const [followersAre,setFollowersAre]=useState(RoleType.commenter)
const [canUserEdit,setCanUserEdit]=useState(false)
 const [title,setTitle]=useState("")
 const [openHashtag,setOpenHashtag]=useState(false)
 const [purpose,setPurpose]=useState("")
  const [newCollections, setNewCollections] = useState([]);
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
   const [isPrivate, setIsPrivate] = useState(true)
const dialog = useSelector(state=>state.users.dialog)


  useEffect(() => {
    async function loadData() {
      console.log("ROXY",id)
      const col = await dispatch(fetchCollectionProtected(id));

      if (col) setCollection(col);
      setLoading(false);
    }
    loadData();
  }, [id]);
 const handleStoryOrderChange = (newOrder) => {
    setNewPages(newOrder.map((stc, i) => new StoryToCollection(stc.id, i, stc.collection, stc.story, currentProfile)));
  };
    function soUserCanEdit() {
      if (!currentProfile || !colInView) {
        setCanUserEdit(null);
        return;
      }

      if (colInView.roles) {
        let found = colInView.roles.find(colRole => colRole && colRole.profileId === currentProfile.id);
      
        if (found && (found.role === RoleType.editor)||colInView.profileId==currentProfile.id) {
          setCanUserEdit(found);
          return;
        }
      }
  
    }

  const handleColOrderChange = (newOrder) => {
    setNewCollections(
      newOrder.map((c, i) => new CollectionToCollection(c.id, i, c.childCollection, colInView, currentProfile))
    );
  };
     const deleteStory = (stc) => {
    dispatch(deleteStoryFromCollection({ stId: stc.id }));
  };

  const deleteChildFromCollection = (tc) => {
    if (tc) dispatch(deleteCollectionFromCollection({ tcId: tc.id }));
  };
  const setItems = (col) => {
    
    if (!col) return;
 if (col.storyIdList) {

    const stcList = col.storyIdList.map((stc, i) => {
      const index = stc.index ?? i; // fallback if index is null
      return new StoryToCollection(
        stc.id,      // the id of the StoryToCollection record
        index,       // computed index
        stc.collectionId || col.id, // reference to parent collection
        stc.story,   // nested story object
        currentProfile
      );
    }).sort((a, b) => a.index - b.index);

    setNewPages(stcList);
    console.log(newPages)
  }
if (col.childCollections) {
    const collList = col.childCollections.map((c, i) => {
      const index = c.index ?? i;
      return new CollectionToCollection(
        c.id,                   // id of the CollectionToCollection record
        index,                  // index
        c.childCollection,      // nested collection object
        col,                    // parent collection
        currentProfile
      );
    }).sort((a, b) => a.index - b.index);

    setNewCollections(collList);
  }}
         const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
       router.goBack()
    } else {
      router.push(Paths.discovery());
    }
  };
     const setInfo = (col) => {
    
    if (!col) return;
    setTitle(col.title);
    setPurpose(col.purpose);
    setIsPrivate(col.isPrivate);
    setIsOpen(col.isOpenCollaboration);
    setFollowersAre(col.followersAre ?? RoleType.commenter);
  };
  const handleSave = () => {

    let log = {
        id: params.id,
        isPrivate,
        isOpenCollaboration: isOpen,
        title,
        purpose,
        storyToCol: newPages,
        colToCol: newCollections,
        col: colInView,
        profile: currentProfile,
      }
    console.log("FS",log)
    dispatch(
      patchCollectionContent({
        id: params.id,
        isPrivate,
        isOpenCollaboration: isOpen,
        title,
        purpose,
        storyToCol: newPages,
        colToCol: newCollections,
        col: colInView,
        profile: currentProfile,
      })
    )
      .then(() => setSuccess("Successful Update"))
      .catch((err) => setError(err.message));
  };
  useEffect(soUserCanEdit,[currentProfile,colInView])
  useEffect(() => {
    if (colInView) {
      setInfo(colInView);
      setItems(colInView);
    }
    // eslint-disable-next-line
  }, [colInView]);
    const getCol = async () => {
    const token = (await Preferences.get({ key: "token" })).value;

    console.log("VD",token)
    // if (token && (!colInView || colInView.id !== id)) {
      token &&id&& dispatch(fetchCollectionProtected(params)).then((res) => {
        console.log(res)
       
        setPending(false);
      });
    // }
  };
  useEffect(()=>{
     getCol(id).then()
  },[id])
  const handleAddStory = () => router.push(Paths.addToCollection.createRoute(id));
  const handleDelete = () => {
    let dia = { ...dialog };
    dia.title = "Deleting?";
    dia.isOpen = true;
    dia.agree = () => {
      dispatch(deleteCollection(params));
      router.push(Paths.myProfile);
      dispatch(setDialog({ isOpen: false }));
    };
    dia.agreeText = "Delete";
    dia.onClose = () => dispatch(setDialog({ isOpen: false }));
    dia.text = (
      <p>
        Are you sure you want to delete this <strong>{colInView.title}</strong>?
      </p>
    );
    dispatch(setDialog(dia));
  };
  const openRoleForm=()=>{

    let dia = { ...dialog };
    dia.title = null;
    // dia.title = "Change Roles";
    dia.isOpen = true;
    dia.agree =null
  
    dia.agreeText = null
    dia.onClose = () => dispatch(setDialog({ isOpen: false }));
    dia.text = <RoleForm item={colInView} onClose={()=>dispatch(setDialog({ isOpen: false }))}/>
    dispatch(setDialog(dia));
  
  }

  return (

    <ErrorBoundary>
      {/* <IonContent fullscreen={true} className="bg-gray-50"> */}
            {isNative?<IonHeader translucent>
        <IonToolbar className="bg-white border-b border-emerald-100">
          <IonButtons slot="start">
            <IonBackButton
              
              onClick={handleBack}
              className="text-emerald-700"
            />
          </IonButtons>

          <IonTitle className="text-emerald-800 font-semibold text-center">
            Edit Collection
          </IonTitle>

          {/* {canUserEdit && ( */}
            <IonButtons slot="end">
            
            </IonButtons>
          {/* )} */}
        </IonToolbar>
      </IonHeader>:<div className="pt-8"/>}
<IonContent>
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <IonSpinner name="crescent" color="success" />
          </div>
        ) : (
        
          <div className="ion-padding sm:max-w-[50em] mx-auto">
        

            <IonList lines="none">
              {/* Title */}
              <IonItem className="rounded-xl mb-3 border border-emerald-100">
                <IonLabel position="stacked" className="text-emerald-700">
                  Title
                </IonLabel>
                <IonInput
                  value={title}
                  placeholder="Enter collection title"
                  onIonChange={(e) =>{
                    setCollection({ ...collection, title: e.detail.value })
                    setTitle(e.detail.value)
                  }}
                  className="p-2 text-[1.8rem]"
                />
              
               {canUserEdit? currentProfile.id == colInView.profileId?"You're the owner":<IonText >You are {canUserEdit.role=="editor"?"an":"a"} {canUserEdit.role}</IonText>:null}
            
              </IonItem>
  <div className="mt-4">
    <div className="mb-1">
                <IonLabel position="stacked" className="text-emerald-700  text-[1rem] font-bold">
                  Description
                </IonLabel>
                </div>
                <textarea
                className="border border-blueSea p-3 min-h-[12em] w-full rounded-lg shadow-sm w-[100%] sm:max-w-[50em]"
                  autoGrow={true}
                  placeholder="Describe your collection"
                  value={purpose}
              
                  onIonChange={(e) =>{
                    setCollection({
                      ...collection,
                      description: e.detail.value,
                    })
                    setPurpose(e.detail.value)
                  }}
                  // className="p-2 "
                />
</div>
            </IonList>
              <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
  {/* Open Collaboration Toggle */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
      ${isOpen
        ? "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
        : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
      }`}
  >
    {isOpen ? "Open Collaboration Enabled" : "Close Collaboration"}
  </button>
  {/* <div className="flex flex-row space-x-4"> */}
  <button
    onClick={() =>openRoleForm()}
    className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
      `}
  >
    Roles
  </button>
  {collection && <button
  onClick={()=>setOpenHashtag(!openHashtag)}
  className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
      `}
  > {!openHashtag?"+":"-"} Hashtags</button>}

  {/* </div> */}
  {/* Privacy Toggle */}
  {openHashtag && collection && <HashtagForm item={colInView} type="collection"/>}
  <button
    onClick={() => setIsPrivate(!isPrivate)}
    className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
      ${isPrivate
        ? "bg-red-50 border-red-400 text-red-700 hover:bg-red-100"
        : "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
      }`}
  >
    {isPrivate ? "Private Collection" : "Public Collection"}
  </button>
      <FollowersDropdown followersAre={followersAre}setFollowersAre={setFollowersAre}/>
  <div className="flex flex-row space-between">

  <div
  className={`w-full sm:w-60 flex items-center btn  border border-blueSea border-1 justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border`}
  onClick={() => router.push(Paths.collection.createRoute(colInView.id))}
>
<IonText>View Collection</IonText>
</div>
 <IonImg    onClick={handleAddStory} src={addIcon} alt="Add" className="max-w-14 ml-8 btn rounded-full p-2 max-h-14 bg-soft" />
  </div>           
  <IonText
                onClick={handleSave}
                className="text-white btn bg-blueSea w-[100%] sm:max-w-[50em] my-auto  text-center font-bold text-[1rem] py-3 rounded-full font-medium"
              >
                Save
              </IonText>
  </div>
            
       <div className="w-[100%] md:mt-8 mx-auto flex flex-col sm:max-w-[50em]">       <div role="tablist" className="tabs grid">
        
          <input type="radio" name="my_tabs_2" role="tab" defaultChecked className="tab" aria-label="Pages" />
          <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
              <SortableList items={newPages} onOrderChange={handleStoryOrderChange} onDelete={deleteStory} />
         </div>
         <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Collections" />
          <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
           <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteChildFromCollection} />
           </div>
        </div>
    
              {/* <IonButton
                expand="block"
                fill="solid"
                color="success"
                className="mt-4 rounded-full flex b items-center justify-center gap-2"
             
              > */}
                  {/* <span>Add New Story</span> */}
              {/* </IonButton> */}
            </div>

            {/* ===== DANGER ZONE ===== */}
           {colInView && currentProfile && colInView.profileId==currentProfile.id && <div className="mt-10 border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-red-600 mb-2">
                Danger Zone
              </h4>
          
                <IonImg   onClick={handleDelete} src={deleteIcon} alt="Delete" className="max-w-12 max-h-12 rounded-lg bg-red-400" />
                <span>Delete Collection</span>
           
            </div>}
          </div>
        )}
      </IonContent>

 </ErrorBoundary>
  );
};

export default EditCollectionContainer;

function FollowersDropdown({ followersAre, setFollowersAre }) {
  const [open, setOpen] = useState(false);

  const roleOptions = useMemo(() => [
    { label: "Commenter", value: RoleType.commenter },
    { label: "Reader", value: RoleType.reader },
    { label: "Writer", value: RoleType.writer },
  ], []);

  const handleSelect = (role) => {
    setFollowersAre(role);
    setOpen(false);
  };

  return (
    <ErrorBoundary>
      <IonContent>
    <div className="w-full sm:w-60 text-center relative">
      {/* Button */}
      <div
        tabIndex={0}
        role="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-center rounded-full px-6 py-3 border border-emerald-400 bg-white text-emerald-700 font-medium shadow-sm hover:bg-emerald-50 cursor-pointer transition-all"
      >
        Followers are&nbsp;
        <span className="font-semibold">{followersAre}s</span>
        <IonImg
          src={arrowDown}
          className={`w-4 h-4 ml-2 opacity-80 transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </div>

      {/* Dropdown Menu */}
      <ul
        className={`absolute z-10 mt-2 w-full bg-white border border-emerald-200 rounded-lg shadow-md text-emerald-800 text-sm font-medium transform transition-all duration-300 origin-top ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {roleOptions.map((opt) => (
          <li
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className="px-4 py-2 hover:bg-emerald-50 cursor-pointer transition-colors"
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
       </IonContent>
    </ErrorBoundary>

  );
}

