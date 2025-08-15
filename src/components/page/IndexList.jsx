
import InfiniteScroll from "react-infinite-scroll-component"
import IndexItem from "./IndexItem"
import React, { useState, useEffect } from 'react';
import {

  IonList,
  IonItem,

} from '@ionic/react';
const IndexList = ({ items, handleFeedback }) => {
  if (!items) {
    return (
      <div className="flex min-h-36">
        <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
      </div>
    );
  }
  return<IonList 
  style={{minHeight:"30rem"}}>
  {items && items.length? items.filter(item=>item).map((item, i) => (
    <IonItem key={i + item.id}>
      <IndexItem page={item} item={item} handleFeedback={() => handleFeedback(item)} />
    </IonItem>
  )):[]}
</IonList>
 
                  }
 export default IndexList