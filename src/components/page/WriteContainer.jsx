
// import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { IonContent, useIonRouter, useIonViewWillEnter } from "@ionic/react";

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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const profileId = currentProfile?.id;
const colRes = usePaginatedResource({
  cacheKey: "profile:collections",
  fetcher: getMyCollections,
  pageSize: 8,
  search: debouncedSearch,
});

const pageRes = usePaginatedResource({
  cacheKey: "profile:stories",
  fetcher: getMyStories,
  pageSize: 8,
  search: debouncedSearch,
});

const stories = pageRes.items;
const rooms = colRes.items;

  const storiesLoading = useSelector(
    (state) => state.pages.loading
  );
  const roomsLoading = useSelector(
    (state) => state.books.loading
  );



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

useIonViewWillEnter(
  useCallback(() => {
    if (!profileId) return;

    pageRes.setPage(1);
    colRes.setPage(1);

    pageRes.fetchPage(1, true);
    colRes.fetchPage(1, true);
  }, [
    profileId,
    pageRes.setPage,
    pageRes.fetchPage,
    colRes.setPage,
    colRes.fetchPage,
  ])
);
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
