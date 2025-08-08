import { useNavigate } from "react-router-dom";
import Paths from "../core/paths";
import { clearPagesInView } from "../actions/PageActions.jsx";
import { useDispatch } from "react-redux";
import { setCollectionInView, setCollections } from "../actions/CollectionActions";
import { useLayoutEffect } from "react";
import { initGA, sendGAEvent } from "../core/ga4.js";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from "@ionic/react";

export default function BookListItem({ book }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    initGA();
  }, []);

  const navigateToBook = () => {
    dispatch(clearPagesInView());
    dispatch(setCollections({ collections: [] }));
    dispatch(setCollectionInView({ collection: book }));
    navigate(Paths.collection.createRoute(book.id));
    sendGAEvent(
      "Navigate",
      `Navigate to Collection ${JSON.stringify({ id: book.id, title: book.title })}`
    );
  };

  return (
    <IonCard
    
      onClick={navigateToBook}
      className="h-[10rem] btn hover:h-[12rem] transition-all duration-300 min-w-[14rem] max-w-[16rem] border-0 bg-emerald-700 text-white rounded-lg shadow-md overflow-hidden group"
    >
      <IonCardHeader className="px-3 py-1 bg-transparent">
        <IonCardTitle
          className="font-bold  mb-2 truncate"
          
    >{book.title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent className="px-3 py-1 bg-transparent">
        {/* Purpose text: clipped until hover */}
        <div
          className="overflow-hidden max-h-[6rem] group-hover:max-h-[10rem] transition-all duration-300"
          style={{ textOverflow: "ellipsis" }}
        >
          <IonText className="open-sans-medium text-sm block text-left text-white p-1">
            {book.purpose}
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
}

// import {useNavigate} from "react-router-dom"
// import Paths from "../core/paths"

// import { clearPagesInView } from "../actions/PageActions.jsx"
// import { useDispatch } from "react-redux"
// import { setCollectionInView } from "../actions/CollectionActions"
// import { setCollections } from "../actions/CollectionActions"
// import { useLayoutEffect } from "react"
// import { initGA, sendGAEvent } from "../core/ga4.js"
// function BookListItem({book}){
//     const dispatch = useDispatch()
//     const navigate = useNavigate()
//     useLayoutEffect(()=>{
//         initGA()
//     })
//     const navigateToBook = ()=>{  
//         dispatch(clearPagesInView())
//         dispatch(setCollections({collections:[]}))
//         dispatch(setCollectionInView({collection:book}))
//         navigate(Paths.collection.createRoute(book.id))
//         sendGAEvent("Navigate",`Navigate to Collection ${JSON.stringify({id:book.id,title:book.title})}`)
  
//     }
//     return (

// <div onClick={navigateToBook} className=" h-[10rem] hover:h-[12rem] text-left shadow-md min-w-[12rem] max-w-[13rem] mx-8  rounded-lg  bg-emerald-700">
// <div  
// className=" text-white h-48 bg-transparent ">
//  <div className="px-3 py-3">
//     <div className="font-bold text-l lora-bold b-2">{book.title}</div>
    
//         <div className=" p-2 overflow-hidden max-h-[6rem] hover:max-h-[10rem] open-sans-medium text-ellipsis ">
//      <h6 className="text-left  text-white text-sm  p-1 ">{book.purpose}</h6> 
//      </div>
   
//   </div>
//   </div>
// </div>
  
//     )
    
// }
// export default BookListItem