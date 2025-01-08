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
function IndexItem({item,page,onDelete}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [canUserEdit,setCanUserEdit]=useState(false)
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }
    useLayoutEffect(()=>{
      soCanUserEdit()
    },[currentProfile,item])
    const handleOnClick = ()=>{
       
      if(item && item.storyIdList){
        navigate(Paths.editCollection.createRoute(item.id))
      }else if(item){
        navigate(Paths.editPage.createRoute(item.id))
      }  
    }

    const handleNavigate=()=>{
      console.log(item)
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
   let buttonDiv= (<div>
    <div className="dropdown dropdown-left">
  <div tabIndex={0} role="button" className=" my-auto"><img className={"min-w-8 min-h-8 bg-emerald-800 p-2 rounded-full"}src={addBox}/></div>
  <ul tabIndex={0} className="dropdown-content menu  rounded-box z-[1] md:w-72 p-2">
    <li className="text-green-600 "><a onClick={handleAddToClick}>{item.storyIdList?"Add to Collection":`Add ${item.title} to Collection` }</a></li>
    <li className="text-green-600 "><a >Share</a></li>
  </ul>
</div>

   </div>)
   const soCanUserEdit=()=>{
      let found = item && item.roles?item.roles.find(role=>role.profileId==currentProfile.id):null
      if(currentProfile){
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
    if(canUserEdit){
        buttonDiv = (<div className="dropdown dropdown-left">
            
        <button tabIndex={0} role="button" className="rounded-full bg-emerald-800  px-2  h-[2.5rem] w-[2.5rem]"><img classname=" my-auto mx-auto pb-1" src={edit}/></button>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li className="text-green-600 " onClick={
           handleOnClick}><a >Edit</a></li>
          <li className="text-green-600 " onClick={()=>handleNavigate(Paths.addStoryToCollection.createRoute(page.id))}><a>Add to Collection</a></li>
        </ul>
      </div>)
  
    }
    return(
                <div className="border-3  shadow-sm  rounded-full  w-full my-3 py-1 mx-2 border-emerald-300"><div className={`   mb-1 `}> 
              <div  className=" px-1 flex flex-row justify-between  " >
                <div className="text-left my-auto mx-4 py-4 mt-1 ">
               
                <a className="text-emerald-700 no-underline " onClick={handleNavigate}> 
                   {item && item.title && item.title.length>0? <h6 className="text-[0.9rem] md:text-[1.2rem] text-ellipsis w-[12em] lg:w-[15em] whitespace-nowrap overflow-hidden my-auto  ">{item.title}</h6>:<h6>Unititled</h6>}
                </a>
                </div> 
                <div className=" my-auto mx-4 w-fit">
                  {buttonDiv}
                  </div>
                </div>
              </div>  
            </div>)
            
    
    }
    
  
    export default IndexItem
