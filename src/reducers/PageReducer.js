
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
          deletePage,
          fetchCommentsOfPage,
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
          fetchAppendPagesOfProfile,
          saveRolesForPage,
          updatePage,
          setEditingPage
        } from "../actions/PageActions"
import { createSlice} from "@reduxjs/toolkit"

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
        getProfilePages.rejected,(state,{payload,error})=>{
          if(error!=null){
            state.error = error.name
          }else{
          state.error = payload.error
          }
          state.loading = false
       
        }
      ).addCase(deletePage.fulfilled,(state,{payload})=>{
        let filtered = state.pagesInView.filter(page => page.id !== payload.page.id)
        state.pagesInView = filtered
      }).addCase(createPage.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading = false

      }).addCase(createPage.pending,(state)=>{

        state.loading = true

      }).addCase(createPage.fulfilled,(state,{payload})=>{
        state.loading =false
        state.editingPage = payload.page

      }).addCase(clearEditingPage,(state)=>{
        state.editingPage =null
      }).addCase(setPageInView,(state,{payload})=>{
     
        state.pageInView = payload.page
      }).addCase(setEditingPage.type,(state,{payload})=>{
        state.editingPage = payload
      }).addCase(saveRolesForPage.fulfilled,(state,{payload})=>{
        if(payload.page){
        state.editingPage = payload.page
      }}).addCase(saveRolesForPage.rejected,(state,{payload})=>{
        state.error = payload.error
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
        state.pagesInView = [...state.pagesInView,...payload.pageList]
        state.loading = false
      }).addCase(fetchArrayOfPagesAppened.rejected,(state,{payload})=>{
      state.error = payload.error
      state.loading = false
    }).addCase(clearPagesInView.type,(state)=>{
      state.pagesInView = []
    }).addCase(fetchEditingPage.fulfilled,(state,{payload})=>{
      if(payload.page){
      state.editingPage = payload.page
      }
    }).addCase(fetchCommentsOfPage.pending,(state,{payload})=>{
      state.loading = true
    }).addCase(fetchCommentsOfPage.rejected,(state,{payload})=>{
        state.error = payload.error
        state.loading =false
    }).addCase(fetchCommentsOfPage.fulfilled,(state,{payload})=>{
      if(Array.isArray(payload.comments)){
        state.commentsInView = payload.comments
      }else{
        state.error = payload.error
      }
        state.loading =false
    }).addCase(deleteComment.rejected,(state,{payload})=>{
      state.error = payload.error
    }).addCase(deleteComment.fulfilled,(state,{payload})=>{
       let comments= state.commentsInView.filter(com=>com.id !== payload.comment)
      state.commentsInView = comments
      }).addCase(appendComment,(state,{payload})=>{
        if(Array.isArray(state.commentsInView)){
          state.commentsInView = [...state.commentsInView,payload.comment]
        }else{
          state.commentsInView = [payload.comment]
        }
        
      }).addCase(updateComment.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(updateComment.fulfilled,(state,{payload})=>{
       let newList = state.commentsInView.map(comment=>{
          if(comment.id === payload.comment.id){
            return payload.comment
          }else{
            return comment
          }
        })
        state.commentsInView = newList
      }).addCase(fetchAppendPagesOfProfile.fulfilled,(state,{payload})=>{
        state.pagesInView = [...state.pagesInView,...payload.pageList]
      }).addCase(fetchAppendPagesOfProfile.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(updatePage.fulfilled,(state,{payload})=>{
        if(payload.page){
        state.editingPage = payload.page
        }
      }).addCase(updatePage.rejected,(state,{payload})=>{
       state.error = payload.error
      })
    }
  })
    
export {pageSlice}