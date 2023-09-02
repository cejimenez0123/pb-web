
import { useEffect,useState} from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector,useDispatch } from "react-redux"
import { fetchArrayOfPages } from "../actions/PageActions"



function LibraryViewContainer(props){
    const dispatch = useDispatch()
    const libraryInView = useSelector(state=>state.libraries.libraryInView)
    const pagesInView = useSelector(state=>state.pages.pagesInView)
    const booksInView = useSelector(state=>state.books.booksInView)
    const [hasMorePages,setHasMorePages] = useState(false)
    useEffect(()=>{
      getPages()
    },[libraryInView])
    const libraryInfo=()=>{
        if(libraryInView!=null){
            const lib = libraryInView
                return(<div>
                        {lib.name}
                </div>)}else{

                    return(<div>
                            Loading...
                        </div>)
                }
    }
    const getPages = () =>{
        if(libraryInView!=null){
            

            const pageIdList = libraryInView.pageIdList
            const params = {pageIdList: pageIdList}
            dispatch(fetchArrayOfPages(params)).then((result) => {
                if(pagesInView.length<libraryInView.page.length){
                    setHasMorePages(true)
                }else{
                    setHasMorePages(false)
                }
            }).catch((err) => {
                
            });
        }
    }
    const getBooks=()=>{

    }
    const pageList = ()=>{
        if(pagesInView!=null && pagesInView.length>0){
            return(<div className="">

                <InfiniteScroll
                dataLength={pagesInView.length}
                next={getPages}
                hasMore={hasMorePages} // Replace with a condition based on your data source
                loader={<p>Loading...</p>}
                endMessage={<p>No more data to load.</p>}
                scrollableTarget="scrollableDiv"
                >
                {
            pagesInView.map((page)=>{
                return(<div key={page.id}>
                    {page.title}
                </div>)
            })
        }
                </InfiniteScroll>
            </div>
            )}else{

                return(<div>
                    Content Loading...
                </div>)

            }}
    
    return (<div>
        <div className="left-side-bar">
            <div>
                {libraryInfo()}
            </div>
        </div>
        <div className="main-side-bar">
                {pageList()}
        </div>
        <div className="right-side-bar">
        </div>
    </div>)


}

export default LibraryViewContainer