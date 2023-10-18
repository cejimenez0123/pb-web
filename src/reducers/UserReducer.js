import { createSlice } from "@reduxjs/toolkit"
import {    logIn ,
            signUp,
            getCurrentProfile,
            fetchAllProfiles,
            fetchProfile,
            setProfileInView,
            fetchFollowBooksForProfile,
            fetchFollowLibraryForProfile,
            createFollowBook,
            createFollowLibrary  } from "../actions/UserActions"
import Profile from "../domain/models/profile"
const initialState = {
    loggedIn: false,
    currentProfile: null,
    loading:false,
    followedBooks: [],
    followedLibraries:[],
    profileInView:null,
    profilesInView: [],
    error:""
}
const userSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers(builder) {
        builder
        .addCase(logIn.pending,(state) => {
        state.loading = true
    })
    .addCase(logIn.fulfilled, (state, { payload }) => {
        state.loading = false
        state.loggedIn = true
      
        state.currentProfile = payload.profile
    }).addCase(logIn.rejected, (state,{payload}) => {
        state.error = payload.error
        state.loading = false
    }).addCase(signUp.pending, (state)=>{

        state.loading = true
    }).addCase(signUp.fulfilled,(state,{payload})=>{
   
        state.currentProfile = payload.profile
        state.loggedIn = true
        state.loading = false
    }).addCase(signUp.rejected,(state,{payload})=>{   
        state.error = payload.error
    }).addCase(getCurrentProfile.rejected,(state,{payload})=>{   
        state.loading = false
        state.loggedIn = false
        // state.error = payload.error
    }).addCase(getCurrentProfile.pending,(state)=>{
        state.loading = true
    }).addCase(getCurrentProfile.fulfilled,(state, { payload }) => {
   
        state.loading = false
        state.loggedIn = true
        console.log(`payload ${JSON.stringify(payload)}`)
       state.currentProfile = payload.profile
    }).addCase("users/loggedIn",(state, { payload }) => {

        state.loggedIn = payload.loggedIn
    }).addCase(fetchAllProfiles.fulfilled,(state,{ payload })=>{
        state.profilesInView = payload.profileList
    }).addCase(fetchAllProfiles.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(fetchProfile.pending,(state)=>{
        state.loading=true
    }).addCase(fetchProfile.fulfilled,(state,{ payload })=>{
        console.log(`fdsad ${JSON.stringify(payload)}`)
        state.profileInView = payload.profile
        state.loading = false
    }).addCase(fetchProfile.rejected,(state,{ payload })=>{
        state.error = payload.error
        state.loading = false
    }).addCase(setProfileInView,(state,{payload})=>{
     
        state.profileInView = payload.profile
      }).addCase(fetchFollowBooksForProfile.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(fetchFollowBooksForProfile.fulfilled,(state,{payload})=>{
        state.followedBooks = payload.followList
      }).addCase(fetchFollowLibraryForProfile.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(fetchFollowLibraryForProfile.fulfilled,(state,{payload})=>{
        state.followedLibraries = payload.followList
      }).addCase(createFollowBook.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(createFollowBook.fulfilled,(state,{payload})=>{
        state.followedBooks = [...state.followedBooks,payload.followBook]
      }).addCase(createFollowLibrary.fulfilled,(state,{payload})=>{
        state.followedLibraries = [...state.followedLibraries,payload.followLibrary]
      }).addCase(createFollowLibrary.rejected,(state,{payload})=>{
        state.followedLibraries = [...state.followedLibraries,payload.followLibrary]
      })
}})


export default userSlice