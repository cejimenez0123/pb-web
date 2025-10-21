import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonTextarea,
  IonText,
  IonCard,
  IonCardContent
} from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Paths from "../../core/paths";
import {
  deleteCollection,
  deleteStoryFromCollection,
  deleteCollectionFromCollection,
  patchCollectionContent,
  fetchCollectionProtected,
} from "../../actions/CollectionActions";
import SortableList from "../../components/SortableList";
import StoryToCollection from "../../domain/models/storyToColleciton";
import CollectionToCollection from "../../domain/models/ColllectionToCollection";
import RoleForm from "../../components/role/RoleForm";
import { RoleType } from "../../core/constants";
import Context from "../../context";
import { useSelector, useDispatch } from "react-redux";
import HashtagForm from "../../components/hashtag/HashtagForm";
import { setDialog } from "../../actions/UserActions";

import deleteIcon from "../../images/icons/delete.svg";
import arrowDown from "../../images/icons/arrow_down.svg";
import add from "../../images/icons/add_circle.svg";
import view from "../../images/icons/view.svg";

export default function EditCollectionContainer() {
  const colInView = useSelector((state) => state.books.collectionInView);
  const dialog = useSelector((state) => state.users.dialog);
  const params = useParams();
  const { id } = params;
  const { currentProfile, setError, setSuccess } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pending, setPending] = useState(true);
  const [canUserEdit, setCanUserEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [followersAre, setFollowersAre] = useState(RoleType.commenter);
  const [newPages, setNewPages] = useState([]);
  const [newCollections, setNewCollections] = useState([]);

  // --- Fetch collection ---
  const getCol = async () => {
    const token = (await Preferences.get({ key: "token" })).value;
    setNewPages([]);
    setNewCollections([]);
    if (token && (!colInView || colInView.id !== id)) {
      dispatch(fetchCollectionProtected(params)).then((res) => {
        if (res.payload?.collection) setItems(res.payload.collection);
        setPending(false);
      });
    }
  };

  useLayoutEffect(() => {
    getCol();
    // eslint-disable-next-line
  }, [location.pathname, id, currentProfile]);

  useLayoutEffect(() => {
    if (colInView && currentProfile) checkPermissions();
    // eslint-disable-next-line
  }, [currentProfile]);

  useEffect(() => {
    if (colInView) {
      setInfo(colInView);
      setItems(colInView);
    }
    // eslint-disable-next-line
  }, [colInView]);

  const checkPermissions = () => {
    if (colInView.profileId === currentProfile.id) setCanUserEdit(true);
    setPending(false);
  };

  const setInfo = (col) => {
    if (!col) return;
    setTitle(col.title);
    setPurpose(col.purpose);
    setIsPrivate(col.isPrivate);
    setIsOpen(col.isOpenCollaboration);
    setFollowersAre(col.followersAre ?? RoleType.commenter);
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

  const updateCollection = (e) => {
    e.preventDefault();
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

  const handleStoryOrderChange = (newOrder) => {
    setNewPages(newOrder.map((stc, i) => new StoryToCollection(stc.id, i, stc.collection, stc.story, currentProfile)));
  };

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

  const deleteHandler = () => {
    let dia = { ...dialog };
    dia.title = "Deleting?";
    dia.isOpen = true;
    dia.agree = () => {
      dispatch(deleteCollection(params));
      navigate(Paths.myProfile());
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

  const handleRoleForm = () => {
    let dia = { ...dialog };
    dia.isOpen = true;
    dia.title = "Manage Access";
    dia.text = (
      <div className="overflow-y-scroll h-[100%] overflow-x-hidden">
        <RoleForm item={colInView} onClose={() => dispatch(setDialog({ isOpen: false }))} />
      </div>
    );
    dispatch(setDialog(dia));
  };

  if (!colInView) {
    return (
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="ion-text-center">Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    );
  }

  return (
    <IonContent fullscreen scrollY>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Edit Collection: {colInView.title}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {!pending && canUserEdit && (
        <IonCard className="ion-margin mx-auto ion-padding">
          <IonCardContent>
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Collection Title"
                className="bg-transparent text-emerald-800 border-1 border-emerald-200 rounded-full px-2 py-2 mb-4 text-2xl text-center"
              />

              <div
                className="rounded-full justify-center bg-emerald-800 p-2 cursor-pointer flex items-center"
                style={{ width: 40, height: 40 }}
                onClick={() => navigate(Paths.collection.createRoute(colInView.id))}
              >
                <IonImg src={view} style={{ width: 24, height: 24 }} alt="view" />
              </div>

              <IonTextarea
                value={purpose}
                onIonChange={(e) => setPurpose(e.detail.value)}
                placeholder="Purpose / Description"
                className="mb-4 text-[0.8rem] text-emerald-800 border-emerald-600 bg-transparent rounded-lg p-2"
                rows={4}
              />

              <HashtagForm item={colInView} />

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div
                  className="rounded-full bg-emerald-800 px-6 py-3 cursor-pointer hover:bg-emerald-900"
                  onClick={updateCollection}
                >
                  <IonText className="text-white font-semibold">Update</IonText>
                </div>

                <div
                  className="rounded-full bg-emerald-800 px-6 py-3 flex items-center justify-center cursor-pointer hover:bg-emerald-900"
                  onClick={() => navigate(Paths.addToCollection.createRoute(colInView.id))}
                >
                  <IonImg src={add} style={{ width: 24, height: 24, marginRight: 6 }} />
                  <IonText className="text-white font-semibold">Add New</IonText>
                </div>

                <div
                  className="rounded-full bg-emerald-600 px-6 py-3 cursor-pointer hover:bg-emerald-700"
                  onClick={handleRoleForm}
                >
                  <IonText className="text-white font-semibold">Manage Access</IonText>
                </div>

                <div
                  className="rounded-full bg-red-600 px-6 py-3 cursor-pointer hover:bg-red-700"
                  onClick={deleteHandler}
                >
                  <IonText className="text-white font-semibold">Delete</IonText>
                </div>
              </div>

              {/* Collab / Private */}
              <div className="mt-4 flex flex-col items-center gap-3">
                <div
                  className={`rounded-full px-4 py-2 ${
                    isOpen ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-gray-50"
                  } border-2 cursor-pointer`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <IonText className={`${isOpen ? "text-yellow-700" : "text-gray-700"} font-semibold text-[0.8rem]`}>
                    {isOpen ? "Collection is Open Collab" : "Collection is Close Collab"}
                  </IonText>
                </div>

                <div
                  className={`rounded-full px-4 py-2 ${
                    isPrivate ? "border-red-500 bg-red-50" : "border-emerald-400 bg-emerald-50"
                  } border-2 cursor-pointer opacity-70`}
                  onClick={() => setIsPrivate(!isPrivate)}
                >
                  <IonText className={`${isPrivate ? "text-red-600" : "text-emerald-700"} font-semibold text-[1rem]`}>
                    {isPrivate ? "Is Private" : "Is Public"}
                  </IonText>
                </div>

                {/* Followers */}
                <div className="flex flex-col items-center">
                  <div className="dropdown">
                    <div
                      tabIndex={0}
                      role="button"
                      className="w-[9rem] h-[4rem] border-2 border-emerald-600 text-center flex rounded-full items-center justify-center"
                    >
                      <span className="text-emerald-700">
                        Followers are <br />
                        {followersAre}s <IonImg src={arrowDown} style={{ width: 18, height: 18 }} />
                      </span>
                    </div>
                    <ul className="dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 p-2 shadow">
                      <li onClick={() => setFollowersAre(RoleType.commenter)}>Commenter</li>
                      <li onClick={() => setFollowersAre(RoleType.reader)}>Reader</li>
                      <li onClick={() => setFollowersAre(RoleType.writer)}>Writer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      )}

      {/* Tabs for Pages and Collections */}
      <div className="w-[96vw] md:mt-8 mx-auto flex flex-col md:w-page">
        <div role="tablist" className="tabs grid">
          <input type="radio" name="my_tabs_2" role="tab" defaultChecked className="tab" aria-label="Pages" />
          <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
            <SortableList items={newPages} onOrderChange={handleStoryOrderChange} onDelete={deleteStory} />
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Collections" />
          <div role="tabpanel" className="tab-content pt-1 lg:py-4 rounded-lg md:mx-auto">
            <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteChildFromCollection} />
          </div>
        </div>
      </div>
    </IonContent>
  );
}




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

// import {
//   IonHeader,
//   IonToolbar,
//   IonButtons,
//   IonBackButton,
//   IonButton,
//   IonTitle,
//   IonContent,
//   IonList,
//   IonItem,
//   IonLabel,
//   IonInput,
//   IonTextarea,
//   IonImg,
//   IonSpinner,
//   IonText,
// } from "@ionic/react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCollectionProtected } from "../../actions/CollectionActions";
// import Paths from "../../core/paths";
// import addIcon from "../../images/icons/add_circle.svg"
// import view from "../../images/icons/view.svg"
//  import deleteIcon from "../../images/icons/delete.svg"
// // import saveIcon from "../../assets/icons/save.svg";
// import "../../styles/EditBook.css"

// const EditCollectionContainer = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { currentProfile } = useSelector((state) => state.users.currentProfile);
//   const [collection, setCollection] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load collection data
//   useEffect(() => {
//     async function loadData() {
//       const col = await dispatch(fetchCollectionProtected(id));
//       if (col) setCollection(col);
//       setLoading(false);
//     }
//     loadData();
//   }, [id]);

//   const handleBack = () => navigate(Paths.discovery());
//   const handleSave = () => console.log("Save collection", collection);
//   const handleAddStory = () => console.log("Add new story");
//   const handleDelete = () => console.log("Delete collection");

//   const canUserEdit = currentProfile?.id === collection?.profile?.id;

//   return (
//     <>
//       {/* ===== HEADER ===== */}
//       <IonHeader translucent>
//         <IonToolbar>
//           <IonButtons slot="start">
//             <IonBackButton defaultHref={Paths.discovery()} onClick={handleBack} />
//           </IonButtons>

//           <IonTitle className="text-emerald-800 font-semibold truncate">
//             Edit Collection
//           </IonTitle>

//           {canUserEdit && (
//             <IonButtons slot="end">
//               <IonButton onClick={handleSave}>
//                 <IonText>Save</IonText>
//                 {/* <IonImg src={saveIcon} alt="Save" className="icon-btn" /> */}
//               </IonButton>
//             </IonButtons>
//           )}
//         </IonToolbar>
//       </IonHeader>

//       {/* ===== CONTENT ===== */}
//       <IonContent fullscreen className="ion-padding bg-gray-50">
//         {loading ? (
//           <div className="flex justify-center items-center h-[60vh]">
//             <IonSpinner name="crescent" />
//           </div>
//         ) : (
//           <>
//             <div className="max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-sm border border-emerald-100">
//               <h2 className="text-lg font-semibold text-emerald-700 mb-3">
//                 {collection?.title || "Untitled Collection"}
//               </h2>

//               <IonList lines="none">
//                 <IonItem className="rounded-xl my-2">
//                   <IonLabel position="stacked">Title</IonLabel>
//                   <IonInput
//                     value={collection?.title}
//                     onIonChange={(e) =>
//                       setCollection({ ...collection, title: e.detail.value })
//                     }
//                   />
//                 </IonItem>

//                 <IonItem className="rounded-xl my-2">
//                   <IonLabel position="stacked">Description</IonLabel>
//                   <IonTextarea
//                     autoGrow
//                     value={collection?.description}
//                     onIonChange={(e) =>
//                       setCollection({
//                         ...collection,
//                         description: e.detail.value,
//                       })
//                     }
//                   />
//                 </IonItem>
//               </IonList>

//               {/* ===== STORY LIST ===== */}
//               <div className="mt-6">
//                 <h3 className="text-emerald-700 font-medium mb-2">
//                   Stories in this Collection
//                 </h3>

//                 {collection?.storyIdList?.length > 0 ? (
//                   <div className="space-y-2">
//                     {collection.storyIdList.map((stc, i) => (
//                       <div
//                         key={i}
//                         className="p-3 rounded-lg bg-emerald-50 flex justify-between items-center"
//                       >
//                         <span className="truncate text-sm font-medium text-gray-700">
//                           {stc.story?.title || "(Untitled Story)"}
//                         </span>
//                         <IonButton
//                           fill="clear"
//                           size="small"
//                           color="danger"
//                           onClick={() =>
//                             setCollection({
//                               ...collection,
//                               storyIdList: collection.storyIdList.filter(
//                                 (s) => s.id !== stc.id
//                               ),
//                             })
//                           }
//                         >
//                           <IonImg
//                             src={deleteIcon}
//                             alt="Delete"
//                             className="icon-btn"
//                           />
//                         </IonButton>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">
//                     No stories added yet.
//                   </p>
//                 )}

//                 <IonButton
//                   expand="block"
//                   fill="solid"
//                   color="success"
//                   className="mt-4 rounded-xl"
//                   onClick={handleAddStory}
//                 >
//                   <IonImg src={addIcon} alt="Add" className="w-4 h-4 mr-2" />
//                   Add New Story
//                 </IonButton>
//               </div>

//               {/* ===== DANGER ZONE ===== */}
//               <div className="mt-10 border-t border-gray-200 pt-4">
//                 <h4 className="text-sm font-semibold text-red-600 mb-2">
//                   Danger Zone
//                 </h4>
//                 <IonButton
//                   expand="block"
//                   color="danger"
//                   fill="outline"
//                   onClick={handleDelete}
//                   className="rounded-xl"
//                 >
//                   <IonImg src={deleteIcon} alt="Delete" className="w-4 h-4 mr-2" />
//                   Delete Collection
//                 </IonButton>
//               </div>
//             </div>
//           </>
//         )}
//       </IonContent>
//     </>
//   );
// };

// export default EditCollectionContainer;
