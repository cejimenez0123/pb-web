import { createSlice } from "@reduxjs/toolkit"
import {    logIn ,
            signUp,
            getCurrentProfile,
            fetchAllProfiles,
            fetchProfile,
            setProfileInView,
            fetchFollowBooksForProfile,
            fetchFollowLibraryForProfile,
            fetchFollowProfilesForProfile,
            createFollowBook,
            createFollowLibrary,
            createFollowProfile,
            signOutAction,
            fetchHomeCollection,
            updateHomeCollection,
            deleteFollowLibrary,
            deleteFollowProfile,
            deleteFollowBook,
            setSignedInTrue,
            setSignedInFalse,
            getPageApprovals,
            searchDialogToggle,
            searchMultipleIndexes,
            fetchArrayOfProfiles
        } from "../actions/UserActions"
import { create } from "lodash"
import { createPageApproval, deletePageApproval } from "../actions/PageActions"
const initialState = {
    signedIn: false,
    currentProfile: null,
    homeCollection: null,
    loading:false,
    userApprovals:[],
    followedBooks: [],
    followedProfiles:[],
    followedLibraries:[],
    profileInView:null,
    profilesInView: [],
    searchResults:[],
    searchDialogOpen:false,
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
        state.signedIn = true
        localStorage.setItem("loggedIn",true)
        state.currentProfile = payload.profile
    }).addCase(logIn.rejected, (state,{payload}) => {
        state.error = payload.error
        state.loading = false
    }).addCase(signUp.pending, (state)=>{

        state.loading = true
    }).addCase(signUp.fulfilled,(state,{payload})=>{
        localStorage.setItem("loggedIn",true)
        state.currentProfile = payload.profile
        state.signedIn= true
        state.loading = false
    }).addCase(signUp.rejected,(state,{payload})=>{   
        state.error = payload.error
    }).addCase(getCurrentProfile.rejected,(state,{payload})=>{   
        state.loading = false
        state.signedIn = false
        // state.error = payload.error
    }).addCase(getCurrentProfile.pending,(state)=>{
        state.loading = true
    }).addCase(getCurrentProfile.fulfilled,(state, { payload }) => {
       state.currentProfile = payload.profile
       localStorage.setItem("loggedIn",true)
       state.loading = false
    }).addCase(fetchAllProfiles.fulfilled,(state,{ payload })=>{
        state.profilesInView = payload.profileList
        state.loading=false
    }).addCase(fetchAllProfiles.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading = false
    }).addCase(fetchProfile.pending,(state)=>{
        state.loading=true
    }).addCase(fetchProfile.fulfilled,(state,{ payload })=>{
       
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
        if(Array.isArray(payload.followList)){
        state.followedBooks = payload.followList
        }
    }).addCase(fetchFollowLibraryForProfile.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(fetchFollowLibraryForProfile.fulfilled,(state,{payload})=>{
        if(Array.isArray(payload.followList)){
            state.followedLibraries = payload.followList
        }
    }).addCase(createFollowBook.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(createFollowBook.fulfilled,(state,{payload})=>{
        state.followedBooks = [...state.followedBooks,payload.followBook]
    }).addCase(createFollowLibrary.fulfilled,(state,{payload})=>{
        state.followedLibraries = [...state.followedLibraries,payload.followLibrary]
    }).addCase(createFollowLibrary.rejected,(state,{payload})=>{
        
        state.error = payload.error
    }).addCase(fetchFollowProfilesForProfile.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(fetchFollowProfilesForProfile.fulfilled,(state,{payload})=>{
        if(Array.isArray(payload.followList)){
        state.followedProfiles = payload.followList
        }
    }).addCase(createFollowProfile.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(createFollowProfile.fulfilled,(state,{payload})=>{
        state.followedProfiles = [...state.followedProfiles,payload.followProfile]
    }).addCase(signOutAction.fulfilled,(state,{payload})=>{
        state.currentProfile = null
        state.followedBooks = []
        state.followedLibraries = []
        state.followedProfiles = []
        state.homeCollection = null
        state.loading = false
        state.signedIn = false
        localStorage.setItem('loggedIn', false)
    }).addCase(signOutAction.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(fetchHomeCollection.fulfilled,(state,{payload})=>{
        state.homeCollection = payload.collection
    }).addCase(fetchHomeCollection.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(updateHomeCollection.fulfilled,(state,{payload})=>{
        state.homeCollection = payload.collection
    }).addCase(updateHomeCollection.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(deleteFollowBook.fulfilled,(state,{payload})=>{
        const list = state.followedBooks.filter(fb=>fb!=null && fb.id != payload.followBook.id)
        state.followedBooks = list
    }).addCase(deleteFollowLibrary.fulfilled,(state,{payload})=>{
        const list = state.followedLibraries.filter(fl=>fl!=null &&fl.id != payload.followLibrary.id)
        state.followedBooks = list
    }).addCase(deleteFollowProfile.fulfilled,(state,{payload})=>{
        const list = state.followedProfiles.filter(fp=> fp!=null &&payload.followProfile && fp.id != payload.followLibrary.id)
        state.followedBooks = list
    }).addCase(setSignedInTrue.type,(state,{payload})=>{
        state.signedIn = true
    }).addCase(setSignedInFalse.type,(state,{payload})=>{
        state.signedIn=false
    }).addCase(getPageApprovals.fulfilled,(state,{payload})=>{
        if(payload.userApprovals!==null){
            state.userApprovals = payload.userApprovals
        }
    }).addCase(getPageApprovals.rejected,(state,{payload})=>{
        state.error = payload.error
    }).addCase(createPageApproval.fulfilled,(state,{payload})=>{
        state.userApprovals = [...state.userApprovals,payload.userApproval]
    }).addCase(deletePageApproval.fulfilled,(state,{payload})=>{
        const list = state.userApprovals.filter(ua=> ua!=null &&payload.userApproval && ua.id != payload.userApproval.id)
        state.userApprovals = list
    }).addCase(searchDialogToggle.type,(state,{payload})=>{
        state.searchDialogOpen = payload
    }).addCase(searchMultipleIndexes.fulfilled,(state,{payload})=>{
        state.searchResults = payload.searchResults
    }).addCase(searchMultipleIndexes.rejected,(state,{payload})=>{
        state.error =payload.error
    }).addCase(fetchArrayOfProfiles.fulfilled,(state,{payload})=>{
        state.profilesInView = payload.profileList
    })
}})


export default userSlice