
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";

import WriteLanding from "../lovehome/WriterLanding";
import Paths from "../../core/paths";
import { getMyStories } from "../../actions/StoryActions";

export default function WriteContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );
const [search, setSearch] = useState("");

useEffect(() => {
  if (!currentProfile?.id) return;

  const timeout = setTimeout(() => {
    dispatch(
      getMyStories({
        skip: 0,
        take: 8,
        search: search.trim(),
      })
    );
  }, 300);

  return () => clearTimeout(timeout);
}, [currentProfile?.id, search, dispatch]);
  const stories = useSelector(
    (state) => state.pages.myPages
  );

  const loading = useSelector(
    (state) => state.pages.loading
  );

  useEffect(() => {
    if (!currentProfile?.id) return;

    dispatch(
      getMyStories({
        skip: 0,
        take: 8,
      })
    );
  }, [currentProfile?.id, dispatch]);

  const handleBegin = () => {
    router.push(
      Paths.editor.text,
      "forward"
    );
  };

  const handleSelectStory = (story) => {
    if (!story?.id) return;

    const type = story.type || "text";

    router.push(
      Paths.editPage.createRoute(story.id, type),
      "forward"
    );
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <IonContent>
    <WriteLanding
      search={search}
      onSearch={setSearch}
      stories={stories}
      loading={loading}
      onBegin={handleBegin}
      onSelectStory={handleSelectStory}
    />
    </IonContent>
  );
}