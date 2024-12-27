<<<<<<< HEAD
// //import {SortableContainer, SortableElement,sortableHandle} from 'react-sortable-hoc';
// import {arrayMoveImmutable,arrayMoveMutable }from 'array-move';
// import { Remove,DragIndicator } from "@mui/icons-material"
// import {IconButton} from "@mui/material"
// import {  useState } from 'react';
// import { useEffect } from 'react';
// const SortableItem = SortableElement(({value,handleRemove,index}) =>{
//     const {item } = value
//     if(item){
           
            
//         return(
// <div>
//             <div key={`${value.uId}`}className="sort-item">
//             <h5>{item.title}</h5>
//             <div className="button-row">
//        <IconButton onClick={()=>{
//         handleRemove(index)}}>
//         <Remove/>
//        </IconButton>
//        <DragHandle/>
//             </div>
//         </div>
//         </div>)
        
//     }else{

//     return(
//     <div><div key={`${value.uId}`} className="sort-item">  
//             <h1>Page Deleted</h1>
//            </div> </div>
//     )
//     }
//     });
//     const targetHasProp = (
//         target,
//         hasProp,
//       ) => {
//         while (target) {
//           if (hasProp(target)) {
//             return true;
//           }
      
//           target = target.parentElement;
//         }
//         return false;
//       };
// const shouldCancelSortStart = (coach)=> {
//         return targetHasProp(coach.target , (el) => {
//           return ['button'].includes(el.tagName.toLowerCase());
//         });
//       };
// const SortableList = SortableContainer(({items,handleRemove}) => {
//   return (
//     <ul>
//       {items.map((value, index) => {
//        return( <div>
//         <SortableItem key={`item-`+value.uId} handleRemove={()=>{
         
//             handleRemove(value,index)
//         }} index={index} idx={index} value={value} />
//         </div> )})}
//     </ul>
//   );
// });
// const DragHandle = sortableHandle(() => <IconButton>
// <DragIndicator/>
// </IconButton>);



const SortableComponent = ({items, getItems }) => {
  // const [newItems, setNewItems] = useState(items);

  // useEffect(()=>{
  //   getItems(newItems)
  // },[newItems])
  // const onSortEnd = ({ oldIndex, newIndex }) => {
  //   setNewItems((prevState) => {
  //      let list = prevState
  //       return arrayMoveImmutable(list, oldIndex, newIndex)
  //   });
  // };
  // const remove = (value) => {
  //   const newitems = newItems.filter((item) => item !== value);
  //   setNewItems(newitems);
  // };
=======

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
>>>>>>> prisma

export default function SortableList({ items, onOrderChange }) {
    const [listItems,setListItems]=useState(items)
    // Handle drag and drop
    const handleOnDragEnd = (result) => {
      if (!result.destination) return;
  
      // Rearrange the list
      const newList = Array.from(items);
      const [movedItem] = newList.splice(result.source.index, 1);
      newList.splice(result.destination.index, 0, movedItem);
  
      setListItems(newList);
      onOrderChange(newList);
    };
  
    // Handle delete item
    const handleDelete = (index) => {
      const newList = listItems.filter((_, i) => i !== index);
      setListItems(newList);
      onOrderChange(newList);
    };
  
    return (
      <div className="p-4 max-w-md mx-auto">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="sortableList">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {listItems && listItems.map((item, index) => (

                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center p-4 bg-transparent border-white border rounded-lg shadow-md hover:bg-gray-100"
                      >
                        <span className="flex-grow text-white">{item.title}</span>
                        <button
                          onClick={() => handleDelete(index)}
                          className="ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  };
  
  // Usage Example

<<<<<<< HEAD
  return (
    <div>
      {/* <SortableList
        axis="y"
        useDragHandle
        items={newItems}
        shouldCancelSortStart={shouldCancelSortStart}
        onSortEnd={onSortEnd}
        handleRemove={(value) => remove(value)}
      /> */}
    </div>
  );
};


export default SortableComponent
=======
  
>>>>>>> prisma
