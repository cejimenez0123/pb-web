import { debounce } from "lodash";
import { useEffect ,useState,useLayoutEffect, useContext} from "react";
import { setDialog } from "../../actions/UserActions";
import { useDispatch } from "react-redux";
import { IonList,IonItem,IonText,IonImg } from "@ionic/react";
import { useSelector } from "react-redux";
import loadingGif from "../../images/loading.gif"
import bookmarkFill from "../../images/bookmarkfill.svg";
import { RoleType } from "../../core/constants";
import bookmarkadd from "../../images/bookmark_add.svg"
import Context from "../../context";
import { sendGAEvent } from "../../core/ga4";
import { addStoryListToCollection } from "../../actions/CollectionActions";
import checkResult from "../../core/checkResult";
import Enviroment from "../../core/Enviroment";
export default function ShareList({ page, profile, archive,setArchive, bookmark, setBookmarked }) {
  const [localBookmark, setLocalBookmark] = useState(bookmark);
  const {setSuccess,setError}=useContext(Context)
  const dialog = useSelector(state=>state.users.dialog)
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const [canUserEdit,setCanUserEdit ]=useState(false)
  const [loading,setLoading]=useState(false)
//    const [bookmarked, setBookmarked] = useState(null);

  function soCanUserEdit() {
    const roles = [RoleType.editor];
    if (currentProfile && page) {
      if (currentProfile.id === page.authorId) {
        setCanUserEdit(true);
        return;
      }
      if (page.betaReaders) {
        let found = page.betaReaders.find((rTc) => rTc.profileId === currentProfile.id && roles.includes(rTc.role));
        setCanUserEdit(found);
      }
    }
  }
    const onBookmarkPage = () => {
    setLoading(true);
    if (currentProfile && currentProfile.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      if (ptc && ptc.collectionId && page && page.id) {
        dispatch(addStoryListToCollection({ id: ptc.collectionId, list: [page], profile: currentProfile })).then(
          (res) => {
            checkResult(
              res,
              ({ collection }) => {
                let bookmark = collection.storyIdList.find((stc) => stc.storyId == page.id);
                setArchive(collection);
                setBookmarked(bookmark);
                setLoading(false);
                setSuccess("Added Successfully");
              },
              () => {
                setError("Error");
                setLoading(false);
              }
            );
          }
        );
      }
    } else {
      setLoading(false);
    }
  };
    useLayoutEffect(() => {
    // soCanUserComment();
    soCanUserEdit();
  }, [page, currentProfile]);
  const dispatch = useDispatch()
    const copyShareLink = () => {
    dispatch(setDialog({...dialog,isOpen:false}))
    sendGAEvent("Copy Share Link", `Share ${JSON.stringify({ id: page.id, title: page.title })}`, 0, false);
    navigator.clipboard.writeText(Enviroment.domain + Paths.page.createRoute(page.id)).then(() => {
      setSuccess("Ready to share");
    });
  };
        const handleBookmark = debounce((e) => {
    
    e.preventDefault();
    if (bookmark) {
      deleteStc();
    } else {
      onBookmarkPage();
    }
  }, 10);
        useEffect(() => {
    isBookmarked();
  }, [page, archive]);

     const deleteStc = () => {
    setLoading(true);
    if (localBookmark) {
      dispatch(deleteStoryFromCollection({ stId: localBookmark.id })).then((res) => {
        checkResult(
          res,
          ({ collection }) => {
            setArchive(collection[0]);
            setBookmarked(null);
            isBookmarked();
     
          },
          () => {
            setBookmarked(null);
            // setLoading(false);
            isBookmarked();
          }
        );
      });
    }
  };
  useEffect(() => {
    // sync whenever parent bookmark or archive changes
    if (archive && page) {
      const found = archive.storyIdList.find((stc) => stc.storyId == page.id);
      setLocalBookmark(found || null);
    } else {
      setLocalBookmark(bookmark);
    }
  }, [archive, page, bookmark]);
  const isBookmarked = () => {
    if (profile) {
      if (archive) {
        let bookmark = archive.storyIdList.find((stc) => stc.storyId == page.id);
        setBookmarked(bookmark);
      } else {
        getArchive();
      }
    }
  };
    const getArchive = () => {
    if (currentProfile && currentProfile.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc.collection);
    }
  };

  useEffect(() => {
    getArchive();
  }, []);
  const handleLocalBookmark = async (e) => {
    e.preventDefault();
    if (localBookmark) {
      await deleteStc(); // uses closure from parent
      setLocalBookmark(null);
      setBookmarked(null);
    } else {
      await onBookmarkPage();
      setLocalBookmark(true);
      setBookmarked();
    }
  };

  return (
    <IonList className="flex flex-col">
      <li className="py-3 border-b">
        <IonItem
          onClick={async () => {
            if (profile && (await Preferences.get({ key: "token" })).value) {
              navigate(Paths.addStoryToCollection.story(page.id));
            } else {
              setError("Please Sign Up");
            }
            dispatch(setDialog({ ...dialog, isOpen: false }));
          }}
        >
          <IonText className="text-[1rem]">Add to Collection</IonText>
        </IonItem>
      </li>

      {canUserEdit && (
        <li className="py-3 border-b">
          <IonItem
            onClick={() => {
              dispatch(setDialog({ ...dialog, isOpen: false }));
              dispatch(setEditingPage({ page }));
              dispatch(setHtmlContent(page.data));
              navigate(Paths.editPage.createRoute(page.id));
            }}
          >
            <IonText className="text-[1rem]">Edit</IonText>
          </IonItem>
        </li>
      )}

      <li className="py-3 border-b">
        <IonItem onClick={copyShareLink}>
          <IonText className="text-[1rem]">Copy Share Link</IonText>
        </IonItem>
      </li>

      <li className="py-3 border-b">
        <IonItem
          onClick={(e) => {
            profile ? handleLocalBookmark(e) : setError("Please Sign In");
          }}
        >
          <div className="text-left w-full">
            {!loading ? (
              localBookmark ? (
                <IonImg src={bookmarkFill} className="mx-auto max-h-10 max-w-10" />
              ) : (
                <IonImg src={bookmarkadd} className="mx-auto max-h-10 max-w-10" />
              )
            ) : (
              <IonImg src={loadingGif} className="max-h-6 mx-auto" />
            )}
          </div>
        </IonItem>
      </li>
    </IonList>
  );
}