import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import dragHandle from "../images/icons/drag_handle.svg";
import { useNavigate } from "react-router-dom";
import Paths from "../core/paths";
import { IonImg, IonText } from "@ionic/react";

export default function SortableList({ items, type, onOrderChange, onDelete }) {
  const navigate = useNavigate();

  // Memoize items to prevent unnecessary resets
  const memoizedItems = useMemo(() => items ?? [], [items]);

  // Local state for drag-and-drop
  const [listItems, setListItems] = useState(memoizedItems);

  // Sync local state only when items meaningfully change
  useEffect(() => {
    const same =
      listItems.length === memoizedItems.length &&
      listItems.every((it, i) => it.id === memoizedItems[i].id);

    if (!same) setListItems(memoizedItems);
    console.log("SortableList items:", type, listItems);
  }, [memoizedItems, listItems, type]);

  // Handle drag-and-drop reordering
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newList = Array.from(listItems); // Use local state
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);

    setListItems(newList);
    onOrderChange(newList);
  };

  // Handle item deletion
  const handleDelete = (e, index) => {
    e.preventDefault();
    onDelete(listItems[index]);

    const newList = listItems.filter((_, i) => i !== index);
    setListItems(newList);
    onOrderChange(newList);
  };

  // Navigate to story or collection
  const handleNavigate = (item) => {
    if (item.childCollection) {
      navigate(Paths.collection.createRoute(item.childCollection.id));
    } else {
      navigate(Paths.page.createRoute(item.story.id));
    }
  };

  if (!listItems.length) {
    return (
      <div className="my-4 h-[20em]  px-2 sm:h-page w-[90vw] flex bg-emerald-100 rounded-lg bg-opacity-80 sm:w-page mx-auto text-emerald-800">
        <IonText className="text-emerald-800 text-center mx-auto mt-16 text-2xl">
          Add something
        </IonText>
      </div>
    );
  }

  return (
    <div className="py-4 mx-auto min-h-[50em]">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="sortableList">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {listItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-[96%] mx-auto items-center text-emerald-800 py-4 bg-transparent border-blueSea border-opacity-60 border-2 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <div className="flex justify-between mr-3">
                        <IonImg src={dragHandle} className="my-auto ml-4" />
                        <div className="justify-between flex-grow flex flex-row mr-4">
                          <h6
                            onClick={() => handleNavigate(item)}
                            className="text-emerald-800 text-nowrap text-left my-auto max-w-[13em] min-w-[10em] min-h-[1.5rem] overflow-hidden text-ellipsis sm:text-[1.2rem]"
                          >
                            {item.story
                              ? item.story.title
                              : item.childCollection
                              ? item.childCollection.title
                              : "Not found"}
                          </h6>
                          <button
                            onClick={(e) => handleDelete(e, index)}
                            className="ml-2 px-2 py-1 text-red-500 rounded-full open-sans-medium bg-transparent border-1 border-red-500 hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
}
