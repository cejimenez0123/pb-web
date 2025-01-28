
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dragHandle from "../images/icons/drag_handle.svg"
export default function SortableList({ items, onOrderChange, }) {
  
    const [listItems,setListItems]=useState(items)
    useEffect(()=>{
      setListItems(items)
    },[items])
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
    const handleDelete = (e,index) => {
      e.preventDefault()
      const newList = listItems.filter((_, i) => i !== index);

      setListItems(newList);
      onOrderChange(newList);
    };
  if(listItems.length>0){
    return (
      <div className=" py-4 mx-auto w-[96vw] md:w-page">
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
                    {(provided) => {


                      return(<li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-[96%] mx-auto items-center text-emerald-800  py-4 bg-transparent border-emerald-600 border-2 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <div className=" flex justify-between mr-3">
                        <img src={dragHandle} className="my-auto ml-4"/>
                        <div className="justify-between  flex-grow flex flex-row mr-4">
                        <h6 className=" text-emerald-800 text-nowrap text-left my-auto max-w-[13em] overflow-hidden text-ellipsis sm:text-[1.2rem]">
                          {item.story?item.story.title:item.childCollection?item.childCollection.title:"Not found"}</h6>
                        <button
                          onClick={(e) => handleDelete(e,index)}
                          className="ml-2 px-2 py-1 text-red-500 rounded-full open-sans-medium px-2 bg-transparent  border-1 border-red-500 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        </div>
                        </div>
                      </li>
                    )}}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }else{
    <div className="my-4 min-h-24 text-emerald-800">
     <h6> You can do so much with this space</h6>
    </div>
  }
  };
  


  
