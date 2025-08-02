import { useContext, useEffect, useLayoutEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getStory } from "../../actions/StoryActions"
import {   fetchCollectionProtected, getMyCollections, setCollections } from "../../actions/CollectionActions"
import InfiniteScroll from "react-infinite-scroll-component"
import CreateCollectionForm from "../../components/collection/CreateCollectionForm"
// import {Dialog} from "@mui/material"
import Dialog from "../../components/Dialog"
import usePersistentMyCollectionCache from "../../domain/usecases/usePersistentMyCollectionCache"
import { useMediaQuery } from "react-responsive"
import checkResult from "../../core/checkResult"
import loadingGif from "../../images/loading.gif"
import Context from "../../context"
import ErrorBoundary from "../../ErrorBoundary"
import AddToItem from "../../components/collection/AddToItem"

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
    return match.toUpperCase();
  });
}

export default function AddStoryToCollectionContainer(props){
  const isPhone =  useMediaQuery({
    query: '(max-width: 600px)'
  })
  const{setError,currentProfile,seo,setSeo}=useContext(Context)
 
    const pathParams = useParams()
    const {id,type}=pathParams 
    const dispatch = useDispatch()
    const cols=usePersistentMyCollectionCache(()=>dispatch(getMyCollections()))
    const [hasMoreCol,setHasMoreCol]=useState(false)
    const [openDialog,setOpenDialog]=useState(false)
    const [search,setSearch]=useState("")
    const collectionInView = useSelector(state=>state.books.collectionInView)
    const pageInView = useSelector(state=>state.pages.pageInView)
    const [item,setItem]=useState(type=="collection"?collectionInView:pageInView)
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
     useEffect(()=>{
      if(pageInView){
        let soo = seo
          soo.title=`Plumbum Add (${pageInView.title}) to Collection `
          soo.description="Explore events, workshops, and writer meetups on Plumbum."
          setSeo(soo)
     }
     },[])
    useLayoutEffect(()=>{
      if(currentProfile){
        dispatch(setCollections({collections: currentProfile.collections}))
  
      }
   },[currentProfile,id])
    
        
    const handleSearch = (value)=>{
      setSearch(value)
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
return(<ErrorBoundary><div className="text-emerald-800 w-[100vw]">
           
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
return <AddToItem key={i} item={item} col={col}/>


})


}

</InfiniteScroll>

                </div>
                <div>
              {/* <Dialog className={
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
              onClose={()=>setOpenDialog(false)}> */}
              <Dialog isOpen={openDialog}
              
              text={
                <CreateCollectionForm onClose={()=>{
                  setOpenDialog(false)
                }}/>}/>
            


                </div>
          
        </div>
        </ErrorBoundary>)
    
    
}