
 import { useContext, useEffect, useState } from "react"
import RichEditor from "./RichEditor"
import { PageType } from "../../core/constants"
import PicturePageForm from "./PicturePageForm"
import EditorContext from "../../container/page/EditorContext"
import { useLocation } from "react-router-dom"
import { setHtmlContent } from "../../actions/PageActions.jsx"
import { useDispatch } from "react-redux"
import { IonImg } from "@ionic/react"
import { useSelector } from "react-redux"
import Enviroment from "../../core/Enviroment.js"
 export default function EditorDiv({handleChange,createPageAction,page}){
        const location = useLocation()
        const dispatch = useDispatch()
        const {parameters,setParameters} = useContext(EditorContext)
       const htmlContent = useSelector(state=>state.pages.editorHtmlContent)
        let href =location.pathname.split("/")
        let last = href[href.length-1]
   
    
          let types = [PageType.link,PageType.picture,PageType.text]
          console.log(page)

      if (!parameters) {
        return <div>Loading</div>;
      }
      
      if (types.includes(last)) {
        if (last === PageType.picture) {
          return (
            <div>
              <PicturePageForm  createPageAction={createPageAction}/>
            </div>
          );
        } else if (last === PageType.link) {
          return (
            <div>
              <PicturePageForm createPageAction={createPageAction}/>
            </div>
          );
        } else if (last === PageType.text) {
          return (
            <RichEditor
              initContent={htmlContent.html}
              handleChange={content => handleChange(content)}
            />
          );
        } else {
          return <div className="skeleton w-24 h-24" />;
        }
      } else if (page) {
        if (page.type === PageType.picture) {
          if (!page) {
            return <div><PicturePageForm createPageAction={createPageAction} /></div>;
          }
          return (
            <div className="mx-auto bg-emerald-200 rounded-b-lg w-full p-8">
              <IonImg
                className="rounded-lg my-4 mx-auto"
                src={Enviroment.imageProxy(page.data)}
                alt={page.title}
              />
            </div>
          );
        } else if (page.type === PageType.link) {
          return (
            <div>
              <PicturePageForm  createPageAction={createPageAction}/>
            </div>
          );
        } else if (page.type === PageType.text) {
          return (
            <RichEditor
              initContent={htmlContent.html}
              handleChange={content => {
                dispatch(setHtmlContent({html:content}));
                handleChange(content);
              }}
            />
          );
        } else {
          return <div>Loading</div>;
        }
      } else {
        return <div>Loading</div>;
      }
      
    }