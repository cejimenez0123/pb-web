import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import storyRepo from "../data/storyRepo"
import commentRepo from "../data/commentRepo"
import likeRepo from "../data/likeRepo"
import profileRepo from "../data/profileRepo"

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
  async (params,thunkApi) => {
    try{

    let data= await storyRepo.getPublicProfileStories(params)

  return {
    pageList:data.stories
  }
  }catch(e){

  return {error:`public pages${e.message}`}
}})
const getProtectedProfilePages= createAsyncThunk(
  'pages/getProtectedProfilePages',
  async (params,thunkApi) => {
    try{

    let data= await storyRepo.getProtectedProfileStories(params)
  
  return {
    pageList:data.stories}
  }catch(e){

  return {error:`Page Query Where Error: ${e.message}`}
}})







const appendToPagesInView = createAction("pages/appendToPagesInView", (params)=> {

  const {pages} = params
  return  {payload:
    pages}})
const appendToMyStories = createAction("pages/appendToMyStories", (params)=> {

  const {pages} = params
  return  {payload:
    pages}})
const setPageInView = createAction("pages/setPageInView", (params)=> {

  const {page} = params
  return  {payload:
    page}
    
  
})
const setPageType = createAction("pages/setPageType", (params)=> {

  const {type} = params
  return  {payload:
    type}
    
  
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
  anchorText,        // ← add
}, thunkApi) {
  try {
    let data = await commentRepo.create({
      profile,
      storyId,
      text,
      parentId:   parentCommentId,
      anchorText: anchorText ?? "",  // ← add
    });
   return { comment: { ...data.comment, storyId } };
  } catch(error) {
    return { error: new Error(`Error: Create Comment ${error.message}`) };
  }
});
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
const fetchCommentsOfPage = createAsyncThunk(
  "comments/fetchCommentsOfPage",
  async ({ id, isPublic = false }, thunkAPI) => {
    try {
      const data = await commentRepo.fetchByStory({ storyId: id }); // ✅ bound + correct key
      return { comments: data.comments };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data ?? err.message);
    }
  }
);
// const fetchCommentsOfPagePublic = createAsyncThunk("comments/fetchCommentsOfPagePublic",async (params,thunkApi)=>{
//   try{
  
//       let data = await storyRepo.fetchCommentsOfPagePublic({pageId:params.id})
//       return {

//         comments: data.comments
//       }

// }catch(err){

// return err

// }}

// )
// const fetchCommentsOfPageProtected = createAsyncThunk("comments/fetchCommentsOfPages",async (params,thunkApi)=>{
//   try{
   
   

//       let data = await storyRepo.fetchCommentsOfPageProtected({pageId:params.id})
//       return {

//         comments: data.comments
//       }

// }catch(err){

// return err

// }}

// )

const setCurrentPage = createAction(
  "pages/setCurrentPage",
  function prepare({ key, page }) {
    return {
      payload: { key, page },
    };
  }
);

const setPaginationLoading = createAction("pagination/setLoading");
 const initKey = createAction("pagination/initKey");
const setPageData = createAction(
  "pagination/setPageData",
  function prepare({ key, page, items, totalCount }) {
    return {
      payload: {
        key,
        page,
        items,
        totalCount,
      },
    };
  }
);
// const setLoading = createAction("pagination/setLoading");
//  const initKey = createAction("pagination/initKey");
// const setPageData = createAction(
//   "pagination/setPageData",
//   function prepare({ key, page, items, totalCount }) {
//     return {
//       payload: {
//         key,
//         page,
//         items,
//         totalCount,
//       },
//     };
//   }
// );
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
    console.log("DATA FROM LIKE REPO",data)
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
    
      let profileData = await profileRepo.getMyProfiles()

      return {
      profile: profileData.profile
      }
    }catch(e){
      return {
        error: e
      }
    }
  })

 const fetchPage = createAsyncThunk(
  "pages/fetchPage",
  async ({ key, fetcher, page, pageSize, params, select }, thunkApi) => {
    try {
      const res = await thunkApi.dispatch(
        fetcher({
          skip: (page - 1) * pageSize,
          take: pageSize,
          ...params,
        })
      ).unwrap();

      const parsed = select ? select(res) : res;

      return {
        key,
        page,
        items: parsed.items,
        totalCount: parsed.totalCount,
      };
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);
  export {
          pagesLoading,
          setHtmlContent,
          getProtectedProfilePages,
          getPublicProfilePages,        
          setPageInView,
         
          setPagesToBeAdded,
          clearPagesInView,
       
          createComment,
          fetchCommentsOfPage,
          deleteComment,
          clearEditingPage,
          appendComment,
          updateComment,
       
          setEditingPage,
          setPagesInView,
          createPageApproval,
          deletePageApproval,
       setPageType,
          getPublicStories,
         appendToPagesInView,
         setComments,
         appendToMyStories,
         setPaginationLoading,
        //  setCurrentPage,
   fetchPage,
       setPageData,
         setCurrentPage,
         initKey
        } 
