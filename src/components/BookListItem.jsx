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
import { useIonRouter } from '@ionic/react';
export default function BookListItem({ book }) {
  const dispatch = useDispatch();
  const router = useIonRouter()
console.log(book)
  useLayoutEffect(() => {
    initGA();
  }, []);

  const navigateToBook = () => {
    if(book){
    dispatch(clearPagesInView());
    dispatch(setCollections({ collections: [] }));
    dispatch(setCollectionInView({ collection: book }));
    router.push(Paths.collection.createRoute(book.id),);
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
     className="min-h-[10em] group-hover:h-[13rem] overflow-hidden relative btn hover:h-[13rem] transition-all duration-300 w-[16rem]  boreder-blueSea boder-opacity-10 bg-blueSea bg-opacity-10 text-emerald-800 rounded-lg text-ellipsis "
    >
      <div className="h-16"> 
    <div className="absolute top-0 pt-2 left-3 right-3 z-10">
        <IonCardHeader className="p-0">

        <IonCardTitle
          className="font-bold text-emerald-800 text-[1.125rem] truncate"
          
    >{book.title.slice(0, 30)}{book.title.length > 30 && "..."}</IonCardTitle>
    </IonCardHeader>
    </div>
     
      </div>
   
        <IonCardContent className="mt-1 bottom-2">
    <div
      className="transition-all duration-300 overflow-hidden max-h-[5rem] group-hover:max-h-[10rem]"
    >
      <IonText className="text-sm block text-left text-emerald-800">
       

{book.purpose.length<=65? book.purpose.slice(0,65):book.purpose.slice(0,65)+"..."}         
 </IonText>
        </div>
      </IonCardContent>
      {/* </div> */}
    </IonCard>
  );
}}

