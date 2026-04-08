import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";
import { setHtmlContent } from "../../actions/PageActions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function EditorDiv({ handleChange,parameters, type, createPageAction }) {

  const page = useSelector((state) => state.pages.editingPage);


  // switch (type) {
  
if(type==PageType.link){
    return (
      <PicturePageForm
      type={type}
  parameters={parameters}
        key={`link-${page?.id ?? "new"}`} // <-- forces remount on type/id change
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }else if(type==PageType.picture){
    return (
      <PicturePageForm
      parameters={parameters}
      type={type}
        key={`picture-${page?.id ?? "new"}`} // <-- new key resets editor
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  
    }else{
    
     return (
        <RichEditor
          handleChange={(content) => handleChange("data", content)}
        />
      );
  }
}