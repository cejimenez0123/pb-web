
// import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
// import {
//   IonContent,
//   IonText,
//   IonSkeletonText,
//   IonList,
//   IonItem,
//   IonLabel,
//   IonSearchbar,
//   useIonRouter,
// } from "@ionic/react";
// import { useDispatch, useSelector } from "react-redux";
// import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
// import AddToItem from "../../components/collection/AddToItem";
// import checkResult from "../../core/checkResult";
// import Context from "../../context";
// import ErrorBoundary from "../../ErrorBoundary";
// import { getStory } from "../../actions/StoryActions";
// import {
//   fetchCollectionProtected,
//   setCollections,
// } from "../../actions/CollectionActions";
// import Paths from "../../core/paths";
// import { Preferences } from "@capacitor/preferences";
// import { useParams } from "react-router";
// import { useDialog } from "../../domain/usecases/useDialog";
// import { getCurrentProfile } from "../../actions/UserActions";
// import { PageType } from "../../core/constants";
// import truncate from "html-truncate";
// import Enviroment from "../../core/Enviroment";

// export default function AddStoryToCollectionContainer() {
//   const { setError, seo, setSeo } = useContext(Context);
//   const { currentProfile } = useSelector(state => state.users);
//   const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

//   const { id, type } = useParams();
//   const dispatch = useDispatch();
//   const router = useIonRouter();

//   const [token, setToken] = useState(null);
//   const [search, setSearch] = useState("");

//   const collectionInView = useSelector((state) => state.books.collectionInView);
//   const pageInView = useSelector((state) => state.pages.pageInView);

//   const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);

//   const rawCollections = useSelector((state) => state.books.collections) || [];

//   // Close dialog on mount
//   useEffect(() => {
//     closeDialog();
//   }, []);

//   // Memo collections
//   const collections = useMemo(() => {
//     return rawCollections
//       .filter((col) => col && col.type && col.type !== "feedback")
//       .filter((col) => {
//         if (!col) return false;
//         if (item && item.id === col.id) return false;
//         if (search) return col.title.toLowerCase().includes(search.toLowerCase());
//         return true;
//       });
//   }, [rawCollections, item, search]);

//   useLayoutEffect(() => {
//     Preferences.get({ key: "token" }).then(tok => setToken(tok.value));
//   }, []);

//   useEffect(() => {
//     if (pageInView) {
//       setSeo({
//         ...seo,
//         title: `Add ${pageInView.title} to Collection`,
//         description: "Organize your stories into collections.",
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (currentProfile) {
//       dispatch(setCollections({ collections: currentProfile.collections }));
//     }
//   }, [currentProfile, collectionInView, pageInView]);

//   useEffect(() => {

//     getContent();
//   }, [currentProfile]);

//   const getContent = () => {
//     switch (type) {
//       case "story":
//         dispatch(getStory({ id })).then(res =>
//           checkResult(res, payload => setItem(payload.story), err => setError(err.message))
//         );
//         break;
//       case "collection":
//         dispatch(fetchCollectionProtected({ id })).then(res =>
//           checkResult(res, payload => setItem(payload.collection), err => setError(err.message))
//         );
//         break;
//       default:
//         break;
//     }
//   };

//   const openNewCollectionForm = () => {
//     let dia = { ...dialog };
//     dia.text = (
//       <CreateCollectionForm
//         initPages={[pageInView]}
//         onClose={() => resetDialog()}
//       />
//     );
//     dia.title = "New Collection";
//     dia.isOpen = true;
//     dia.disagreeText = "Close";
//     openDialog(dia);
//   };

//   const handleBack = (e) => {
//     e.preventDefault();
//     if (window.history.length > 1) {
//       router.goBack();
//     } else {
//       router.push(Paths.discovery);
//     }
//   };

//   if (!item) {
//     return (
//       <IonContent             style={{ "--background":Enviroment.palette.cream}} fullscreen className="ion-padding">
//         <IonSkeletonText animated style={{ height: 120, marginBottom: 16 }} />
//         <IonSkeletonText animated style={{ height: 300 }} />
//       </IonContent>
//     );
//   }

//   return (
//     <ErrorBoundary>

//       {/* Native iOS Header */}
  

//       <IonContent             style={{ "--background": Enviroment.palette.cream}} fullscreen>

//         <div className="max-w-[50em] mx-auto px-4 py-4">

//           {/* Context Info */}
//           <IonText className="text-sm text-gray-500">
//             {collectionInView?.purpose ?? ""}
//           </IonText>
//          {item &&<div> <IonText className="text-[2em]">{item.title}</IonText>
//          <IonText>{item.author && item.type==PageType.text && <div dangerouslySetInnerHTML={{__html:truncate(item.data,75,[])}}/>}</IonText></div>}

//           {/* View Item Button */}
//           <div className="mt-4 rounded-full">
//             <button
//               expand="block"
    
//               className="rounded-full bg-blueSea text-white text-[1.6em] w-[100%] btn"
//               onClick={() =>
//                 item.storyIdList
//                   ? router.push(Paths.collection.createRoute(id))
//                   : router.push(Paths.page.createRoute(id))
//               }
//             >
//               View {item.storyIdList ? item?.title?.slice(0, 10) : "Story"}
//             </button>
//           </div>
// <div className="bg-cream">
        
//           <div   className=" bg-cream">
//   <IonList style={{ background:"transaprent",paddingTop:0,marginTop:0}} inset={false}>
// <div className="bg-cream">
//     <IonItem lines="none" style={{ "--background": Enviroment.palette.cream }} >
//       <IonSearchbar
//         value={search}
//         onIonInput={(e) => setSearch(e.detail.value)}
//         placeholder="Search collections"
//       />
//     </IonItem>

//     {collections.map((col, i) => (
//       <AddToItem key={col.id || i} item={item} col={col} />
//     ))}
// </div>
//   </IonList>
// </div>
// {/* </div> */}
//         </div>
// </div>
//       </IonContent>
//     </ErrorBoundary>
//   );
// }

import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IonContent } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ErrorBoundary from "../../ErrorBoundary";
import { getMyStories, getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  getMyCollections,
  setCollections,
} from "../../actions/CollectionActions";
import { useParams } from "react-router";
import { useDialog } from "../../domain/usecases/useDialog";
import { PageType } from "../../core/constants";
import truncate from "html-truncate";
import Enviroment from "../../core/Enviroment";
import Pill from "../../components/Pill";

export default function AddToCollectionsContainer() {
  const { setError, seo, setSeo } = useContext(Context);
  const { currentProfile } = useSelector((state) => state.users);
  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

  const { id, type } = useParams(); // id = item to add, type = "story" | "collection"
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const collectionInView = useSelector((state) => state.books.collectionInView);
  const pageInView = useSelector((state) => state.pages.pageInView);
  const rawCollections = useSelector((state) => state.books.myCollections) || [];

  const [item, setItem] = useState(
    type === "collection" ? collectionInView : pageInView
  );

  // Close dialogs on load
  useEffect(() => closeDialog(), []);

  // Filter collections for adding
  const collections = useMemo(() => {
    return rawCollections
      .filter((c) => c && c.type && c.type !== "feedback")
      .filter((c) => {
        if (!c) return false;
        if (item && item.id === c.id) return false; // cannot add to itself
        if (search) return c.title.toLowerCase().includes(search.toLowerCase());
        return true;
      });
  }, [rawCollections, item, search]);

  // Load collections & stories
  useEffect(() => {
    if (currentProfile) {
      dispatch(getMyCollections());
      dispatch(getMyStories());
    }
  }, [currentProfile, dispatch]);

  // Optional: load token
  useLayoutEffect(() => {
    import("@capacitor/preferences").then(({ Preferences }) => Preferences.get({ key: "token" }));
  }, []);

  // SEO
  useEffect(() => {
    if (item) {
      setSeo({
        ...seo,
        title: `Add ${item.title} to Collections`,
        description: "Organize your stories and collections.",
      });
    }
  }, [item]);

  // Sync collections to store
  useEffect(() => {
    if (currentProfile) {
      dispatch(setCollections({ collections: currentProfile.collections }));
    }
  }, [currentProfile]);

  // Load the item to add
  useEffect(() => {
    if (!currentProfile) return;
    if (type === "story") {
      dispatch(getStory({ id })).then((res) =>
        checkResult(res, (payload) => setItem(payload.story), (err) => setError(err.message))
      );
    }
    if (type === "collection") {
      dispatch(fetchCollectionProtected({ id })).then((res) =>
        checkResult(res, (payload) => setItem(payload.collection), (err) => setError(err.message))
      );
    }
  }, [currentProfile]);

  // Open new collection form
  const openNewCollectionForm = () => {
    const dia = {
      ...dialog,
      text: <CreateCollectionForm initPages={type === "story" ? [pageInView] : []} onClose={() => resetDialog()} />,
      title: "New Collection",
      isOpen: true,
      disagreeText: "Close",
    };
    openDialog(dia);
  };

  // Loading state
  if (!item) {
    return (
      <IonContent fullscreen style={{ "--background": Enviroment.palette.cream }}>
        <div className="p-4 space-y-4 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-10 bg-gray-200 rounded-full w-32" />
          <div className="h-10 bg-gray-200 rounded-2xl" />
        </div>
      </IonContent>
    );
  }

  return (
    <ErrorBoundary>
      <IonContent fullscreen style={{ "--background": Enviroment.palette.cream }}>
        <div className="max-w-[42em] mx-auto px-4 py-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-soft">Add to Collection</h1>
            <p className="text-sm text-gray-500">Choose where this belongs</p>
          </div>

          {/* Item Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-xs text-soft opacity-70">Adding</p>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            {item.type === PageType.text && item.data && (
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: truncate(item.data, 120, []) }}
              />
            )}
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap gap-3">
            <Pill label="New Collection" onClick={openNewCollectionForm} variant="primary" color="soft" />
          </div>

          {/* Search */}
          <div className="bg-white rounded-2xl px-3 py-2 shadow-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {/* List Label */}
          <p className="text-xs text-gray-500 px-1">Your collections</p>

          {/* List */}
          <div className="space-y-2">
            {collections.map((col, i) => (
              <AddToItem key={col.id || i} col={col} item={item} /> // Pass `item` for both story or collection
            ))}
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}
// import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
// import { IonContent } from "@ionic/react";
// import { useDispatch, useSelector } from "react-redux";
// import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
// import AddToItem from "../../components/collection/AddToItem";
// import checkResult from "../../core/checkResult";
// import Context from "../../context";
// import ErrorBoundary from "../../ErrorBoundary";
// import { getMyStories, getStory } from "../../actions/StoryActions";
// import {
//   fetchCollectionProtected,
//   getMyCollections,
//   setCollections,
// } from "../../actions/CollectionActions";
// import Paths from "../../core/paths";
// import { Preferences } from "@capacitor/preferences";
// import { useParams } from "react-router";
// import { useDialog } from "../../domain/usecases/useDialog";
// import { PageType } from "../../core/constants";
// import truncate from "html-truncate";
// import Enviroment from "../../core/Enviroment";
// import Pill from "../../components/Pill";

// export default function AddStoryToCollectionContainer() {
//   const { setError, seo, setSeo } = useContext(Context);
//   const { currentProfile } = useSelector((state) => state.users);
//   const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

//   const { id, type } = useParams();
//   const dispatch = useDispatch();

//   const [search, setSearch] = useState("");

//   const collectionInView = useSelector((state) => state.books.collectionInView);
//   const pageInView = useSelector((state) => state.pages.pageInView);

//   const [item, setItem] = useState(
//     type === "collection" ? collectionInView : pageInView
//   );

//   const rawCollections =
//     useSelector((state) => state.books.myCollections) || [];

//   // ===== CLOSE MODALS ON LOAD =====
//   useEffect(() => {
//     closeDialog();
//   }, []);

//   // ===== FILTER COLLECTIONS =====
//   const collections = useMemo(() => {
//     return rawCollections
//       .filter((c) => c && c.type && c.type !== "feedback")
//       .filter((c) => {
//         if (!c) return false;
//         if (item && item.id === c.id) return false;
//         if (search)
//           return c.title.toLowerCase().includes(search.toLowerCase());
//         return true;
//       });
//   }, [rawCollections, item, search]);
// useEffect(() => {
//     if (currentProfile) {
//       dispatch(getMyCollections());
//       dispatch(getMyStories());
//     }
//   }, [currentProfile, dispatch]);
//   // ===== LOAD TOKEN (optional future use) =====
//   useLayoutEffect(() => {
//     Preferences.get({ key: "token" });
//   }, []);

//   // ===== SEO =====
//   useEffect(() => {
//     if (pageInView) {
//       setSeo({
//         ...seo,
//         title: `Add ${pageInView.title}`,
//         description: "Organize your stories into collections.",
//       });
//     }
//   }, []);

//   // ===== SET COLLECTIONS =====
//   useEffect(() => {
//     if (currentProfile) {
//       dispatch(
//         setCollections({ collections: currentProfile.collections })
//       );
//     }
//   }, [currentProfile]);

//   // ===== LOAD ITEM =====
//   useEffect(() => {
//     getContent();
//   }, [currentProfile]);

//   const getContent = () => {
//     if (type === "story") {
//       dispatch(getStory({ id })).then((res) =>
//         checkResult(
//           res,
//           (payload) => setItem(payload.story),
//           (err) => setError(err.message)
//         )
//       );
//     }

//     if (type === "collection") {
//       dispatch(fetchCollectionProtected({ id })).then((res) =>
//         checkResult(
//           res,
//           (payload) => setItem(payload.collection),
//           (err) => setError(err.message)
//         )
//       );
//     }
//   };

//   // ===== NEW COLLECTION =====
//   const openNewCollectionForm = () => {
//     let dia = { ...dialog };
//     dia.text = (
//       <CreateCollectionForm
//         initPages={[pageInView]}
//         onClose={() => resetDialog()}
//       />
//     );
//     dia.title = "New Collection";
//     dia.isOpen = true;
//     dia.disagreeText = "Close";
//     openDialog(dia);
//   };

//   // ===== LOADING =====
//   if (!item) {
//     return (
//       <IonContent
//         fullscreen
//         style={{ "--background": Enviroment.palette.cream }}
//       >
//         <div className="p-4 space-y-4 animate-pulse">
//           <div className="h-6 w-40 bg-gray-200 rounded" />
//           <div className="h-24 bg-gray-200 rounded-2xl" />
//           <div className="h-10 bg-gray-200 rounded-full w-32" />
//           <div className="h-10 bg-gray-200 rounded-2xl" />
//         </div>
//       </IonContent>
//     );
//   }

//   return (
//     <ErrorBoundary>
//       <IonContent
//         fullscreen
//         style={{ "--background": Enviroment.palette.cream }}
//       >
//         <div className="max-w-[42em] mx-auto px-4 py-6 space-y-6">

//           {/* ===== HEADER ===== */}
//           <div>
//             <h1 className="text-xl font-semibold text-soft">
//               Add to Collection
//             </h1>
//             <p className="text-sm text-gray-500">
//               Choose where this belongs
//             </p>
//           </div>

//           {/* ===== ITEM CARD ===== */}
//           <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
//             <p className="text-xs text-soft opacity-70">Adding</p>

//             <h2 className="text-lg font-semibold">{item.title}</h2>

//             {item.type === PageType.text && item.data && (
//               <div
//                 className="text-sm text-gray-600 line-clamp-3"
//                 dangerouslySetInnerHTML={{
//                   __html: truncate(item.data, 120, []),
//                 }}
//               />
//             )}
//           </div>

//           {/* ===== PRIMARY ACTIONS ===== */}
//           <div className="flex flex-wrap gap-3">
//             <Pill
//               label="New Collection"
//               onClick={openNewCollectionForm}
//               variant="primary"
//               color="soft"
//             />
//           </div>

//           {/* ===== SEARCH ===== */}
//           <div className="bg-white rounded-2xl px-3 py-2 shadow-sm">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search collections"
//               className="w-full bg-transparent outline-none text-sm"
//             />
//           </div>

//           {/* ===== LIST LABEL ===== */}
//           <p className="text-xs text-gray-500 px-1">
//             Your collections
//           </p>

//           {/* ===== LIST ===== */}
//           <div className="space-y-2">
//             {collections.map((col, i) => (
//               <AddToItem key={col.id || i} col={col} />
//             ))}
//           </div>
//         </div>
//       </IonContent>
//     </ErrorBoundary>
//   );
// }