import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import {  where,
          query,
          and,
          or,
          arrayUnion,
          collection,
          getDocs,
        
          updateDoc} from "firebase/firestore"
import { db,auth,client} from "../core/di"
import Contributors from "../domain/models/contributor"
import collectionRepo from "../data/collectionRepo"

const setCollections = createAction("cols/setCollections", (params)=> {

  const {collections} = params
  return  {payload:
    collections}
    
  
})
const fetchBook = createAsyncThunk("books/fetchBook", async function(params,thunkApi){
    try{
      const data = await collectionRepo.fetchCollection(params)
   
    return {
      book:data.collection
    }
    }catch(e){
      return {
        error: e
      }
  
    }
  })
  const getProfileBooks= createAsyncThunk(
    'books/getProfileBooks',
    async (params,thunkApi) => {
      try {
        const profile = params["profile"]
        const data = await collectionRepo.getProfileBooks({profile})

            return {
                bookList:data.collections
            }
          }catch(err){
    
      return {
            error: new Error(`Error: GET PROFILE BOOKS: ${err.message}`)
            }
        }
    }
  )
  const clearBooksInView = createAction("books/clearBooksInView")
const fetchArrayOfBooksAppened = createAsyncThunk("books/fetchArrayOfBooksAppend",async (params,thunkApi)=>{

  const ref = collection(db,"book")
  const bookIdList = params["bookIdList"]
  let queryReq = query(ref, where('id', 'in', bookIdList),where("privacy","==",false))
  
  if(auth.currentUser){
  queryReq = query(ref,
      and(where("id", "in", bookIdList),
      or(where("privacy","==",false),
      or(where('commenters', 'array-contains', auth.currentUser.uid),
         where('readers','array-contains', auth.currentUser.uid),
         where('editors', 'array-contains', auth.currentUser.uid),
         where('writers', 'array-contains', auth.currentUser.uid),
         where("privacy","==",false)))))
  }
  const snapshot =await getDocs(queryReq)
  let bookList = []
  snapshot.docs.forEach(doc => {
            
  const pack = doc.data();
  const { id } = doc;
  const title =pack["title"]
  const purpose = pack["purpose"]
  const profileId = pack["profileId"]
  const pageIdList = pack["pageIdList"]
  const updatedAt = pack["updatedAt"]
  const privacy = pack["privacy"]
  const writingIsOpen = pack["writingIsOpen"]
  const created = pack["created"]
  
  let commenters = pack["commenters"]
  let editors = pack["editors"]
  let readers = pack["readers"]
  let writers = pack["writers"]
if(!editors){
  editors = []
}
if(!commenters){
  commenters = []
}
if(!readers){
    readers=[]
}
if(!writers){
  writers=[]
}
const contributors= new Contributors(commenters,readers,writers,editors)
            

  const book =  new Book( 
      id,
      purpose,
      title,
      profileId,
      pageIdList,
      privacy,
      writingIsOpen,
      contributors,
      updatedAt,
      created,
  )

    bookList = [...bookList, book]
  })
    return {
      bookList
    }
  
}
)


const appendSaveRolesFoBook= createAsyncThunk("books/appendSaveRolesForBooks",async (params,thunkApi)=>{
  try {
    const { bookIdList,
            readers,
            commenters,
            } = bookIdList
        bookIdList.forEach(id=>{
            let ref =collection(db,'book',id)
            updateDoc(ref,{
              readers: arrayUnion(readers),
              commenters: arrayUnion(commenters),
            })

        }

        )
  }catch(e){
    return {
      error: new Error(`Error: SAVE BOOK ROLES ${e.message}`)
    }
  }
})

const fetchBooksWhereProfileEditor = createAsyncThunk("books/fetchBooksWhereProfileEditor",(params,thunkApi)=>{
  try{
  const ref = collection(db,"book")
  let snapshot = query(ref,
       where('editors', 'array-contains', auth.currentUser.uid),
  )
let bookList = []
  snapshot.docs.forEach(doc => {
    const book = unpackBookDoc(doc)
    bookList = [...bookList,book]
})
  return {
    bookList: bookList,
  }
}catch(e){
  return {
    error: e
  }
}
})
const fetchBooksWhereProfileWriter = createAsyncThunk("books/fetchBooksWhereProfileEditor",(params,thunkApi)=>{
  try{
  const ref = collection(db,"book")
  let snapshot = query(ref,
        where('writers', 'array-contains', auth.currentUser.uid),
  )
  let bookList = []
  snapshot.docs.forEach(doc => {
    const book = unpackBookDoc(doc)
    
  bookList = [...bookList,book]
})
  return {
    bookList: bookList,
  }
}catch(e){
  return {
    error: e
  }
}
})

function unpackBookDoc(doc){
  const pack = doc.data();
  const { id } = doc;
  const title =pack["title"]
  const purpose = pack["purpose"]
  const profileId = pack["profileId"]
  const pageIdList = pack["pageIdList"]
  const updatedAt = pack["updatedAt"]
  const privacy = pack["privacy"]
  const writingIsOpen = pack["writingIsOpen"]
  const created = pack["created"]
  let commenters = pack["commenters"]
  let editors = pack["editors"]
  let readers = pack["readers"]
  let writers = pack["writers"]
  if(!editors){
    editors = []
  }
  if(!commenters){
    commenters = []
  }
  if(!writers){
    writers= []
  }
  if(!readers){
    readers=[]
  }
  const contributors= new Contributors( commenters,
                                        readers,
                                        writers,
                                        editors)
  const book =  new Book( id,
                          purpose,
                          title,
                          profileId,
                          pageIdList,
                          privacy,
                          writingIsOpen,
                          contributors,
                          updatedAt,
                          created
                        )
    return book
}
  export { setCollections, 
            getProfileBooks,
            fetchArrayOfBooksAppened,
            appendSaveRolesFoBook,
            fetchBooksWhereProfileEditor,
            fetchBooksWhereProfileWriter}