import Library from "../domain/models/library"
import {    getProfileLibraries,
            fetchLibrary,
            createLibrary,
            fetchBookmarkLibrary,
            updateLibrary,
            setLibraryInView,
            getPublicLibraries,
            fetchArrayOfLibraries,
            fetchArrayOfLibrariesAppend,
            clearLibrariesInView,
            setBookmarkLibrary,
            saveRolesForLibrary,
            updateLibraryContent,
            deleteLibrary} from "../actions/LibraryActions"
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
    .addCase(getProfileLibraries.rejected,(state,{payload})=>{
        return {...state,error: payload.error}
    })
    .addCase(getProfileLibraries.fulfilled,(state,{payload})=>{
        return {...state,
                librariesInView: payload.libList}
    })
    .addCase(getProfileLibraries.pending,(state,)=>{
        return {...state,
                loading: true}
    }).addCase(fetchLibrary.pending,(state)=>{
        return {...state,loading: true}
    }).addCase(fetchLibrary.rejected,(state,{payload})=>{
        return {...state,
                loading:false,
                error: payload.error}
    }).addCase(fetchLibrary.fulfilled,(state,{payload})=>{
        return {...state,
                loading:false,
                libraryInView: payload.library}
    }).addCase(createLibrary.pending,(state)=>{
        return {...state,loading: true}
    }).addCase(createLibrary.rejected,(state,{payload})=>{
        return {...state,error: payload.error}
    }).addCase(createLibrary.fulfilled,(state,{payload})=>{
        return {...state,
                loading: false,
                libraryInView: payload.library}
    }).addCase(fetchBookmarkLibrary.fulfilled,(state,{payload})=>{
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
        
    }).addCase(getPublicLibraries.pending,(state)=>{
        state.pending = true
    }).addCase(getPublicLibraries.fulfilled,(state,{payload})=>{
        state.librariesInView = payload.libraries
        state.loading = false
    }).addCase(getPublicLibraries.rejected,(state,{payload})=>{
        state.loading = false
        state.error = payload
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
    }).addCase(updateLibraryContent.fulfilled,(state,{payload})=>{
        if(payload.library){
            state.libraryInView = payload.library
        }
    }).addCase(updateLibraryContent.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(setBookmarkLibrary.type,(state,{payload})=>{
        state.bookmarkLibrary = payload.library
    }).addCase(saveRolesForLibrary.fulfilled,(state,{payload})=>{
        if(payload.library){
        state.libraryInView = payload.library
        }
    }).addCase(saveRolesForLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(deleteLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(deleteLibrary.fulfilled,(state,{payload})=>{
        state.libraryInView = null
    })
}})
export default libSlice