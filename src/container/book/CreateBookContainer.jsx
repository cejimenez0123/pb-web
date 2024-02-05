
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getProfileBooks, updateBook,createBook } from "../../actions/BookActions"
import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { appendSaveRolesForPage } from "../../actions/PageActions"
import {IconButton} from "@mui/material"
import "../../styles/CreateBook.css"
import "../../styles/CreateLibrary.css"
import { Add } from "@mui/icons-material"
import checkResult from "../../core/checkResult"
import CreateForm from "../../components/CreateForm"
import { iconStyle } from "../../styles/styles"

export default function CreateBookContainer({pagesInView}){
        const navigate = useNavigate()
        const [books,setBooks]=useState([])
        const currentProfile = useSelector(state=>state.users.currentProfile)
        const pagesToBeAdded = useSelector(state=>{return state.pages.pagesToBeAdded})
        const dispatch = useDispatch()
        
       
   
    

    useEffect(
        ()=>{
            fetchBooks()
        },[]
    )
    
    const fetchBooks = ()=>{
        if(currentProfile){
        const params = {profile: currentProfile}
        dispatch(getProfileBooks(params)).then(result=>
            checkResult(result,(payload)=>{
                const {bookList}=payload
                setBooks(bookList)
            },err=>{

            }))}
    }
    const addUpdateBook=(book)=>{
        
    pagesToBeAdded.forEach(page=>{
        let readers = [...book.commenters,...book.writers,...book.editors,...book.readers]
        let list = pagesToBeAdded.map(page=>page.id)
        let pageIdList = [...book.pageIdList,...list]
        pageIdList.push(page.id)
        const roleParams = {
            pageIdList,
            readers,
        }
        dispatch(appendSaveRolesForPage(roleParams)).then(result=>{
            checkResult(result,payload=>{
                window.alert("Book contributors added to page readers")
            },(err)=>{
                window.alert("Error others may not be able to read page. Check roles")
            })
        })   
    })
    
    let list = pagesToBeAdded.map(page=>page.id)
    let pageIdList = [...book.pageIdList,...list]
    const params ={
        book,
        title:book.title,
        purpose:book.purpose,
        pageIdList,
        privacy:book.
        privacy,
        writingIsOpen:book.writingIsOpen
    } 
    dispatch(updateBook(params))
    .then(result => {
        checkResult(result,payload=>{
            navigate(`/book/${book.id}`)
        },()=>{})
    }).catch(error =>{

    })
    }
    // const setSortOrderAlpha=()=>{

    //     if(sortAlpha){
    //     let newPages = [...pages].sort((a,b)=>{
    //         if (a.title < b.title) {
    //             return -1;
    //           }
    //           if (a.title > b.title) {
    //             return 1;
    //           }
    //           return 0;
    //     })
    //     // setPages(newPages);
 
    //     }else{
    //         let newPages = [...pages].sort((a,b)=>{
    //             if (b.title < a.title) {
    //                 return -1;
    //               }
    //               if (b.title > a.title) {
    //                 return 1;
    //               }
    //               return 0;
    //         })
    //         // setPages(newPages);
        
    //     }
    // }
    const bookList = ()=>{
            let i = 0
                return(<div >
                    <InfiniteScroll dataLength={books.length} 
           next={fetchBooks}
           hasMore={false} // Replace with a condition based on your data source
           loader={<p>Loading...</p>}
           endMessage={<p className="no-more-data">No more data to load.</p>}
        >
             {books.map(book=>{
                i+=1
                
                let found = book.pageIdList.find(xid=>{
                  let add =  pagesToBeAdded.find(page=>page.id==xid)
                  return add
                })
                return (<div className={`list-item rounded ${found? "add":""}`} key={`${book.id}_${i}`}>
                    <h6>{book.title}</h6>
                    <div className="button-row">
                    <IconButton onClick={()=>addUpdateBook(book)}>
                    <Add style={iconStyle}/>
                    </IconButton>
                    </div>
                </div>)
             })}
    
    
             
                    </InfiniteScroll>
                </div>)
            }

        const pagesToBeAddedList =()=>{
            if(pagesToBeAdded!=null){
        
             
            return(<div className="content-to-be-added-list">
                <div>
                <h4>Pages to be Added</h4>
                </div>
                {pagesToBeAdded.length>0?pagesToBeAdded.map(page =>{

                    return (
                        <div key={page.id}>
                            <h6>{page.title}</h6>
                        
                        </div>
                    )
                }):<h6>0 items being added</h6>}
            </div>)}
            
        }
      
    return(<div className="create" >
        <div className="two-panel">
         
            <div className="left-bar">
          
                {bookList()}
            
            </div>
            <div className="right-bar">
       
                <CreateForm/>
          
            
            </div>
        </div>
    </div>)
}

