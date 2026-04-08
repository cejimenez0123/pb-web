import { useSelector } from "react-redux";
import { PageType } from "../../core/constants";
import RichEditor from "./RichEditor";
import PicturePageForm from "./PicturePageForm";

export default function EditorDiv({ handleChange,page,parameters, type, createPageAction }) {

  

let pageType = page?.type??type
console.log("TYPE",page)
console.log("TYPE<",pageType)
  // switch (type) {
  
if(pageType==PageType.link){
    return (
      <PicturePageForm
      type={type}
  parameters={parameters}
        key={`link-${page?.id ?? "new"}`} // <-- forces remount on type/id change
        handleChange={handleChange}
        createPageAction={createPageAction}
      />
    );
  }else if(pageType==PageType.picture){
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