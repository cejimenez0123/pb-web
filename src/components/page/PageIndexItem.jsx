import { useState } from "react";
import { useDispatch } from "react-redux";
import { setHtmlContent, setPageInView,setPagesToBeAdded } from "../../actions/PageActions";
import { PageType } from "../../core/constants";
import {useNavigate} from 'react-router-dom'
import addBox from "../../images/icons/add_box.svg"
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
        dispatch(setHtmlContent(page.data))
        dispatch(setPageInView(params))
        navigate(`/page/${page.id}`)
        
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
  <div tabIndex={0} role="button" className=" my-auto"><img className={"min-w-8 min-h-8"}src={addBox}/></div>
  <ul tabIndex={0} className="dropdown-content menu  rounded-box z-[1] md:w-72 p-2 shadow">
    <li className="text-green-600 "><a onClick={()=>handleAddClick("book")}>Add to Collection</a></li>
    <li className="text-green-600 "><a >Share</a></li>
  </ul>
</div>

   </div>)
    if(currentProfile!=null && page.authorId==currentProfile.id){
        buttonDiv = (<div className="dropdown dropdown-left">
        <div tabIndex={0} role="button" className="mx-4"><img classname="w-12 h-12" src={edit}/></div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li className="text-green-600 " onClick={()=>{
            dispatch(setPageInView({page}))
            handleNavigate(Paths.editPage.createRoute(page.id))}}><a >Edit</a></li>
          <li className="text-green-600 " onClick={()=>handleNavigate(Paths.addStoryToCollection.createRoute(page.id))}><a>Add to Collection</a></li>
        </ul>
      </div>)
  
    }
            return(<div className={`   border-white rounded-lg border flex flex-row justify-between  mb-1  `}>
                <div className="text-left max-w-[100vw] h-fit  my-auto md:ml-4 py-8   ">
               
                <a className="text-white " onClick={handleOnClick}> 
                   {page.title.length>0? <h6 className="text-xl ml-2 my-auto">{page.title}</h6>:<h6>Unititled</h6>}
                </a>
                </div> 
                <div className=" my-auto w-fit">
                {buttonDiv}

              
             
            
                </div>
            </div>)}else{
                return(<div className="list-item">

                    Loading...
                </div>)
            }
    
    }
    
  
    export default PageIndexItem
