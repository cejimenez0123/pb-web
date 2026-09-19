import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";

export default function EditorDiv({
  page,
  handleChange,
  isSaved,
  setIsSaved,
  parameters,
  type,
  createPageAction,
}) {
  if (type === PageType.link || type === PageType.picture) {
    return (
      <PicturePageForm
        type={type}
        parameters={parameters}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }

  return (
    <RichEditor
      handleChange={(content) => handleChange("data", content)}
    />
  );
}
