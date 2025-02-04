import { useContext, useEffect, useLayoutEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getStory } from "../../actions/StoryActions"
import { addCollectionListToCollection, addStoryListToCollection, deleteCollectionFromCollection, deleteStoryFromCollection, fetchCollection, fetchCollectionProtected, getMyCollections, setCollections } from "../../actions/CollectionActions"
import InfiniteScroll from "react-infinite-scroll-component"
import CreateCollectionForm from "../../components/collection/CreateCollectionForm"
import {Dialog} from "@mui/material"
import usePersistentMyCollectionCache from "../../domain/usecases/usePersistentMyCollectionCache"
import addBox from "../../images/icons/add_circle.svg"
import clear from "../../images/icons/close.svg"
import { useMediaQuery } from "react-responsive"
import checkResult from "../../core/checkResult"
import loadingGif from "../../images/loading.gif"
import Context from "../../context"
import Paths from "../../core/paths"

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
}

export default function AddStoryToCollectionContainer(props){
  const isPhone =  useMediaQuery({
    query: '(max-width: 600px)'
  })
  const{setError,currentProfile}=useContext(Context)
    const pathParams = useParams()
    const {id,type}=pathParams 

    // let prof = usePersistentMyCollectionCache((()=>dispatch(getMyCollections())))   
    const dispatch = useDispatch()
    const [item,setItem]=useState(null)
 const navigate = useNavigate()
    const cols=usePersistentMyCollectionCache(()=>dispatch(getMyCollections()))
    const [hasMoreCol,setHasMoreCol]=useState(false)
    const [openDialog,setOpenDialog]=useState(false)
    const [search,setSearch]=useState("")
    
    const collections = useSelector(state=>state.books.collections??cols).
    filter(col=>col )
    .filter(col=>{return col && col.type && col.type!="feedback"}).filter(col=>{
      if(item && item.id==col.id){
        return false
      }
      if(search.length>0){
       return col.title.toLowerCase().includes(search.toLowerCase())
      }else{
       return true
      }
  
     })
    useLayoutEffect(()=>{
      if(currentProfile){
        dispatch(setCollections({collections: currentProfile.collections}))
  
      }
   },[currentProfile,id])
    const addStory = (e,collection)=>{
        e.preventDefault()
        if(item.storyIdList&&type==="collection"){

          dispatch(addCollectionListToCollection({id:collection.id,list:[item.id],profile:currentProfile})).then(res=>
            checkResult(res,payload=>{
              const {collection}=payload
            setItem(collection)
           
            },err=>{setError(err.message)})
          )
                  }
        if(item && type==="story"){
      dispatch(addStoryListToCollection({id:collection.id,list:[item],profile:currentProfile})).then(res=>{
        checkResult(res,payload=>{
          
        
        },err=>{
          setError(err.message)
        })
      })
        }
     
      
      }
        
    const handleSearch = (value)=>{
      setSearch(value)
  }
    const deleteStory = (e,collection,tc)=>{
  
      e.preventDefault()
      if(item&&type=="collection"&&item.childCollections&&item.storyIdList&&item.id&&tc.id){
        dispatch(deleteCollectionFromCollection({id:tc.id,parentId:item.id})).then(res=>{
          checkResult(res,payload=>{
            console.log(payload)
            const{collection}=payload
       
            if(collection){
              setItem(collection)
            }
          })
        })
      }else if(item&&type=="story"){
      dispatch(deleteStoryFromCollection({id:collection.id,storyId:item.id}))
      }else{
        setError("Something messy")
      }
    }
    useLayoutEffect(()=>{
getContent()
    },[id])

    const getContent=()=>{
      switch(type){
        case"story":      
        dispatch(getStory({id:pathParams.id})).then(res=>{
          checkResult(res,payload=>{
            setItem(payload.story)
         
          },err=>{
      setError(err.message)
          })
        })
      case"collection":dispatch(fetchCollectionProtected({id:id})).then(res=>{
        checkResult(res,payload=>{
          setItem(payload.collection)
        },err=>{
          setError(err.message)
        })
      })
      }
  
     
   
    }
    
if(!item){
  return<div>
    <div className="w-[96vw] bg-slate-100 skeleton mx-auto md:w-info m-2 h-info"/>
    <di className="w-[96vw] bg-slate-100 skeleton mx-auto md:w-page h-page"/>
  </div>
}
return(<div className="text-emerald-800 w-[100vw]">
           
            <div className="border-2 mt-16 w-[96vw] h-info mx-auto md:w-info  text-left border-emerald-600 p-8   rounded-lg">
            <h6 className="text-xl font-bold pb-2 lora-medium  font-bold">Add <strong>{item.title} </strong>to Collection</h6>

            
              <button  
              onClick={()=>setOpenDialog(true)}
              className="bg-emerald-900 text-white rounded-full">New Collection</button>
              </div>
            <div>
                </div>
                <div className="border-b-2   max-w-[96vw] md:w-page md:px-2  mx-auto border-emerald-600  md:mb-4 mb-1 mt-16 text-left   mx-2 rounded-lg">
                    <div className="flex flex-col  pb-8  pt-4  w-[100%]">
                    <h6 className="text-xl font-bold my-auto ml-4 lora-medium font-bold">Your Collections</h6>
                   <label className='flex my-auto w-[90%] mx-auto mt-4 mx-auto border-emerald-600 border-2 rounded-full my-1 flex-row '>
<span className='my-auto text-emerald-800 mx-2 w-full mont-medium '> Search:</span>
  <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2  w-[95%] py-1 rounded-full text-sm bg-transparent my-1  text-emerald-800' />
  </label></div>
                
                    <InfiniteScroll
                className="scroll "
                dataLength={collections?collections.length:0}
                hasMore={hasMoreCol} // Replace with a condition based on your data source
                loader={<div><img src={loadingGif}/></div>}
                endMessage={
                    <div className="flex ">
                        <p className="text-emerald-800 mx-auto md:text-xl py-12 lora-medium">Fin </p>
                    </div>
                }
            >
             {collections.map((col,i)=>{

  let found =null
  if(type=="story"&&col.storyIdList){
    found= col.storyIdList.find((sTc,i)=>{
  
   return sTc.storyId == item.id
  })}
  if(type=="collection"&& col.childCollections){
   found = col.childCollections.find(ctc=>{
    return ctc.childCollectionId == item.id
   })
    }

              if(col){
                return(<div key={`${col.id}_${i}`} 
                 className="border-emerald-600 border-2 mx-auto w-[96%] flex flex-row justify-between rounded-full px-6 py-4 my-3">

                  <h6  
                  onClick={()=>navigate(Paths.collection.createRoute(col.id))}
                  className="text-md lg:text-xl my-auto  overflow-hidden text-ellipsis max-w-[12rem] md:max-w-[25rem] whitespace-nowrap " >
                    {col.title}
                    </h6>
                    {!found?<img onClick={(e)=>addStory(e,col)}className="bg-emerald-600 p-2 w-12 h-12 rounded-full" src={addBox}/>:<img onClick={(e)=>deleteStory(e,col,found)}className="bg-emerald-600 p-2 w-12 h-12 rounded-full" src={clear}/>}</div>)
}else{
  return <div className="skeleton w-[100%]"></div>
}})}</InfiniteScroll>

                </div>
                <div>
              <Dialog className={
                "bg-emerald-400"
              }
              fullScreen={isPhone}
              PaperProps={{
                style: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
            
              open={openDialog}
              onClose={()=>setOpenDialog(false)}>
                <CreateCollectionForm onClose={()=>{
                  setOpenDialog(false)
                }}/>
              </Dialog>


                </div>
          
        </div>)
    
    
}