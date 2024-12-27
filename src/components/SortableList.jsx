
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  


  
