import { useParams ,useNavigate} from "react-router-dom"
import { useDispatch,useSelector } from "react-redux"
import { useState,useEffect} from "react"
import { fetchBook,saveRolesForBook,setBookInView,updateBook } from "../../actions/BookActions"
import "../../styles/EditBook.css"

import {  fetchPage } from "../../actions/PageActions"
import BookRole from "../../domain/models/bookrole"
import { RoleType } from "../../core/constants"
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import { TextField ,Checkbox, FormControlLabel,Button, FormGroup, IconButton} from "@mui/material"
import RoleList from "../../components/RoleList"
import theme from "../../theme"
import checkResult from "../../core/checkResult"
import { Add,Visibility,Remove,DragIndicator } from "@mui/icons-material"
import uuidv4 from "../../core/uuidv4"
import ErrorBoundary from "../../ErrorBoundary"
import SortableComponent from "../../components/SortableList"

  
function EditBookContainer({book}){   
    const pathParams = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [newBookRoles, setNewBookRoles ]= useState([BookRole])
    const [bookTitle,setBookTitle] = useState("")
    const [bookIsPrivate,setBookPrivacy]= useState(false)
    const [bookPurpose,setBookPurpose] = useState("")
    const [writingIsOpen,setWritingIsOpen]= useState(false)
    const [listItems, setListItems] = useState([]);
    const [newListItems, setNewListItems]= useState([]);
    const getBook=()=>{
        const bookId =pathParams["id"]
        const parameters = {
        id: bookId,
    }
  
        dispatch(fetchBook(parameters)).then((result) => {checkResult(result,payload=>{
            const gotBook = payload["book"]
            setBookInfo(gotBook)
            getPages(gotBook.pageIdList)
        },err=>{

        })
            
        })
  
    }
    const setBookInfo = (info)=>{
        setBookTitle(info.title)
        setBookPrivacy(info.privacy)
        setWritingIsOpen(info.writingIsOpen)
        setBookPurpose(info.purpose)
    }
    useEffect(()=>{
        getBook()
    },[])
  

    
   
    const getPages = (pageIdList)=>{
      if(pageIdList.length > 0){
        setListItems([])
        pageIdList.forEach((pageId,i)=>{
            const pageParam = { id:pageId}
            dispatch(fetchPage(pageParam)).then((result)=>{
                checkResult(result,payload=>{
                        const {page}=payload
                        let uId =`${page.id}_${uuidv4()}`
                        const item = {uId:uId, item:page}
                        if(item){
                            let list =listItems
                            list[i]=item
                            setListItems(list)
                        
                        }else{
                            let uId =`${page.id}_${uuidv4()}`
                            const item = {uId:uId,item: {title:"Error Fetching Page"}}
                            let list =listItems
                            list[i]=item
                    
                            setListItems(list)

                        }
                       
                },()=>{

                })
            })})
        }else if(pageIdList.length<1){
            setListItems([])
        }
    }
    const sortableList = ()=>{
        if(listItems && listItems.length == 0){
            return (<div className="empty">
                    Empty
                </div>)
        }else if(listItems && listItems.length>0){
            return(
                <div>
                    <div id="sort-list">
                    <ErrorBoundary>
                    <SortableComponent   
                items={listItems} 
                getItems={items=>{
                            setNewListItems(items)
                        }}/>
     
     </ErrorBoundary>
   </div>
   </div>
        )
    }else{
        return(<div>
            Loading...
        </div>)
    }
}
    const handleTitleChange = (e)=>{
        setBookTitle(e.target.value)
    }
    const handleSave = (e)=>{
        e.preventDefault()
        if(book!=null){
      
          
            const pageIdList  = newListItems.map(hash=>hash.item.id).filter(hash=>hash!==null)

            const dispatchParams = {book:book,
                            title: bookTitle,
                            pageIdList:pageIdList,
                            purpose: bookPurpose,
                            privacy: bookIsPrivate,
                            writingIsOpen: writingIsOpen}              
            dispatch(updateBook(dispatchParams)).then(result=>{
                checkResult(result,payload=>{
                    getBook()
                    window.alert("Book Info Updated")
                },(err)=>{
                    window.alert(`${err.message}`)
                })
            })
            const readers = newBookRoles.filter(role => role.role == RoleType.reader).map(role=>role.profile.userId)
            const commenters = newBookRoles.filter(role => role.role == RoleType.commenter).map(role=>role.profile.userId)
            const editors = newBookRoles.filter(role => role.role == RoleType.editor).map(role=>role.profile.userId)
            const writers = newBookRoles.filter(role => role.role == RoleType.writer).map(role=>role.profile.userId)
            
       
            const rolesParams = {
            book: book,
            readers,
            commenters,
            editors,
            writers}
    

        dispatch(saveRolesForBook(rolesParams)).then(result=>{
            checkResult(result,payload=>{

                window.alert("Roles saved successfully")
            },(err)=>{
                window.alert(`${err.message}`)
            })
        })
        }
    }
    const form = ()=>{
        return( <FormGroup style={{padding:"2em 1em"}} >
            <TextField
                style={{backgroundColor:theme.palette.primary.contrastText}}
                onChange={(e)=>handleTitleChange(e)}
                id="standard-required"
                label="Title"
                value={bookTitle}
            />
            <FormControlLabel 
            control={<Checkbox checked={bookIsPrivate} onChange={()=>{
                setBookPrivacy(!bookIsPrivate)
            }}/>} label={bookIsPrivate?"Private":"Public"} 
               value={bookIsPrivate}/>
                 <FormControlLabel 
                    control={<Checkbox 
                                checked={writingIsOpen}
                                onChange={()=>{
                                    setWritingIsOpen(!writingIsOpen) 
                                }}/>} 
                                label="Writing is Open to Others"
                            />
               <div id="purpose">
                <label>Purpose</label>         
                <TextareaAutosize value={bookPurpose}
                                            minRows={3} 
                                            onChange={(e)=>{
                                            setBookPurpose(e.target.value)   
                                        }}  
                                            
                                    />
                     </div> 
            
                <Button onClick={handleSave} style={{backgroundColor:theme.palette.secondary.main}}variant="contained"type="submit">Save</Button>
            <div>
                <IconButton onClick={()=>{
                    const bookParams = {book}
                    dispatch(setBookInView(bookParams))
                    navigate(`/book/${book.id}`)
                }}>
                    <Visibility/>
                </IconButton>
                <IconButton onClick={()=>{
                    navigate(`/book/${book.id}/add`)
                }}>
                    <Add/>
                </IconButton>
            </div>
            
            </FormGroup>)}
    if(book!=null){

    return(<div id="EditBook" className="container">
            
            <div className="left-bar">
                {sortableList()}
            </div>

      
            
    
            <div className="right-bar">
                <div className="edit">
                <div >
                    {form()}
                <div className="roles">
                    <RoleList item={book} book={book} type={"book"} getRoles={roles=>{
                        setNewBookRoles(roles)
                    }} />
                </div>
                </div>
            </div>
        </div>

    </div>)}else{
        
        return(<div>
            Loading...
        </div>)
    }
}

export default EditBookContainer