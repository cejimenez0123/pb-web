import IndexItem from "./IndexItem"
import {

  IonList,
  IonItem,

} from '@ionic/react';
import "../../App.css"
const IndexList = ({ items, handleFeedback ,type}) => {
  if (!items) {
    return (
      <div className="flex min-h-36">
        <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
      </div>
    );
  }

return (
  <IonList className="!overflow-visible !bg-transparent">
    {items && items.length
      ? items
          .filter((item) => item)
          .map((item, i) => (
            // <IonItem
            //   key={i + item.id}
            //   lines="none"
            //   className="!bg-transparent !overflow-visible"
            // >
              <IndexItem
              key={i + item.id}
                page={item}
                item={item}
                type={type}
                handleFeedback={() => handleFeedback(item)}
              />
            // </IonItem>
          ))
      : null}
  </IonList>
);

 
                  }
 export default IndexList


 //   return<IonList 
//   className="overflow-visible "
//   >
//     <div className="min-h-[50rem]">
//   {items && items.length? items.filter(item=>item).map((item, i) => (
//     <IonItem key={i + item.id}>
//       <IndexItem page={item} item={item} type={type} handleFeedback={() => handleFeedback(item)} />
//     </IonItem>
//   )):[]}</div>
// </IonList>