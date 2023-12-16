import { useState } from "react";
import Add from "@mui/icons-material/Add"
import { IconButton } from "@mui/material"
import { PageType } from "../core/constants";
function PageItem({page,setPageIdList}){
    const [show,setShow]=useState(false)
    let pageDataElement = (<div></div>)
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='dashboard-content text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashborad-content' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }
    return(<div>

          
        <div className="list-item">
            <a className="title"><h6 onClick={()=>{setShow(!show)}}>{page.title}</h6>
            </a>
            
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