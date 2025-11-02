import IndexItem from "./IndexItem"
import React, { useState, useEffect } from 'react';
import {

  IonList,
  IonItem,

} from '@ionic/react';
const IndexList = ({ items, handleFeedback ,type}) => {
  if (!items) {
    return (
      <div className="flex min-h-36">
        <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
      </div>
    );
  }
  return<IonList 
  className="overflow-visible"
  style={{minHeight:"40rem"}}>
  {items && items.length? items.filter(item=>item).map((item, i) => (
    <IonItem key={i + item.id}>
      <IndexItem page={item} item={item} type={type} typehandleFeedback={() => handleFeedback(item)} />
    </IonItem>
  )):[]}
</IonList>
 
                  }
 export default IndexList