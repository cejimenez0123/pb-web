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
  IonText,
  IonSkeletonText
} from "@ionic/react";
import { useIonRouter } from '@ionic/react';
 function BookListItem({ book }) {
  const dispatch = useDispatch();
  const router = useIonRouter()

  useLayoutEffect(() => {
    initGA();
  }, []);

const navigateToBook = async () => {
  if (!book) return;
  await dispatch(clearPagesInView());
  await dispatch(setCollections({ collections: [] }));
  await dispatch(setCollectionInView({ collection: book }));
  router.push(Paths.collection.createRoute(book.id), 'forward', 'replace');
  sendGAEvent(
    "Navigate",
    `Navigate to Collection ${JSON.stringify({ id: book.id, title: book?.title })}`
  );
};
  if(!book){

    return <BookListItemShadow/>
  }
if(book){
  return (
    <IonCard
    

     className="min-h-[10em] group-hover:h-[13rem] overflow-hidden relative btn hover:h-[13rem] transition-all duration-300 w-[16rem]  boreder-blueSea boder-opacity-10 bg-blueSea bg-opacity-10 text-emerald-800 rounded-lg text-ellipsis "
    >
      <div        onClick={navigateToBook} className="h-16"> 
    <div className="absolute top-0 pt-2 left-3 right-3 z-10">
        <IonCardHeader className="p-0">

        <IonCardTitle
          className="font-bold text-emerald-800 text-[1.125rem] truncate"
          
    >{book?.title.slice(0, 30)}{book?.title.length > 30 && "..."}</IonCardTitle>
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

function BookListItemShadow() {
  return (
    <IonCard
      className="min-h-[10em] min-w-[16rem] overflow-hidden relative rounded-lg bg-blueSea bg-opacity-10 text-emerald-800 animate-pulse"
    >
      {/* Title placeholder */}
      <div className="absolute top-2 left-3 right-3 z-10">
        <IonCardHeader className="p-0">
          <IonCardTitle className="truncate">
            <IonSkeletonText animated style={{minWidth:"10em", width: '60%', height: '1.25rem' }} />
          </IonCardTitle>
        </IonCardHeader>
      </div>

      {/* Content placeholder */}
      <IonCardContent className="mt-1 bottom-2">
        <div className="max-h-[5rem] overflow-hidden">
          <IonSkeletonText animated style={{ width: '100%', height: '0.75rem', marginBottom: 4 }} />
          <IonSkeletonText animated style={{ width: '90%', height: '0.75rem', marginBottom: 4 }} />
          <IonSkeletonText animated style={{ width: '80%', height: '0.75rem' }} />
        </div>
      </IonCardContent>
    </IonCard>
  );
}
export {BookListItem,BookListItemShadow}