import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonText,
  IonSkeletonText,
  IonList,
  IonItem,
  IonLabel,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ErrorBoundary from "../../ErrorBoundary";
import { getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  setCollections,
} from "../../actions/CollectionActions";
import Paths from "../../core/paths";
import { Preferences } from "@capacitor/preferences";
import { useParams } from "react-router";
import { useDialog } from "../../domain/usecases/useDialog";
import { getCurrentProfile } from "../../actions/UserActions";
import { PageType } from "../../core/constants";
import truncate from "html-truncate";
import Enviroment from "../../core/Enviroment";

export default function AddStoryToCollectionContainer() {
  const { setError, seo, setSeo } = useContext(Context);
  const { currentProfile } = useSelector(state => state.users);
  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

  const { id, type } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();

  const [token, setToken] = useState(null);
  const [search, setSearch] = useState("");

  const collectionInView = useSelector((state) => state.books.collectionInView);
  const pageInView = useSelector((state) => state.pages.pageInView);

  const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);

  const rawCollections = useSelector((state) => state.books.collections) || [];

  // Close dialog on mount
  useEffect(() => {
    closeDialog();
  }, []);

  // Memo collections
  const collections = useMemo(() => {
    return rawCollections
      .filter((col) => col && col.type && col.type !== "feedback")
      .filter((col) => {
        if (!col) return false;
        if (item && item.id === col.id) return false;
        if (search) return col.title.toLowerCase().includes(search.toLowerCase());
        return true;
      });
  }, [rawCollections, item, search]);

  useLayoutEffect(() => {
    Preferences.get({ key: "token" }).then(tok => setToken(tok.value));
  }, []);

  useEffect(() => {
    if (pageInView) {
      setSeo({
        ...seo,
        title: `Add ${pageInView.title} to Collection`,
        description: "Organize your stories into collections.",
      });
    }
  }, []);

  useEffect(() => {
    if (currentProfile) {
      dispatch(setCollections({ collections: currentProfile.collections }));
    }
  }, [currentProfile, collectionInView, pageInView]);

  useEffect(() => {
    dispatch(getCurrentProfile());
    getContent();
  }, []);

  const getContent = () => {
    switch (type) {
      case "story":
        dispatch(getStory({ id })).then(res =>
          checkResult(res, payload => setItem(payload.story), err => setError(err.message))
        );
        break;
      case "collection":
        dispatch(fetchCollectionProtected({ id })).then(res =>
          checkResult(res, payload => setItem(payload.collection), err => setError(err.message))
        );
        break;
      default:
        break;
    }
  };

  const openNewCollectionForm = () => {
    let dia = { ...dialog };
    dia.text = (
      <CreateCollectionForm
        initPages={[pageInView]}
        onClose={() => resetDialog()}
      />
    );
    dia.title = "New Collection";
    dia.isOpen = true;
    dia.disagreeText = "Close";
    openDialog(dia);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.goBack();
    } else {
      router.push(Paths.discovery);
    }
  };

  if (!item) {
    return (
      <IonContent             style={{ "--background":Enviroment.palette.cream}} fullscreen className="ion-padding">
        <IonSkeletonText animated style={{ height: 120, marginBottom: 16 }} />
        <IonSkeletonText animated style={{ height: 300 }} />
      </IonContent>
    );
  }

  return (
    <ErrorBoundary>

      {/* Native iOS Header */}
  

      <IonContent             style={{ "--background": Enviroment.palette.cream}} fullscreen>

        <div className="max-w-[50em] mx-auto px-4 py-4">

          {/* Context Info */}
          <IonText className="text-sm text-gray-500">
            {collectionInView?.purpose ?? ""}
          </IonText>
         {item &&<div> <IonText className="text-[2em]">{item.title}</IonText>
         <IonText>{item.author && item.type==PageType.text && <div dangerouslySetInnerHTML={{__html:truncate(item.data,75,[])}}/>}</IonText></div>}

          {/* View Item Button */}
          <div className="mt-4 rounded-full">
            <button
              expand="block"
    
              className="rounded-full bg-blueSea text-white text-[1.6em] w-[100%] btn"
              onClick={() =>
                item.storyIdList
                  ? router.push(Paths.collection.createRoute(id))
                  : router.push(Paths.page.createRoute(id))
              }
            >
              View {item.storyIdList ? item?.title?.slice(0, 10) : "Story"}
            </button>
          </div>
<div className="bg-cream">
        
          <div   className=" bg-cream">
  <IonList style={{ background:"transaprent",paddingTop:0,marginTop:0}} inset={false}>
<div className="bg-cream">
    <IonItem lines="none" style={{ "--background": Enviroment.palette.cream }} >
      <IonSearchbar
        value={search}
        onIonInput={(e) => setSearch(e.detail.value)}
        placeholder="Search collections"
      />
    </IonItem>

    {collections.map((col, i) => (
      <AddToItem key={col.id || i} item={item} col={col} />
    ))}
</div>
  </IonList>
</div>
{/* </div> */}
        </div>
</div>
      </IonContent>
    </ErrorBoundary>
  );
}