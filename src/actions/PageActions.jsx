import {client} from "../core/di"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import {storage} from "../core/di"
import storyRepo from "../data/storyRepo"
import commentRepo from "../data/commentRepo"
import likeRepo from "../data/likeRepo"
import profileRepo from "../data/profileRepo"
import { PageType } from "../core/constants"
import { deleteObject } from "firebase/storage"
import { Preferences } from "@capacitor/preferences"

const getPublicStories = createAsyncThunk("page/getPublicStories",async (thunkApi)=>{
  
  try{
    const data = await storyRepo.getPublicStories()
    

return {
    stories:data.stories
  }

    }catch(err){
      return {error: err}
    }
  
})

const setHtmlContent = createAction(
  'pages/setHtmlContent',(html)=>{
      return {
        payload:{
          html
        }
      }
  }
)



const getPublicProfilePages= createAsyncThunk(
  'pages/getPublicProfilePages',
  async ({profile},thunkApi) => {
    try{

    let data= await storyRepo.getPublicProfileStories({profileId:profile.id})

  return {
    pageList:data.stories
  }
  }catch(e){

  return {error:`public pages${e.message}`}
}})
const getProtectedProfilePages= createAsyncThunk(
  'pages/getProtectedProfilePages',
  async ({profile},thunkApi) => {
    try{

    let data= await storyRepo.getProtectedProfileStories({profileId:profile.id})
  
  return {
    pageList:data.stories}
  }catch(e){

  return {error:`Page Query Where Error: ${e.message}`}
}})







const appendToPagesInView = createAction("pages/appendToPagesInView", (params)=> {

  const {pages} = params
  return  {payload:
    pages}})

const setPageInView = createAction("pages/setPageInView", (params)=> {

  const {page} = params
  return  {payload:
    page}
    
  
})
const setPagesInView = createAction("pages/setPagesInView", (params)=> {

  const {pages} = params
  return  {payload:
    pages}
    
  
})
const setEditingPage = createAction("pages/setEditingPage", (params)=> {

  const {page} = params
  return  {payload:
    page}
    
  
})
const clearEditingPage = createAction("pages/clearEditingPage", (params)=> {


  return  {payload:
    null}
    
  
})

const setPagesToBeAdded = createAction("pages/setPagesToBeAdded",(params)=>{
  let {pageList} = params

  return {
    payload: pageList
  }
})

const clearPagesInView = createAction("pages/clearPagesInView")

const createComment = createAsyncThunk("pages/createComment", async function({
  profile,
  text,
  storyId,
  parentCommentId,
  },thunkApi){
  try{


 let data = await commentRepo.create({profile:profile,storyId:storyId,text,parentId:parentCommentId})
return {comment:data.comment}

  
  }catch(error){
   
    return {
      error: new Error(`Error: Create Comment ${error.message}`)
    }
  }


})
const appendComment = createAction("pages/appendComment", (params)=> {

  const {comment} = params
  return  {payload:
    comment}
    
  
})
const setComments = createAction("pages/setComments", (params)=> {

  const {comments} = params
  return  {payload:
    comments}
    
  
})
const fetchCommentsOfPagePublic = createAsyncThunk("comments/fetchCommentsOfPagePublic",async (params,thunkApi)=>{
  try{
  
      let data = await storyRepo.fetchCommentsOfPagePublic({pageId:params.id})
      return {

        comments: data.comments
      }

}catch(err){

return err

}}

)
const fetchCommentsOfPageProtected = createAsyncThunk("comments/fetchCommentsOfPages",async (params,thunkApi)=>{
  try{
   
   

      let data = await storyRepo.fetchCommentsOfPageProtected({pageId:params.id})
      return {

        comments: data.comments
      }

}catch(err){

return err

}}

)
const deleteComment = createAsyncThunk("pages/deleteComment",async (params,thunkApi)=>{
  const { comment}= params

  
     let data = await commentRepo.delete({id:comment.id})

  return {
    comment:data.comment,
    message:data.message
  }

})
const pagesLoading = createAction("PAGES_LOADING", function prepare(){
    return {
        payload: {
            loading: true
    }}
  })
const deletePage= createAsyncThunk("pages/deletePage", async (params,thunkApi)=>{
    try{
      const {page}=params
    let data = await storyRepo.deleteStory({id:page.id})
    if(page.type==PageType.picture){
      let refer = ref(storage,page.data)
      deleteObject(refer)
    }
    client.initIndex("page").deleteObject(page.id).wait()
    return {
      page:data
    }
    }catch(e){
      return {error: new Error("Error: Delete Page"+e.message)};
    }
  })
  const updateComment = createAsyncThunk(`pages/updateComment`, async (params,thunkApi)=>{
    const {comment,newText}=params

          let data = await commentRepo.update({id:comment.id,text:newText})


      return {
        comment:data.comment
      }
  })
  
  
 
  const createPageApproval = createAsyncThunk("users/createPageApproval",async (params,thunkApi)=>{
   try{
    const {story,profile,score}=params
    const data = await likeRepo.storyCreate({story,profile})
    return {
      profile:data.profile
    }
  }catch(e){
    return {error: e}
  }
  })
  const deletePageApproval = createAsyncThunk("users/deletePageApproval",async (params,thunkApi)=>{
   
try{
      const data = await likeRepo.storyDelete(params)
      const token = (await Preferences.get({key:"token"})).value
      let profileData = await profileRepo.getMyProfiles({token:token})
       await Preferences.set({key:"token",value:profileData.token})
      return {
      profile: profileData.profile
      }
    }catch(e){
      return {
        error: e
      }
    }
  })

  export {
          pagesLoading,
          setHtmlContent,
          getProtectedProfilePages,
          getPublicProfilePages,        
          setPageInView,
         
          setPagesToBeAdded,
          clearPagesInView,
       
          createComment,
          fetchCommentsOfPageProtected,
          fetchCommentsOfPagePublic,
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
       
          setEditingPage,
          setPagesInView,
          createPageApproval,
          deletePageApproval,
       
          getPublicStories,
         appendToPagesInView,
         setComments
        } 
