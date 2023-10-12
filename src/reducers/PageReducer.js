
import {  getPublicPages ,
          setHtmlContent,
          getProfilePages,
          createPage,
          setPageInView,
          fetchPage,
          fetchArrayOfPages,
          setPagesToBeAdded,
          fetchArrayOfPagesAppened,
          clearPagesInView,
          fetchEditingPage,
          fetchCommentsOfPage
        } from "../actions/PageActions"
import Page from "../domain/models/page"
import { createReducer ,createSlice} from "@reduxjs/toolkit"

const initialState = {pagesInView:[],
                      editingPage:null,
                      loading:false,
                      editorHtmlContent:"",
                      error:"",
                      pageInView: null,
                      pagesToBeAdded: [],
                      commentsInView:[]
                    }
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
      ).addCase(createPage.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading = false

      }).addCase(createPage.pending,(state)=>{

        state.loading = true

      }).addCase(createPage.fulfilled,(state,{payload})=>{
        state.loading =false
        state.editingPage = payload.page

      }).addCase(setPageInView,(state,{payload})=>{
     
        state.pageInView = payload.page
      }).addCase(fetchPage.pending,(state)=>{
        state.loading = true
      }).addCase(fetchPage.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(fetchPage.fulfilled,(state,{payload})=>{
        state.loading = false
        state.pageInView = payload.page
      }).addCase(fetchArrayOfPages.fulfilled,(state,{payload})=>{
          state.pagesInView = payload.pageList
          state.loading = false
      }).addCase(fetchArrayOfPages.rejected,(state,{payload})=>{
          state.error = payload.error
          state.loading = false
      }).addCase(fetchArrayOfPages.pending,(state)=>{
          state.loading = true
      }).addCase(setPagesToBeAdded.type,(state,{payload})=>{
        state.pagesToBeAdded = payload
      }).addCase(fetchArrayOfPagesAppened.fulfilled,(state,{payload})=>{
        console.log(`pageload ${JSON.stringify(payload)}`)
        state.pagesInView = [...state.pagesInView,...payload.pageList]
        state.loading = false
      }).addCase(fetchArrayOfPagesAppened.rejected,(state,{payload})=>{
      state.error = payload.error
      state.loading = false
    }).addCase(clearPagesInView.type,(state)=>{
      state.pagesInView = []
    }).addCase(fetchEditingPage.fulfilled,(state,{payload})=>{
      state.editingPage = payload.page
    }).addCase(fetchCommentsOfPage.pending,(state,{payload})=>{
      state.loading = true
    }).addCase(fetchCommentsOfPage.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading =false
    }).addCase(fetchCommentsOfPage.fulfilled,(state,{payload})=>{
        state.commentsInView = payload.comments
        state.loading =false
    })}
  })
    
export {pageSlice}