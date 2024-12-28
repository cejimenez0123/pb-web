import { useMediaQuery } from "react-responsive"
import edit from "../../images/icons/edit.svg"
import addBox from "../../images/icons/add_box.svg"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Paths from "../../core/paths"
import { useDispatch } from "react-redux"
import { clearPagesInView } from "../../actions/PageActions"
export default function CollectionIndexItem({collection}){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      if(collection){
        let buttonDiv = (
            <div className="dropdown dropdown-left my-auto justify-content-center">
        <div tabIndex={0} role="button" className=""><img className=" " src={addBox}/></div>
        <ul tabIndex={0} className="dropdown-content menu  bg-white  rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Share</a></li>
            <li onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))}><a>Add to Collection</a></li>
        </ul>
      
        </div>)
        if(currentProfile && currentProfile.id == collection.profileId){
            buttonDiv =(
                <div className="dropdown dropdown-left justify-content-center">
    <div tabIndex={0} role="button" className=" rounded-full bg-emerald-800 w-16 h-10 pt-2 pb-4 px-2  "><img classname=" " src={edit}/></div>
        <ul tabIndex={0} className="dropdown-content menu bg-white text-slate-800 rounded-box z-[1] w-52 shadow">
            <li onClick={()=>
                {
                    dispatch(clearPagesInView())
                    navigate(Paths.editCollection.createRoute(collection.id))
                    }}><a>Edit</a></li>
            <li onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))}><a>Add to {collection.title}</a></li>
            <li><a>Share</a></li>
        </ul>
      
        </div>
            )
        }
        if(!collection){
            return(<div>
                <div className="skeleton w-24 h-24"/>
            </div>)
        }
    return(
    
                <div className={` rounded-lg px-1 flex flex-row justify-between mb-1    `}>
             
                <div className="text-left my-auto md:ml-4 py-8  ">
                <a onClick={()=>navigate(Paths.collection.createRoute(collection.id))}className="text-emerald-800 " > 
                   {collection && collection.title && collection.title.length>0? <h6 className="text-xl ml-2 my-auto">{collection.title}</h6>:<h6>Unititled</h6>}
                </a>
                </div> 
               <div className="my-auto w-fit">
                {buttonDiv}
                    
                </div>
                   
            
             
          
        </div>)
      }else{
        return<div className={`skeleton ${isPhone?"":"rounded-lg"}`}>

        </div>
      }
}