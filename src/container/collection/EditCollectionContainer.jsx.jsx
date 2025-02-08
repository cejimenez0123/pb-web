import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import { deleteCollection, deleteCollectionFromCollection, patchCollectionContent } from "../../actions/CollectionActions"
import deleteIcon from "../../images/icons/delete.svg"
import arrowDown from "../../images/icons/arrow_down.svg"
import {  deleteStoryFromCollection,  fetchCollectionProtected,  } from "../../actions/CollectionActions"
import add from "../../images/icons/add_circle.svg"
import view from "../../images/icons/view.svg"
import SortableList from "../../components/SortableList"
import checkResult from "../../core/checkResult"
import StoryToCollection from "../../domain/models/storyToColleciton"
import CollectionToCollection from "../../domain/models/ColllectionToCollection"
import { Dialog,DialogActions,DialogTitle,DialogContent,DialogContentText ,Button} from "@mui/material"
import RoleForm from "../../components/role/RoleForm"
import { useMediaQuery } from "react-responsive"
import { RoleType } from "../../core/constants"

import Context from "../../context"
import HashtagForm from "../../components/hashtag/HashtagForm"
import { debounce } from "lodash"
function getUniqueValues(array) {
    let unique = []
    return array.filter(item=>{
        let i = unique.indexOf(item.id)

        if(i<0){
            unique=[...unique,item.id]
            return true
        }
        return false
    })
  }
export default function EditCollectionContainer(props){
    const colInView = useSelector(state=>state.books.collectionInView)
    const params = useParams()
    const {id}=params
    const isPhone =  useMediaQuery({
        query: '(max-width: 600px)'
      })
      
      const [pending,setPending]=useState(true)
    const location = useLocation()

     const [isOpen,setIsOpen]=useState(false)
    const [openDelete,setOpenDelete]=useState(false)
    const [followersAre,setFollowersAre]=useState(RoleType.commenter)
    const {currentProfile} = useContext(Context)
    const [canUserEdit,setCanUserEdit]=useState(false)
    const {setError,setSuccess}=useContext(Context)
  
    const [newPages,setNewPages]=useState([])
    const [newCollections,setNewCollections]=useState([])
    const [title,setTitle]=useState("")
    const [purpose,setPurpose]=useState("")
    const [isPrivate,setIsPrivate]=useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [openAccess,setOpenAccess]=useState(false)
    const setItems=(col)=>{
      if(currentProfile){
   
        if(col.storyIdList){
        
          let stcList = col.storyIdList.map((stc,i)=>{
                         let index = i
                         if(stc.index){
                          index= stc.index
                         }
            return new StoryToCollection(stc.id,index,stc.collection,stc.story,currentProfile)
        }).sort((a,b)=>
            
          b.index>a.index
     
             )
            setNewPages(stcList)
      }
      if(col.childCollections){
            let newList = col.childCollections.map((stc,i)=>{
                return new CollectionToCollection(stc.id,i,stc.childCollection,colInView,currentProfile)
        }).sort((a,b)=>
            
          b.index>a.index
     
             )
    
            setNewCollections(newList)
      }
        }
          
      }
    
  

    useLayoutEffect(()=>{
      soCanUserEdit()
      setItems(colInView)
    },[colInView])
 
    const getCol =()=>{
     let token = localStorage.getItem("token")
      if(token&&colInView&&colInView.id!=id){
        dispatch(fetchCollectionProtected(params)).then(res=>{
          checkResult(res,payload=>{
          
          },err=>{
          setPending(false)
          setCanUserEdit(false)
          })
    
      })
    
    }}
    useLayoutEffect(()=>{
      getCol()
    },[])
    useEffect(()=>{
    if(colInView){
        setTitle(colInView.title)
        setPurpose(colInView.purpose)
        setIsPrivate(colInView.isPrivate)
        setFollowersAre(colInView.followersAre??RoleType.commenter)
        handleSetOpen(colInView.isOpenCollaboration) 
    }
    },[colInView])

  
  
    const soCanUserEdit=()=>{
      if(colInView&&currentProfile&&colInView.profileId && currentProfile.id){
        setCanUserEdit(true)
        setPending(false)
        return
      }
      
    }

    const handleDeleteCollection = ()=>{
     

        dispatch(deleteCollection(params)).then(res=>checkResult(res,payload=>{
                navigate(Paths.myProfile())
        },err=>{

        }))
    }
 
   
    const updateCollection = (e)=>{
        e.preventDefault()
        dispatch(patchCollectionContent({id:params.id,isPrivate:isPrivate,isOpenCollaboration:isOpen,title,purpose,storyToCol:newPages,colToCol:newCollections,col:colInView,profile:currentProfile})).then(res=>{
            setError(null)
              setSuccess("Successful Update")

        },err=>{
            setSuccess(null)
            setError(err.message)
        })
    }
    useEffect(()=>{
      if(isOpen){
        setFollowersAre(RoleType.writer)
      }
    },[isOpen])
    const handleSetOpen=(open)=>{
        setIsOpen(open)
        if(open){
            const arr = [RoleType.writer,RoleType.editor]
            if(!arr.includes(followersAre)){
                setFollowersAre(RoleType.writer)
            }
        }
    }
    
    const collectionInfo=()=>{
        
        return(<div className="   sm:flex-row sm:flex justify-around lg:w-info mx-auto max-h-info sm:pb-8 sm:w-48 p-4 sm:border-emerald-600 sm:border-2 mx-2 mt-4 md:mt-8 rounded-lg mb-8 sm:text-left">
    <div>
        <div className="lg:w-[28em] mx-auto">
    <input 
  onChange={(e)=>{
    setTitle(e.target.value)
}}
    type="text" className="bg-transparent w-fit text-emerald-800 border-1 border-emerald-200  rounded-full  px-2 py-2  text-ellipsis w-full mb-4  lora-medium text-2xl" value={title}/>
       </div>
       <div className=" md:max-w-[27em] ">
        <textarea onChange={e=>setPurpose(e.target.value)}className="  textarea  mb-4 text-[0.8rem]  text-emerald-800 w-[92vw]  border-emerald-600 bg-transparent md:h-[8em] max-w-[96vw] md:w-[100%] md:w-92 md:max-w-96 rounded-lg p-2" value={purpose}/>
        
        <HashtagForm item={colInView}/>
        </div>
        
  </div>
        
        <div className="">
        <div className=" mt-8 w-[100%]   justify-evenly md:ml-12  gap-2 grid  grid-cols-2  ">


   <span className="bg-emerald-800 flex  mx-auto mont-medium text-white w-[9rem] h-[4rem] text-center  rounded-full"
   
   onClick={updateCollection}
   
   ><h6 className="mx-auto my-auto">Update</h6></span>

 
   <div className="flex flex-row">
    
   <img onClick={()=>navigate(Paths.addToCollection.createRoute(colInView.id))
   }className=" bg-emerald-800 max-h-10 p-2 rounded-full mx-auto "
   src={add}/>
   <img
   onClick={()=>navigate(Paths.collection.createRoute(colInView.id))}
    className=" bg-emerald-800 rounded-full mx-auto  max-h-10 p-2 " src={view}/>
   </div>
    {isOpen?<div  onClick={()=>setIsOpen(false)} className={"border-emerald-500 mont-medium border-4 min-w-36 text-center  flex  bg-transparent m text-[1rem]  mx-auto text-emerald-800 w-[9rem] h-[4rem] rounded-full"}><h3 className="text-[0.8rem] w-[6em] mx-auto my-auto lg:text-[0.8rem] ">Collection is Open Collab</h3> </div>:
    <div onClick={()=>setIsOpen(true)} className={"border-emerald-400 border-2 min-w-36 mont-medium flex text-center bg-transparent mx-auto   text-emerald-800 w-[10em] h-[5em] rounded-full"}><h3 className="text-[0.8rem] w-[6em] mx-auto my-auto lg:text-[0.8rem]  ">Collection is Close Collab</h3></div>}
    
 
   <div>
   
    {isPrivate?<div
       className={`
        " border-2 flex border-emerald-300 w-[9rem] h-[4rem] mont-medium bg-transparent text-emerald-800  mx-auto rounded-full`}
    ><a className="mx-auto text-emerald-800 my-auto">
        Is Private
    </a></div>:<div
    
    className={`
        " border-2 border-emerald-300 border-4 flex mx-auto border-success  m-1 w-[9rem] h-[4rem]  bg-transparent text-emerald-800  rounded-full`}
   ><a className="mx-auto my-auto mont-medium text-emerald-800">Is Public</a></div>}
  
   </div>
   <div className="mx-auto">
    <div >
    <div className="dropdown">
  <div tabIndex={0} role="button"  className="  w-[9rem] h-[4rem] border-2 border-emerald-600  text-center flex rounded-full"> <span className=" text-emerald-700  text-center   mx-auto my-auto  mont-medium  ">
    Followers are<br/> <span   className="text-emerald-700 mx-auto flex-row flex ">{followersAre}s<img src={arrowDown}/></span>   </span>
 
</div>
  <ul tabIndex={0} className={`dropdown-content menu bg-white text-emerald-800 rounded-box z-[1] w-52 p-2 shadow ${isOpen?"hidden":""}`}>
  <li onClick={()=>{setFollowersAre(RoleType.commenter)}}><a>{RoleType.commenter}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.reader)}}
        ><a>{RoleType.reader}</a></li>
        <li
        onClick={()=>{setFollowersAre(RoleType.writer)}}
        ><a>{RoleType.writer}</a></li>

    </ul>
</div>


   </div>
   </div>
   
  
 
    <a onClick={()=>setOpenAccess(true)}className="text-white  text-[0.8rem]  mx-auto flex w-[9rem] h-[4rem] rounded-full mont-medium bg-emerald-600"><span className="mx-auto my-auto">Manage Access</span></a>

   <div>

</div>
   <div className="">
  <img className="p-2 rounded-full w-12 h-12  mt-2 w-fit mx-auto bg-emerald-800 hover:bg-red-500  "
    src={deleteIcon} 
    onClick={()=>setOpenDelete(!openDelete)}/> 
  </div>
  

   </div>
   </div></div>
)}
const handleStoryOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
    
        return new StoryToCollection(stc.id,i,stc.collection,stc.story,currentProfile)
    })


    setNewPages(list)
  };
  const handleColOrderChange = (newOrder) => {
    let list = newOrder.map((stc,i)=>{
    
      return new CollectionToCollection(stc.id,i,stc.childCollection,colInView,currentProfile)
  })
    setNewCollections(list)
  };
  const deleteChildFromCollection=(tc)=>{

    if(tc){dispatch(deleteCollectionFromCollection({tcId:tc.id}))}
  }
const deleteStory = (stc)=>{
 
        dispatch(deleteStoryFromCollection({stId:stc.id}))
}

    if(!colInView){
        if(pending){
        return(<div className="skeleton w-96 bg-emerald-50 max-w-[96vw]  m-2 h-96"/>
       
        )
    }else{
        return(<div className="w-[100%] h-[100%]" >
            <h6 className="text-emerald-800 mx-auto my-24">Collection Not Found </h6>
        </div>)
    }
    }

    if(colInView&&canUserEdit){
        return(<div>
      
     
            {!pending?collectionInfo():<div className="w-[96vw] mx-auto md:w-info h-info flex">
              <h6 className="mx-auto my-auto text-emerald-700 text-2xl">You sure you're in the right place</h6>
              </div>
    }
            
                         <div className='w-[96vw] md:mt-8 mx-auto flex flex-col md:w-page'>

                         
<div role="tablist" className="tabs   grid ">

<input type="radio" name="my_tabs_2" role="tab" defaultChecked className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page   text-xl" aria-label="Pages" />
<div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg wmd:mx-auto   ">
<SortableList items={newPages} onOrderChange={handleStoryOrderChange}
  onDelete={deleteStory}/>

  </div>
  <input type="radio" name="my_tabs_2" role="tab"  className="tab hover:min-h-10  [--tab-bg:transparent] rounded-full mont-medium text-emerald-800 border-3 w-[96vw]  md:w-page   text-xl" aria-label="Collections" />
  <div role="tabpanel" className="tab-content  pt-1 lg:py-4 rounded-lg md:mx-auto  w-[96vw] md:w-page  ">

   <SortableList items={newCollections} onOrderChange={handleColOrderChange} onDelete={deleteChildFromCollection}/>

  </div>
</div>
</div>
<Dialog 
fullScreen={isPhone}
open={openAccess}
onClose={()=>{
    setOpenAccess(false)
}}>
    
    <div className="overflow-y-scroll  h-[100%] overflow-x-hidden">
    <RoleForm item={colInView} onClose={()=>setOpenAccess(false)}/>
    </div>
</Dialog>
<Dialog

aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
open={openDelete}
onClose={()=>setOpenDelete(false)}>
  <div className="rounded-lg">
  <DialogTitle id="alert-dialog-title">
    {"Deleting?"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description" className="open-sans-medium">
      Are you sure you want to delete this <strong>{colInView.title}</strong>?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={()=>setOpenDelete(false)}>Disagree</Button>
    <Button onClick={handleDeleteCollection}>
      Agree
    </Button>
  </DialogActions>
  </div>
</Dialog>
        </div>)
    }
    
}
