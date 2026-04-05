// import { IonContent, IonImg, useIonRouter } from "@ionic/react";
// import { useEffect, useState, useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router";

// import {
//   fetchCollectionProtected,
//   patchCollectionContent,
//   deleteCollection,
//   deleteCollectionFromCollection,
//   deleteStoryFromCollection,
// } from "../../actions/CollectionActions";

// import StoryToCollection from "../../domain/models/storyToColleciton";
// import CollectionToCollection from "../../domain/models/CollectionToCollection";
// import { RoleType } from "../../core/constants";
// import Paths from "../../core/paths";

// import SortableList from "../../components/SortableList";
// import Context from "../../context";
// import { useDialog } from "../../domain/usecases/useDialog";

// import addIcon from "../../images/icons/add_circle.svg";
// import deleteIcon from "../../images/icons/delete.svg";
// import Pill from "../../components/Pill";

// export default function EditCollectionContainer() {
//   const dispatch = useDispatch();
//   const router = useIonRouter();
//   const { id } = useParams();

//   const { setError, setSuccess } = useContext(Context);
//   const { openDialog, resetDialog } = useDialog();

//   const colInView = useSelector((s) => s.books.collectionInView);
//   const currentProfile = useSelector((s) => s.users.currentProfile);

//   const [loading, setLoading] = useState(true);

//   const [title, setTitle] = useState("");
//   const [purpose, setPurpose] = useState("");
//   const [isPrivate, setIsPrivate] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [followersAre, setFollowersAre] = useState(RoleType.commenter);

//   const [newPages, setNewPages] = useState([]);
//   const [newCollections, setNewCollections] = useState([]);
//   const [activeTab, setActiveTab] = useState("pages");

//   // ===== Load =====
//   useEffect(() => {
//     dispatch(fetchCollectionProtected(id)).then(() => setLoading(false));
//   }, [id]);

//   // ===== Populate =====
//   useEffect(() => {
//     if (!colInView) return;

//     setTitle(colInView.title);
//     setPurpose(colInView.purpose);
//     setIsPrivate(colInView.isPrivate);
//     setIsOpen(colInView.isOpenCollaboration);
//     setFollowersAre(colInView.followersAre ?? RoleType.commenter);

//     if (colInView.storyIdList) {
//       setNewPages(
//         colInView.storyIdList.map(
//           (s, i) =>
//             new StoryToCollection(
//               s.id,
//               s.index ?? i,
//               colInView.id,
//               s.story,
//               currentProfile
//             )
//         )
//       );
//     }

//     if (colInView.childCollections) {
//       setNewCollections(
//         colInView.childCollections.map(
//           (c, i) =>
//             new CollectionToCollection(
//               c.id,
//               c.index ?? i,
//               c.childCollection,
//               colInView,
//               currentProfile
//             )
//         )
//       );
//     }
//   }, [colInView]);

//   // ===== Save =====
//   const handleSave = () => {
//     dispatch(
//       patchCollectionContent({
//         id,
//         title,
//         purpose,
//         isPrivate,
//         isOpenCollaboration: isOpen,
//         storyToCol: newPages,
//         colToCol: newCollections,
//         col: colInView,
//         profile: currentProfile,
//       })
//     )
//       .then(() => setSuccess("Saved"))
//       .catch((e) => setError(e.message));
//   };

//   const handleDelete = () => {
//     openDialog({
//       isOpen: true,
//       text: `Delete ${colInView?.title}?`,
//       agreeText: "Delete",
//       agree: () => {
//         dispatch(deleteCollection({ id })).then(() => {
//           router.push(Paths.myProfile);
//           resetDialog();
//         });
//       },
//     });
//   };

//   if (loading || !colInView) return <Skeleton />;

//   return (
//     <IonContent fullscreen style={{ "--background": "#f9fafb" }}>
//       <div className="max-w-lg mx-auto px-4 pb-28 pt-6 space-y-6">

//         {/* TITLE */}
//         <div className="card bg-base-100 shadow-sm">
//           <div className="card-body p-4">
//             <p className="text-xs text-gray-500">Title</p>
//             <input
//               className="input input-ghost text-lg font-semibold px-0"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Collection title"
//             />
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div className="card bg-base-100 shadow-sm">
//           <div className="card-body p-4">
//             <p className="text-xs text-gray-500">Description</p>
//             <textarea
//               className="textarea textarea-ghost mt-2 text-sm"
//               value={purpose}
//               onChange={(e) => setPurpose(e.target.value)}
//               placeholder="Describe your collection"
//             />
//           </div>
//         </div>

//         {/* SETTINGS */}
//         <div className="card bg-base-100 shadow-sm">
//           <div className="card-body p-4 space-y-4">

//             {/* Open Collaboration */}
//             <div className="flex justify-between items-center">
//               <span className="text-sm">Open Collaboration</span>
//               <input
//                 type="checkbox"
//                 className="toggle toggle-success"
//                 checked={isOpen}
//                 onChange={() => setIsOpen(!isOpen)}
//               />
//             </div>

//             {/* Privacy */}
//             <div className="flex justify-between items-center">
//               <span className="text-sm">Public</span>
//               <input
//                 type="checkbox"
//                 className="toggle toggle-success"
//                 checked={!isPrivate}
//                 onChange={() => setIsPrivate(!isPrivate)}
//               />
//             </div>

//             {/* Followers */}
//             <select
//               className="select select-bordered w-full"
//               value={followersAre}
//               onChange={(e) => setFollowersAre(e.target.value)}
//             >
//               <option value={RoleType.commenter}>Commenters</option>
//               <option value={RoleType.reader}>Readers</option>
//               <option value={RoleType.writer}>Writers</option>
//             </select>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="space-y-3">
//           <button className="btn btn-success w-full" onClick={handleSave}>
//             Save
//           </button>
// <Pill  
// baseClass="bg-soft bg-opacity-70 "
// label={"View Collection"}
// onClick={() =>
//               router.push(Paths.collection.createRoute(colInView.id))
//             }/>
//           {/* <button
//             className="btn btn-outline w-full"
//             onClick={() =>
//               router.push(Paths.collection.createRoute(colInView.id))
//             }
//           >
      
//           </button> */}

//           {/* <button
//             className="btn btn-outline w-full flex gap-2"
//             onClick={() =>
//               router.push(Paths.addToCollection.createRoute(id))
//             }
//           >
//             <IonImg src={addIcon} className="w-5 h-5" />
//             Add Story
//           </button> */}
//           <Pill label={"Add story"} baseClass="bg-sky-200" icon={addIcon}  onClick={() =>
//               router.push(Paths.addToCollection.createRoute(id))
//             }/>
//         </div>

//         {/* SEGMENT */}
//         <div className="tabs tabs-boxed">
//           <a
//             className={`tab ${activeTab === "pages" && "tab-active"}`}
//             onClick={() => setActiveTab("pages")}
//           >
//             Pages
//           </a>
//           <a
//             className={`tab ${activeTab === "collections" && "tab-active"}`}
//             onClick={() => setActiveTab("collections")}
//           >
//             Collections
//           </a>
//         </div>

//         {/* LISTS */}
//         {activeTab === "pages" && (
//           <SortableList
//             items={newPages}
//             onOrderChange={setNewPages}
//             onDelete={(s) =>
//               dispatch(deleteStoryFromCollection({ stId: s.id }))
//             }
//           />
//         )}

//         {activeTab === "collections" && (
//           <SortableList
//             items={newCollections}
//             onOrderChange={setNewCollections}
//             onDelete={(c) =>
//               dispatch(deleteCollectionFromCollection({ tcId: c.id }))
//             }
//           />
//         )}

//         {/* DELETE */}
//         <button
//           className="btn btn-error btn-outline w-full mt-6"
//           onClick={handleDelete}
//         >
//           <IonImg src={deleteIcon} className="w-5 h-5" />
//           Delete Collection
//         </button>

//       </div>
//     </IonContent>
//   );
// }
// const Skeleton = () => (
//   <div className="max-w-lg mx-auto px-4 pt-6 space-y-4">
//     <div className="card bg-base-100 shadow-sm p-4 space-y-3">
//       <div className="skeleton h-4 w-24" />
//       <div className="skeleton h-6 w-full" />
//     </div>

//     <div className="card bg-base-100 shadow-sm p-4 space-y-3">
//       <div className="skeleton h-4 w-32" />
//       <div className="skeleton h-24 w-full" />
//     </div>

//     <div className="card bg-base-100 shadow-sm p-4 space-y-3">
//       <div className="skeleton h-6 w-full" />
//       <div className="skeleton h-6 w-full" />
//     </div>
//   </div>
// );   



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
import { useDialog } from "../../domain/usecases/useDialog";
import Pill from "../../components/Pill";

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
// const dialog = useSelector(state=>state.users.dialog)
const {dialog,openDialog,closeDialog,resetDialog}=useDialog()

  useEffect(() => {
    async function loadData() {

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
const tabs = [
  { key: "pages", label: "Pages" },
  { key: "collections", label: "Collections" },
];

const [activeTab, setActiveTab] = useState("pages");

// const TabBar = ({ active, onChange }) => (
//   <div className="flex justify-center gap-2 bg-gray-100 rounded-xl p-1 mb-4">
//     {/* {tabs.map((tab) => (
//       <button
//         key={tab.key}
//         onClick={() => onChange(tab.key)}
//         className={`
//           flex-1 text-center py-2 text-sm rounded-lg transition
//           ${active === tab.key
//             ? "text-white bg-soft shadow-sm"
//             : "bg-softBlue text-soft"
//           }
//         `}
//         role="tab"
//         aria-selected={active === tab.key}
//       >
//         {tab.label}
//       </button>
//     ))} */}
//     <div className="flex justify-center gap-2 p-1 rounded-xl bg-gray-100 shadow-sm mb-4">
//   {tabs.map(tab => (
//     <button
//       key={tab.key}
//       onClick={() => setActiveTab(tab.key)}
//       className={`flex-1 py-2 text-sm rounded-lg transition ${activeTab === tab.key ? "bg-blueSea text-white shadow-sm" : "bg-gray-100 text-gray-500"}`}
//     >
//       {tab.label}
//     </button>
//   ))}
// </div>
//   </div>
// );
const TabBar = ({ tabs,active, onChange }) => (
  <div className="flex flex-wrap gap-1 bg-gray-100 rounded-xl p-1 px-2 sm:px-4">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`
          text-center 
          px-3 py-1 
          text-xs sm:text-sm 
          rounded-lg transition 
          whitespace-nowrap
          ${active === tab.key
            ? "text-white bg-soft shadow-sm"
            : "bg-softBlue text-soft"}
        `}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
// export default TabBar;
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
      router.push(Paths.discovery);
    }
  };
  const roleCycle = [
  RoleType.commenter,
  RoleType.reader,
  RoleType.writer,
];
const cycleFollowersRole = () => {
  const currentIndex = roleCycle.indexOf(followersAre);
  const nextIndex = (currentIndex + 1) % roleCycle.length;
  setFollowersAre(roleCycle[nextIndex]);
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
   
    closeDialog()
    let dia = { ...dialog };
    // dia.title = "Deleting?";
    dia.isOpen = true;
    dia.agree = () => {
     
     
      dispatch(deleteCollection(params)).then(()=>{
   router.push(Paths.myProfile);
      resetDialog()
      })
        
   
    };
    dia.agreeText = "Delete";
    dia.onClose = () => closeDialog()
    dia.text = (
      <p>
        Are you sure you want to delete this <strong>{colInView.title}</strong>?
      </p>
    );
  openDialog(dia)
  };
  const openRoleForm=()=>{

    let dia = { ...dialog,scrollY:true };
    dia.title = null;
    dia.isOpen = true;
  dia.disagree = ()=>resetDialog()
  dia.disagreeText = "Close"
    dia.text = <RoleForm item={colInView} onClose={()=>closeDialog()}/>
    openDialog(dia)
  
  }
  if(loading||!colInView) return editCollectionSkeleton()
    return<IonContent fullscreen style={{ "--background": "#f8f6f1" }}>
  <div className="max-w-lg mx-auto px-4 pb-28 pt-6 space-y-6">

    {/* TITLE */}
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-soft mb-1">Title</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Collection title"
        className="w-[100%] text-lg font-semibold bg-transparent outline-none"
      />
    </div>

    {/* DESCRIPTION */}
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-soft mb-2">Description</p>
      <textarea
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Describe your collection"
        className="w-[100%] text-sm bg-transparent outline-none min-h-[120px]"
      />
    </div>

    {/* SETTINGS */}
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">

      <div className="flex flex-wrap gap-2">
        <Pill
          label={isOpen ? "Open Collaboration" : "Closed"}
          onClick={() => setIsOpen(!isOpen)}
          baseClass={
            isOpen
              ? "bg-softBlue text-blueSea"
              : "bg-gray-100 text-gray-600"
          }
        />

        <Pill
          label={isPrivate ? "Private" : "Public"}
          onClick={() => setIsPrivate(!isPrivate)}
          baseClass={
            isPrivate
              ? "bg-gray-100 text-gray-600"
              : "bg-softBlue text-blueSea"
          }
        />

      <Pill
  label={`Followers: ${followersAre}`}
  onClick={cycleFollowersRole}
  variant="secondary"
  color="soft"
/>
      </div>
    </div>

    {/* ACTIONS */}
    <div className="flex flex-wrap gap-3">

      <Pill
        label="Save"
        onClick={handleSave}
        baseClass="bg-blueSea text-white"
      />

      <Pill
        label="View"
        onClick={() =>
          router.push(Paths.collection.createRoute(colInView.id))
        }
        baseClass="bg-softBlue text-blueSea"
      />

      <Pill
        label="Add Story"
        icon={addIcon}
        onClick={() =>
          router.push(Paths.addToCollection.createRoute(id))
        }
        baseClass="bg-soft text-white"
      />
    </div>

    {/* TABS */}
  <TabBar tabs={[{label:"pages"},{label:"collections"}]} active={activeTab} onChange={setActiveTab}/>
    {/* <div className="flex gap-2">
      <Pill
        label="Pages"
        onClick={() => setActiveTab("pages")}
        baseClass={
          activeTab === "pages"
            ? "bg-blueSea text-white"
            : "bg-gray-100 text-gray-600"
        }
      />
      <Pill
        label="Collections"
        onClick={() => setActiveTab("collections")}
        baseClass={
          activeTab === "collections"
            ? "bg-blueSea text-white"
            : "bg-gray-100 text-gray-600"
        }
      />
    </div> */}

    {/* LISTS */}
    {activeTab === "pages" && (
      <SortableList
        items={newPages}
        onOrderChange={setNewPages}
        onDelete={(s) =>
          dispatch(deleteStoryFromCollection({ stId: s.id }))
        }
      />
    )}

    {activeTab === "collections" && (
      <SortableList
        items={newCollections}
        onOrderChange={setNewCollections}
        onDelete={(c) =>
          dispatch(deleteCollectionFromCollection({ tcId: c.id }))
        }
      />
    )}

    {/* DELETE */}
    <div className="pt-4">
      <Pill
        label="Delete Collection"
        icon={deleteIcon}
        onClick={handleDelete}
        baseClass="bg-golden text-white"
      />
    </div>

  </div>
</IonContent>
//   return (


//     <ErrorBoundary>         
// <IonContent fullscreen={true} style={{"--background":"#f4f4e0"}} className="ion-padding-top"> 
//   <div className="pb-[10em]">
  
    
//         {loading ? (
//           <div className="flex justify-center items-center h-[60vh]">
//             <IonSpinner name="crescent" color="success" />
//           </div>
//         ) : (
        
//           <div className="ion-padding sm:max-w-[50em] mx-auto">
        

//             {/* <IonList  lines="none"> */}
//               {/* Title */}
//               {/* <IonItem className="rounded-xl mb-3 border border-emerald-100">
//                 <IonLabel position="stacked" className="text-emerald-700">
//                   Title
//                 </IonLabel>
//                 <IonInput
//                   value={title}
//                   placeholder="Enter collection title"
//                   onIonChange={(e) =>{
//                     setCollection({ ...collection, title: e.detail.value })
//                     setTitle(e.detail.value)
//                   }}
//                   className="p-2 text-[1.8rem]"
//                 />
              
//                {canUserEdit? currentProfile.id == colInView.profileId?"You're the owner":<IonText >You are {canUserEdit.role=="editor"?"an":"a"} {canUserEdit.role}</IonText>:null}
            
//               </IonItem>
//   <div className="mt-4">
//     <div className="mb-1">
//                 <IonLabel position="stacked" className="text-emerald-700  text-[1rem] font-bold">
//                   Description
//                 </IonLabel>
//                 </div>
//                 <textarea
//                 className="border border-blueSea p-3 min-h-[12em] w-full rounded-lg shadow-sm w-[100%] sm:max-w-[50em]"
//                   autoGrow={true}
//                   placeholder="Describe your collection"
//                   value={purpose}
              
//                   onIonChange={(e) =>{
//                     setCollection({
//                       ...collection,
//                       description: e.detail.value,
//                     })
//                     setPurpose(e.detail.value)
//                   }}
//                   // className="p-2 "
//                 /> */}
//                   <div className="bg-white rounded-xl shadow p-4">
//       <IonLabel position="stacked" className="text-emerald-700 font-semibold text-sm">Title</IonLabel>
//       <IonInput
//         value={title}
//         placeholder="Enter collection title"
//         onIonChange={(e) => setTitle(e.detail.value)}
//         className="mt-1 text-lg font-medium"
//       />
//       {canUserEdit && (
//         <IonText className="text-xs text-gray-500 mt-1 block">
//           {currentProfile.id === colInView.profileId ? "You're the owner" : `You are ${canUserEdit.role}`}
//         </IonText>
//       )}
//     </div>

//     {/* Description Card */}
//     <div className="bg-white rounded-xl shadow p-4">
//       <IonLabel className="text-emerald-700 font-semibold text-sm mb-2">Description</IonLabel>
//       <textarea
//         placeholder="Describe your collection"
//         value={purpose}
//         onChange={(e) => setPurpose(e.target.value)}
//         className="w-full p-3 rounded-lg border border-gray-200 shadow-sm min-h-[120px] text-sm"
//       />
//     </div>
// {/* </div> */}
//             {/* </IonList> */}
//               <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
//   {/* Open Collaboration Toggle */}
//   <button
//     onClick={() => setIsOpen(!isOpen)}
//     className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
//       ${isOpen
//         ? "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
//         : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
//       }`}
//   >
//     {isOpen ? "Open Collaboration Enabled" : "Close Collaboration"}
//   </button>
//   <div className="flex flex-row space-x-4">
//   <button
//     onClick={() =>openRoleForm()}
//     className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
// bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
//       `}
//   >
//     Roles
//   </button>
//   {collection && <button
//   onClick={()=>setOpenHashtag(!openHashtag)}
//   className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
// bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
//       `}
//   > {!openHashtag?"+":"-"} Hashtags</button>}

//   </div>
//   {/* Privacy Toggle */}
//   {collection && (
//   <div
//     className={`fixed inset-0 pb-20 z-50 transition-all duration-300 ${
//       openHashtag ? "pointer-events-auto" : "pointer-events-none"
//     }`}
//   >
//     {/* Overlay (click-away) */}
//     <div
//       onClick={() => setOpenHashtag(false)}
//       className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
//         openHashtag ? "opacity-100" : "opacity-0"
//       }`}
//     />

//     {/* Bottom Sheet */}
//     <div
//   className={`absolute left-0 w-full bg-white rounded-t-2xl shadow-xl p-4 pb-6 transform transition-transform duration-300 ${
//     openHashtag ? "translate-y-0" : "translate-y-full"
//   }`}
//   style={{
//     bottom: "calc(env(safe-area-inset-bottom) + 60px)"
//   }}
// >
    
//       <div className="w-12 h-1.5 bg-gray-300 rounded-full max-w-[100vw] mx-auto mb-4 shadow" />

//       <HashtagForm item={colInView} type="collection" />
//     </div>
//   </div>
// )}
//   {/* {openHashtag && collection && <HashtagForm item={colInView} type="collection"/>} */}
//   <button
//     onClick={() => setIsPrivate(!isPrivate)}
//     className={`w-full sm:w-60 flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border 
//       ${isPrivate
//         ? "bg-red-50 border-red-400 text-red-700 hover:bg-red-100"
//         : "bg-emerald-50 border-emerald-400 text-emerald-700 hover:bg-emerald-100"
//       }`}
//   >
//     {isPrivate ? "Private Collection" : "Public Collection"}
//   </button>
//       <FollowersDropdown followersAre={followersAre}setFollowersAre={setFollowersAre}/>
//   <div className="flex flex-row space-between">

  
//  <IonImg    onClick={handleAddStory} src={addIcon} alt="Add" className="max-w-14 mx-4  btn rounded-full p-2 max-h-14 bg-soft" />
//   <div
//   className={`w-full my-auto mx-4 sm:w-60 flex items-center btn  border border-blueSea border-1 justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 shadow-sm border`}
//   onClick={() => router.push(Paths.collection.createRoute(colInView.id))}
// >
// <IonText>View Collection</IonText>
// </div>
//   </div>  
//   <div className="mb-4 w-[100%]">         
//   <IonText
//                 onClick={handleSave}
//                 className="text-white btn bg-blueSea w-[100%] sm:max-w-[50em]  text-center font-bold text-[1rem] py-3 rounded-full font-medium"
//               >
//                 Save
//               </IonText>
//               </div>
//   </div>
//             <TabBar active={activeTab} onChange={setActiveTab} />

// {activeTab === "pages" && (
//   <SortableList
//     items={newPages}
//     onOrderChange={handleStoryOrderChange}
//     onDelete={deleteStory}
//   />
// )}

// {activeTab === "collections" && (
//   <SortableList
//     items={newCollections}
//     onOrderChange={handleColOrderChange}
//     onDelete={deleteChildFromCollection}
//   />
// )}
       

//             {/* ===== DANGER ZONE ===== */}
//            {colInView && currentProfile && <div className="mt-10 border-t border-gray-200 pt-4">
//               <h4 className="text-sm font-semibold text-red-600 mb-2">
//                 Danger Zone
//               </h4>
          
//                 <IonImg   onClick={handleDelete} src={deleteIcon} alt="Delete" className="max-w-12 max-h-12 rounded-lg bg-red-400" />
//                 <span>Delete Collection</span>
           
//             </div>}
//           </div>
//         )}
//         </div>
//       </IonContent>

//  </ErrorBoundary>
//   );
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



const editCollectionSkeleton = () => (
  <div className="ion-padding sm:max-w-[50em] mx-auto animate-pulse">
    
    {/* Title Input Skeleton */}
    <div className="rounded-xl mb-3 border border-emerald-100 p-4 shadow-sm bg-white">
      <div className="h-3 w-20 bg-emerald-200 rounded mb-3 shadow" />
      <div className="h-8 w-full bg-gray-200 rounded shadow" />
    </div>

    {/* Description Skeleton */}
    <div className="mt-4 shadow-sm">
      <div className="h-3 w-28 bg-emerald-200 rounded mb-2 shadow" />
      <div className="h-[10em] w-full bg-gray-200 rounded-lg shadow" />
    </div>

    {/* Buttons Skeleton */}
    <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="w-full sm:w-60 h-10 bg-gray-200 rounded-full shadow"
        />
      ))}
    </div>

    {/* Tab Bar Skeleton */}
    <div className="mt-8 flex gap-4 justify-center">
      <div className="w-24 h-8 bg-gray-200 rounded-full shadow" />
      <div className="w-24 h-8 bg-gray-200 rounded-full shadow" />
    </div>

    {/* List Skeleton */}
    <div className="mt-6 space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-4 rounded-full bg-white border border-gray-200 shadow-sm"
        >
          <div className="h-4 w-32 bg-gray-200 rounded shadow" />
          <div className="w-8 h-8 bg-gray-300 rounded-full shadow" />
        </div>
      ))}
    </div>

  </div>
) 