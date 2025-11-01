
export default function ShareList({ page, profile, archive,setArchive, bookmark, setBookmarked }) {
  const [localBookmark, setLocalBookmark] = useState(bookmark);
        const handleBookmark = debounce((e) => {
    
    e.preventDefault();
    if (bookmarked) {
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
                <IonImg src={bookmarkAdd} className="mx-auto max-h-10 max-w-10" />
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