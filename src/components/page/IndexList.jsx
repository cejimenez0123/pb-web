import IndexItem from "./IndexItem"
import {

  IonList,
  IonItem,

} from '@ionic/react';
import "../../App.css"
const IndexList = ({ items, handleFeedback ,type}) => {
  if (!items && items.length) {
    return (
      <div className="flex min-h-36">
        <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
      </div>
    );
  }

return (
<IonList className="bg-transparent">
  {items && items.length
    ? items.map((item, i) => (
        <IndexItem
          key={i + item.id}
          page={item}
          item={item}
          type={type}
          handleFeedback={() => handleFeedback(item)}
        />
      ))
    : <h2 className="mx-auto my-8 text-emerald-800">Room for possibility</h2>
  }
</IonList>

);

 
                  }
 export default IndexList

