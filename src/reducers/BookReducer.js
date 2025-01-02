import { createSlice} from "@reduxjs/toolkit"
import { 
        
        fetchBook,
        saveRolesForBook,
      
    
        } from "../actions/BookActions"
        import { createCollection, fetchCollection, fetchCollectionProtected, getMyCollections, getPublicBooks,
                saveRoleToCollection
        ,addCollectionListToCollection,
        addStoryListToCollection,
        getSubCollectionsProtected,
        getSubCollectionsPublic,
        deleteCollectionFromCollection,
        deleteStoryFromCollection,
        clearCollections
            } from "../actions/CollectionActions"
import { deleteCollectionRole, postCollectionRole } from "../actions/RoleActions"

const initialState = {
    // booksInView:[],
    collections:[],
    collectionToCollectionsList:[],
    collectionInView:[],
    loading:false,
    error:"",
    bookInView: null,
    booksToBeAdded: [],
    bookRoles: [],
    role:null
}
const bookSlice = createSlice({
name: 'books',
initialState,
extraReducers(builder) {
builder.addCase(clearCollections.type,(state)=>{
    state.collections=[]
}).addCase(deleteCollectionFromCollection.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
}).addCase(deleteCollectionFromCollection.rejected,(state,{payload})=>{
    state.error=payload.error
}).addCase(deleteCollectionRole.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
}).addCase(deleteStoryFromCollection.fulfilled,(state,{payload})=>{

    let list = state.collections
    const index = list.findIndex(col=>col.id==payload.collection.id)
    if(index>0){
            list[index]=payload.collection
            state.collections = list
    }})
  
.addCase(getSubCollectionsProtected.fulfilled,(state,{payload})=>{
    state.collectionToCollectionsList = payload.list
    state.collections = payload.list.map(item=>item.childCollection)
}).addCase(getSubCollectionsPublic.fulfilled,(state,{payload})=>{
    
    state.collectionToCollectionsList = payload.list
    state.collections = payload.list.map(item=>item.childCollection)
}).addCase(addCollectionListToCollection.pending,(state,{payload})=>{
    state.loading = true
})
.addCase(addStoryListToCollection.pending,(state,{payload})=>{
   
    state.loading =true
})
.addCase(addCollectionListToCollection.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
    state.loading = false
}).addCase(addCollectionListToCollection.rejected,(state,{payload})=>{  
    state.error = payload.error
    state.loading = false
}).addCase(addStoryListToCollection.rejected,(state,{payload})=>{
    if(payload.error){
        state.error = payload.error
    }
   
    state.loading = false
}).addCase(addStoryListToCollection.fulfilled,(state,{payload})=>{
    state.loading=false
   let list = state.collections
    // state.collectionInView =payload.collection
    const index = list.findIndex(col=>col.id==payload.collection.id)
    if(index>0){
        list[index]=payload.collection
        state.collections = list
    }
}).addCase(postCollectionRole.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
}).addCase(createCollection.pending,(state)=>{
    state.loading = true
}).addCase(createCollection.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
})
.addCase(getPublicBooks.pending, (state,{payload})=>{
    state.loading = true
})
.addCase(getPublicBooks.rejected,(state,{payload})=>{
    state.loading = false
    state.error = payload.error

})
.addCase(getPublicBooks.fulfilled,(state,{payload})=>{
    state.loading = false
    state.collections= payload.books

})
.addCase(saveRoleToCollection.rejected,(state,{payload})=>{
    state.loading = false
    state.error = "Error Saving Role"
}).addCase(getMyCollections.fulfilled,(state,{payload})=>{
    state.collections = payload.collections
    state.loading =false
}).addCase(getMyCollections.pending,)
.addCase(getMyCollections.rejected,(state,{payload})=>{
    console.log(payload.error)
    state.loading = true
}).addCase(saveRoleToCollection.fulfilled,(state,{payload})=>{
    state.role = payload.role
}).addCase(fetchCollection.pending,(state)=>{
    state.loading=true
}).addCase(fetchCollection.fulfilled,(state,{payload})=>{
    state.collectionInView=payload.collection
    state.loading = false
}).addCase(fetchCollectionProtected.pending,(state)=>{
    state.loading=false
}).addCase(fetchCollectionProtected.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
}).addCase(fetchBook.pending,(state)=>{
    state.loading = true

}).addCase(fetchBook.rejected,(state,{payload})=>{
    state.loading = false
    state.error = payload.error


}).addCase(saveRolesForBook.rejected,(state,{payload})=>{
    state.error = payload.error
}).addCase(saveRolesForBook.fulfilled,(state,{payload})=>{
 
    state.bookInView = payload.book
})
}

})
export default bookSlice