import { useMediaQuery } from "react-responsive"
import edit from "../../images/icons/edit.svg"
import addBox from "../../images/icons/add_circle.svg"
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
        <div tabIndex={0} role="button" className="bg-emerald-700 p-1 rounded-full"><img className="w-8 h-8 p-1 " src={addBox}/></div>
        <ul tabIndex={0} className="dropdown-content menu  bg-white  rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Share</a></li>
            <li onClick={()=>navigate(Paths.addToCollection.createRoute(collection.id))}><a>Add to Collection</a></li>
        </ul>
      
        </div>)
        if(currentProfile && currentProfile.id == collection.profileId){
            buttonDiv =(
                <div className="dropdown dropdown-left justify-content-center">
    <button tabIndex={0} role="button" className="rounded-full bg-emerald-800  px-2  h-[2.5rem] w-[2.5rem]"><img classname=" my-auto mx-auto pb-1" src={edit}/></button>
        <ul tabIndex={0} className="dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 shadow">
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
        <div id={collection.id}  className="border-3  shadow-sm  rounded-full  border-emerald-300"><div className={`   mb-1 `}> 
        <div  className=" px-1 flex flex-row justify-between  " >
          <div className="text-left my-auto mx-3 py-4 mt-1 ">
                <h3 className={"w-[12em]  sm:w-full"}onClick={()=>navigate(Paths.collection.createRoute(collection.id))}> 
                   {collection && collection.title && collection.title.length>0? <h6 className="text-[0.9rem] sm:text-[1rem] w-[10rem]  md:w-[20em] no-underline text-ellipsis  whitespace-nowrap overflow-hidden text-emerald-800 ml-2 my-auto">{collection.title}</h6>:<h6 className="text-[0.9rem] sm:text-[1rem]">Unititled</h6>}
                </h3>
                </div> 
               <div className="my-auto mr-6 w-fit">
                {buttonDiv}
                    
                </div>
                   
            
             </div>
          </div>
        </div>)
      }else{
        return<div className={`skeleton ${isPhone?"":"rounded-lg"}`}>

        </div>
      }
}