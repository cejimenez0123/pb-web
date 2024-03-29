import { createSlice} from "@reduxjs/toolkit"
import { getPublicBooks,
        fetchBook,
        getProfileBooks,
        fetchArrayOfBooksAppened,
        fetchArrayOfBooks,
        saveRolesForBook,
        updateBook,
        setBooksToBeAdded,
        setBookInView,
        clearBooksInView,
        deleteBook,
    
        } from "../actions/BookActions"


const initialState = {
    booksInView:[],
    loading:false,
    error:"",
    bookInView: null,
    booksToBeAdded: [],
    bookRoles: []
}
const bookSlice = createSlice({
name: 'books',
initialState,
extraReducers(builder) {
builder
.addCase(getPublicBooks.pending, (state,{payload})=>{
    state.loading = true
})
.addCase(getPublicBooks.rejected,(state,{payload})=>{
    state.loading = false
    state.error = payload.error

}).addCase(getPublicBooks.fulfilled,(state,{payload})=>{
    state.loading = false
    state.booksInView = payload.bookList

}).addCase(fetchBook.pending,(state)=>{
    state.loading = true

}).addCase(fetchBook.rejected,(state,{payload})=>{
    state.loading = false
    state.error = payload.error

}).addCase(fetchBook.fulfilled,(state,{payload})=>{
  
    state.loading = false
    state.bookInView = payload.book
}).addCase(getProfileBooks.pending,(state)=>{
    state.loading = true
}).addCase(getProfileBooks.fulfilled,(state,{payload})=>{

    state.loading = false
    state.booksInView = payload.bookList

}).addCase(getProfileBooks.rejected,(state,{payload})=>{
    state.loading = false
    state.error = payload.error
}).addCase(fetchArrayOfBooks.fulfilled,(state,{payload})=>{
    state.booksInView = payload.bookList
    state.loading = false
}).addCase(fetchArrayOfBooksAppened.fulfilled,(state,{payload})=>{
    state.booksInView = [...state.booksInView,...payload.bookList]
    state.loading = false
}).addCase(clearBooksInView,(state)=>{
    state.booksInView = []
}).addCase(saveRolesForBook.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(saveRolesForBook.fulfilled,(state,{payload})=>{
 
    state.bookInView = payload.book
}).addCase(updateBook.fulfilled,(state,{payload})=>{
    state.bookInView = payload.book
    state.loading = false
}).addCase(updateBook.pending,(state)=>{
    state.loading = true

}).addCase(updateBook.rejected,(state,{payload})=>{
    state.error = payload.error
    state.loading =false
}).addCase(setBooksToBeAdded.type,(state,{payload})=>{
    state.booksToBeAdded = payload
  }).addCase(setBookInView.type,(state,{payload})=>{
    state.bookInView = payload.book
  }).addCase(deleteBook.fulfilled,(state,{payload})=>{
   let list = state.booksInView.filter(book=>book.id != payload.book.id)
   state.booksInView = list
  }).addCase(deleteBook.rejected,(state,{payload})=>{
    state.error = payload.error
  })
}

})
export default bookSlice