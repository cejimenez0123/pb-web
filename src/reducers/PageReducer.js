
import { getPublicPages ,setHtmlContent,getProfilePages,savePage,setPageInView,fetchPage} from "../actions/PageActions"
import Page from "../domain/models/page"
import { createReducer ,createSlice} from "@reduxjs/toolkit"

const initialState = {pagesInView:[Page],
                      editingPage:null,
                      loading:false,
                      editorHtmlContent:"",
                      error:"",
                      pageInView: null}
const pageSlice = createSlice({
    name: 'pages',
    initialState,
    extraReducers(builder) {
        builder
        .addCase(getPublicPages.pending,(state) => {
        state.loading = true
      })
      .addCase(getPublicPages.fulfilled, (state, { payload }) => {
        state.loading = false
        const list=  payload.pageList
        state.pagesInView = list
      }).addCase(getPublicPages.rejected, (state) => {
        state.loading = false
      }).addCase(setHtmlContent,(state,{payload})=>{
        state.editorHtmlContent = payload.html
      }).addCase(getProfilePages.pending,(state)=>{
        state.loading = true
      }).addCase(getProfilePages.fulfilled,(state,{payload})=>{
        state.loading = false
    
        state.pagesInView = payload.pageList
      }).addCase(
        getProfilePages.rejected,(state,{payload})=>{
          state.loading = false
          state.error = payload.error
        }
      ).addCase(savePage.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading = false

      }).addCase(savePage.pending,(state)=>{

        state.loading = true

      }).addCase(savePage.fulfilled,(state,{payload})=>{
        state.loading =false
        state.editingPage = payload.page

      }).addCase(setPageInView,(state,{payload})=>{
        console.log(`Pagereducer ${JSON.stringify(payload)}`)
        state.pageInView = payload.page
      }).addCase(fetchPage.pending,(state)=>{
        state.loading = true
      }).addCase(fetchPage.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(fetchPage.fulfilled,(state,{payload})=>{
        state.loading = false
        state.pageInView = payload.page
      })
    },
  })
    
export {pageSlice}