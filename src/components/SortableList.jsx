
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function SortableList({ items, onOrderChange }) {
  
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
    const handleDelete = (index) => {
      const newList = listItems.filter((_, i) => i !== index);

      setListItems(newList);
      onOrderChange(newList);
    };
  
    return (
      <div className=" py-4 mx-auto">
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
                        className="flex justify-between w-[100%] items-center p-4 bg-transparent border-emerald-600 border-1 rounded-full shadow-md hover:bg-gray-100"
                      >
                        <h6 className="flex-grow text-emerald-800 text-left text-[1.2rem]">
                          {item.story?item.story.title:item.childCollection?item.childCollection.title:"Not found"}</h6>
                        <button
                          onClick={() => handleDelete(index)}
                          className="ml-2 px-2 py-1 text-red-500 bg-transparent  border-1 border-red-500 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
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
  };
  


  
