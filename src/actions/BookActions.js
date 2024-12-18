import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import Book from "../domain/models/book"
import { unpackPageDoc } from "./PageActions"
import {unpackLibraryDoc} from "./LibraryActions"
import {  where,
          query,
          and,
          or,
          arrayUnion,
          collection,
          getDocs,
          getDoc,
          doc,
          setDoc,
          deleteDoc, 
          Timestamp,
          updateDoc} from "firebase/firestore"
import { db,auth,client} from "../core/di"
import Contributors from "../domain/models/contributor"
import axios from "axios"
import collectionRepo from "../data/collectionRepo"

const getPublicBooks = createAsyncThunk(
    'books/getPublicBooks',
    async (thunkApi) => {
        let bookList = []
   
        try{
    const snapshot = await getDocs(query(collection(db, "book"), where("privacy", "==", false)))

          snapshot.docs.forEach(doc => {

              const book = unpackBookDoc(doc)
              bookList = [...bookList,book]
            })
    
    return {
  
        bookList
    }
}catch (error) {
    return{
        error: new Error(`getPublicBooks ${error.message}`)
    }
}
      
    }
)
async function trySomething(){
  try{
  let snapshot = await getDocs(collection(db,"user"))

 let prosmises = snapshot.docs.map(async doc=>{
       
         const pack = doc.data();
        const { id } = doc;
        const docs = await getDocs(query(collection(db, "profile"),where("userId","==",id)))
                            
        const email =pack["email"]
     
        let profile = docs.docs.map(doc=>unpackProfileDoc(doc))[0]
        if(profile){
        let docpages = await getDocs(query(collection(db, "page"),where("profileId","==",profile.id)))
        let docbooks = await getDocs(query(collection(db, "book"),where("userId","==",profile.id)))
        let doclibrary = await getDocs(query(collection(db, "library"),where("profileId","==",profile.id)))
        let pages = docpages.docs.map(doc=>unpackPageDoc(doc) )
        let books = docbooks.docs.map(doc=>unpackBookDoc(doc))
        let libraries = doclibrary.docs.map(doc=>unpackLibraryDoc(doc))
         return  axios.post("http://localhost:3000/auth",{id,email,uId,profile:profile,pages,books,libraries})
        }
        })
  console.log(await Promise.all(prosmises))

  }catch(e){
    console.log(e)
  }
}
const fetchBook = createAsyncThunk("books/fetchBook", async function(params,thunkApi){
    try{
      const data = await collectionRepo.fetchCollection(params)
    console.log(data)
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
  const createBook = createAsyncThunk("books/createBook", async function(params,thunkApi){

    try{
       
        const {
            title,
            purpose,
            profileId,
            pageIdList,
            privacy,
            writingIsOpen,
            commenters,
            editors,
            readers,
            writers,
          }=params
          const data = await collectionRepo.createCollection({name:title,
            profileId:profileId, purpose:purpose,privacy:privacy,writingIsOpen:writingIsOpen
          })
if(!privacy){
            client.initIndex("collection").saveObject(
              {objectID:data.id,title:params.title,type:"collection"}).wait()
          }      


    return { book:data.book }
    }catch(error){
  
      return {
        error: new Error(`Error: CreateBook ${error.message}`)
      }
    }})


    const fetchArrayOfBooks = createAsyncThunk("books/fetchArrayOfBooks",async (params,thunkApi)=>{
      try{
      
      const bookIdList = params["bookIdList"]
      
      const promises = bookIdList.map((bId) => {
        const bookRef = doc(db, "book", bId);
        return getDoc(bookRef);
      });
      // Use Promise.all to resolve all promises concurrently
      let snapshots = await Promise.all(promises)
      let bookList = snapshots.map(snapshot => unpackBookDoc(snapshot))

        return {
          bookList
        }
      }catch(err){
        const error = err??new Error("Error: Fetch Array of Books")
        return {error }
      }
})
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

const saveRolesForBook = createAsyncThunk("books/saveRolesForBook",async (params,thunkApi)=>{
    
   try {
    const {book,
          readers,
          commenters,
          editors,
          writers} = params
   
      let ref = doc(db,'book',book.id)
      await updateDoc(ref,{ editors: editors,
        commenters:commenters,
        writers: writers,
        readers: readers,
      })
      const contributors= new Contributors(commenters,readers,writers,editors)
            
     const newBook =new Book( book.id,
                book.purpose,
                book.title,
                book.profileId,
                book.pageIdList,
                book.privacy,
                book.writingIsOpen,
                contributors,
                book.updatedAt,
                book.created)
      return{
        book:newBook
      }
 
    }catch(e){
      const error = e??new Error("Error: SAVE BOOK ROLES")
      return {error }
    }                
})
const updateBook = createAsyncThunk("books/updateBooks",async (params,thunkApi)=>{
      
  try{
    const { book,title,purpose,pageIdList,privacy,writingIsOpen } = params
    const data = await collectionRepo.updateCollection({id:book.id,title:title,purpose:purpose,
      isOpenCollaboration:writingIsOpen,isPrivate:privacy
    })
     
      return {
        book: data.collection
      }
    }catch(e){
    return {error: new Error("Error: UDATE BOOK -" + e.message)}
  }
})
const deleteBook= createAsyncThunk("books/deleteBook", async (params,thunkApi)=>{
  try{
    const {book}=params
    let data = await collectionRepo.deleteCollection({id:book.id})
    client.initIndex("book").deleteObject(book.id).wait()
    return {
      book:data
    }
  }catch(e){
    return {error: new Error("Error: DELETE BOOK"+e.message)};
  }
})
const updateBookContent = createAsyncThunk("books/updateBookContent", async (params,thunkApi)=>{
  try {

    const {book,pageIdList} = params

    let data = collectionRepo.addStoriesToCollection({collection:book,storyIdList:pageIdList})
  //   let ref = doc(db,'book',book.id)
  //   pageIdList.forEach(pageId => {
  //    updateDoc(ref,{ pageIdList:arrayUnion(pageId)
  //   })})
  //  let contributors= new Contributors(book.commenters,book.readers,book.writers,book.editors)
  //   let newBook = new Book(book.id,
  //                       book.purpose,
  //                       book.title,
  //                       book.profileId,
  //                       pageIdList,
  //                       book.privacy,
  //                       book.writingIsOpen,
  //                       contributors,
  //                       book.updatedAt,
  //                       book.created
  //                       )
    return {
      book:data.collection
    } 
  }catch(e){
    return {error: new Error("Error: Update Book Content"+e.message)};
  }
})

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
const setBookInView = createAction("books/setBookInView", (params)=> {

  const {book} = params
  
  return  {payload:
    book}
    
  
})
const setBooksToBeAdded = createAction("books/setBooksToBeAdded",(params)=>{
  let {bookList} = params
  return {
    payload: bookList
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
  export {  getPublicBooks,
            fetchBook,
            fetchArrayOfBooks,
            getProfileBooks,
            createBook,
            fetchArrayOfBooksAppened,
            saveRolesForBook,
            setBookInView,
            trySomething,
            deleteBook,clearBooksInView,
            updateBook,
            setBooksToBeAdded,
            appendSaveRolesFoBook,
            updateBookContent,
            fetchBooksWhereProfileEditor,
            fetchBooksWhereProfileWriter}