
// import RichEditor from "./RichEditor"
// import { PageType } from "../../core/constants"
// import PicturePageForm from "./PicturePageForm"

// import { useParams } from "react-router"
// import { IonImg } from "@ionic/react"
// import { useSelector } from "react-redux"
// import Enviroment from "../../core/Enviroment.js"
// import isValidUrl from "../../core/isValidUrl.js"
//  export default function EditorDiv({handleChange,createPageAction}){

//         const {id,type}=useParams()
      
        
//         const page = useSelector(state=>state.pages.editingPage)
      
     
       
//    switch (type) {
// case PageType.picture:{
//       return (
//             <div>
//               <PicturePageForm  handleChange={handleChange}/>
//             </div>
//           );
// }
// case PageType.link:{
//   return <PicturePageForm handleChange={handleChange} />
// }

// case PageType.text:
//   return (
//     <RichEditor
//       handleChange={(content) => handleChange("data", content)}
//     />
//   );

//    }
//     if(page) {
//         if (page.type === PageType.picture) {
//           if (page.data.length==0 ){
//             return <div><PicturePageForm handleChange={handleChange} createPageAction={createPageAction} /></div>;
//           }
//           return isValidUrl(page.data)?      <div className="mx-auto bg-emerald-200 rounded-b-lg w-full p-8">
//               <IonImg
//                 className="rounded-lg my-4 mx-auto"
//                 src={page.data}
//                 alt={page.title}
//               />
//             </div>:      <div className="mx-auto bg-emerald-200 rounded-b-lg w-full p-8">
//               <IonImg
//                 className="rounded-lg my-4 mx-auto"
//                 src={Enviroment.imageProxy(page.data)}
//                 alt={page.title}
//               />
//             </div>
       
      
//         } else if (page.type === PageType.link) {
//           return (
//             <div>
//               <PicturePageForm  handleChange={handleChange}createPageAction={createPageAction}/>
//             </div>
//           );
//         } else if (page.type === PageType.text) {
//           return (
//             <RichEditor
          
//               handleChange={content => {
             
//                 handleChange("data",content);
//               }}
//             />
//           );
//         } 

//           return <div className="skeleton w-24 h-24" />;
        
       
//   }
      
//     }
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