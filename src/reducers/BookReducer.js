import { createSlice} from "@reduxjs/toolkit"
import { getPublicBooks,
        fetchBook,
        getProfileBooks,
        fetchArrayOfBooksAppened,
        fetchArrayOfBooks,
        saveRolesForBook,
        updateBook,
        setBooksToBeAdded,
        setBookInView
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
    state.booksInView = [...state.bookInView,...payload.bookList]
    state.loading = false
}).addCase(saveRolesForBook.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(saveRolesForBook.fulfilled,(state,{payload})=>{
    state.bookRoles = payload.roleList

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
  })
}

})
export default bookSlice