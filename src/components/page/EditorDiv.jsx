import { useSelector } from "react-redux";
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";
import { set } from "lodash";

export default function EditorDiv({page, handleChange,isSaved,setIsSaved,parameters, type, createPageAction }) {

  

let pageType = type

  
if(pageType==PageType.link){
    return (
      <PicturePageForm
      type={pageType}
  parameters={parameters}
  isSaved={isSaved}
  setIsSaved={setIsSaved}
        key={`link-${page?.id ?? "new"}`} // <-- forces remount on type/id change
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }else if(pageType==PageType.picture){
    return (
      <PicturePageForm
      parameters={parameters}
      type={pageType}
       isSaved={isSaved}
  setIsSaved={setIsSaved}
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