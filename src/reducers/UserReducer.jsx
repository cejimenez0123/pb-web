
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
            setUserLoading,
            setCurrentProfile,
            setAuthResolved,
        } from "../actions/UserActions"

import {  addNotification, createProfile, fetchNotifcations, fetchProfileRecommendations, fetchProfiles } from "../actions/ProfileActions"
import { createPageApproval, deletePageApproval } from "../actions/PageActions.jsx" 
import { postCollectionHistory, postStoryHistory } from "../actions/HistoryActions"
import { createFollow, deleteFollow } from "../actions/FollowAction"
import { postActiveUser } from "../actions/WorkshopActions"

const initialState = {
    signedIn: false,
    user: null,
    recommendationsStatus: "idle", // "idle" | "loading" | "succeeded" | "failed"
    recommendationsError: null,
    recommendations:[],
    currentProfile: null,
    homeCollection: null,
    loading: true,
    notifications: [],
    events: [],
    authResolved: false,
    userApprovals: [],
    followedBooks: [],
    followedProfiles: [],
    followedLibraries: [],
    profileInView: null,
    profilesInView: [],
    searchResults: [],
    searchDialogOpen: false,
    error: "",
    dialog: { text: "", title: "", agree: null, onClose: null, isOpen: false, agreeText: "agree", disagreeText: "Close" }
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers(builder) {
        builder
        .addCase(fetchProfiles.fulfilled, (state, { payload }) => {
            const profiles = payload.profiles.filter(prof => {
               return state.currentProfile && prof.id != state.currentProfile.id
            })
            state.profilesInView = profiles
        })
        .addCase(fetchProfiles.pending, (state, { payload }) => {})
        .addCase(setEvents.type, (state, { payload }) => {
            if (payload.events && payload.events.length) {
                state.events = payload.events
            }
        })
        .addCase(setUserLoading.type, (state, { payload }) => {
            state.loading = payload
        })
        .addCase(setAuthResolved, (state, action) => {
            state.authResolved = action.payload;
        })
        .addCase(useReferral.fulfilled, (state, { payload }) => {
            if (payload.profile) {
                state.currentProfile = payload.profile
            }
        })
        .addCase(deleteUserAccounts.fulfilled, (state, { payload }) => {
            state.currentProfile = null
        })
        .addCase(postActiveUser.fulfilled, (state, { payload }) => {
            state.profilesInView = payload.profiles
        })
        .addCase(createFollow.fulfilled, (state, { payload }) => {})
        .addCase(deleteFollow.fulfilled, (state, { payload }) => {})
        .addCase(logIn.pending, (state) => {
            console.log("LOGIN PENDING");
            state.loading = true
        })
        .addCase(logIn.fulfilled, (state, { payload }) => {
            console.log("LOGIN FULFILLED", payload?.profile?.id);
            state.currentProfile = payload?.profile
            state.loading = false
            state.signedIn = true
            state.authResolved = true
        })
        .addCase(logIn.rejected, (state, { payload }) => {
            console.log("LOGIN REJECTED");
            if (payload?.error) state.error = payload.error
            state.loading = false
        })
        .addCase(fetchNotifcations.fulfilled, (state, { payload }) => {
            state.notifications = payload
        })
        .addCase(addNotification.type, (state, payload) => {
            state.notifications = payload
        })
        .addCase(createProfile.rejected, (state, { payload }) => {
            state.loading = false
        })
        .addCase(createProfile.pending, (state) => {
            state.loading = true
        })
        .addCase(createProfile.fulfilled, (state, { payload }) => {
            state.loading = false
            state.currentProfile = payload.profile
        })
        .addCase(updateProfile.fulfilled, (state, { payload }) => {
            state.currentProfile = payload.profile
        })
      .addCase(postStoryHistory.fulfilled, (state, { payload }) => {
    if (payload?.profile) state.currentProfile = payload.profile;
})
.addCase(postCollectionHistory.fulfilled, (state, { payload }) => {
    if (payload?.profile) state.currentProfile = payload.profile;
})
        .addCase(setCurrentProfile.type, (state, action) => {
            console.log("SET CURRENT PROFILE", action.payload?.id);
            state.currentProfile = action.payload;
            state.loading = false;
            state.authResolved = true;
        })
        .addCase(getCurrentProfile.pending, (state) => {
            console.log("GET CURRENT PROFILE PENDING");
            state.loading = true
        })
        .addCase(getCurrentProfile.fulfilled, (state, action) => {
            console.log("GET CURRENT PROFILE FULFILLED", action.payload?.profile?.id);
            state.currentProfile = action?.payload?.profile;
            state.loading = false;
            state.authResolved = true;
        })
        .addCase(getCurrentProfile.rejected, (state) => {
            console.log("GET CURRENT PROFILE REJECTED");
            state.loading = false;
            state.authResolved = true;
        })
        .addCase(fetchProfile.pending, (state) => {})
        .addCase(fetchProfile.fulfilled, (state, { payload }) => {
            state.profileInView = payload.profile
        })
        .addCase(fetchProfile.rejected, (state, { payload }) => {
            state.error = payload.error
        })
        .addCase(setProfileInView, (state, { payload }) => {
            state.profileInView = payload.profile
        })
        .addCase(signOutAction.pending, (state, payload) => {
            console.log("SIGN OUT PENDING");
            state.loading = true
        })
    .addCase(signOutAction.fulfilled, (state) => {
    state.currentProfile = null
    state.loading = false
    state.signedIn = false
    state.authResolved = true  // ← auth resolved, user is simply logged out
})
        .addCase(signOutAction.rejected, (state, { payload }) => {
            console.log("SIGN OUT REJECTED");
            state.error = payload.error
            state.signedIn = false
        })
        .addCase(setDialog.type, (state, { payload }) => {
            if (payload) {
                if (payload.isOpen == false) {
                    state.dialog.isOpen = false
                } else {
                    state.dialog = payload ?? { text: "", title: "", agree: () => {}, onClose: () => {}, isOpen: false, agreeText: "agree", disagreeText: "Close" }
                }
            }
        }).addCase(fetchProfileRecommendations.pending, (state) => {
        state.recommendationsStatus = "loading";
        state.recommendationsError = null;
      })
      .addCase(fetchProfileRecommendations.fulfilled, (state, action) => {
        state.recommendationsStatus = "succeeded";
        state.recommendations = action?.payload?.profiles;
      })
      .addCase(fetchProfileRecommendations.rejected, (state, action) => {
        state.recommendationsStatus = "failed";
        state.recommendationsError = action.payload;
      })
        .addCase(setSignedInTrue.type, (state, { payload }) => {
            state.signedIn = true
        })
        .addCase(setSignedInFalse.type, (state, { payload }) => {
            state.signedIn = false
        })
        .addCase(deletePageApproval.fulfilled, (state, { payload }) => {
            const list = state.userApprovals.filter(ua => ua != null && payload.userApproval && ua.id != payload.userApproval.id)
            state.userApprovals = list
        })
        .addCase(searchDialogToggle.type, (state, { payload }) => {
            state.searchDialogOpen = payload
        })
        .addCase(searchMultipleIndexes.fulfilled, (state, { payload }) => {
            state.searchResults = payload.results
        })
        .addCase(searchMultipleIndexes.rejected, (state, { payload }) => {
            state.error = payload
        })
    }
})

export default userSlice