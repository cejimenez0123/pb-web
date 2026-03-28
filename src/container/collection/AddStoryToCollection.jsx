// import  { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
// import {
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonText,
//   IonSkeletonText,
//   IonList,
//   IonButtons,
//   IonBackButton,
//   useIonRouter,
// } from "@ionic/react";
// import { useDispatch, useSelector } from "react-redux";
// import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
// import AddToItem from "../../components/collection/AddToItem";
// import checkResult from "../../core/checkResult";
// import Context from "../../context";
// import ErrorBoundary from "../../ErrorBoundary";
// import { getStory } from "../../actions/StoryActions";
// import {
//   fetchCollectionProtected,
//   setCollections,
// } from "../../actions/CollectionActions";
// import Paths from "../../core/paths";
// import { Preferences } from "@capacitor/preferences";
// import { useParams } from "react-router";
// import { useDialog } from "../../domain/usecases/useDialog";
// import { getCurrentProfile } from "../../actions/UserActions";


// function toTitleCase(str) {
//   return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
//     return match.toUpperCase();
//   });
// }

// export default function AddStoryToCollectionContainer(props) {
//   const { setError,  seo, setSeo } = useContext(Context);
//   const {currentProfile} = useSelector(state=>state.users)
//   // const dialog = useSelector(state=>state.users.dialog)
//   const {dialog,openDialog,closeDialog,resetDialog}=useDialog()
//   const pathParams = useParams()
//   const { id, type } = pathParams;

//   const dispatch = useDispatch();
//   const router = useIonRouter()
//   const [token,setToken]=useState(null)
//   const collectionInView = useSelector((state) => state.books.collectionInView);
//   const pageInView = useSelector((state) => state.pages.pageInView);
//   const [search, setSearch] = useState("");
//   const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);


//   const rawCollections = useSelector((state) => state.books.collections) || [];
//   useEffect(()=>{
//     closeDialog()
//   },[])
//   const collections = useMemo(() => {
//     return rawCollections
//       .filter((col) => col && col.type && col.type !== "feedback")
//       .filter((col) => {
//         if (!col) return false;
//         if (item && item.id === col.id) return false; // exclude current item
//         if (search && search.length > 0)
//           return col.title.toLowerCase().includes(search.toLowerCase());
//         return true;
//       });
//   }, [rawCollections, item, search]);

//     useLayoutEffect(()=>{
//         Preferences.get({key:"token"}).then(tok=>setToken(tok.value))
//     },[])
//   // Update SEO for page
//   useEffect(() => {
//     if (pageInView) {
//       let seoUpdate = {
//         ...seo,
//         title: `Plumbum Add (${pageInView.title}) to Collection`,
//         description: "Explore events, workshops, and writer meetups on Plumbum.",
//       };
//       setSeo(seoUpdate);
//     }
    
//   }, []);
//   const openNewCollectionForm=()=>{

// let dia = {...dialog}
//   dia.text = <CreateCollectionForm 
//   initPages={[pageInView]}
//   onClose={()=>{
//                    resetDialog()
//                     }}/>  
//                     dia.title="Create Collection"
//    dia.isOpen = true
  
//    dia.agree=null
//    dia.agreeText=null
//    dia.disagreeText = "Close"             
//  openDialog(dia)
//     //               
//   }
//   useEffect(() => {
//     // if (currentProfile) {
   
//     currentProfile &&  dispatch(setCollections({ collections: currentProfile.collections }));
//     // }

//   }, [currentProfile,collectionInView,pageInView]);
//   useEffect(()=>{
//     dispatch(getCurrentProfile())
//     getContent()
//   },[])
 

//   const getContent = () => {
//     console.log("FDFD")
//     switch (type) {
//       case "story":
//         dispatch(getStory({ id })).then((res) => {
//           checkResult(
//             res,
//             (payload) => {
//               setItem(payload.story);
//             },
//             (err) => {
//               setError(err.message);
//             }
//           );
//         });
//         break;
//       case "collection":
//         dispatch(fetchCollectionProtected({ id })).then((res) => {
//           checkResult(
//             res,
//             (payload) => {
//               setItem(payload.collection);
//             },
//             (err) => {
//               setError(err.message);
//             }
//           );
//         });
//         break;
//       default:
//         break;
//     }
//   };

//   // Handle search input changes
//   const handleSearch = (value) => {
//     setSearch(value);
//   };

//   // Render loading skeleton if no item available
//   if (!item) {
//     return (
//       <IonContent fullscreen={true} className="ion-padding" scrollY>
//         <IonSkeletonText animated style={{ width: "50em", height: 150, margin: "2rem auto", borderRadius: 18 }} />
//         <IonSkeletonText animated style={{ width: "50em", height: 400, margin: "2rem auto", borderRadius: 18 }} />
//       </IonContent>
//     );
//   }
//           const handleBack = (e) => {
//     e.preventDefault();
//     if (window.history.length > 1) {
//           router.goBack()
//     } else {
//       router.push(Paths.discovery);
//     }
//   };

  
//   return (
//     <ErrorBoundary>
//       <IonContent fullscreen={true}className="ion-padding pt-12 ion-text-emerald-800" scrollY >

//       <div className="flex flex-col max-w-[50em] mx-auto ">
//             <div>{collectionInView.purpose??""}</div>
//             <div className="flex flex-row">
//            <div
//             className="btn cursor-pointer rounded-full bg-emerald-900 px-6 py-3 text-white text-center  select-none transition hover:bg-emerald-800"
//             onClick={() => openNewCollectionForm()}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenDialog(true); }}
//             style={{ userSelect: "none" }}
//           >
//             <IonText>New Collection</IonText>
//           </div>
//           <div
//             className="btn mx-4 cursor-pointer max-w-[50em] rounded-full bg-emerald-900 px-6 py-3 text-white text-center  select-none transition hover:bg-emerald-800"
//             onClick={() => item.storyIdList?router.push(Paths.collection.createRoute(id)):router.push(Paths.page.createRoute(id))}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenDialog(true); }}
//             style={{ userSelect: "none" }}
//           >
//             <IonText>View {item.storyIdList?item?.title.slice(0,10):"Story"}</IonText>
            
//           </div>
//           </div>
//           </div>
//         <div
//           className="rounded-lg max-w-[50em] mx-auto  mt-8 mb-4 px-2"
        
//         >
//           <div className="flex flex-col w-full pb-6 mx-auto sm:w-[50em] pt-4">
//             <h6 className="text-xl font-bold my-auto  ml-4 lora-medium font-bold">Your Collections</h6>
//             <label className="flex my-2 sm:w-[50em] max-w-[90vw] mx-auto border-2 border-emerald-600 rounded-full items-center px-3">
//               <IonText className="text-emerald-800 mont-medium mr-2 flex-shrink-0">Search:</IonText>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="flex-grow px-2 py-1 rounded-full text-sm bg-transparent text-emerald-800 outline-none"
//                 placeholder="Search collections"
//                 aria-label="Search Collections"
//               />
//             </label>
//           </div>
// <div className="sm:max-w-[50em] mx-auto sm:overflow-y-auto">
//           <IonList>
//             {collections.map((col, i) => (
//               <AddToItem key={col.id || i} item={item} col={col} />
//             ))}
//     </IonList>
//     </div>
//         </div>
//       </IonContent>
//     </ErrorBoundary>
//   );
// }

import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonText,
  IonSkeletonText,
  IonList,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonLabel,
  IonSearchbar,
  useIonRouter,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import CreateCollectionForm from "../../components/collection/CreateCollectionForm";
import AddToItem from "../../components/collection/AddToItem";
import checkResult from "../../core/checkResult";
import Context from "../../context";
import ErrorBoundary from "../../ErrorBoundary";
import { getStory } from "../../actions/StoryActions";
import {
  fetchCollectionProtected,
  setCollections,
} from "../../actions/CollectionActions";
import Paths from "../../core/paths";
import { Preferences } from "@capacitor/preferences";
import { useParams } from "react-router";
import { useDialog } from "../../domain/usecases/useDialog";
import { getCurrentProfile } from "../../actions/UserActions";
import { PageType } from "../../core/constants";
import truncate from "html-truncate";

export default function AddStoryToCollectionContainer() {
  const { setError, seo, setSeo } = useContext(Context);
  const { currentProfile } = useSelector(state => state.users);
  const { dialog, openDialog, closeDialog, resetDialog } = useDialog();

  const { id, type } = useParams();
  const dispatch = useDispatch();
  const router = useIonRouter();

  const [token, setToken] = useState(null);
  const [search, setSearch] = useState("");

  const collectionInView = useSelector((state) => state.books.collectionInView);
  const pageInView = useSelector((state) => state.pages.pageInView);

  const [item, setItem] = useState(type === "collection" ? collectionInView : pageInView);

  const rawCollections = useSelector((state) => state.books.collections) || [];

  // Close dialog on mount
  useEffect(() => {
    closeDialog();
  }, []);

  // Memo collections
  const collections = useMemo(() => {
    return rawCollections
      .filter((col) => col && col.type && col.type !== "feedback")
      .filter((col) => {
        if (!col) return false;
        if (item && item.id === col.id) return false;
        if (search) return col.title.toLowerCase().includes(search.toLowerCase());
        return true;
      });
  }, [rawCollections, item, search]);

  useLayoutEffect(() => {
    Preferences.get({ key: "token" }).then(tok => setToken(tok.value));
  }, []);

  useEffect(() => {
    if (pageInView) {
      setSeo({
        ...seo,
        title: `Add ${pageInView.title} to Collection`,
        description: "Organize your stories into collections.",
      });
    }
  }, []);

  useEffect(() => {
    if (currentProfile) {
      dispatch(setCollections({ collections: currentProfile.collections }));
    }
  }, [currentProfile, collectionInView, pageInView]);

  useEffect(() => {
    dispatch(getCurrentProfile());
    getContent();
  }, []);

  const getContent = () => {
    switch (type) {
      case "story":
        dispatch(getStory({ id })).then(res =>
          checkResult(res, payload => setItem(payload.story), err => setError(err.message))
        );
        break;
      case "collection":
        dispatch(fetchCollectionProtected({ id })).then(res =>
          checkResult(res, payload => setItem(payload.collection), err => setError(err.message))
        );
        break;
      default:
        break;
    }
  };

  const openNewCollectionForm = () => {
    let dia = { ...dialog };
    dia.text = (
      <CreateCollectionForm
        initPages={[pageInView]}
        onClose={() => resetDialog()}
      />
    );
    dia.title = "New Collection";
    dia.isOpen = true;
    dia.disagreeText = "Close";
    openDialog(dia);
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.goBack();
    } else {
      router.push(Paths.discovery);
    }
  };

  if (!item) {
    return (
      <IonContent             style={{ "--background": "#f4f4e0" }} fullscreen className="ion-padding">
        <IonSkeletonText animated style={{ height: 120, marginBottom: 16 }} />
        <IonSkeletonText animated style={{ height: 300 }} />
      </IonContent>
    );
  }

  return (
    <ErrorBoundary>

      {/* Native iOS Header */}
  

      <IonContent             style={{ "--background": "#f4f4e0" }} fullscreen>

        <div className="max-w-[50em] mx-auto px-4 py-4">

          {/* Context Info */}
          <IonText className="text-sm text-gray-500">
            {collectionInView?.purpose ?? ""}
          </IonText>
         {item &&<div> <IonText className="text-[2em]">{item.title}</IonText>
         <IonText>{item.author && item.type==PageType.text && <div dangerouslySetInnerHTML={{__html:truncate(item.data,75,[])}}/>}</IonText></div>}

          {/* View Item Button */}
          <div className="mt-4 rounded-full">
            <button
              expand="block"
              // style={{background:"transparent"}}
              // style={{cornerRadius:"100%"}}
              className="rounded-full bg-blueSea text-white text-[1.6em] w-[100%] btn"
              onClick={() =>
                item.storyIdList
                  ? router.push(Paths.collection.createRoute(id))
                  : router.push(Paths.page.createRoute(id))
              }
            >
              View {item.storyIdList ? item?.title?.slice(0, 10) : "Story"}
            </button>
          </div>
<div className="bg-cream">
        
          <div   className=" bg-cream">
  <IonList style={{ background:"transaprent",paddingTop:0,marginTop:0}} inset={false}>
<div className="bg-cream">
    <IonItem lines="none" style={{ "--background": "#f4f4e0" }} >
      <IonSearchbar
        value={search}
        onIonInput={(e) => setSearch(e.detail.value)}
        placeholder="Search collections"
      />
    </IonItem>

    {collections.map((col, i) => (
      <AddToItem key={col.id || i} item={item} col={col} />
    ))}
</div>
  </IonList>
</div>
{/* </div> */}
        </div>
</div>
      </IonContent>
    </ErrorBoundary>
  );
}