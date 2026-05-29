

import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IonImg, IonText, useIonRouter } from "@ionic/react";
import dragHandle from "../images/icons/drag_handle.svg";
import Paths from "../core/paths";

export default function SortableList({ items, type, onOrderChange, onDelete }) {
  const router = useIonRouter();
  const memoizedItems = useMemo(() => items ?? [], [items]);
  const [listItems, setListItems] = useState(memoizedItems);

  // Sync local state with props
  useEffect(() => {
    const same =
      listItems.length === memoizedItems.length &&
      listItems.every((it, i) => it.id === memoizedItems[i].id);
    if (!same) setListItems(memoizedItems);
  }, [memoizedItems, listItems]);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newList = Array.from(listItems);
    const [movedItem] = newList.splice(result.source.index, 1);
    newList.splice(result.destination.index, 0, movedItem);
    setListItems(newList);
    onOrderChange(newList);
  };

  const handleDelete = (e, index) => {
    e.preventDefault();
    onDelete(listItems[index]);
    const newList = listItems.filter((_, i) => i !== index);
    setListItems(newList);
    onOrderChange(newList);
  };

  const handleNavigate = (item) => {
    if (item.childCollection) router.push(Paths.collection.createRoute(item.childCollection.id));
    else router.push(Paths.page.createRoute(item.story.id));
  };

  if (!listItems.length) {
    return (
      <div className="my-4 h-[20em] px-2 sm:h-page flex items-center justify-center bg-emerald-100 bg-opacity-30 rounded-xl">
        <IonText className="text-emerald-800 text-center text-2xl font-medium">
          Add something
        </IonText>
      </div>
    );
  }

  return (
    <div className="py-4 mx-auto max-w-lg">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="sortableList">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-[1.618rem]">
              {listItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        flex items-center justify-between p-4 
                        rounded-2xl shadow-lg 
                        bg-base-bg hover:shadow-xl 
                        transition-shadow duration-150
                        border border-gray-200
                        ${snapshot.isDragging ? "bg-gray-50 shadow-2xl" : ""}
                      `}
                    >
                      {/* Drag handle */}
                      <img src={dragHandle} className="w-5 dark:bg-cream rounded-2xl h-5 mr-4 cursor-grab" />

                      {/* Title */}
                      <h6
                        onClick={() => handleNavigate(item)}
                        className="flex-1 text-left text-soft dark:text-cream font-medium truncate cursor-pointer"
                        style={{ maxWidth: "calc(100% - 100px)" }}
                      >
                        {item?.story?.title?.slice(0, 30) || item?.childCollection?.title?.slice(0, 30) || "Untitled"}
                      </h6>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(e, index)}
                        className="ml-4 px-3 py-1 text-red-500 font-medium rounded-full border border-red-400 hover:bg-red-500 hover:text-white transition"
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
}