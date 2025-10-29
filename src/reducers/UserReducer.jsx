import { createSlice } from "@reduxjs/toolkit"
import {    logIn ,
            signUp,
            getCurrentProfile,
    
            fetchProfile,
            setProfileInView,
        
            signOutAction,
        
     
            setDialog,
            setSignedInTrue,
            setSignedInFalse,
      
            searchDialogToggle,
            searchMultipleIndexes,
            updateProfile,
            useReferral,
            deleteUserAccounts,
            setEvents,
        
        } from "../actions/UserActions"
import { createProfile, fetchNotifcations, fetchProfiles } from "../actions/ProfileActions"
import { createPageApproval, deletePageApproval } from "../actions/PageActions.jsx" 
import { postCollectionHistory, postStoryHistory } from "../actions/HistoryActions"
import { createFollow, deleteFollow } from "../actions/FollowAction"
import { postActiveUser } from "../actions/WorkshopActions"
import { Preferences } from "@capacitor/preferences"

const initialState = {
    signedIn: false,
    currentProfile: null,
    homeCollection: null,
    loading:true,
    notifications:[],
    events:[],
    userApprovals:[],
    followedBooks: [],
    followedProfiles:[],
    followedLibraries:[],
    profileInView:null,
    profilesInView: [],
    searchResults:[],
    searchDialogOpen:false,
    error:"",
    dialog:{text:"",title:"",agree:()=>{},onClose:()=>{},isOpen:false,agreeText:"agree",disagreeText:"Close"}
}
const userSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers(builder) {
        builder.addCase(fetchProfiles.fulfilled,(state,{payload})=>{
            const profiles = payload.profiles.filter(prof=>{
               return state.currentProfile && prof.id!=state.currentProfile.id
            })
            state.profilesInView = profiles
            state.loading=false
        }).addCase(fetchProfiles.pending,(state,{payload})=>{
            state.loading = true
        }).addCase(setEvents.type,(state,{payload})=>{
            if(payload.events&&payload.events.length){
                state.events = payload.events
            }
        })
        .addCase(useReferral.fulfilled,(state,{payload})=>{
            if(payload.profile){
                state.currentProfile = payload.profile
            }
        }).addCase(deleteUserAccounts.fulfilled,(state,{payload})=>{
            state.currentProfile = null
 
        }).addCase(postActiveUser.fulfilled,(state,{payload})=>{
            state.profilesInView = payload.profiles
    
        }).addCase(createFollow.fulfilled,(state,{payload})=>{
            const {follow}=payload
            if(follow && follow.following){
                state.profileInView = follow.following
                state.currentProfile = follow.follower
            }

        }).addCase(deleteFollow.fulfilled,(state,{payload})=>{
            if(payload.profile){
                state.currentProfile = payload.profile
            }
            if(payload.followed){
                state.profileInView = payload.followed
            }
        })
        .addCase(logIn.pending,(state) => {
        state.loading = true
    }).addCase(fetchNotifcations.fulfilled,(state,{payload})=>{
state.notifications = payload
    }).addCase(createProfile.rejected, (state, { payload })=>{
       state.loading=false
    
    }).addCase(createProfile.pending, (state)=>{
        state.loading=true
    }).addCase(updateProfile.fulfilled,(state,{payload})=>{
        state.currentProfile = payload.profile
    })
    .addCase(createProfile.fulfilled, (state, { payload })=>{
        state.loading=false    

        state.currentProfile = payload.profile
    }).addCase(logIn.fulfilled, (state, { payload }) => {
        if(payload&&payload.profile){
            state.currentProfile = payload.profile
             state.loading = false
        state.signedIn = true
            }
        // state.token = payload.token
       
       
    }).addCase(logIn.rejected, (state,{payload}) => {
        if(payload && payload.error){
            state.error = payload.error
        }

        state.loading = false
    }).addCase(signUp.fulfilled,(state,{payload})=>{
        
        state.currentProfile = payload.profile
        state.signedIn= true
        state.loading = false
    }).addCase(signUp.rejected,(state,{payload})=>{   
      if(payload && payload.error){
        state.error = payload.error
      }
 
    }).addCase(getCurrentProfile.rejected,(state,data)=>{ 
        if(data){
            let {payload}=data
        
        if(payload && payload.error){
            state.loading = false
            state.signedIn = false
            state.currentProfile = null
           
        }  }
    }).addCase(postStoryHistory.fulfilled,(state,{payload})=>{
        state.currentProfile = payload.profile
    }).addCase(postCollectionHistory.fulfilled,(state,{payload})=>{
        state.currentProfile = payload.profile
    }).addCase(getCurrentProfile.pending,(state)=>{
        state.loading = true
    }).addCase(getCurrentProfile.fulfilled,(state, data) => {

if(data && data.payload && data.payload.profile){
       state.currentProfile = data.payload.profile
       state.loading = false
}
    })
 
    .addCase(fetchProfile.pending,(state)=>{
        state.loading=true
    }).addCase(fetchProfile.fulfilled,(state,{ payload })=>{
       
        state.profileInView = payload.profile
        state.loading = false
    }).addCase(fetchProfile.rejected,(state,{ payload })=>{
        state.error = payload.error
        state.loading = false
    }).addCase(setProfileInView,(state,{payload})=>{
        state.profileInView = payload.profile
    }
)


    .addCase(signOutAction.fulfilled,(state,{payload})=>{

        state.currentProfile = null
        state.loading = false
        state.signedIn = false
        
      
    }).addCase(signOutAction.rejected,(state,{payload})=>{
        state.error = payload.error
    })

    .addCase(setDialog.type,(state,{payload})=>{
        if(payload){ if(payload.isOpen==false){
state.dialog.isOpen = false
        }else{
    state.dialog = payload}
}
    }).addCase(setSignedInTrue.type,(state,{payload})=>{
        state.signedIn = true
    }).addCase(setSignedInFalse.type,(state,{payload})=>{
        state.signedIn=false
    })
   .addCase(createPageApproval.fulfilled,(state,{payload})=>{
        state.currentProfile = payload.profile
    }).addCase(deletePageApproval.fulfilled,(state,{payload})=>{
        const list = state.userApprovals.filter(ua=> ua!=null &&payload.userApproval && ua.id != payload.userApproval.id)
        state.userApprovals = list
    }).addCase(searchDialogToggle.type,(state,{payload})=>{
        state.searchDialogOpen = payload
    }).addCase(searchMultipleIndexes.fulfilled,(state,{payload})=>{
        state.searchResults = payload.results
    }).addCase(searchMultipleIndexes.rejected,(state,{payload})=>{
        state.error =payload
    })
    // .addCase(fetchArrayOfProfiles.fulfilled,(state,{payload})=>{
    //     state.profilesInView = payload.profileList
    // })
}})


export default userSlice