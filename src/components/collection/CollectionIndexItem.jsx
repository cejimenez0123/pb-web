import { useMediaQuery } from "react-responsive"
import edit from "../../images/icons/edit.svg"
import addBox from "../../images/icons/add_box.svg"
import { useSelector } from "react-redux"
export default function CollectionIndexItem({collection}){
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      if(collection){
        let buttonDiv = (
            <div className="dropdown dropdown-left my-auto justify-content-center">
        <div tabIndex={0} role="button" className="btn m-1"><img className="w-8 h-8 my-auto" src={addBox}/></div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Share</a></li>
            <li><a>Add to Collection</a></li>
        </ul>
      
        </div>)
        if(currentProfile && currentProfile.id == collection.profileId){
            buttonDiv =(
                <div className="dropdown dropdown-left my-auto justify-content-center">
        <div tabIndex={0} role="button" className="btn m-1"><img className="w-6 h-6 my-auto" src={edit}/></div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
            <li><a>Edit</a></li>
            <li><a>Add to Collection</a></li>
            <li><a>Share</a></li>
        </ul>
      
        </div>
            )
        }
    return(<div>
        <div className={` ${isPhone?"":"rounded-lg"} flex w-full flex-row justify-between border border-white mb-1  `}>
                <div className="text-left my-auto ml-4 py-4   ">
                <a className="text-white " > 
                   {collection.title.length>0? <h6 className="text-xl my-auto">{collection.title}</h6>:<h6>Unititled</h6>}
                </a>
                </div> 
                <div className=" my-auto w-fit">
                {buttonDiv}
                    
              
                   
            
                </div>
            </div>
        </div>)
      }else{
        return<div className={`skeleton ${isPhone?"":"rounded-lg"}`}>

        </div>
      }
}