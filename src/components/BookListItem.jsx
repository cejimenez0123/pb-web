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
      className="min-h-[10em] group-hover:h-[11rem] relative btn hover:h-[11rem] transition-all duration-300 w-[16rem]  bg-emerald-700 text-white rounded-lg shadow-md text-ellipsis group"
    >
      <div className="h-16"> 
    <div className="absolute top-0 pt-2 left-3 right-3 z-10">
        <IonCardHeader className="p-0">

        <IonCardTitle
          className="font-bold truncate"
          
    >{book.title}</IonCardTitle>
    </IonCardHeader>
    </div>
      {/* </IonCardHeader> */}
      </div>
      <div className="  bottom-0 mt-2">
      <IonCardContent className="">  
        <div
          className=" transition-all h-[5rem] duration-300"
          style={{ textOverflow: "ellipsis" }}
        >
          <IonText        style={{ textOverflow: "ellipsis" }} className="open-sans-medium text-sm block text-left text-white ">
            {book.purpose}
          </IonText>
        </div>
      </IonCardContent>
      </div>
    </IonCard>
  );
}}

