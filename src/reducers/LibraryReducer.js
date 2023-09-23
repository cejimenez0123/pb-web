import Library from "../domain/models/library"
import {    getProfileLibraries,
            fetchLibrary,
            createLibrary,
            fetchBookmarkLibrary,
            updateLibrary} from "../actions/LibraryActions"
import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    librariesInView:[Library],
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
                pending: true}
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
        return {...state,
                bookmarkLibrary: payload.library}
    }).addCase(fetchBookmarkLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(updateLibrary.fulfilled,(state,{payload})=>{
        state.libraryInView = payload.library
        state.loading = false
    }).addCase(updateLibrary.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(updateLibrary.pending,(state,{payload})=>{

        state.loading = true
    })
}})
export default libSlice