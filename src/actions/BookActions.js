import { createAsyncThunk ,createAction} from "@reduxjs/toolkit"
import Book from "../domain/models/book"
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
import { db,auth} from "../core/di"
import Contributors from "../domain/models/contributor"

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

const fetchBook = createAsyncThunk("books/fetchBook", async function(params,thunkApi){
    let id = params["id"]
  
   
  
    try {
    const docSnap = await getDoc(doc(db, "book", id))
    const pack = docSnap.data()
  
    const bId = pack["id"]
    const title =pack["title"]
    const purpose = pack["purpose"]
    const profileId = pack["profileId"]
    const pageIdList = pack["pageIdList"]
    let commenters = pack["commenters"]
    let writers = pack["writers"]
    let editors = pack["editors"]
    let readers = pack["readers"]
    const updatedAt = pack["updatedAt"]
    const privacy = pack["privacy"]
    const writingIsOpen = pack["writingIsOpen"]
    const created = pack["created"]

    const contributors = new Contributors(commenters,readers,writers,editors)
    const book = new Book(bId,
                          purpose,
                          title,
                          profileId,
                          pageIdList,
                          privacy,
                          writingIsOpen,
                          contributors,
                          updatedAt,
                          created)    
    return {
      book
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
        const ref = collection(db, "book")
        let bookList = []
        let queryReq = query(ref,and(where("profileId","==",profile.id),where("privacy","==",false)))
        if(auth.currentUser){
          let queryCommenter = query(ref,where("profileId", "==", profile.id),where("commenters", "array-contains", auth.currentUser.uid))   
          let queryWriter = query(ref,where("profileId", "==", profile.id, where("writers", "array-contains", auth.currentUser.uid)))  
          let queryEditor = query(ref,where("profileId", "==",profile.id),where("editors", "array-contains",auth.currentUser.uid))
          let queryReaders = query(ref,where("profileI","==", profile.id),where("readers", "array-contains", auth.currentUser.uid))
         
          if(auth.currentUser.uid == profile.userId){
            let queryForUser = query(ref, where("profileId", "==", profile.id))
            let snapshot = await getDocs(queryForUser)
            snapshot.forEach(doc=>{
              let book=  unpackBookDoc(doc)
              if(!bookList.find(b=>b.id == book.id)){
                bookList = [...bookList,book]
              }
              })
              queryCommenter = query(ref,where("commenters", "array-contains", auth.currentUser.uid))   
              queryWriter = query(ref, where("writers", "array-contains", auth.currentUser.uid))
              queryEditor = query(ref,where("editors", "array-contains",auth.currentUser.uid))
              queryReaders = query(ref,where("readers", "array-contains", auth.currentUser.uid))
          
          }
          try{
            let snapshot = await getDocs(queryCommenter)
            snapshot.docs.forEach(doc=>{
            const book = unpackBookDoc(doc)
            if(!bookList.find(b=>b.id == book.id)){
              bookList = [...bookList,book]
            }
            })
          }catch(e){
            console.error(e.message)
          }
          try{
            let readerSnap = await getDocs(queryReaders)
            readerSnap.docs.forEach(doc=>{
              const book = unpackBookDoc(doc)
              if(!bookList.find(b=>b.id == book.id)){
                bookList = [...bookList,book]
              }
            })
          }catch(e){
            console.error(e.message)
          }
          try{
            let editorSnap = await getDocs(queryEditor)
            editorSnap.docs.forEach(doc=>{
             const book = unpackBookDoc(doc)
            bookList = [...bookList, book]
          })
          }catch(e){
            console.error(e.message)
          }
          try{
            let writerSnap = await getDocs(queryWriter)
            writerSnap.docs.forEach(doc=>{
              let book = unpackBookDoc(doc)
              if(!bookList.find(b=>b.id == book.id)){
                bookList = [...bookList,book]
              }
            })
          }catch(e){
            console.error(e.message)
          }
            return {
              bookList
            }
}
    
        
        const snapshot = await getDocs(
                queryReq);
       
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
        const ref = collection(db,"book")
        const id = doc(ref).id
      
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
            const created = Timestamp.now()
            const updatedAt = created
    const snapshot = await setDoc(doc(db,"book", id), 
                        { 
                            id:id,
                            title:title,
                            purpose:purpose,
                            profileId:profileId,
                            pageIdList:pageIdList,
                            privacy:privacy,
                            writingIsOpen:writingIsOpen,
                            commenters,
                            editors,
                            readers,
                            writers,
                            updatedAt: created,
                            created: created
                        })
                        const contributors= new Contributors(commenters,readers,writers,editors)
            
   const book = new Book(
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

    return { book }
    }catch(error){
  
      return {
        error: new Error(`Error: CreateBook ${error.message}`)
      }
    }})


    const fetchArrayOfBooks = createAsyncThunk("books/fetchArrayOfBooks",async (params,thunkApi)=>{
      try{
      const ref = collection(db,"book")
      const bookIdList = params["bookIdList"]
      
    if(bookIdList.length == 0){
      return {bookList:[]}
    }else{
      let queryReq =query(ref,
        and(where("id", "in", bookIdList),where("privacy","==",false)))
      if(auth.currentUser){
      queryReq = query(ref,
        and(where("id", "in", bookIdList),
                     or(where("privacy","==",false),
                        where('commenters', 'array-contains', auth.currentUser.uid),
                        where('readers','array-contains', auth.currentUser.uid),
                        where('editors', 'array-contains', auth.currentUser.uid),
                        where('writers', 'array-contains',auth.currentUser.uid),
                        where("privacy","==",false))))
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
      let privacy = pack["privacy"]
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
      if(!privacy){
        privacy = false
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
        }}
      }catch(err){
        const error = err??new Error("Error: Fetch Array of Books")
        return {error }
      }
})
const fetchArrayOfBooksAppened = createAsyncThunk("books/fetchArrayOfBooksAppend",async (params,thunkApi)=>{

  const ref = collection(db,"book")
  const bookIdList = params["bookIdList"]
  const {profile}= params
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
    let updatedAt =Timestamp.now()
      let ref = doc(db,"book",book.id)
      await updateDoc(ref,{
        title:title,
        pageIdList:pageIdList,
        privacy: privacy,
        writingIsOpen: writingIsOpen,
        purpose: purpose,
        updatedAt: updatedAt
      })
      const contributors= new Contributors(book.commenters,book.readers,book.writers,book.editors)
            
      let newBook = new Book( book.id,
                              purpose,
                              title,
                              book.profileId,
                              pageIdList,
                              privacy,
                              writingIsOpen,
                              contributors,
                              updatedAt,
                              book.created)
      return {
        book: newBook
      }
    }catch(e){
    return {error: new Error("Error: UDATE BOOK -" + e.message)}
  }
})
const deleteBook= createAsyncThunk("books/deleteBook", async (params,thunkApi)=>{
  try{
    const {book}=params
  await deleteDoc(doc(db, "book", book.id));
    return {
      book:book
    }
  }catch(e){
    return {error: new Error("Error: Delete Book"+e.message)};
  }
})
const updateBookContent = createAsyncThunk("books/updateBookContent", async (params,thunkApi)=>{
  try {
    const {book,pageIdList} = params
    let ref = doc(db,'book',book.id)
    pageIdList.forEach(pageId => {
     updateDoc(ref,{ pageIdList:arrayUnion(pageId)
    })})
   let contributors= new Contributors(book.commenters,book.readers,book.writers,book.editors)
    let newBook = new Book(book.id,
                        book.purpose,
                        book.title,
                        book.profileId,
                        pageIdList,
                        book.privacy,
                        book.writingIsOpen,
                        contributors,
                        book.updatedAt,
                        book.created
                        )
    return {
      book:newBook
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
  const bookList = []
  snapshot.docs.forEach(doc => {

    const pack = doc.data();
    
    const id = pack["id"]
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
    const book = new Book(  id,
                            purpose,
                            title,
                            profileId,
                            pageIdList,
                            privacy,
                            writingIsOpen,
                            editors,
                            commenters,
                            readers,
                            writers,
                            updatedAt,
                            created)
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
  const bookList = []
  snapshot.docs.forEach(doc => {

    const pack = doc.data();
    
    const id = pack["id"]
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
    const book = new Book(  id,
                            purpose,
                            title,
                            profileId,
                            pageIdList,
                            privacy,
                            writingIsOpen,
                            editors,
                            commenters,
                            readers,
                            writers,
                            updatedAt,
                            created)
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
            deleteBook,clearBooksInView,
            updateBook,
            setBooksToBeAdded,
            appendSaveRolesFoBook,
            updateBookContent,
            fetchBooksWhereProfileEditor,
            fetchBooksWhereProfileWriter}