
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";

import WriteLanding from "../lovehome/WriterLanding";
import Paths from "../../core/paths";

import { getMyStories } from "../../actions/StoryActions";
import { getMyCollections } from "../../actions/CollectionActions";

import styles from "../../styles/style";

export default function WriteContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const stories = useSelector(
    (state) => state.pages.myPages ?? []
  );

  const rooms = useSelector(
    (state) => state.books.myCollections ?? []
  );

  const storiesLoading = useSelector(
    (state) => state.pages.loading
  );

  const roomsLoading = useSelector(
    (state) => state.books.loading
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentProfile?.id) return;

    const normalizedSearch = search.trim();

    const fetchData = () => {
      const params = {
        skip: 0,
        take: 100,
        search: normalizedSearch,
      };

      dispatch(getMyStories(params));
      dispatch(getMyCollections(params));
    };

    if (!normalizedSearch) {
      fetchData();
      return;
    }

    const timeout = setTimeout(fetchData, 300);

    return () => clearTimeout(timeout);
  }, [currentProfile?.id, search, dispatch]);

  const handleBegin = () => {
    router.push(Paths.editor.text, "forward");
  };

  const handleSelectStory = (story) => {
    if (!story?.id) return;

    router.push(
      Paths.editPage.createRoute(
        story.id,
        story.type || "text"
      ),
      "forward"
    );
  };

  const handleSelectRoom = (room) => {
    if (!room?.id) return;

    router.push(
      Paths.collection.createRoute(room.id),
      "forward"
    );
  };

  if (!currentProfile?.id) return null;

  return (
    <IonContent>
      <main className={styles.pageShell.base}>
        <WriteLanding
          search={search}
          onSearch={setSearch}
          stories={stories}
          rooms={rooms}
          profileCollections={currentProfile?.profileToCollections ?? []}
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

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { IonContent, useIonRouter } from "@ionic/react";

// import WriteLanding from "../lovehome/WriterLanding";
// import Paths from "../../core/paths";

// import { getMyStories } from "../../actions/StoryActions";
// import { getMyCollections } from "../../actions/CollectionActions";

// import styles from "../../styles/style";

// export default function WriteContainer() {
//   const router = useIonRouter();
//   const dispatch = useDispatch();

//   const currentProfile = useSelector(
//     (state) => state.users.currentProfile
//   );

//   const stories = useSelector(
//     (state) => state.pages.myPages ?? []
//   );

//   const rooms = useSelector(
//     (state) => state.books.myCollections ?? []
//   );

//   const storiesLoading = useSelector(
//     (state) => state.pages.loading
//   );

//   const roomsLoading = useSelector(
//     (state) => state.books.loading
//   );

//   const profileCollections =
//     currentProfile?.profileToCollections ?? [];

//   const [search, setSearch] = useState("");

// const storyPagination = useSelector(
//   (state) => state.pages.pagination ?? {}
// );

// const handleShowAllStories = () => {
//   const totalCount = storyPagination.totalCount ?? stories.length;
//   const remaining = totalCount - stories.length;

//   if (remaining <= 0) return;

//   dispatch(
//     getMyStories({
//       skip: stories.length,
//       take: remaining,
//       search: search.trim(),
//       append: true,
//     })
//   );
// };

//   useEffect(() => {
//     if (!currentProfile?.id) return;

//     const fetchData = () => {
//       const params = {
//         skip: 0,
//         take: 8,
//         search: search.trim(),
//       };

//       dispatch(getMyStories(params));
//       dispatch(getMyCollections(params));
//     };

//     if (!search.trim()) {
//       fetchData();
//       return;
//     }

//     const timeout = setTimeout(fetchData, 300);

//     return () => clearTimeout(timeout);
//   }, [currentProfile?.id, search, dispatch]);

//   const handleBegin = () => {
//     router.push(Paths.editor.text, "forward");
//   };

//   const handleSelectStory = (story) => {
//     if (!story?.id) return;

//     router.push(
//       Paths.editPage.createRoute(
//         story.id,
//         story.type || "text"
//       ),
//       "forward"
//     );
//   };

//   const handleSelectRoom = (room) => {
//     if (!room?.id) return;

//     router.push(
//       Paths.collection.createRoute(room.id),
//       "forward"
//     );
//   };

//   if (!currentProfile?.id) return null;

//   return (
//     <IonContent>
//       <main className={styles.pageShell.base}>
// <WriteLanding
//   search={search}
//   onSearch={setSearch}
//   stories={stories}
//   rooms={rooms}
//   profileCollections={profileCollections}
//   storiesLoading={storiesLoading}
//   roomsLoading={roomsLoading}
//   totalStoryCount={storyPagination.totalCount ?? stories.length}
//   onBegin={handleBegin}
//   onSelectStory={handleSelectStory}
//   onSelectRoom={handleSelectRoom}
//   onShowAllStories={handleShowAllStories}
// />
//       </main>
//     </IonContent>
//   );
// }
