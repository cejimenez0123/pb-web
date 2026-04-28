import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { IonContent } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ErrorBoundary from "../../ErrorBoundary";
import {  getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  getMyCollections,
  setCollections,
} from "../../actions/CollectionActions";
import PaginatedList from "../../components/page/PaginatedList"
import { useParams } from "react-router";
import { useDialog } from "../../domain/usecases/useDialog";
import { PageType } from "../../core/constants";
import truncate from "html-truncate";
import Enviroment from "../../core/Enviroment";
import Pill from "../../components/Pill";
import shortName from "../../core/shortName";
import getBackground, { watchBackground } from "../../core/getbackground";
// ── Layout tokens ──────────────────────────────────────
const WRAP         = "max-w-2xl mx-auto px-4";
const PAGE_Y       = "py-6";
const PAGE_STACK   = "space-y-6";
const FADE_IN = "transition-all duration-500 ease-out";
const CARD         = "bg-base-bg rounded-2xl p-4 shadow-sm";
const SECTION_STACK = "space-y-2";

const LABEL        = "text-xs text-gray-500";
const INPUT_WRAP   = "bg-base-bg rounded-2xl px-4 py-2 shadow-sm border border-soft";
export default function AddToCollectionsContainer() {
  const { setError, seo, setSeo } = useContext(Context);
  const { currentProfile } = useSelector((state) => state.users);
  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

  const { id, type } = useParams(); // id = item to add, type = "story" | "collection"
  const dispatch = useDispatch();

  const collectionInView = useSelector((state) => state.books.collectionInView);
  const pageInView = useSelector((state) => state.pages.pageInView);


  const [item, setItem] = useState(
    type === "collection" ? collectionInView : pageInView
  );
const refreshItem = async () => {
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
};
  // Close dialogs on load
  useEffect(() => closeDialog(), []);

  // Filter collections for adding



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
useEffect(() => {
  getBackground();
  watchBackground();
}, []);
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
  }

  // Loading state
  if (!item) {
    return (
      <IonContent fullscreen >
       <div className={`${WRAP} ${PAGE_Y} ${PAGE_STACK} animate-pulse`}>
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
      <IonContent fullscreen className="page-content">
    
<div className={`${WRAP}  bg-base-surface pb-26 dark:bg-base-bgDark ${PAGE_Y} ${PAGE_STACK}`}>
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-soft">Add to Collection</h1>
            <p className="text-sm text-gray-500">Choose where this belongs</p>
          </div>

          {/* Item Card */}
          <div className="bg-base-bg dark:bg-base-surfaceDark rounded-2xl p-4 shadow-sm space-y-2">
            <p className="text-xs text-soft opacity-70 dark:text-cream">Adding</p>
            <h2 className="text-lg font-semibold dark:text-cream">   {shortName(item.title,30)}</h2>
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
 
          <p className={LABEL+" "}>Your Collections</p>


  <div
    className={`${SECTION_STACK} ${FADE_IN} bg-base-surface dark:bg-base-bgDark  opacity-100 translate-y-0`}
  >
<PaginatedList
  cacheKey="collections"
  fetcher={getMyCollections}
  pageSize={10}
  enableInternalSearch={true}
  className="bg-base-surface dark:bg-base-bgDark "
  renderItem={(col) => {
    if(item.id==col.id)return
   return <AddToItem key={col.id ?? col.title} col={col} item={item} onSuccess={refreshItem} />
  }}
/>
    
  
  </div>

          </div>
       
      </IonContent>
    </ErrorBoundary>
  );
}
function CollectionsSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-2xl" />
      ))}
    </div>
  );
}
function EmptyCollections({ onCreate }) {
  return (
    <div className="text-center py-10 space-y-3">
      <p className="text-sm text-gray-500">
        No collections yet
      </p>
      <button
        onClick={onCreate}
        className="px-4 py-2 bg-emerald-700 text-white rounded-full text-sm"
      >
        Create your first collection
      </button>
    </div>
  );
}