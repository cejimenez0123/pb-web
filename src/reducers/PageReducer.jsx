
import { 
          setHtmlContent,
          getProtectedProfilePages,
          getPublicProfilePages,
          appendToPagesInView,
          setPageInView,
          fetchPage,
          fetchArrayOfPages,
          setPagesToBeAdded,
          clearPagesInView,
          fetchEditingPage,
          clearEditingPage,
          saveRolesForPage,
          updatePage,
          setEditingPage,
          getPublicStories,
          setPagesInView,
       
        } from "../actions/PageActions"
        
import { createSlice} from "@reduxjs/toolkit"
import { getMyStories, getStory,createStory, fetchRecommendedStories,
  updateStory, deleteStory, getCollectionStoriesProtected,getCollectionStoriesPublic} from "../actions/StoryActions"
import { getRecommendedCollectionStory } from "../actions/CollectionActions"


const initialState = {pagesInView:[],
                      storyToCollectionList:[],
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
      state.pagesInView = payload.stories
    }).addCase(appendToPagesInView.type,(state,{payload})=>{

      if(payload.length>0){
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
        
        }).addCase(getMyStories.fulfilled,(state,{payload})=>{
          if(payload.pageList){
            state.pagesInView =    payload.pageList
          }
     
          state.loading=false
        }).addCase(getMyStories.pending,(state)=>{
          state.loading=true
        }).addCase(getMyStories.rejected,(state,{payload})=>{
          state.error= payload.error
          state.loading = false
        }).addCase(getPublicStories.fulfilled,(state,{payload})=>{
          state.loading = false
          state.pagesInView = payload.stories
        }   
        )
      .addCase(getPublicStories.rejected,(state,{payload})=>{
        state.loading = false
        state.error = payload.error
      })
   
      .addCase(setHtmlContent,(state,{payload})=>{
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
  
        state.loading = false
        state.pageInView = story
        state.editorHtmlContent = story.data
      })

      .addCase(clearEditingPage,(state)=>{
        state.editingPage =null
      }).addCase(setPageInView,(state,{payload})=>{
     if(payload && payload.page){
      state.pageInView = payload.page
     }else{
      state.pageInView=null
     }
      
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
      }).addCase(setPagesInView.type,(state,{payload})=>{
        if(payload.length>0){
          state.pagesInView = payload
        }else{
          state.pagesInView=[]
        }
    
      }).addCase(setPagesToBeAdded.type,(state,{payload})=>{
        state.pagesToBeAdded = payload
      }).addCase(deleteStory.rejected,(state,{payload})=>{
        state.error = payload.error
      }).addCase(deleteStory.fulfilled,(state,{payload})=>{
        state.pageInView = null
      }).addCase(clearPagesInView.type,(state)=>{
      state.pagesInView = []
    }).addCase(fetchEditingPage.fulfilled,(state,{payload})=>{
      if(payload.page){
      state.editingPage = payload.page
      }
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