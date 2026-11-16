
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";

import WriteLanding from "../lovehome/WriterLanding";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import { getMyCollections } from "../../actions/CollectionActions";

import styles from "../../styles/style";
import usePaginatedResource from "../../core/usePaginatedResource";
import { setPageInView } from "../../actions/PageActions";

export default function WriteContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const profileId = currentProfile?.id;

const colRes = usePaginatedResource({cacheKey: "profile:collections",
fetcher:getMyCollections,
pageSize:8})

const pageRes = usePaginatedResource({cacheKey: "profile:stories",
fetcher:getMyStories,
pageSize:8})


const stories =pageRes.items

const rooms =colRes.items
  const storiesLoading = useSelector(
    (state) => state.pages.loading
  );

  const roomsLoading = useSelector(
    (state) => state.books.loading
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* -----------------------------------------------------
     Debounce search
  ----------------------------------------------------- */

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  /* -----------------------------------------------------
     Fetch workspace data
  ----------------------------------------------------- */

  useEffect(() => {
    if (!profileId) return;

    const params = {
      skip: 0,
      take: 100,
      search: debouncedSearch,
    };

    dispatch(getMyStories(params));
    dispatch(getMyCollections(params));
  }, [profileId, debouncedSearch, dispatch]);

  /* -----------------------------------------------------
     Navigation
  ----------------------------------------------------- */

  const handleBegin = () => {
    router.push(Paths.editor.pre);
  };

  const handleSelectStory = (story) => {
    if (!story?.id) return;
    console.log("WRITE:"+story.id)
dispatch(setPageInView({page:story}))
    router.push(
Paths.editor.createRoute(story.id)
    );
  };

  const handleSelectRoom = (room) => {
    if (!room?.id) return;

    router.push(
      Paths.collection.createRoute(room.id),
      "forward"
    );
  };

  if (!profileId) return null;

  return (
    <IonContent>
      <main className={styles.pageShell.base}>
        <WriteLanding
          search={search}
          onSearch={setSearch}
          stories={stories}
          rooms={rooms}
          profileCollections={
            currentProfile.profileToCollections ?? []
          }
          storiesLoading={storiesLoading}
          roomsLoading={roomsLoading}
          onBegin={handleBegin}
          onSelectStory={handleSelectStory}
          onSelectRoom={handleSelectRoom}
        />
      </main>
    </IonContent>
  );
}
