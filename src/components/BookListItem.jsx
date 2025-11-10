// import { useNavigate } from "react-router-dom";
// import Paths from "../core/paths";
// import { clearPagesInView } from "../actions/PageActions.jsx";
// import { useDispatch } from "react-redux";
// import { setCollectionInView, setCollections } from "../actions/CollectionActions";
// import { useLayoutEffect } from "react";
// import { initGA, sendGAEvent } from "../core/ga4.js";
// import {
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonCardContent,
//   IonText
// } from "@ionic/react";

// export default function BookListItem({ book }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useLayoutEffect(() => {
//     initGA();
//   }, []);

//   const navigateToBook = () => {
//     if (!book) return;
//     dispatch(clearPagesInView());
//     dispatch(setCollections({ collections: [] }));
//     dispatch(setCollectionInView({ collection: book }));
//     navigate(Paths.collection.createRoute(book.id));
//     sendGAEvent(
//       "Navigate",
//       `Navigate to Collection ${JSON.stringify({ id: book.id, title: book.title })}`
//     );
//   };

//   if (!book) return <div>Loading...</div>;

//   // truncate purpose string safely
//   const truncatePurpose = (str, max = 80) =>
//     str.length > max ? str.slice(0, max) + "..." : str;

//   return (
//     <div className="group w-[16rem]">
//       <IonCard
//         onClick={navigateToBook}
//         className="min-h-[10em] overflow-hidden relative bg-emerald-700 text-white rounded-lg shadow-md transition-all duration-300 group-hover:h-[13rem] cursor-pointer"
//       >
//         <div className="absolute top-0 pt-2 left-3 right-3 z-10">
//           <IonCardHeader className="p-0">
//             <IonCardTitle className="font-bold truncate">
//               {book.title}
//             </IonCardTitle>
//           </IonCardHeader>
//         </div>

//         <IonCardContent className="mt-16">
//           <div className="transition-all duration-300">
//             <IonText className="open-sans-medium text-sm block text-left text-white overflow-hidden">
//               {truncatePurpose(book.purpose || "")}
//             </IonText>
//           </div>
//         </IonCardContent>
//       </IonCard>
//     </div>
//   );
// }

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
    if(book){
    dispatch(clearPagesInView());
    dispatch(setCollections({ collections: [] }));
    dispatch(setCollectionInView({ collection: book }));
    navigate(Paths.collection.createRoute(book.id));
    sendGAEvent(
      "Navigate",
      `Navigate to Collection ${JSON.stringify({ id: book.id, title: book.title })}`
    );
  }
  };
  if(!book){

    return <div>Loading...</div>
  }
if(book){
  return (
    <IonCard
    
      onClick={navigateToBook}
      className="min-h-[10em] group-hover:h-[13rem] overflow-hidden relative btn hover:h-[13rem] transition-all duration-300 w-[16rem]  bg-emerald-700 text-white rounded-lg shadow-md text-ellipsis "
    >
      <div className="h-16"> 
    <div className="absolute top-0 pt-2 left-3 right-3 z-10">
        <IonCardHeader className="p-0">

        <IonCardTitle
          className="font-bold truncate"
          
    >{book.title}</IonCardTitle>
    </IonCardHeader>
    </div>
     
      </div>
   
        <IonCardContent className="mt-1 bottom-2">
    <div
      className="transition-all duration-300 overflow-hidden max-h-[5rem] group-hover:max-h-[10rem]"
    >
      <IonText className="open-sans-medium text-sm block text-left text-white">
       

{book.purpose}          </IonText>
        </div>
      </IonCardContent>
      {/* </div> */}
    </IonCard>
  );
}}

