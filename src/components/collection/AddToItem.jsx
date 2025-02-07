import { useNavigate, useParams } from "react-router-dom"
import Paths from "../../core/paths"
import loadingGif from "../../images/loading.gif"
import addBox from "../../images/icons/add_circle.svg"
import clear from "../../images/icons/close.svg"
import { useContext, useLayoutEffect, useState } from "react"
import { useSelector } from "react-redux"
import Context from "../../context"
import { deleteStoryFromCollection,deleteCollectionFromCollection, setCollectionInView ,addCollectionListToCollection,addStoryListToCollection} from "../../actions/CollectionActions"
import { useDispatch } from "react-redux"
import checkResult from "../../core/checkResult"



export default function AddToItem({col}){
    const pathParams = useParams() 
    const {setError,setSuccess,currentProfile}=useContext(Context)
    const {id,type}=pathParams 
    const collectionInView = useSelector(state=>state.books.collectionInView)
    const pageInView = useSelector(state=>state.pages.pageInView)
    const [item,setItem]=useState(type=="collection"?collectionInView:pageInView)
    const navigate= useNavigate()
    const dispatch =useDispatch()
    const [pending,setPending]=useState(false)
    const isFound=()=>{
            if(type=="story"&&item.collections&&item.id){
                
                    return item.collections.find((sTc,i)=>{
               
                return sTc.collectionId == col.id
               })}
        if(type=="collection"&& item.parentCollections&&item.id){
             
           
            return item.parentCollections.find(ptc=>{
                
                return ptc.parentCollectionId==col.id})
                
         

            }
          return null 
          }
        const [found,setFound]=useState(isFound())

        const addStory = (e,collection)=>{
            e.preventDefault()
            setPending(true)
            if(item.storyIdList&&type==="collection"){
    
              dispatch(addCollectionListToCollection({id:collection.id,list:[item.id],profile:currentProfile})).then(res=>
                checkResult(res,payload=>{

                 setItem(payload.collection)
            setPending(false)

                },err=>{setError(err.message)
                    setPending(false)
                })
              )
                      }
            if(item && type==="story"){
               let story = item
               if(!story){
                        story={id}
               }
          dispatch(addStoryListToCollection({id:col.id,list:[story],profile:currentProfile})).then(res=>{
            checkResult(res,payload=>{
                if(payload.stories){
                    setItem(payload.stories.find(story=>id==story.id))
                }

                setPending(false)
            },err=>{
               
              setError(err.message)
              setPending(false)
            })
          })
            }
         
          
          }
          const deleteStory = (e)=>{
  
            e.preventDefault()
           
             
            setPending(true)
            if(item&&type=="collection"&&item.id&&found&&found.id){
              dispatch(deleteCollectionFromCollection({tcId:found.id})).then(res=>{
                checkResult(res,payload=>{
     
                    const{collection}=payload
                    if(collection){
                        setItem(collection)
                    }
                   
                
                 
                  setPending(false)
                },err=>{
                    setError(err.message)
                    setFound(isFound())
                    setPending(false)
                })
              })
            }else if(item&&type=="story"&&found&&found.id){
            
            dispatch(deleteStoryFromCollection({stId:found.id})).then(res=>{
                checkResult(res,payload=>{
                   setPending(false)
               if(payload.story){
                setItem(payload.story)
               }
                   setFound(isFound())
                },err=>{
                    setPending(false)
                })
            })
            }else{
                setPending(false)
             
              setError("Something messy")
            }
          }
 
          useLayoutEffect(()=>{
            setFound(isFound())
    },[item])
 
                    if(col){
                      return(<div
                       className="border-emerald-600 border-2 mx-auto w-[96%] flex flex-row justify-between rounded-full px-6 py-4 my-3">
      
                        <h6  
                        onClick={()=>navigate(Paths.collection.createRoute(col.id))}
                        className="text-md lg:text-xl my-auto  overflow-hidden text-ellipsis max-w-[12rem] md:max-w-[25rem] whitespace-nowrap " >
                          {col.title}
                          </h6>
                          {pending?<img className="bg-emerald-600 p-2 max-w-10 max-h-10 rounded-full"  alt="loading" src={loadingGif} />:!found?<img onClick={(e)=>addStory(e,col)}alt="addbox" className="bg-emerald-600 p-2 max-w-12 max-h-12  rounded-full" src={addBox}/>:<img alt="clear" onClick={(e)=>deleteStory(e,col,found)}className="bg-emerald-600 p-2 max-w-12 max-h-12 rounded-full" src={clear}/>}</div>)
      }else{
        return <div className="skeleton w-[100%]"></div>
      }
}