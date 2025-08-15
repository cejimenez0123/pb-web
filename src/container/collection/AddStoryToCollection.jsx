import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonSkeletonText,
  IonImg,
  IonList,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Dialog from "../../components/Dialog";
import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import loadingGif from "../../images/loading.gif";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ErrorBoundary from "../../ErrorBoundary";
import { getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  getMyCollections,
  setCollections,
} from "../../actions/CollectionActions";
import usePersistentMyCollectionCache from "../../domain/usecases/usePersistentMyCollectionCache";
import Paths from "../../core/paths";
import getLocalStore from "../../core/getLocalStore";

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}

export default function AddStoryToCollectionContainer(props) {
  const { setError, currentProfile, seo, setSeo } = useContext(Context);
  const dialog = useSelector(state=>state.users.dialog)
  const pathParams = useParams();
  const { id, type } = pathParams;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token,setToken]=useState(null)
  // Load cached collections persistently to avoid flicker
  const cachedCols = usePersistentMyCollectionCache(() => dispatch(getMyCollections({token})));

  // Redux selectors
  const collectionInView = useSelector((state) => state.books.collectionInView);
  const pageInView = useSelector((state) => state.pages.pageInView);

  // Local state
  const [hasMoreCol, setHasMoreCol] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);

  // Filtered collections excluding feedback and current item
  const collections = (useSelector((state) => state.books.collections) ?? cachedCols)
    .filter((col) => col && col.type && col.type !== "feedback")
    .filter((col) => {
      if (item && item.id === col.id) return false; // exclude current item
      if (search.length > 0) return col.title.toLowerCase().includes(search.toLowerCase());
      return true;
    });
    useLayoutEffect(()=>{
        getLocalStore("token").then(tok=>setToken(tok))
    },[])
  // Update SEO for page
  useEffect(() => {
    if (pageInView) {
      let seoUpdate = {
        ...seo,
        title: `Plumbum Add (${pageInView.title}) to Collection`,
        description: "Explore events, workshops, and writer meetups on Plumbum.",
      };
      setSeo(seoUpdate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openNewCollectionForm=()=>{
let dia = {...dialog}
  dia.text = <CreateCollectionForm onClose={()=>{
                      setOpenDialog(false)
                    }}/>  
                    dia.title="Create Collecition"
                
  
    //               
  }
  // Update redux collections when profile or id changes
  useLayoutEffect(() => {
    if (currentProfile) {
      dispatch(setCollections({ collections: currentProfile.collections }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile, id]);

  // Fetch correct item (story or collection) on mount/id/type change
  useLayoutEffect(() => {
    getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const getContent = () => {
    switch (type) {
      case "story":
        dispatch(getStory({ id })).then((res) => {
          checkResult(
            res,
            (payload) => {
              setItem(payload.story);
            },
            (err) => {
              setError(err.message);
            }
          );
        });
        break;
      case "collection":
        dispatch(fetchCollectionProtected({ id })).then((res) => {
          checkResult(
            res,
            (payload) => {
              setItem(payload.collection);
            },
            (err) => {
              setError(err.message);
            }
          );
        });
        break;
      default:
        break;
    }
  };

  // Handle search input changes
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Render loading skeleton if no item available
  if (!item) {
    return (
      <IonContent fullscreen className="ion-padding">
        <IonSkeletonText animated style={{ width: "96vw", height: 150, margin: "2rem auto", borderRadius: 18 }} />
        <IonSkeletonText animated style={{ width: "96vw", height: 400, margin: "2rem auto", borderRadius: 18 }} />
      </IonContent>
    );
  }

  return (
    <ErrorBoundary>
      <IonContent fullscreen className="ion-padding ion-text-emerald-800" style={{ minWidth: "320px" }}>
        <IonHeader translucent>
          <IonToolbar>
            <IonButtons>
              <IonBackButton defaultHref={Paths.collection.createRoute(id)}/>
            </IonButtons>
            <IonTitle className="ion-text-center">
              Add <strong>{item.title}</strong> to Collection
            </IonTitle>
          </IonToolbar>
        </IonHeader>
      <div className="flex flex-row">
            <div>{collectionInView.purpose}</div>
           <div
            className="btn cursor-pointer rounded-full bg-emerald-900 px-6 py-3 text-white text-center  select-none transition hover:bg-emerald-800"
            onClick={() => openNewCollectionForm()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenDialog(true); }}
            style={{ userSelect: "none" }}
          >
            <IonText>New Collection</IonText>
          </div>
          <div
            className="btn mx-4 cursor-pointer rounded-full bg-emerald-900 px-6 py-3 text-white text-center  select-none transition hover:bg-emerald-800"
            onClick={() => navigate(Paths.collection.createRoute(id))}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenDialog(true); }}
            style={{ userSelect: "none" }}
          >
            <IonText>View</IonText>
          </div>
          </div>
        <div
          className="border-b-2 border-emerald-600 rounded-lg mx-auto max-w-[1024px] md:w-page mt-8 mb-4 px-2"
          style={{ width: "96vw" }}
        >
          <div className="flex flex-col w-full pb-6 pt-4">
            <h6 className="text-xl font-bold my-auto ml-4 lora-medium font-bold">Your Collections</h6>
            <label className="flex my-2 w-[90%] mx-auto border-2 border-emerald-600 rounded-full items-center px-3">
              <IonText className="text-emerald-800 mont-medium mr-2 flex-shrink-0">Search:</IonText>
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-grow px-2 py-1 rounded-full text-sm bg-transparent text-emerald-800 outline-none"
                placeholder="Search collections"
                aria-label="Search Collections"
              />
            </label>
          </div>

          <IonList>
            {collections.map((col, i) => (
              <AddToItem key={col.id || i} item={item} col={col} />
            ))}
    </IonList>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

// import { useContext, useEffect, useLayoutEffect,useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate, useParams } from "react-router-dom"
// import { getStory } from "../../actions/StoryActions"
// import {   fetchCollectionProtected, getMyCollections, setCollections } from "../../actions/CollectionActions"
// import InfiniteScroll from "react-infinite-scroll-component"
// import CreateCollectionForm from "../../components/collection/CreateCollectionForm"
// // import {Dialog} from "@mui/material"
// import Dialog from "../../components/Dialog"
// import usePersistentMyCollectionCache from "../../domain/usecases/usePersistentMyCollectionCache"
// import { useMediaQuery } from "react-responsive"
// import checkResult from "../../core/checkResult"
// import loadingGif from "../../images/loading.gif"
// import Context from "../../context"
// import ErrorBoundary from "../../ErrorBoundary"
// import AddToItem from "../../components/collection/AddToItem"

// function toTitleCase(str) {
//   return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
//     return match.toUpperCase();
//   });
// }

// export default function AddStoryToCollectionContainer(props){
 
//   const{setError,currentProfile,seo,setSeo}=useContext(Context)
 
//     const pathParams = useParams()
//     const {id,type}=pathParams 
//     const dispatch = useDispatch()
//     const cols=usePersistentMyCollectionCache(()=>dispatch(getMyCollections()))
//     const [hasMoreCol,setHasMoreCol]=useState(false)
//     const [openDialog,setOpenDialog]=useState(false)
//     const [search,setSearch]=useState("")
//     const collectionInView = useSelector(state=>state.books.collectionInView)
//     const pageInView = useSelector(state=>state.pages.pageInView)
//     const [item,setItem]=useState(type=="collection"?collectionInView:pageInView)
//     const collections = useSelector(state=>state.books.collections??cols).
//     filter(col=>col )
//     .filter(col=>{return col && col.type && col.type!="feedback"}).filter(col=>{
//       if(item && item.id==col.id){
//         return false
//       }
//       if(search.length>0){
//        return col.title.toLowerCase().includes(search.toLowerCase())
//       }else{
//        return true
//       }
  
//      })
//      useEffect(()=>{
//       if(pageInView){
//         let soo = seo
//           soo.title=`Plumbum Add (${pageInView.title}) to Collection `
//           soo.description="Explore events, workshops, and writer meetups on Plumbum."
//           setSeo(soo)
//      }
//      },[])
//     useLayoutEffect(()=>{
//       if(currentProfile){
//         dispatch(setCollections({collections: currentProfile.collections}))
  
//       }
//    },[currentProfile,id])
    
        
//     const handleSearch = (value)=>{
//       setSearch(value)
//   }
   
//     useLayoutEffect(()=>{
// getContent()
//     },[id])

//     const getContent=()=>{
//       switch(type){
//         case"story":      
//         dispatch(getStory({id:pathParams.id})).then(res=>{
//           checkResult(res,payload=>{
//             setItem(payload.story)
         
//           },err=>{
//       setError(err.message)
//           })
//         })
//       case"collection":dispatch(fetchCollectionProtected({id:id})).then(res=>{
//         checkResult(res,payload=>{
//           setItem(payload.collection)
//         },err=>{
//           setError(err.message)
//         })
//       })
//       }
  
     
   
//     }
    
// if(!item){
//   return<div>
//     <div className="w-[96vw] bg-slate-100 skeleton mx-auto md:w-info m-2 h-info"/>
//     <di className="w-[96vw] bg-slate-100 skeleton mx-auto md:w-page h-page"/>
//   </div>
// }
// return(<ErrorBoundary><div className="text-emerald-800 w-[100vw]">
           
//             <div className="border-2 mt-16 w-[96vw] h-info mx-auto md:w-info  text-left border-emerald-600 p-8   rounded-lg">
//             <h6 className="text-xl font-bold pb-2 lora-medium  font-bold">Add <strong>{item.title} </strong>to Collection</h6>

            
//               <button  
//               onClick={()=>setOpenDialog(true)}
//               className="bg-emerald-900 text-white rounded-full">New Collection</button>
//               </div>
//             <div>
//                 </div>
//                 <div className="border-b-2   max-w-[96vw] md:w-page md:px-2  mx-auto border-emerald-600  md:mb-4 mb-1 mt-16 text-left   mx-2 rounded-lg">
//                     <div className="flex flex-col  pb-8  pt-4  w-[100%]">
//                     <h6 className="text-xl font-bold my-auto ml-4 lora-medium font-bold">Your Collections</h6>
//                    <label className='flex my-auto w-[90%] mx-auto mt-4 mx-auto border-emerald-600 border-2 rounded-full my-1 flex-row '>
// <span className='my-auto text-emerald-800 mx-2 w-full mont-medium '> Search:</span>
//   <input type='text' value={search} onChange={(e)=>handleSearch(e.target.value)} className=' px-2  w-[95%] py-1 rounded-full text-sm bg-transparent my-1  text-emerald-800' />
//   </label></div>
                
//                     <InfiniteScroll
//                 className="scroll "
//                 dataLength={collections?collections.length:0}
//                 hasMore={hasMoreCol} // Replace with a condition based on your data source
//                 loader={<div><img src={loadingGif}/></div>}
//                 endMessage={
//                     <div className="flex ">
//                         <p className="text-emerald-800 mx-auto md:text-xl py-12 lora-medium">Fin </p>
//                     </div>
//                 }
//             >
//              {collections.map((col,i)=>{
// return <AddToItem key={i} item={item} col={col}/>


// })


// }

// </InfiniteScroll>

//                 </div>
//                 <div>
         
//               <Dialog isOpen={openDialog}
              
//               text={
//                 <CreateCollectionForm onClose={()=>{
//                   setOpenDialog(false)
//                 }}/>}/>
            


//                 </div>
          
//         </div>
//         </ErrorBoundary>)
    
    
// }