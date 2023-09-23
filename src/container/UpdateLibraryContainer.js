import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {fetchArrayOfBooksAppened, getProfileBooks } from "../actions/BookActions"
import {fetchArrayOfPagesAppened, getProfilePages,clearPagesInView} from "../actions/PageActions"
import { fetchBookmarkLibrary, fetchLibrary,updateLibraryContent } from "../actions/LibraryActions"
import { useDispatch } from "react-redux"
import { updateLibrary } from "../actions/LibraryActions"
import { useParams } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"
import ListItem from "../components/ListItem"
import { useNavigate } from "react-router-dom"



function UpdateLibraryContainer(props) { 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pathParams = useParams()
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const [libraryName, setLibraryName]= useState("")
    const [writingIsOpen,setWritingIsOpen]=useState(false)
    const [privacy,setPrivacy]=useState(false)
    const [purpose,setPurpose]=useState("")
    const [hasMore,setHasMore]=useState(true)
    const [initial,setInitial]=useState(0)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [itemsInLibrary,setItemsInLibrary] = useState([])
    const [contentItems,setContentItems]=useState([])
    useEffect(()=>{
        
            if(currentProfile){
                dispatch(fetchLibrary(pathParams)).then((result)=>{
                if(libraryInView){
                    setLibraryName(libraryInView.name)
                    setWritingIsOpen(libraryInView.writingIsOpen)
                    setPrivacy(libraryInView.privacy)
                    setPurpose(libraryInView.purpose)
                }
                dispatch(clearPagesInView())
                fetchData()
              
            })
          
            }else{

            }
    }

    ,[])
    // useEffect(()=>{
    //     fetchBooks()
    // },[libraryInView])
    useEffect(()=>{
        
            fetchPages()
            
 
    },[])
    // const pageItemsWithin=(content)=>{

    //     if(initial<1 && libraryInView!=null){
    //     const itemsWithin= content.filter(hash=>{
        
    //         let found = libraryInView.pageIdList.find(id=>id == hash.item.id)
    //         return !!found
    //     })
        
    //     const itemsWithinList = [...itemsInLibrary,...itemsWithin]
    //     let list = [...itemsInLibrary,...itemsWithinList]
    //     let uniqList = []
    //         list.forEach(hash=>{
    //            let i = uniqList.find(item=>item.item.id == hash.item.id)
    //             if(!i){
    //                 uniqList.push(hash)
    //             }
    //         })
    //         setItemsInLibrary(uniqList)
    //     }
    //     setInitial(1)
    // }
    useEffect(()=>{
        setItemsWithin()
    },[contentItems])
    const setItemsWithin=()=>{
            if(libraryInView!=null){
            const itemsWithin= contentItems.filter(hash=>{
                let found = libraryInView.bookIdList.find(id=>id == hash.item.id)
                return !!found
            })
            const pageItemsWithin= contentItems.filter(hash=>{
                console.log(`BOBOBO ${JSON.stringify(hash)}`)
                let found = libraryInView.pageIdList.find(id=>id == hash.item.id)
                return !!found
            })
            console.log(`fdfsdcvd ${JSON.stringify(pageItemsWithin)}`)
            const itemsWithinList = [...itemsInLibrary,...itemsWithin,...pageItemsWithin]
            let uniqList = []
            itemsWithinList.forEach(hash=>{
               let i = uniqList.find(item=>item.item.id == hash.item.id)
                if(!i){
                    uniqList.push(hash)
                }
            })
            
                setItemsInLibrary(uniqList)
                setInitial(2)
            }}
    const fetchBooks =()=>{
        if(libraryInView){
            const content  = booksInView.map(book=>{return {type:"book",item:book}})
            let newItems = content.filter(hash=>{ 
                let itemFound = contentItems.find(({item})=>{
                    return item.id == hash.item.id
                }) 
                return !itemFound
            })
         
                if(newItems.length > 0){
            
                
                    setContentItems(prevState=>{
                        let newThings = newItems.filter(hash=>{ 
                            let itemFound = prevState.find(({item})=>{
                                return item.id == hash.item.id
                            }) 
                            return !itemFound
                        })
                        return [...prevState,...newThings];
                    })
                    setHasMore(true)
                    
                }else{
                    setHasMore(false)
                }
                setItemsWithin()
            }
    }
    const fetchPages=()=>{
        if(libraryInView){
            const content = pagesInView.map(page=>{return {type:"page",item:page}})
           
        
       
        let newItems = content.filter(hash=>{ 
                let itemFound = contentItems.find(({item})=>{
                    return item.id == hash.item.id
                }) 
                return !itemFound
            })
            
            if(newItems.length > 0){
            
                
                setContentItems(prevState=>{
                    let newThings = newItems.filter(hash=>{ 
                        let itemFound = prevState.find(({item})=>{
                            return item.id == hash.item.id
                        }) 
                        return !itemFound
                    })
                    return [...prevState,...newThings];
                })
                setHasMore(true)
        
            }else{

                setHasMore(false)
            }
        fetchBooks()
        }
    }

    const fetchData = () =>{
        if(currentProfile){
        const params = { 
            profileId: currentProfile.id,
            page: 1,
            groupBy: 9
        }
       

        
        dispatch(getProfilePages(params)).then((result) => {
            dispatch(getProfileBooks(params)).then((result)=>{
                fetchPages()
            })
            
    
        
    })
        if(!bookmarkLibrary){
            const parm = { id: currentProfile.bookmarkLibraryId}
            dispatch(fetchBookmarkLibrary(parm)).then((result)=>{
               const {payload } = result 
               if(payload.library){

               
             }})
        }else{
 }
        }
    }
    const libraryInfo=()=>{
        return (<div>
            <form>
                <input type="text"  value={libraryName} 
                                    onChange={(e)=>{
                                        setLibraryName(e.target.value)
                                    }

                }/>
                <input type="checkbox" value={privacy} onChange={(e)=>{

                    setPrivacy(!privacy)
                }}/>
                <input type="checkbox" value={writingIsOpen} onChange={(e)=>{
                    setWritingIsOpen(!writingIsOpen)
                }}/>
                <button type="submit" onClick={(e)=>updateLibraryDetails(e)}>Update</button>
            </form>
        </div>)
    }
    const updateLibraryDetails = (e) => {
        e.preventDefault();

        const params ={
            library: libraryInView,
            name: libraryName,
            purpose: purpose,
            privacy: privacy,
            writingIsOpen: writingIsOpen 
        }
        dispatch(updateLibrary(params)).then(result=>{
            const {payload} = result
            if(payload.error!=null){
                let error  = window.confirm(`${payload.error.message}`)
                window.alert(error)
            }else{
                let updateed = window.confirm(`Updated`)
                window.alert(updateed)
            }
        })
        const pageIdList  = itemsInLibrary.filter(item => item.type==="page").map(item => item.item.id)
        const bookIdList  = itemsInLibrary.filter(item => item.type==="book").map(item => item.item.id)
        const contentParams = {
            library: libraryInView,
            pageIdList: pageIdList,
            bookIdList: bookIdList
        }

        dispatch(updateLibraryContent(contentParams)).then((result) =>{
            let {id }= pathParams
            if(result.error==null){
            navigate(`/library/${id}`)
            }
        })
        


    }
    const contentList = ()=>{
        return (<div>
            <InfiniteScroll
      dataLength={contentItems.length}
      next={fetchData}
      hasMore={hasMore} // Replace with a condition based on your data source
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
        {contentItems.map(hash =>{
           let item = itemsInLibrary.find(ha=>{
                return ha.item.id == hash.item.id
            })
                
                return(<div key={hash.item.id}>
                    <div></div>
                    <h5>{hash.type}</h5>
                    <h5>{hash.item.title}</h5>
                    <input type="checkbox" checked={!!item} onChange={()=>{
                            if(itemsInLibrary.includes(hash)){
                                let newList = itemsInLibrary.filter(  item => item.item.id !== hash.item.id)
                                setItemsInLibrary(newList)
                            }else{
                                setItemsInLibrary(prevState=>[...prevState,hash])
                            }
                    }}/>
                </div>)
        })}
    </InfiniteScroll>
        </div>)
    }
  
    return (<div className="container">
        <div className="">

        </div>
        <div>
            
        <ul><h1>New things for Library</h1></ul>
            {contentList()}
        </div>
        <div>
            {libraryInfo()}
          
        </div>

    </div>)
}
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
export default UpdateLibraryContainer