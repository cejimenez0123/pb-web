import { createSlice } from "@reduxjs/toolkit"
import { logIn } from "../actions/UserActions"
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
      }).addCase(logIn.rejected, (state) => {
        state.loading = false
      })
    },
  })

export default userSlice