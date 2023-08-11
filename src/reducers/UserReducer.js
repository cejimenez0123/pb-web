import { createSlice } from "@reduxjs/toolkit"
import { logIn ,signUp,getCurrentProfile} from "../actions/UserActions"
import Profile from "../domain/models/profile"
const initialState = {
    loggedIn: false,
    currentProfile: null,
    loading:false,
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
        state.currentProfile = payload.profile})
}})

export default userSlice