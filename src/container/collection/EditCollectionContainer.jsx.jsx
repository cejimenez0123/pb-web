



import {
 
  IonContent,

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
  const [search, setSearch] = useState("");

// Memoized filtered lists
const filteredPages = useMemo(() => {
  if (!search.trim()) return newPages;
  const lower = search.toLowerCase();
  return newPages.filter((s) => s.story?.title?.toLowerCase().includes(lower));
}, [newPages, search]);

const filteredCollections = useMemo(() => {
  if (!search.trim()) return newCollections;
  const lower = search.toLowerCase();
  return newCollections.filter((c) => c.childCollection?.title?.toLowerCase().includes(lower));
}, [newCollections, search]);

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
    {/* SEARCH */}
<div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder={`Search ${activeTab}...`}
    className="w-full bg-transparent outline-none text-sm"
  />
  <IonImg src={arrowDown} className="w-5 h-5" />
</div>
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
        items={filteredPages}
        onOrderChange={setNewPages}
        onDelete={(s) =>
          dispatch(deleteStoryFromCollection({ stId: s.id }))
        }
      />
    )}

    {activeTab === "collections" && (
      <SortableList
        items={filteredCollections}
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