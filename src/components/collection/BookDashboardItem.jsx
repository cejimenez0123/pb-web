import { useContext,useEffect,useLayoutEffect, useRef, useState } from 'react'
import "../../Dashboard.css"
import {useDispatch} from 'react-redux'
import bookmarkfill from "../../images/bookmarkfill.svg"
import checkResult from '../../core/checkResult'
import Paths from '../../core/paths'
import bookmarkoutline from "../../images/bookmarkadd.svg"
import ProfileCircle from '../profile/ProfileCircle'
import {  addCollectionListToCollection, deleteCollectionFromCollection,  } from '../../actions/CollectionActions'
import Context from '../../context'
import { debounce } from 'lodash'
import Carousel from './Carousel'
import { IonImg, useIonRouter } from '@ionic/react'


function BookDashboardItem({book,isGrid}) {
 console.log(book)
    const dispatch = useDispatch()
    const {setError,currentProfile,isPhone,isHorizPhone}=useContext(Context)
    const router = useIonRouter()
    
    const [bookmarked,setBookmarked]=useState()
     const soCanUserEdit=()=>{


        
     }

   
const deleteBtc=()=>{

        if(bookmarked){
          
          dispatch(deleteCollectionFromCollection({tcId:bookmarked.id})).then(res=>checkResult(res,payload=>{
    setBookmarked(null)

   },err=>{
    setError(err.message)
   })
)
}
}

const checkFound=()=>{
    
    if(currentProfile && currentProfile.profileToCollections){
   let archive = currentProfile.profileToCollections.find(col=>col.type=="archive")

    if(book&&book.parentCollections){
 
           
            
         let found = book.parentCollections.find(ptc=>ptc.parentCollectionId==archive.collection.id)

            // setIsArchived(found)
            setBookmarked(found)
            }
 
    }
}
 

useLayoutEffect(()=>{
    checkFound()
},[book])
const description = (book)=>{return !isPhone&&!isGrid?book.description && book.description.length>0?
    <div id="book-description" className={`text-emerald-700 min-h-12 pt-4 px-3 rounded-t-lg`}>
        <h6 className={`text-emerald-700 ${isGrid?isPhone?" w-grid-mobile-content ":" w-grid ":isHorizPhone?" w-page-content ":" w-page-mobile-content px-4 "} open-sans-medium text-left `}>
            {book.description}
        </h6>
    </div>:null:null}

    useLayoutEffect(()=>{
        soCanUserEdit()

    },[book])
  
 const BookmarkBtn = ({ book }) => {
  let title = book?.title.length > 23 ? book?.title.slice(0, 20) + "..." : book?.title;

  return (
    <div
      className={`flex justify-between items-center py-2 rounded-b-lg bg-bleuSea bg-opacity-10  px-3  px-2 w-[100%]`}
    >
      {/* Profile Circle on left, hide if small phone in grid */}
      {!(isPhone && isGrid) && (
        <ProfileCircle isGrid={isGrid} color="emerald-700" profile={book.profile} />
      )}

      {/* Title + Bookmark */}
      <div className="flex-1 flex justify-end items-center  px-2 gap-2 overflow-hidden">
        <h6
          className="text-emerald-700 open-sans-medium text-[0.7rem] truncate cursor-pointer"
          onClick={() => router.push(Paths.collection.createRoute(book.id))}
        >
          {title}
        </h6>
        <IonImg
          onClick={handleBookmark}
          src={bookmarked ? bookmarkfill : bookmarkoutline}
          className="w-4 h-4 cursor-pointer"
        />
      </div>
    </div>
  );
};

 
   
    const handleBookmark =debounce((e)=>{
        if(currentProfile){
        e.preventDefault()
        if(bookmarked){
                deleteBtc()
        }else{
         let archive =   currentProfile.profileToCollections.find(col=>col && col.collection && col?.collection?.title.toLowerCase()=="archive").collection
       
         if(archive.id&&book.id){
           
           dispatch(addCollectionListToCollection({id:archive.id,list:[book.id],profile:currentProfile})).then(res=>{
            checkResult(res,payload=>{
                    const {collection}=payload
                    const marked = collection.parentCollections.find(col=>col.parentCollectionId==archive.id)
            
                    setBookmarked(marked)
                },err=>{

            })
           })
            }else{
                setError("Error with Archive Collection")
            }
        }}else{
            
            setError("Please Login")
        }
          },10)


if(!book){
    return<span className={`skeleton mt-2 shadow-md overflow-clip sm:max-w-[50em] w-[100%] w-[94vw]  rounded-box flex flex-col bg-emerald-100`}/>
}
    
        return(
            <div className='bg-blueSea bg-opacity-10 w-[100%] rounded-lg '>
    


        {description(book)}
    
            <Carousel book={book}/>

                <BookmarkBtn book={book}/> 
              
</div>

     )

}


export default BookDashboardItem

