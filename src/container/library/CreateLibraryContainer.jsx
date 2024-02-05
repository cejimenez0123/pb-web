import { useNavigate } from "react-router-dom"
import {useEffect} from "react"
import { useDispatch,useSelector } from "react-redux"
import { appendSaveRolesFoBook,  } from "../../actions/BookActions"
import {  appendSaveRolesForPage} from "../../actions/PageActions"
import { appendLibraryContent, createLibrary,getProfileLibraries,updateLibraryContent } from "../../actions/LibraryActions"
import InfiniteScroll from "react-infinite-scroll-component"
import "../../styles/CreateLibrary.css"
import {  
            Button,
          } from "@mui/material"
import { Add } from "@mui/icons-material"
import MediaQuery from "react-responsive"
import LibraryCreateForm from "../../components/LibraryCreateForm"
import uuidv4 from "../../core/uuidv4"
import { iconStyle } from "../../styles/styles"
export default function CreateLibraryContainer(props){
    const booksToBeAdded = useSelector(state => state.books.booksToBeAdded)
    const pagesToBeAdded = useSelector(state => state.pages.pagesToBeAdded)
    
    const navigate = useNavigate()
    
    const currentProfile = useSelector(state=>{return state.users.currentProfile})
    const librariesInView = useSelector(state => state.libraries.librariesInView)
   
    const dispatch = useDispatch()
    
    
    const onClickAdd=(hash)=>{  
        
        const pIdList = pagesToBeAdded.map(page=>{ return page.id; });
        const bIdList = booksToBeAdded.map(book=>{ return book.id; });
       
        
        let params = {
            library:hash,
            pageIdList:pIdList,
            bookIdList:bIdList
        }
        const bookRoleParams = {
            bookIdList:bIdList,
            readers: hash.readers,
            commenters: hash.commenters
        }

        const pageRoleParams = {
            pageIdList:pIdList,
            reader: hash.readers,
            commenters: hash.commenters
        }
        dispatch(appendSaveRolesFoBook(bookRoleParams))
        dispatch(appendSaveRolesForPage(pageRoleParams))
        dispatch(appendLibraryContent(params)).then(result=>{
            if(result.error==null){
                navigate(`/library/${hash.id}`)
            }
        })  
    }
    
    
    const fetchLibraries = ()=>{
        if(currentProfile){
            const params = {profile:currentProfile}
            dispatch(getProfileLibraries(params))
        }
    }
    useEffect(()=>{
        fetchLibraries()
    },[])


        const libraryList = ()=>{
        if(!!librariesInView && librariesInView.length > 0){
        return(<div >
            <InfiniteScroll dataLength={librariesInView.length} 
                            next={fetchLibraries}
                            hasMore={false} 
                            loader={<p>Loading...</p>}
                            endMessage={<div className="no-more-data">
                                    <p>No more data to load.</p>
                                    </div>}
            >
     {librariesInView.map((hash) =>{

             return(<div className="list-item" key={hash.id}>
                <div>
                    
                <h6 >
                {hash.name}
            
                </h6>
                </div>
                <div className="button-row">
              
                <Button onClick={()=>onClickAdd(hash)}>
                    <Add style={iconStyle}/>
                </Button>
                </div>
            </div>)
        })}
            </InfiniteScroll>
        </div>)}else{
            return (<div>
                Loading...
            </div>)
        }
    }

    
return(<div id="CreateLibrary">
    <div className="screen">
        <div className="left-bar">
                <MediaQuery maxWidth={"1000px"}>
                    <LibraryCreateForm/>
                </MediaQuery>
        </div>
        <div className="main-bar">
            {libraryList()}
        </div>
        <div className="right-bar">
            <MediaQuery minWidth={"1000px"}>
                <LibraryCreateForm/>
            </MediaQuery>
        </div>
    </div>
</div>)
}
