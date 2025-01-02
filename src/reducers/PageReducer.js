
import { 
          setHtmlContent,
          getProfilePages,
    
          setPageInView,
          fetchPage,
          fetchArrayOfPages,
          setPagesToBeAdded,
          clearPagesInView,
          fetchEditingPage,
         
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
          fetchAppendPagesOfProfile,
          saveRolesForPage,
          updatePage,
          setEditingPage,
          getPublicStories,
       
        } from "../actions/PageActions"
import { createSlice} from "@reduxjs/toolkit"
import { getMyStories, getStory,createStory, 
  updateStory, deleteStory, getCollectionStoriesProtected,getCollectionStoriesPublic} from "../actions/StoryActions"


const initialState = {pagesInView:[],
                      storyToCollectionList:[],
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
        // .addCase(getPublicCollectionStories.pending,(state)=>{
        //   state.loading=true
        // })
    .addCase(getCollectionStoriesPublic.fulfilled,(state,{payload})=>{
      const {list}=payload
          state.loading = false
      
          state.pagesInView = list.map(item=>item.story)
          state.storyToCollectionList= list
    })
        .addCase(getCollectionStoriesProtected.fulfilled,(state,{payload})=>{
          const {list}=payload
          console.log("list",list)
          state.loading = false
      
          state.pagesInView = list.map(item=>item.story)
          state.storyToCollectionList= list
        }).addCase(getCollectionStoriesProtected.pending,(state)=>{
          state.loading=true
        
        }).addCase(updateStory.rejected,(state,{payload})=>{
            state.loading = false
            state.error = payload.message
        }).addCase(updateStory.fulfilled,(state,{payload})=>{
          state.pageInView = payload.story
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
          state.pageInView = payload.story
        }).addCase(getMyStories.fulfilled,(state,{payload})=>{
          state.pagesInView = payload.pageList
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
      )
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