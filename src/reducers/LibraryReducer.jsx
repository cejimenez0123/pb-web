
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    librariesInView:[],
    loading:false,
    error:"",
    bookmarkLibrary: null,
    libraryInView: null
}
const libSlice = createSlice({
name: 'libraries',
initialState,
extraReducers(builder) {
builder


    .addCase(fetchBookmarkLibrary.fulfilled,(state,{payload})=>{
        if(payload.library){
            state.bookmarkLibrary = payload.library
        }
    }).addCase(fetchBookmarkLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(updateLibrary.fulfilled,(state,{payload})=>{
        state.libraryInView = payload.library
        state.loading = false
    }).addCase(updateLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(updateLibrary.pending,(state,{payload})=>{

        state.loading = true
    }).addCase(setLibraryInView.type,(state,{payload})=>{
        if(payload){
            state.libraryInView = payload.library
        }else{
            state.error = "No Payload"
        }
        
    }).addCase(fetchArrayOfLibraries.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading = false
    }).addCase(fetchArrayOfLibraries.fulfilled,(state,{payload})=>{
        state.librariesInView = payload.libraryList
    }).addCase(fetchArrayOfLibrariesAppend.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(fetchArrayOfLibrariesAppend.fulfilled,(state,{payload})=>{
        state.librariesInView = [...state.librariesInView,...payload.libraryList]
    }).addCase(clearLibrariesInView.type,(state)=>{
        state.librariesInView = []
    })
    .addCase(setBookmarkLibrary.type,(state,{payload})=>{
        state.bookmarkLibrary = payload.library
    }).addCase(saveRolesForLibrary.fulfilled,(state,{payload})=>{
        if(payload.library){
        state.libraryInView = payload.library
        }
    }).addCase(saveRolesForLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    })
}})
export default libSlice