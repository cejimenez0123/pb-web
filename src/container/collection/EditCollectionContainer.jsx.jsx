import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
  IonCard,
  IonCardContent,
  IonImg,
  IonTextarea,
} from "@ionic/react";
import deleteIcon from "../../images/icons/delete.svg"
import arrowDown from "../../images/icons/arrow_down.svg"
// import {  deleteStoryFromCollection,  fetchCollectionProtected,  } from "../../actions/CollectionActions"
import add from "../../images/icons/add_circle.svg"
import view from "../../images/icons/view.svg"
import { trashOutline, addCircleOutline, eyeOutline } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import Paths from "../../core/paths";
import { deleteCollection, deleteStoryFromCollection,deleteCollectionFromCollection, patchCollectionContent,  fetchCollectionProtected } from "../../actions/CollectionActions";
// import arrowDown from "../../images/icons/arrow_down.svg";
// import add from "../../images/icons/add_circle.svg";
// import view from "../../images/icons/view.svg";
import SortableList from "../../components/SortableList";
import checkResult from "../../core/checkResult";
import StoryToCollection from "../../domain/models/storyToColleciton";
import CollectionToCollection from "../../domain/models/ColllectionToCollection";
import RoleForm from "../../components/role/RoleForm";
import { RoleType } from "../../core/constants";
import Context from "../../context";
import HashtagForm from "../../components/hashtag/HashtagForm";
import { setDialog } from "../../actions/UserActions";

function getUniqueValues(array) {
  let unique = [];
  return array.filter(item => {
    let i = unique.indexOf(item.id);
    if (i < 0) {
      unique = [...unique, item.id];
      return true;
    }
    return false;
  });
}

export default function EditCollectionContainer(props) {
  const colInView = useSelector(state => state.books.collectionInView);
  const dialog = useSelector(state => state.users.dialog);
  const params = useParams();
  const { id } = params;
  const { isPhone } = useContext(Context);

  const [pending, setPending] = useState(true);
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [followersAre, setFollowersAre] = useState(RoleType.commenter);
  const { currentProfile, setError, setSuccess } = useContext(Context);
  const [canUserEdit, setCanUserEdit] = useState(false);

  const [newPages, setNewPages] = useState([]);
  const [newCollections, setNewCollections] = useState([]);
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openAccess, setOpenAccess] = useState(false);
  const handleRoleForm=()=>{
    let dia = {...dialog}
    dia.isOpen = true
    dia.title = "Manage Access"
    dia.text =(<div className="overflow-y-scroll h-[100%] overflow-x-hidden">
    <RoleForm item={colInView} onClose={() => setOpenAccess(false)} />
  </div>)
 
 
  }
  // --- Fetch the collection ---
  const getCol = () => {
    let token = localStorage.getItem("token");
    setNewPages([]);
    setNewCollections([]);
    if (token && (!colInView || colInView.id !== id)) {
      dispatch(fetchCollectionProtected(params)).then(res => {
        checkResult(res, payload => {
          setItems(payload.collection);
        }, err => {
          setPending(false);
          setCanUserEdit(false);
        });
      });
    }
  };

  useLayoutEffect(() => {
    getCol();
    // eslint-disable-next-line
  }, [location.pathname, id, currentProfile]);

  useLayoutEffect(() => {
    if (colInView && currentProfile && currentProfile.id) {
      soCanUserEdit();
    }
    // eslint-disable-next-line
  }, [currentProfile]);

  useEffect(() => {
    setInfo(colInView);
    setItems(colInView);
    // eslint-disable-next-line
  }, [colInView]);

  // --- Extract info from collection ---
  const setInfo = col => {
    if (col) {
      setTitle(col.title);
      setPurpose(col.purpose);
      setIsPrivate(col.isPrivate);
      setFollowersAre(col.followersAre ?? RoleType.commenter);
      handleSetOpen(col.isOpenCollaboration);
    }
  };

  // --- Permissions check ---
  const soCanUserEdit = () => {
    if (colInView && currentProfile && colInView.profileId === currentProfile.id) {
      setCanUserEdit(true);
      setPending(false);
      return;
    }
    setCanUserEdit(false);
    setPending(false);
  };

  // --- Form handlers ---  
  const handleDeleteCollection = () => {
    dispatch(deleteCollection(params)).then(res =>
      checkResult(res, payload => { navigate(Paths.myProfile()); }, err => {})
    );
  };

  const updateCollection = (e) => {
    e.preventDefault();
    dispatch(patchCollectionContent({
      id: params.id,
      isPrivate,
      isOpenCollaboration: isOpen,
      title,
      purpose,
      storyToCol: newPages,
      colToCol: newCollections,
      col: colInView,
      profile: currentProfile
    })).then(res => {
      setError(null);
      setSuccess("Successful Update");
    }, err => {
      setSuccess(null);
      setError(err.message);
    });
  };

  useEffect(() => {
    if (isOpen) setFollowersAre(RoleType.writer);
  }, [isOpen]);

  const handleSetOpen = (open) => {
    setIsOpen(open);
    if (open) {
      const arr = [RoleType.writer, RoleType.editor];
      if (!arr.includes(followersAre)) {
        setFollowersAre(RoleType.writer);
      }
    }
  };

  // --- Extract & sort items from collection ---
  const setItems = (col) => {
    if (col) {
      if (col.storyIdList) {
        let stcList = [...col.storyIdList].map((stc, i) => {
          let index = stc.index || i;
          return new StoryToCollection(stc.id, index, stc.collection, stc.story, currentProfile);
        });
        let list = [...stcList].sort((a, b) => (b.index && a.index && b.index > a.index));
        setNewPages(list);
      }
      if (col.childCollections) {
        const newList = [...col.childCollections].sort((a, b) => (a.index && b.index && b.index > a.index))
          .map((stc, i) => new CollectionToCollection(stc.id, i, stc.childCollection, colInView, currentProfile));
        setNewCollections(newList);
      }
    }
  };

  // --- Handle order changes ---
  const handleStoryOrderChange = (newOrder) => {
    let list = newOrder.map((stc, i) => new StoryToCollection(stc.id, i, stc.collection, stc.story, currentProfile));
    setNewPages(list);
  };
  const handleColOrderChange = (newOrder) => {
    let list = newOrder.map((stc, i) => new CollectionToCollection(stc.id, i, stc.childCollection, colInView, currentProfile));
    setNewCollections(list);
  };

  // --- Delete handlers ---
  const deleteChildFromCollection = (tc) => {
    if (tc) dispatch(deleteCollectionFromCollection({ tcId: tc.id }));
  };
  const deleteStory = (stc) => {
    dispatch(deleteStoryFromCollection({ stId: stc.id }));
  };


  const deleteHandler=()=>{
    let dia = {...dialog}
dia.title = "Deleting?"
dia.isOpen=true
dia.agree=handleDeleteCollection
dia.agreeText ="Delete"
dia.onClose=()=>{
  dispatch(setDialog({isOpen:false}))
}
dia.text = ( <p>Are you sure you want to delete this <strong>{colInView.title}</strong>?</p>
)
dispatch(setDialog(dia))
  }
  if (!colInView) {
    return (
      <IonContent fullscreen>
        <div className="skeleton w-96 bg-emerald-50 max-w-[96vw]  m-2 h-96" />
      </IonContent>
    );
  }

  if (colInView && canUserEdit) {
    return (
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center">Edit Collection: {colInView.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {!pending ? (
          <IonCard className="ion-margin mx-auto ion-padding">
            <IonCardContent>
              <div className="flex-col flex  ">
              <input
                onChange={e => setTitle(e.target.value)}
                type="text"
                className="bg-transparent  text-emerald-800 border-1 border-emerald-200 rounded-full px-2 py-2  mb-4 lora-medium text-2xl "
                value={title}
                placeholder="Collection Title"
                style={{ textAlign: "center" }}
              />
               <div
                    className="rounded-full justify-self-end bg-emerald-800 p-2 mx-auto cursor-pointer flex items-center justify-center"
                    style={{ width: 40, height: 40 }}
                    onClick={() => navigate(Paths.collection.createRoute(colInView.id))}
                  >
                    <IonImg src={view} style={{ width: 24, height: 24 }} alt="view" />
                  </div>
              </div>
              <div className="px-4">
              <IonTextarea
                onChange={e => setPurpose(e.target.value)}
                className="mb-4 text-[0.8rem]  text-emerald-800 border-emerald-600 bg-transparent    rounded-lg p-2"
                value={purpose}
                rows={4}
                cols={10}
                placeholder="Purpose / Description"
                style={{ textAlign: "left" }}
              />
              <HashtagForm item={colInView} />
              </div>
              <div className="mt-8 grid md:ml-12 gap-2 grid-cols-2">
            
<div
  className="rounded-full bg-emerald-800 px-6 py-3 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-900 transition"
  style={{ minWidth: 120, minHeight: 44 }}

  onClick={updateCollection}
>
  <IonText className="text-white font-semibold text-[1rem]">
    {/* Button label */}
    Update
  </IonText>
</div>

                {/* Icon buttons wrapped in styled divs */}
                <div className="flex flex-row justify-evenly items-center">
                <div
  className="rounded-full bg-emerald-800 px-6 py-3 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-900 transition"
  style={{ minWidth: 120, minHeight: 44 }}
  onClick={() => navigate(Paths.addToCollection.createRoute(colInView.id))}
>
  <IonImg src={add} style={{ width: 24, height: 24, marginRight: 8 }} alt="add" />
  <IonText className="text-white font-semibold text-[1rem]">
    Add New
  </IonText>
</div>

                  {/* <div
                    className="rounded-full bg-emerald-800 p-2 mx-auto cursor-pointer flex items-center justify-center"
                    style={{ width: 40, height: 40 }}
                    onClick={() => navigate(Paths.addToCollection.createRoute(colInView.id))}
                  >
                    <IonImg src={add} style={{ width: 24, height: 24 }} alt="add" />
                  </div> */}
                 
                </div>
                {/* Collab open/close */}
                {isOpen ? (
  <div
    className="rounded-full border-2 border-yellow-500 bg-yellow-50 px-4 py-2 mx-auto flex items-center justify-center cursor-pointer hover:bg-yellow-100 transition"
    style={{ minWidth: 140, minHeight: 44 }}
    onClick={() => setIsOpen(false)}
  >
    <IonText className="text-yellow-700 text-cetner  w-[5rem] font-semibold text-[0.8rem]">
      Collection is Open Collab
    </IonText>
  </div>
) : (
  <div
    className="rounded-full border-2 border-gray-300 bg-gray-50 px-4 py-2   mx-auto flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
    style={{ minWidth: 140, minHeight: 44 }}
    onClick={() => setIsOpen(true)}
  >
    <IonText className="text-gray-700 font-semibold text-center w-[5rem] text-[0.8rem]">
      Collection is Close Collab
    </IonText>
  </div>
)}

<div
  className={
    "rounded-full border-2 px-4 py-2 mx-auto flex items-center justify-center " +
    (isPrivate
      ? "border-red-500 bg-red-50 cursor-not-allowed"
      : "border-emerald-400 bg-emerald-50 cursor-not-allowed")
  }
  style={{ minWidth: 120, minHeight: 44, opacity: 0.7 }}
  onClick={()=>setIsPrivate(!isPrivate)}
  // tabIndex={-1} // for accessibility, since disabled
>
  <IonText
    className={
      isPrivate
        ? "text-red-600 font-semibold text-[1rem]"
        : "text-emerald-700 font-semibold text-[1rem]"
    }
  >
    {isPrivate ? "Is Private" : "Is Public"}
  </IonText>
</div>

             
                {/* Followers dropdown using IonImg */}
                <div className="mx-auto flex flex-col items-center">
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="w-[9rem] h-[4rem] border-2 border-emerald-600 text-center flex rounded-full items-center justify-center">
                      <span className="text-emerald-700 mx-auto mont-medium">
                        Followers are
                        <br />
                        <span className="text-emerald-700 flex-row flex items-center justify-center">
                          {followersAre}s
                          <IonImg src={arrowDown} style={{ width: 18, height: 18 }} alt="arrow" />
                        </span>
                      </span>
                    </div>
                    <ul tabIndex={0} className={`dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 p-2 shadow ${isOpen ? "hidden" : ""}`}>
                      <li onClick={() => setFollowersAre(RoleType.commenter)}><a>{RoleType.commenter}</a></li>
                      <li onClick={() => setFollowersAre(RoleType.reader)}><a>{RoleType.reader}</a></li>
                      <li onClick={() => setFollowersAre(RoleType.writer)}><a>{RoleType.writer}</a></li>
                    </ul>
                  </div>
                </div>
                <div
  className="rounded-full bg-emerald-600 px-6 py-3 mx-auto flex items-center justify-center cursor-pointer hover:bg-emerald-700 transition"
  style={{ minWidth: 140, minHeight: 44 }}
  onClick={() => handleRoleForm()}
>
  <IonText className="text-white font-semibold text-[1rem]">
    Manage Access
  </IonText>
</div>

                
                {/* Delete icon */}
                <div
  className="rounded-full bg-emerald-800 p-2 mx-auto flex items-center justify-center cursor-pointer hover:bg-red-600"
  style={{ width: 44, height: 44 }}
  onClick={deleteHandler}
>
  <IonImg src={deleteIcon} style={{ width: 24, height: 24 }} alt="delete" />
</div>

             
              </div>
            </IonCardContent>
          </IonCard>
        ) : (
          <div className="w-[96vw] mx-auto md:w-info h-info flex justify-center items-center">
            <IonText color="medium" className="mx-auto my-auto text-emerald-700 text-2xl">
              You sure you're in the right place?
            </IonText>
          </div>
        )}

        <div className="w-[96vw] md:mt-8 mx-auto flex flex-col md:w-page">
          {/* Tabs for Pages and Collections */}
          <div role="tablist" className="tabs grid">
            <input type="radio" name="my_tabs_2" role="tab" defaultChecked className="tab hover:min-h-10 rounded-full mont-medium text-emerald-800 border-3 w-[96vw] md:w-page text-xl" aria-label="Pages" />
            <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
              <SortableList
                items={newPages}
                onOrderChange={handleStoryOrderChange}
                onDelete={deleteStory}
              />
            </div>
            <input type="radio" name="my_tabs_2" role="tab" className="tab hover:min-h-10 rounded-full mont-medium text-emerald-800 border-3 w-[96vw] md:w-page text-xl" aria-label="Collections" />
            <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
              <SortableList
                items={newCollections}
                onOrderChange={handleColOrderChange}
                onDelete={deleteChildFromCollection}
              />
            </div>
          </div>
        </div>
        {/* <Dialog
          isOpen={openAccess}
          onClose={() => setOpenAccess(false)}
          title={"Roles"}
          text={
            <div className="overflow-y-scroll h-[100%] overflow-x-hidden">
              <RoleForm item={colInView} onClose={() => setOpenAccess(false)} />
            </div>
          }
        /> */}
        {/* <Dialog
          title={"Deleting?"}
          isOpen={openDelete}
          agree={handleDeleteCollection}
          agreeText={"Delete"}
          onClose={() => setOpenDelete(false)}
          text={
            <p>Are you sure you want to delete this <strong>{colInView.title}</strong>?</p>
          }
        /> */}
      </IonContent>
    );
  }

  return (
    <IonContent fullscreen>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Loading...</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonText className="ion-text-center">
        <IonSpinner style={{ margin: '2rem auto', display: 'block' }} />
      </IonText>
    </IonContent>
  );
  
  // Not editable or not loaded
  // return (
  //   <IonContent fullscreen>
  //     <IonHeader>
  //       <IonToolbar>
  //         <IonTitle>Loading...</IonTitle>
  //       </IonToolbar>
  //     </IonHeader>
  //     <IonSpinner style={{ margin: '2rem auto', display: 'block' }} />
  //   </IonContent>
  // );
}
