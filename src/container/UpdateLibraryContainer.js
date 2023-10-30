import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import {fetchArrayOfBooks} from "../actions/BookActions"
import { fetchArrayOfPages,clearPagesInView} from "../actions/PageActions"
import {    updateLibrary,
            fetchLibrary,
            saveRolesForLibrary,
            updateLibraryContent } from "../actions/LibraryActions"
import { useParams,useNavigate } from "react-router-dom"
import { getCurrentProfile } from "../actions/UserActions"
import InfiniteScroll from "react-infinite-scroll-component"
import RoleList from "../components/RoleList"
import "../styles/UpdateLibrary.css"
import {Checkbox , Button, FormGroup, TextField,FormControlLabel } from "@mui/material"
import { RoleType } from "../core/constants"
import useAuth from "../core/useAuth"
function UpdateLibraryContainer(props) {
    const authHook = useAuth() 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pathParams = useParams()
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const [libraryName, setLibraryName]= useState("")
    const [writingIsOpen,setWritingIsOpen]=useState(false)
    const [privacy,setPrivacy]=useState(false)
    const [purpose,setPurpose]=useState("")
    const [hasMore,setHasMore]=useState(true)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const bookmarkLibrary = useSelector(state=>state.libraries.bookmarkLibrary)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [itemsInLibrary,setItemsInLibrary] = useState([])
    const [roleList,setRoleList]=useState([])
    const [contentItems,setContentItems]=useState([])
    const { id } = pathParams
    useEffect(()=>{
        
            if(currentProfile){
            
            }else{
                if(authHook.user){
                    const params = {
                     userId: authHook.user.uid
                    }
                    dispatch(getCurrentProfile(params))
                }
            }
    }

    ,[])
    const start =()=>{
        dispatch(fetchLibrary(pathParams)).then((result)=>{
            setLibrary()
            dispatch(clearPagesInView())
            fetchData()
          
        })
    }
    const setLibrary=()=>{
        if(libraryInView ){
            setLibraryName(libraryInView.name)
            setWritingIsOpen(libraryInView.writingIsOpen)
            setPrivacy(libraryInView.privacy)
            setPurpose(libraryInView.purpose)

        }
    }
  
    useEffect(()=>{
        if(libraryInView!=null && libraryInView.id==id){
            fetchBooks()
            fetchPages()
        }else{
            start()
        }
    },[])
    useEffect(()=>{     
       setLibrary()
    },[])


    const fetchBooks =()=>{
        if(libraryInView){
            let params = {bookIdList: libraryInView.bookIdList}
            dispatch(fetchArrayOfBooks(params)).then(result=>{

                if(result.error == null){
                    const {payload } = result
                    if(payload.error == null){
                        const {bookList} = payload
                        const newItems  = bookList.map(book=>{return {type:"book",item:book}})
         
                if(newItems.length > 0){
            
                
                    setContentItems(prevState=>{
                        let newThings = newItems.filter(hash=>{ 
                            let itemFound = prevState.find(({item})=>{
                                return item.id == hash.item.id
                            }) 
                            return !itemFound
                        })
                        let newState = [...prevState,...newThings]
                      
                    
                            
                        setItemsInLibrary(newState)
                        return newState;
                    })
                    
                    setHasMore(false)
                    
                }else{
                    setHasMore(false)
                }
            }
                    }})
            }
              
            }
    
    const fetchPages=()=>{
        if(libraryInView){
            const paramsA = {pageIdList:libraryInView.pageIdList}
            dispatch(fetchArrayOfPages(paramsA)).then(result=>{   
        if(result.error == null){
            const {payload } = result
        
            if(payload.error == null){
            const {pageList} = payload
            const newItems = pageList.map(page=>{return {type:"page",item:page}})
            
            if(newItems.length > 0){
            
                
                setContentItems(prevState=>{
                    let newThings = newItems.filter(hash=>{ 
                        let itemFound = prevState.find(({item})=>{
                            return item.id == hash.item.id
                        }) 
                        return !itemFound
                    })
                    let items = [...prevState,...newThings]
                    setItemsInLibrary(items)
                    return items;
                })
                setHasMore(false)
        
            }else{

                setHasMore(false)
            }

    }}})}}

    const fetchData = () =>{
        if(currentProfile){
        const params = { 
            profileId: currentProfile.id,
            page: 1,
            groupBy: 9
        }
        fetchPages()
    }}
    const libraryInfo=()=>{
        return (<div className="library-update">
            <FormGroup>
            
                <TextField type="text"  value={libraryName} 
                                    onChange={(e)=>{
                                        setLibraryName(e.target.value)
                                    }

                }/>
                    <FormControlLabel control={<Checkbox checked={privacy} onChange={(e)=>{

            setPrivacy(!privacy)}} />} label="Private" />
        
                 <FormControlLabel control={<Checkbox  onChange={(e)=>{
                    setWritingIsOpen(!writingIsOpen)
                }} checked={writingIsOpen} />} label="Writing is Open" />
               
                <Button style={{ backgroundColor: "rgb(24, 69, 24)",
    color:"white"}}type="submit" variant="outlined" onClick={(e)=>updateLibraryDetails(e)}>Update</Button>
            </FormGroup>
          
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

        const writers = roleList.filter(role=>role.role==RoleType.writer).map(role=>role.profile.userId)
        const editors = roleList.filter(role=>role.role==RoleType.editor).map(role=>role.profile.userId)
        const commenters = roleList.filter(role=>role.role==RoleType.commenter).map(role=>role.profile.userId)
        const readers = roleList.filter(role=>role.role==RoleType.reader).map(role=>role.profile.userId)
        const roleParams = {library:libraryInView,
            readers,
            commenters,
            editors,
            writers}
        dispatch(saveRolesForLibrary(roleParams))


    }
    const contentList = ()=>{
        if(contentItems!=null){
        return (<div >
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
                
                return(<div className="list-item "key={hash.item.id}>
                    <div className="item-info">
                        <h5>{hash.type}</h5>
                        <h5>{hash.item.title}</h5>
                    </div>
                    <input type="checkbox" checked={item} onChange={()=>{
                        
                            if(item){
                                let newList = itemsInLibrary.filter(  item => item.item.id !== hash.item.id)
                                setItemsInLibrary(newList)
                            }else{
                                setItemsInLibrary(prevState=>[...prevState,hash])
                            }
                    }}/>
                </div>)
        })}
    </InfiniteScroll>
        </div>)}else{
            return(<div>
                    So Empty
            </div>)
        }
    }
  
    return (<div className="container">
        <div className="left-side-var">

        </div>
        <div className="main-bar">
        <div className="content-list">
            {contentList()}
            </div>
        </div>
        <div className="right-side-var">
            <div className="info">
                <div>
            {libraryInfo()}
            </div>
            <div>
                <RoleList library={libraryInView} getRoles={(roleList) => {
                
                setRoleList(roleList)
                }}/>
                  
            </div>
          </div>
        </div>

    </div>)
}
function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
export default UpdateLibraryContainer