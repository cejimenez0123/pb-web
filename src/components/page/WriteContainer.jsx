import { useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import WriteLanding from "../lovehome/WriterLanding";
import Paths from "../../core/paths";

export default function WriteContainer({
  stories = [],
  loading = false,
}) {
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

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
    <WriteLanding
      stories={stories}
      loading={loading}
      onBegin={handleBegin}
      onSelectStory={handleSelectStory}
    />
  );
}