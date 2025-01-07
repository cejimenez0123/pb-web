import { useState } from "react";
import { useDispatch } from "react-redux";
import {  setPageInView,setPagesToBeAdded } from "../../actions/PageActions";
import { PageType } from "../../core/constants";
import {useNavigate} from 'react-router-dom'
import addBox from "../../images/icons/add_circle.svg"
import edit from "../../images/icons/edit.svg"
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Paths from "../../core/paths";
import ReactGA from "react-ga4"
function PageIndexItem({page,onDelete}) {
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
    const [showPreview,setShowPreview] = useState(false)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onToggle = ()=>{
        setShowPreview(!showPreview)
    }
    const handleOnClick = ()=>{
        const params = {
            page: page
        }
       
        navigate(Paths.editPage.createRoute(page.id))
        
    }
    const handleAddClick = (type)=>{
        if(page){
        let params = {
            pageList: [page]
        }
        dispatch(setPagesToBeAdded(params))
        navigate(`/${type}/new`)
    }
    }
    const handleNavigate=(path)=>{
        if(path.includes("collection")){
            ReactGA.event({
                category: "Story",
                action: "Add Story To Collection",
                label: "Edit Icon", 
                value: page.id,
                nonInteraction: false
              });
        }else{
            ReactGA.event({
                category: "Story",
                action: "Navigate to Edit",
                label: "Edit Icon", 
                value: page.id,
                nonInteraction: false
              });
            dispatch(setPageInView({page}))
        }

        navigate(path)

    }
    let pageDataElement = (<div></div>)
    if(page!=null){
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
        break;
        case PageType.picture:
            pageDataElement = <img className='dashboard-data' src={page.data} alt={page.title}/>
        break;
        case PageType.video:
            pageDataElement = <video src={page.data}/>
        break;
        default:
            pageDataElement = <div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>
        break;
    }
    
   let buttonDiv= (<div>
    <div className="dropdown dropdown-left">
  <div tabIndex={0} role="button" className=" my-auto"><img className={"min-w-8 min-h-8 bg-emerald-800 p-2 rounded-full"}src={addBox}/></div>
  <ul tabIndex={0} className="dropdown-content menu  rounded-box z-[1] md:w-72 p-2">
    <li className="text-green-600 "><a onClick={()=>handleAddClick("book")}>Add to Collection</a></li>
    <li className="text-green-600 "><a >Share</a></li>
  </ul>
</div>

   </div>)
    if(currentProfile!=null && page.authorId==currentProfile.id){
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
               
                <a className="text-emerald-700 no-underline " onClick={()=>{navigate(Paths.page.createRoute(page.id))}}> 
                   {page && page.title && page.title.length>0? <h6 className="text-[0.9rem] md:text-[1.2rem] text-ellipsis  w-[12em] whitespace-nowrap overflow-hidden my-auto  ">{page.title}</h6>:<h6>Unititled</h6>}
                </a>
                </div> 
                <div className=" my-auto mx-4 w-fit">
                {buttonDiv}

              
             
            
                </div></div>
            </div>  </div>)}else{
                return(null)
            }
    
    }
    
  
    export default PageIndexItem
