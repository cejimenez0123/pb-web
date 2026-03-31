import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";
import { setHtmlContent } from "../../actions/PageActions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function EditorDiv({ handleChange, createPageAction }) {
  const { type } = useParams();
  const page = useSelector((state) => state.pages.editingPage);
const dispatch = useDispatch()
  const resolvedType = page?.type || type;
useEffect(() => {
  if (page?.data) {
    dispatch(setHtmlContent({ html: page.data }));
    handleChange("data", page.data);
  } else {
   
  }
}, [page, type]);
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
case PageType.link:
    return (
      <PicturePageForm
        key={`link-${page?.id ?? "new"}`} // <-- forces remount on type/id change
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  case PageType.picture:
    return (
      <PicturePageForm
        key={`picture-${page?.id ?? "new"}`} // <-- new key resets editor
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
   

    default:
      return <div className="skeleton w-full h-[20em]" />;
  }
}