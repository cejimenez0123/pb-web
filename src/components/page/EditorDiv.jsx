
 import { useContext, useEffect, useState } from "react"
import RichEditor from "./RichEditor"
import { PageType } from "../../core/constants"
import PicturePageForm from "./PicturePageForm"
import EditorContext from "../../container/page/EditorContext"
import { useLocation, useParams } from "react-router-dom"
import { setHtmlContent } from "../../actions/PageActions.jsx"
import { useDispatch } from "react-redux"
import { IonImg } from "@ionic/react"
import { useSelector } from "react-redux"
import Enviroment from "../../core/Enviroment.js"
import isValidUrl from "../../core/isValidUrl.js"
 export default function EditorDiv({handleChange,createPageAction}){

        const {id,type}=useParams()
      
        const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
        const page = useSelector(state=>state.pages.editingPage)
      
     
       
   switch (type) {
case PageType.picture:{
      return (
            <div>
              <PicturePageForm  handleChange={handleChange}/>
            </div>
          );
}
case PageType.link:{
        return (
            <div>
              <PicturePageForm  handleChange={handleChange} />
            </div>
          );
}
case PageType.text:{
        <RichEditor
              initContent={htmlContent.html}
              handleChange={content => handleChange(content)}
            />
}

   }
    if(page) {
        if (page.type === PageType.picture) {
          if (page.data.length==0 ){
            return <div><PicturePageForm handleChange={handleChange} createPageAction={createPageAction} /></div>;
          }
          return isValidUrl(page.data)?      <div className="mx-auto bg-emerald-200 rounded-b-lg w-full p-8">
              <IonImg
                className="rounded-lg my-4 mx-auto"
                src={page.data}
                alt={page.title}
              />
            </div>:      <div className="mx-auto bg-emerald-200 rounded-b-lg w-full p-8">
              <IonImg
                className="rounded-lg my-4 mx-auto"
                src={Enviroment.imageProxy(page.data)}
                alt={page.title}
              />
            </div>
       
      
        } else if (page.type === PageType.link) {
          return (
            <div>
              <PicturePageForm  handleChange={handleChange}createPageAction={createPageAction}/>
            </div>
          );
        } else if (page.type === PageType.text) {
          return (
            <RichEditor
              initContent={htmlContent.html}
              handleChange={content => {
             
                handleChange(content);
              }}
            />
          );
        } 
        // if (last === PageType.picture) {
      
        // } else if (last === PageType.link) {
    
        // } else if (last === PageType.text) {
        //   return (
      
        //   );
  
          return <div className="skeleton w-24 h-24" />;
        
       
  }
      
    }