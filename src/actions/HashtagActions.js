import {db,auth} from "../core/di"
import {where,deleteDoc,query,and,orderBy,updateDoc,or,collection,getDocs,getDoc,doc,setDoc, Timestamp, arrayUnion} from "firebase/firestore"
import Page from "../domain/models/page"
import PageComment from "../domain/models/page_comment"
import { createAction,createAsyncThunk } from "@reduxjs/toolkit"
import Hashtag from "../domain/models/hashtag"
import { create } from "@mui/material/styles/createTransitions"
import HashtagComment from "../domain/models/hashtag_comment"
import HashtagPage from "../domain/models/hashtag_page"

const createHashtag = createAsyncThunk("hashtag/createHashtag", 
    async (params,thunkApi) => {
        const ref = collection(db,Hashtag.className)
        const id = doc(ref).id
        const { profile}=params
        const hashtagName = params["name"]
   
        try{
      
        
        await setDoc(doc(db,Hashtag.className, id), { id,})
        const created =Timestamp.now()
        const hashtag = new Hashtag(id,hashtagName,profile.id,1,created)
        return{
            hashtag
        }
    }catch(e){
        return {error:e}
    }
})
const getHashtags = createAsyncThunk("hashtag/getHashtags",async (params,thunkApi)=>{

    let hashtags = []
    try{
     let ref = collection(db, Hashtag.className)
    const request = query(ref,)
    const snapshot = await getDocs(request)
        snapshot.docs.forEach(doc => {
            let hashtag = unpackHashtagDoc(doc)
            hashtags = [...hashtags,hashtag ]
        })
        return {
            hashtags
        }
    }catch(err){
        return {error: err}
    }
})
const createHashtagComment = createAsyncThunk("hashtag/createHashtagComment", 
    async (params,thunkApi) => {
        const ref = collection(db,HashtagComment.className)
        
        const { hashtag,comment}=params
        const id = `${hashtag.id}_${comment.id}`
        const created = Timestamp.now()
        try{
            await setDoc(doc(db,HashtagComment.className, id), { id,
            hashtagId: hashtag.id,
            commentId: comment.id,
            created: created
            })
           let hashtag= new Hashtag(id,hashtagName,profile.id,1,created)
        return {
            hashtag: hashtag
        }
    }catch(e){
        return {error:e}
    }
})
const createHashtagPage = createAsyncThunk("hashtag/createHashtagPage", 
    async (params,thunkApi) => {
       
        const ref = collection(db,HashtagPage.className)
        // const id = doc(ref).id
        const { hashtag,page}=params
        const id = `${hashtag.id}_${page.id}`
        const created = Timestamp.now()
   
        try{
      
        
        await setDoc(doc(db,HashtagPage.className, id),
         {  id,
            hashtagId:hashtag.id,
            pageId:page.id,
            created})
  
        let hashtagPage = new HashtagPage(id,h,profile.id,1,created)
        return {
            hashtagPage: hashtagPage
        }
    }catch(e){
        return {error:e}
    }
})
const getHashtagPages = createAsyncThunk("hashtag/getHashtagPage",async (params,thunkApi)=>{
    const {page}=params
    let hashtagPageList = []
    try{
     let ref = collection(db, HashtagPage.className)
    const request = query(ref,where("pageId","==",page.id))
    const snapshot = await getDocs(request)
        snapshot.docs.forEach(doc => {
            let hashtag = unpackHashtagPageDoc(doc)
            hashtagPageList = [...hashtagPageList,hashtag ]
        })
        return {
            hashtagPageList
        }
    }catch(err){
        return {error: err}
    }
})
const getHashtagComments = createAsyncThunk("hashtag/getHashtagComment",async (params,thunkApi)=>{
    const {comment}=params
    let hashtagCommentList = []
    try{
     let ref = collection(db, HashtagComment.className)
    const request = query(ref,where("comment","==",comment.id))
    const snapshot = await getDocs(request)
        snapshot.docs.forEach(doc => {
            let hashtag = unpackHashtagCommentDoc(doc)
            hashtagCommentList = [...hashtagCommentList,hashtag ]
        })
        return {
            hashtagCommentList
        }
    }catch(err){
        return {error: err}
    }
})
const clearHashComments = createAction("hashtags/clearHashComments")
const clearHashPages = createAction("hashtags/clearHashPages")

const unpackHashtagDoc = (doc)=>{
    const id = doc.id
    const pack = doc.pack()
    const {name,created,popularityScore,profileId}=pack
    const hashtag = new Hashtag(id,
                                name,
                                profileId,
                                popularityScore,
                                created)
    return hashtag
}
const unpackHashtagPageDoc = (doc)=>{
    const id = doc.id
    const pack = doc.pack()
    const {pageId,hashtagId,created}=pack
    const hashtag = new HashtagPage(id,
                                    hashtagId,
                                    pageId,
                                    created)
    return hashtag
}
const unpackHashtagCommentDoc = (doc)=>{
    const id = doc.id
    const pack = doc.pack()
    const {commentId,hashtagId,created}=pack
    const hashtag = new HashtagPage(id,
                                    hashtagId,
                                    commentId,
                                    created)
    return hashtag
}
export {unpackHashtagDoc,
        createHashtag,
        createHashtagComment,
        createHashtagPage,
        getHashtags,
        getHashtagPages,
        getHashtagComments,
        clearHashComments,
        clearHashPages
}