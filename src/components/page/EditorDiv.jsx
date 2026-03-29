import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";

export default function EditorDiv({ handleChange, createPageAction }) {
  const { type } = useParams();
  const page = useSelector((state) => state.pages.editingPage);

  const resolvedType = page?.type || type;

  if (!resolvedType) {
    return <div className="skeleton w-full h-[20em]" />;
  }

  switch (resolvedType) {
    case PageType.text:
      return (
        <RichEditor
          handleChange={(content) => handleChange("data", content)}
        />
      );

    case PageType.link:return (
        <PicturePageForm
          handleChange={handleChange}
          createPageAction={createPageAction}
        />
      );
    case PageType.picture:
      return (
        <PicturePageForm
          handleChange={handleChange}
          createPageAction={createPageAction}
        />
      );

    default:
      return <div className="skeleton w-full h-[20em]" />;
  }
}