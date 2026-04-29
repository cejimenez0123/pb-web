
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";
import isValidUrl from "../../core/isValidUrl";

export default function EditorDiv({ page, handleChange, isSaved, setIsSaved, parameters, type, createPageAction }) {
  const pageType = type;

  if (pageType === PageType.link) {
    return (
      <PicturePageForm
        type={pageType}
        parameters={parameters}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        key={`link-${page?.id ?? "new"}`}
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }

  if (pageType === PageType.picture) {
    return (
      <PicturePageForm
        parameters={parameters}
        type={pageType}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        key={`picture-${page?.id ?? "new"}`}
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }

  return (
    <RichEditor
      key={`editor-${page?.id ?? "new"}`}
      handleChange={(content) => handleChange("data", content)}
    />
  );
}