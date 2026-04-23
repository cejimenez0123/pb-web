// import { createSlice} from "@reduxjs/toolkit"
// import {  setComments } from "../actions/PageActions.jsx"

// import { createComment,appendComment,updateComment,deleteComment } from "../actions/PageActions.jsx"

// const initialState = {
//     comments:[],
//     userCritique:[],
//     loading:false,
//     error:"",
//     role:null
// }
// const commentSlice = createSlice({
// name: 'comments',
// initialState,
// extraReducers(builder) {
// builder.addCase(createComment.fulfilled,(state,{payload})=>{
//     let list = [...state.comments]
//     if(payload.comment){
//    let index = list.findIndex(com=>com.id==payload.comment.id)
//    if(index>-1){
//     list[i]=payload.comment
  
//     state.comments = list
//   }else{
    
//     list.unshift(payload.comment)
//     state.comments = [...list]
  
    
  
//    }
//   }
   
// }).addCase(fetchCommentsOfPage.fulfilled, (state, action) => {
//   const { comments } = action.payload;
//   if (comments?.length) {
//     state.byStory[comments[0].storyId] = comments;
//   }
// }).addCase(createComment.pending,(state,{payload})=>{
//     state.loading=true
// }).addCase(createComment.rejected,(state,{payload})=>{
//     state.error = payload.error
// }).addCase(setComments.type,(state,{payload})=>{

//   state.comments = payload
// }).addCase(appendComment.type,(state,{payload})=>{
//   let list = [...state.comments]
  
//   if(payload&&!payload.length){ 
//  let index = list.findIndex(com=>com.id==payload.id)
//  if(index>-1){
//   list[index]=payload

//   state.comments = list
//  }else{

//   list.unshift(payload)
//   state.comments = [...list]
//  }
// }else{

//  if(state.comments.length==0){
//   state.comments = [...payload]
//  }else{
//   state.comments = [...new Set([...list,...payload])]
//  }
// }
    
//   }).addCase(updateComment.rejected,(state,{payload})=>{
//     state.error = payload.error
//   }).addCase(updateComment.fulfilled,(state,{payload})=>{
//     let list = state.comments
    
//    let newList = list.map(comment=>{
//       if(comment.id==payload.comment.id){
 
//         return payload.comment
//       }else{
//         return comment
//       }
//     })

//     state.comments = newList
//   }).addCase(deleteComment.rejected,(state,{payload})=>{
//     console.log(payload.error)
//     state.error = payload.error
//   }).addCase(deleteComment.fulfilled,(state,{payload})=>{
//     let list = [...state.comments]
//     if(state.comments.length==1){
//       state.comments=[]}
//       else{
//        state.comments = list.filter(com=>com.id != payload.comment.id)
//       }
//     })}})
// export default commentSlice

import { createSlice } from "@reduxjs/toolkit";
import {
  createComment,
  appendComment,
  updateComment,
  deleteComment,
  setComments,
  fetchCommentsOfPage,
} from "../actions/PageActions.jsx";

const initialState = {
  byStory: {},     // { [storyId]: Comment[] }  ← used by AnnotatedText
  comments: [],    // flat list for the current page's comment feed
  loading: false,
  error: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const upsert = (list, comment) => {
  const idx = list.findIndex((c) => c.id === comment.id);
  if (idx > -1) {
    list[idx] = comment;
  } else {
    list.unshift(comment);
  }
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers(builder) {
    // ── fetch ────────────────────────────────────────────────────────────────
    builder.addCase(fetchCommentsOfPage.fulfilled, (state, { payload }) => {
      const { comments } = payload;
      if (!comments?.length) return;

      state.comments = comments;

      // Also index by storyId for annotation lookups
      const storyId = comments[0].storyId;
      state.byStory[storyId] = comments;
    });

    // ── create ───────────────────────────────────────────────────────────────
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error ?? "Failed to save comment";
      })
      .addCase(createComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        const comment = payload?.comment;
        if (!comment) return;

        // Flat list
        upsert(state.comments, comment);

        // byStory map
        const storyId = comment.storyId;
        if (!state.byStory[storyId]) state.byStory[storyId] = [];

        if (comment.parentId) {
          // Nest reply inside parent's children
          const parent = state.byStory[storyId].find(
            (c) => c.id === comment.parentId
          );
          if (parent) {
            parent.children = [...(parent.children ?? []), comment];
          }
        } else {
          upsert(state.byStory[storyId], comment);
        }
      });

    // ── update ───────────────────────────────────────────────────────────────
    builder
      .addCase(updateComment.rejected, (state, { payload }) => {
        state.error = payload?.error ?? "Failed to update comment";
      })
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        const comment = payload?.comment;
        if (!comment) return;

        // Flat list
        state.comments = state.comments.map((c) =>
          c.id === comment.id ? comment : c
        );

        // byStory map
        const storyId = comment.storyId;
        if (state.byStory[storyId]) {
          state.byStory[storyId] = state.byStory[storyId].map((c) =>
            c.id === comment.id ? comment : c
          );
        }
      });

    // ── delete ───────────────────────────────────────────────────────────────
    builder
      .addCase(deleteComment.rejected, (state, { payload }) => {
        state.error = payload?.error ?? "Failed to delete comment";
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        const comment = payload?.comment;
        if (!comment) return;

        state.comments = state.comments.filter((c) => c.id !== comment.id);

        const storyId = comment.storyId;
        if (state.byStory[storyId]) {
          state.byStory[storyId] = state.byStory[storyId].filter(
            (c) => c.id !== comment.id
          );
        }
      });

    // ── sync actions (setComments / appendComment) ───────────────────────────
    builder.addCase(setComments.type, (state, { payload }) => {
      state.comments = payload;

      // Rebuild byStory from the new flat list
      if (payload?.length) {
        const storyId = payload[0].storyId;
        state.byStory[storyId] = payload;
      }
    });

    builder.addCase(appendComment.type, (state, { payload }) => {
      if (!payload) return;

      if (Array.isArray(payload)) {
        // Batch append — deduplicate by id
        const ids = new Set(state.comments.map((c) => c.id));
        const incoming = payload.filter((c) => !ids.has(c.id));
        state.comments = [...state.comments, ...incoming];

        if (incoming.length) {
          const storyId = incoming[0].storyId;
          if (!state.byStory[storyId]) state.byStory[storyId] = [];
          incoming.forEach((c) => upsert(state.byStory[storyId], c));
        }
      } else {
        // Single comment
        upsert(state.comments, payload);

        const storyId = payload.storyId;
        if (!state.byStory[storyId]) state.byStory[storyId] = [];
        upsert(state.byStory[storyId], payload);
      }
    });
  },
});

export default commentSlice;