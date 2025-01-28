import { createSlice} from "@reduxjs/toolkit"
        import { createCollection, fetchCollection, fetchCollectionProtected, getMyCollections, getPublicBooks,
                saveRoleToCollection
        ,addCollectionListToCollection,
        addStoryListToCollection,
        // getSubCollectionsProtected,
        // getSubCollectionsPublic,
        deleteCollectionFromCollection,
        deleteStoryFromCollection,
        clearCollections,
        getRecommendedCollectionsProfile,
        // getRecommendedCollectionsProfile,
      
            } from "../actions/CollectionActions"
import { deleteCollectionRole, postCollectionRole } from "../actions/RoleActions"
import { createWorkshopGroup, fetchWorkshopGroups, } from "../actions/WorkshopActions"
import { patchCollectionRoles ,getProtectedProfileCollections,getPublicProfileCollections} from "../actions/CollectionActions"
import { setCollections } from "../actions/BookActions"
const initialState = {
    groups:[],
    collections:[],
    collectionToCollectionsList:[],
    collectionInView:[],
    recommendedCols:[],
    loading:false,
    error:"",
    roles:[],

    role:null
}
const bookSlice = createSlice({
name: 'books',
initialState,
extraReducers(builder) {
builder.addCase(patchCollectionRoles.fulfilled,(state,{payload})=>{
    if(payload.collection){
        state.collectionInView = payload.collection
    }
    if(payload.roles){
        state.roles = payload.collection
    }
}).addCase(getProtectedProfileCollections.fulfilled,(state,{payload})=>{
   state.collections= payload.collections
}).addCase(getPublicProfileCollections.fulfilled,(state,{payload})=>{
    state.collections = payload.collections
}).addCase(createWorkshopGroup.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
    state.loading = false
}).addCase(createWorkshopGroup.pending,(state)=>{
state.loading = true
}).addCase(createWorkshopGroup.rejected,(state,{payload})=>{
    state.loading =false
}).addCase(fetchWorkshopGroups.fulfilled,(state,{payload})=>{
    state.groups = payload.groups
}).addCase(clearCollections.type,(state)=>{
    state.collections=[]
}).addCase(deleteCollectionFromCollection.fulfilled,(state,{payload})=>{
    const {collection}=payload
    if(collection){
        state.collectionInView = collection
    }
  
}).addCase(deleteCollectionFromCollection.rejected,(state,{payload})=>{
    state.error=payload.error
}).addCase(getRecommendedCollectionsProfile.fulfilled,(state,{payload})=>{
    state.recommendedCols = payload.collections
}).addCase(deleteCollectionRole.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
}).addCase(deleteStoryFromCollection.fulfilled,(state,{payload})=>{

    let list = state.collections
    const index = list.findIndex(col=>col.id==payload.collection.id)
    if(index>0&&payload.collection){
            list[index]=payload.collection
            state.collections = list
    }})
  

.addCase(addCollectionListToCollection.pending,(state,{payload})=>{
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
   
   let list = state.collections
  
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

}).addCase(setCollections,(state,{payload})=>{
 
    state.collections = payload
 
    })
.addCase(saveRoleToCollection.rejected,(state,{payload})=>{
    state.loading = false
    state.error = "Error Saving Role"
}).addCase(getMyCollections.fulfilled,(state,{payload})=>{
    let cols = state.collections
    const list = cols.map(col=>{
        return payload.collections.find(colx=>{
           return col.id==colx.id}
        )
    })
    const filtered = payload.collections.filter(col=>{
       return !state.collections.find(colx=>col.id==colx.id)
    })
    state.collections =[...list,...filtered]
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
    state.collections = payload.collection.childCollections.map(cTc=>cTc.childCollection)
    state.collectionToCollectionsList = payload.collection.childCollections
    state.loading = false
}).addCase(fetchCollectionProtected.pending,(state)=>{
    state.loading=false
}).addCase(fetchCollectionProtected.fulfilled,(state,{payload})=>{
    state.collectionInView = payload.collection
    state.collections = payload.collection.childCollections.map(cTc=>cTc.childCollection)
})
}

})
export default bookSlice
