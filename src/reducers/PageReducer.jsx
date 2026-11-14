
import { 
          setHtmlContent,
          getProtectedProfilePages,
          getPublicProfilePages,
          appendToPagesInView,
          setPageInView,
       
          setPagesToBeAdded,
          clearPagesInView,
  
          clearEditingPage,
      
          setEditingPage,
          getPublicStories,
          setPagesInView,
          setPageType,
       
       
        } from "../actions/PageActions.jsx"
        
import { createSlice} from "@reduxjs/toolkit"
import {  getStory,createStory, fetchRecommendedStories,
  updateStory, deleteStory, getCollectionStoriesProtected,getCollectionStoriesPublic,
  getMyStories} from "../actions/StoryActions"
import { PageType } from "../core/constants.js"
import { removeContentByProfileId } from "../actions/ModerationAcitons.jsx"


const initialState = {pagesInView:[],
myPages: [],


myStoriesLoading: false,

    pagination: {
    skip: 0,
    take: 20,
    totalCount: 0,
    hasMore: false,
  },
  pageType:PageType.text,
                      storyToCollectionList:[],
                      recommendedStories:[],
                      editingPage:null,
                      loading:true,
                      editorHtmlContent:"",
                      error:"",
                      pageInView: null,
                      pagesToBeAdded: [],
            
                    }
const pageSlice = createSlice({
    name: 'pages',
    initialState,
    extraReducers(builder) {
        builder
   
    .addCase(getCollectionStoriesPublic.fulfilled,(state,{payload})=>{
      const {list}=payload
         
      state.loading = false
      if(list){
          state.pagesInView = list.map(item=>item.story)
          state.storyToCollectionList= list
      }else{
        state.pagesInView=[]
        state.storyToCollectionList = []
      }
    }).addCase(fetchRecommendedStories.fulfilled,(state,{payload})=>{
     state.loading=false
      state.recommendedStories = payload.stories
    }).addCase(appendToPagesInView.type,(state,{payload})=>{

      if(payload.length>0&&state.pagesInView){
        payload.forEach(page=>{
       let found = state.pagesInView.find(p=>p&&page&& p.id==page.id)
       if(!found){
        state.pagesInView = [...state.pagesInView,page]
       }
        })
       
      }
     
    })
        .addCase(getCollectionStoriesProtected.fulfilled,(state,{payload})=>{
          const {list}=payload
    
          state.loading = false
      if(list){
          state.pagesInView = list.map(item=>item.story)
          state.storyToCollectionList= list
      }
        }).addCase(getCollectionStoriesProtected.pending,(state)=>{
          state.loading=true
        
        }).addCase(updateStory.rejected,(state,{payload})=>{
            state.loading = false
            state.error = payload.message
        }).addCase(updateStory.fulfilled,(state,{payload})=>{
          state.pageInView= payload.story
          
          state.loading = false
        }).addCase(updateStory.pending,(state)=>{
          state.loading=true
        })
        .addCase(getPublicStories.pending,(state)=>{
          state.loading = true
        }).addCase(getStory.rejected,(state)=>{
          state.loading = false
          state.error ="  Failed to Fetch story"
        }).addCase(getStory.fulfilled,(state,{payload})=>{
          state.loading = false
          state.pageInView = payload.story
        
        })
      
  
  
        .addCase(getPublicStories.fulfilled,(state,{payload})=>{
          if(payload.stories){
            state.pagesInView = payload.stories
          }
          state.loading = false

        }   
        )
      .addCase(getPublicStories.rejected,(state,{payload})=>{
        state.loading = false
        state.error = payload.error
      })



      .addCase(setHtmlContent.type,(state,{payload})=>{
        state.editorHtmlContent = payload.html
      }).addCase(getPublicProfilePages.fulfilled,(state,{payload})=>{
        state.loading = false
    if(payload.pageList){
      state.pagesInView = payload.pageList
    }
  
      }).addCase(getProtectedProfilePages.pending,(state)=>{
        state.loading = true
      }).addCase(getProtectedProfilePages.fulfilled,(state,{payload})=>{
        state.loading = false
        if(payload.pageList){
          state.pagesInView = payload.pageList
        }
     
      })
      .addCase(createStory.rejected,(state,{payload})=>{
        state.loading=false
        state.error = payload.error
      })
      .addCase(createStory.pending,(state)=>{
        state.loading = true
      })
      .addCase(createStory.fulfilled,(state,{payload})=>{
        let {story}=payload
  if(story&&story.id){
        state.loading = false
        state.pageInView = story
        state.editorHtmlContent = story.data
  }
      })

      .addCase(clearEditingPage,(state)=>{
        state.editingPage =null
      }).addCase(setPageInView,(state,{payload})=>{
  
      state.pageInView = payload


      }).addCase(setPageType,(state,{payload})=>{
        state.pageType  = payload
      }).addCase(setEditingPage.type,(state,{payload})=>{
        state.editingPage = payload
      })
.addCase(setPagesInView,(state,{payload})=>{

          state.pagesInView = payload
      
    
      }).addCase(setPagesToBeAdded.type,(state,{payload})=>{
        state.pagesToBeAdded = payload
      }).addCase(deleteStory.rejected,(state,{payload})=>{
        state.error = payload.error
      })
      .addCase(deleteStory.fulfilled, (state, { payload }) => {
  state.pageInView = null;

  state.pagesInView = state.pagesInView.filter(
    (page) => page.id !== payload.id
  );

  state.recommendedStories = state.recommendedStories.filter(
    (story) => story.id !== payload.id
  );
})
.addCase(getMyStories.pending, (state) => {
  state.myStoriesLoading = true;
})

.addCase(getMyStories.fulfilled, (state, { payload }) => {
  state.loading = false;

  const incomingStories = payload.pageList || [];

  if (payload.append) {
    const existingIds = new Set(
      (state.myPages || []).map((story) => story.id)
    );

    const newStories = incomingStories.filter(
      (story) => !existingIds.has(story.id)
    );

    state.myPages = [
      ...(state.myPages || []),
      ...newStories,
    ];
  } else {
    state.myPages = incomingStories;
  }

  state.pagination = {
    skip: payload.skip,
    take: payload.take,
    totalCount: payload.totalCount,
    hasMore: payload.hasMore,
  };
})

// .addCase(getMyStories.fulfilled, (state, { payload }) => {
//   state.myStoriesLoading = false;

//   state.myPages = payload.pageList || [];

//   state.pagination = {
//     skip: payload.skip,
//     take: payload.take,
//     totalCount: payload.totalCount,
//     hasMore: payload.hasMore,
//   };
// })
.addCase(getMyStories.rejected, (state) => {
  state.myStoriesLoading = false;
})


// .addCase(getMyStories.pending, (state) => {
//   state.loading = true;
// })
// .addCase(getMyStories.fulfilled, (state, { payload }) => {
//   console.log("REd")
//   console.log(payload)
//   state.loading = false;

//   state.myPages = payload.pageList || [];

//   state.pagination = {
//     skip: payload.skip,
//     take: payload.take,
//     totalCount: payload.totalCount,
//     hasMore: payload.hasMore,
//   };
// })
// .addCase(getMyStories.rejected, (state, { payload }) => {
//   state.loading = false;
//   state.error = payload?.message || payload || "Failed to fetch stories";
// })

.addCase(clearPagesInView.type,(state)=>{
      state.pagesInView = []
    }).addCase(removeContentByProfileId, (state, { payload }) => {
        const { profileId } = payload;
        if (!profileId) return;

        state.pagesInView = state.pagesInView.filter(
          (p) => p && p.authorId !== profileId && p.profileId !== profileId
        );
        state.myPages = state.myPages.filter(
          (p) => p && p.authorId !== profileId && p.profileId !== profileId
        );
      });

    }
  })
    
export {pageSlice}

