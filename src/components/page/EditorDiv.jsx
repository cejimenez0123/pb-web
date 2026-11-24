



import { useCallback } from "react";

import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";
import LinkPageForm from "./LinkPageForm";

export default function EditorDiv({
  handleChange,
  isSaved,
  setIsSaved,
  parameters,
  type,
  createPageAction,
}) {
  const handleEditorChange = useCallback(
    (content) => {
      handleChange("data", content);
    },
    [handleChange]
  );

  if (type === PageType.picture) {
    return (
      <PicturePageForm
        type={type}
        parameters={parameters}
        setIsSaved={setIsSaved}
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }

  if (type === PageType.link) {
    return (
      <LinkPageForm
        parameters={parameters}
        setIsSaved={setIsSaved}
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }

  return (
    <RichEditor
      value={parameters.data || ""}
      handleChange={handleEditorChange}
    />
  );
}
