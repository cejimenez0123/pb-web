import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {  setHtmlContent, setPageInView } from "../../actions/PageActions";
import {  RoleType } from "../../core/constants";
import {useNavigate} from 'react-router-dom'
import addBox from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Paths from "../../core/paths";
import ReactGA from "react-ga4"
import { setCollectionInView } from "../../actions/CollectionActions";
function IndexItem({item}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    const [canUserAdd,setCanUserAdd]=useState(false)
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
    useLayoutEffect(()=>{
      soCanUserEdit()
      soCanUserAdd()
    },[currentProfile,item])
    const handleOnClick = ()=>{
       
      if(item && item.storyIdList){
        navigate(Paths.editCollection.createRoute(item.id))
      }else if(item){
        navigate(Paths.editPage.createRoute(item.id))
      }  
    }

    const handleNavigate=()=>{
        if(item &&item.storyIdList){
              dispatch(setCollectionInView({collection:item}))
              navigate(Paths.collection.createRoute(item.id))
        }else if(item){
              dispatch(setHtmlContent(item.data))
              dispatch(setPageInView({page:item}))
              navigate(Paths.page.createRoute(item.id))
        }

    }
    const handleAddToClick = ()=>{
       if(item && item.storyIdList){
        navigate(Paths.addToCollection.createRoute(item.id))
       }else if (item){
        navigate(Paths.addStoryToCollection.createRoute(item.id))
       }
    }

   const soCanUserAdd=()=>{
    let arr=[RoleType.editor,RoleType.writer]
    let found = item && item.roles?item.roles.find(role=>role.profileId==currentProfile.id):null
    if(currentProfile && item){
      if(currentProfile.id==item.authorId){
        setCanUserAdd(true)
        return
      }
      if(currentProfile.id==item.profileId){
        setCanUserAdd(true)
        return
      }
      if(found && arr.includes(found.role)){
        setCanUserAdd(true)
        return
      }
    }
    setCanUserAdd(false)
   }
   const soCanUserEdit=()=>{
      let found = item && item.roles?item.roles.find(role=>role.profileId==currentProfile.id):null
      if(currentProfile && item){
        if(currentProfile.id==item.authorId){
          setCanUserEdit(true)
          return
        }
        if(currentProfile.id==item.profileId){
          setCanUserEdit(true)
          return
        }
        if(found && found.role == RoleType.editor){
          setCanUserEdit(true)
          return
        }
      }
      setCanUserEdit(false)
   }
   let buttonDiv= canUserAdd?(
    <div className=" my-auto  w-fit"><div>
    
    <div className="dropdown dropdown-left">
  <div tabIndex={0} role="button" className=" my-auto min-w-8 min-h-8 bg-emerald-800 p-2 rounded-full flex"><img 
className="mx-auto my-auto"
  src={addBox}/></div>
  <ul tabIndex={0} className="dropdown-content menu  bg-slate-100 rounded-box z-[1] md:w-72 p-2">
    {canUserAdd?<li className="text-green-600" onClick={handleAddToClick}><a >{item && item.storyIdList!=null?`Add ${item.title} to Collection`:"Add to Collection" }</a></li>:null}
    <li className="text-green-600 "><a >Share</a></li>
  </ul>
  </div>
</div>

   </div>):null
    if(canUserEdit){
        buttonDiv = (<div className=" my-auto  w-fit"><div className="dropdown dropdown-left">
            
        <div tabIndex={0} role="button" className="rounded-full bg-emerald-800  px-2  h-[2.5rem] w-[2.5rem] flex">
          <img classname=" my-auto mx-auto " src={edit}/></div>

        <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-52 p-2 shadow">
          {canUserEdit?<li className="text-green-600 " onClick={
           handleOnClick}><a >Edit</a></li>:null}
          {!item.storyIdList?<li className="text-green-600 " onClick={()=>navigate(Paths.workshop.createRoute(item.id))}>Get Feedback</li>:null}
          {canUserAdd?<li className="text-green-600 " onClick={handleAddToClick}><a>{item && item.storyIdList!=null?`Add ${item.title} to Collection`:"Add to Collection" }</a></li>:null}
        </ul>
        </div>
      </div>)
  
    }
    if(!canUserAdd&&!canUserEdit){
      buttonDiv=null
    }
    return(
                <div className="border-3  shadow-sm  rounded-full max-w-[94vw] lg:max-w-[42em]  w-full my-3 py-1 border-emerald-300"><div className={`   mb-1 `}> 
              <div  className=" px-8 flex flex-row justify-between  " >
                <div className="text-left my-auto  py-4 mt-1 ">
                   {item && item.title && item.title.length>0? <h6 onClick={handleNavigate}
         className={`text-[0.9rem] md:text-[1.2rem] text-ellipsis ${buttonDiv?"max-w-[12em] ":"max-w-[18em]"} whitespace-nowrap text-emerald-700 no-underline overflow-hidden my-auto`}>{item.title}</h6>:
                   <h6 className={`text-[0.9rem] md:text-[1.2rem] text-ellipsis ${buttonDiv?"max-w-[12em]":""}  whitespace-nowrap text-emerald-700 no-underline overflow-hidden my-auto`}
                   onClick={handleNavigate}>Unititled</h6>}
                </div> 
                <div className=" my-auto w-fit">
                  {buttonDiv}
                  </div>
                </div>
              </div>  
            </div>)
            
    
    }
    
  
    export default IndexItem
