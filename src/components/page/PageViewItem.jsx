// import { useSelector } from "react-redux"

// import {useLayoutEffect, useRef, useState} from "react"
// import PageViewButtonRow  from "./PageViewButtonRow"
// import CommentInput from "../comment/CommentInput"
// import "../../styles/PageView.css"
// import PropTypes from 'prop-types'
// import Paths from "../../core/paths"
// import ProfileCircle from "../profile/ProfileCircle"
// import { initGA, sendGAEvent } from "../../core/ga4"
// import {  useIonRouter } from "@ionic/react"

// import DataElement from "./DataElement"
// export default function PageViewItem({page}) {
//     const ref = useRef()
  
//     PageViewItem.propTypes={
//         page: PropTypes.object.isRequired
//     }
//     useLayoutEffect(()=>{
//         initGA()
//         sendGAEvent("View Story",JSON.stringify(page))
//     },[])

//     const router = useIonRouter()
//     const currentProfile = useSelector(state=>state.users.currentProfile)
    
  
//     const [commenting,setCommenting]=useState(false)
//     const handleClose=()=>{
//         setCommenting(false)
//     }
//       const commentBox = ()=>{
//         if (commenting){
//             return(<CommentInput page={page}  handleClose={handleClose}/>)
//         }
//     }
//     const header=()=>{
//         return <div ><span className={"flex-row flex justify-between px-1 pt-18  pb-1"}>   <ProfileCircle profile={page.author} color={"emerald-700"}/> 
                  
//          <h6 className="text-emerald-700 mx-2  no-underline text-ellipsis  whitespace-nowrap overflow-hidden max-w-[100%] my-auto text-[0.9rem]  " onClick={()=>{
//              dispatch(setPageInView({page}))
//            router.push  (Paths.page.createRoute(page.id))
     
//          }} >{` `+page.title.length>0?page.title:""}</h6>
        
    
//          </span>   {page.description && page.description.length>0?<div className='min-h-24 pt-4 p-2'>
//             {page.needsFeedback||page.description.length>0?<label className='text-emerald-800'>Feedback Request:</label>:null}
//             <h6 className='p-2 open-sans-medium text-left lg:w-[36em]   text-emerald-800'>
//                 {page.description}
//             </h6>
//         </div>:null}   </div>
//      }

    

//         return(
  
//         <div className="">
        
//                 {header()}
              
  
//                 <DataElement page={page} isGrid={false}/>
        
//             <PageViewButtonRow page={page} profile={currentProfile} setCommenting={truthy=>setCommenting(truthy)}/>
            
//                 {commentBox()}   
//    </div>
     
  
//         )
            
// }
import { useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import PageViewButtonRow from "./PageViewButtonRow";
import CommentInput from "../comment/CommentInput";
import ProfileCircle from "../profile/ProfileCircle";
import DataElement from "./DataElement";
import { initGA, sendGAEvent } from "../../core/ga4";

export default function PageViewItem({ page }) {
  const router = useIonRouter();
  const currentProfile = useSelector((state) => state.users.currentProfile);
  const [commenting, setCommenting] = useState(false);

  useLayoutEffect(() => {
    initGA();
    sendGAEvent("View Story", JSON.stringify(page));
  }, []);

  const handleClose = () => setCommenting(false);

  const header = () => (
    <div className="bg-cream rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3">
        <ProfileCircle profile={page.author} color="emerald-700" />
        <h6
          className="text-emerald-800 text-lg font-semibold truncate cursor-pointer"
          onClick={() => {
            router.push(Paths.page.createRoute(page.id));
          }}
        >
          {page.title || ""}
        </h6>
      </div>
      {page.description && (
        <div className="mt-2 text-left">
          {page.needsFeedback && <label className="text-emerald-700 font-medium">Feedback Request:</label>}
          <p className="text-emerald-800 mt-1">{page.description}</p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {header()}
      <DataElement page={page} isGrid={false} />
      <PageViewButtonRow page={page} profile={currentProfile} setCommenting={setCommenting} />
      {commenting && <CommentInput page={page} handleClose={handleClose} />}
    </div>
  );
}

PageViewItem.propTypes = { page: PropTypes.object.isRequired };