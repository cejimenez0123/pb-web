import { useState } from "react";
import Add from "@mui/icons-material/Add"
// import { IconButton } from "@mui/material"
import { PageType } from "../core/constants";
import PropTypes from 'prop-types'
import LinkPreview from "./LinkPreview";
import { IonImg } from "@ionic/react";
function PageItem({page,setPageIdList}){
    const [show,setShow]=useState(false)
    PageItem.propTypes={
        page:PropTypes.object.isRequired,
        setPageIdList:PropTypes.func.isRequired,
    }
    let pageDataElement = (<div></div>)
    switch(page.type){
        case page.type == PageType.text:
            pageDataElement = <div id="page-data-element-text" className=' no-scroll dashboard-content px-2 mx-1 pt-8 ql-editor text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case page.type == PageType.picture:
            pageDataElement = <IonImg
 
  src={previewData.image}
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'contain', // or 'cover' to fill and crop
  }}
  className="w-full ion-image-fit h-auto object-contain rounded-lg"
/>

        break;
        case page.type == PageType.link:
            pageDataElement = <LinkPreview id="page-data-element-link" url={page.data}/>
        break; 
        default:
            pageDataElement = <div id="page-data-element-text" dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }
    const pageShow = ()=>{
        setShow(!show)
    }
    return(<div>
        <div className="list-item">
            <div onClick={pageShow} className="title">
                <h6>
                {page.title.length>0?page.title:"Untitled"}
                </h6>
            </div>
             <IconButton onClick={()=>{
                setPageIdList()
            }

            }><Add/></IconButton>
            
        </div>
        <div style={{display: show? "":"none"}}>
            {pageDataElement}
        </div>
        </div>)
}
export default PageItem