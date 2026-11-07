
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

import {
  useIonRouter,
} from "@ionic/react";

import dragHandle from "../images/icons/drag_handle.svg";
import Paths from "../core/paths";
const DRAG_HANDLE=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M9,20q-0.82,0-1.41-0.59T7,18t0.59-1.41T9,16q0.83,0 1.41,0.59Q11,17.18 11,18t-0.59,1.41T9,20Zm6,0q-0.82,0-1.41-0.59T13,18t0.59-1.41T15,16t1.41,0.59Q17,17.18 17,18t-0.59,1.41T15,20ZM9,14q-0.82,0-1.41-0.59T7,12t0.59-1.41T9,10q0.83,0 1.41,0.59Q11,11.18 11,12t-0.59,1.41T9,14Zm6,0q-0.82,0-1.41-0.59T13,12t0.59-1.41T15,10t1.41,0.59Q17,11.18 17,12t-0.59,1.41T15,14ZM9,8Q8.18,8 7.59,7.41T7,6T7.59,4.59T9,4q0.83,0 1.41,0.59Q11,5.18 11,6T10.41,7.41T9,8Zm6,0q-0.82,0-1.41-0.59T13,6t0.59-1.41T15,4t1.41,0.59Q17,5.18 17,6T16.41,7.41T15,8Z"/></svg>
export default function SortableList({
  items,
  onOrderChange,
  onDelete,
  removedItems = [],
  onUndoAll,
  onUndoRemove,
  disableDrag = false,
  isFiltered = false,
}) {
  const router = useIonRouter();

  const memoizedItems = useMemo(
    () => items ?? [],
    [items]
  );

  const [listItems, setListItems] =
    useState(memoizedItems);


  // =======================================================
  // SYNC FROM PARENT
  // =======================================================

  useEffect(() => {
    setListItems(
      memoizedItems
    );
  }, [memoizedItems]);


  // =======================================================
  // DRAG END
  // =======================================================
const handleOnDragEnd = (result) => {
  if (disableDrag || isFiltered) {
    return;
  }

  if (!result.destination) {
    return;
  }

  const newList = Array.from(listItems);

  const [movedItem] = newList.splice(
    result.source.index,
    1
  );

  newList.splice(
    result.destination.index,
    0,
    movedItem
  );

  const normalized = newList.map(
    (entry, index) => ({
      ...entry,
      index,
      item: {
        ...entry.item,
        index,
      },
    })
  );

  setListItems(normalized);

  onOrderChange(normalized);
};

  // =======================================================
  // DELETE
  // =======================================================
const handleDelete = (event, entry) => {
  event.preventDefault();
  event.stopPropagation();

  onDelete(entry);
};
const handleNavigate = (entry) => {
  console.log("ENTRY:", entry);
  console.log("story:", entry?.story);
  console.log("childCollection:", entry?.childCollection);

  if (entry?.childCollection?.id) {
    router.push(
      Paths.collection.createRoute(
        entry.childCollection.id
      )
    );

    return;
  }

  if (entry?.story?.id) {
    router.push(
      Paths.page.createRoute(
        entry.story.id
      )
    );
  }
};

  // =======================================================
  // EMPTY
  // =======================================================

  if (!listItems.length) {
    return (
      <div
        className="
          my-4
          h-[20em]
          flex
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-card-border
          dark:border-white/10
        "
      >
        <div className="text-center px-6">

          <p className="font-serif text-xl text-text-primary dark:text-cream">
            Nothing here yet.
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            Add a page or room to begin.
          </p>

        </div>
      </div>
    );
  }


return(<DragDropContext onDragEnd={handleOnDragEnd}>
  <Droppable droppableId="sortableList">
    {(provided) => (
      <ul
        {...provided.droppableProps}
        ref={provided.innerRef}
        className="space-y-[1.618rem] w-[100%]"
      >
        {/* Your Draggable items */}

        {provided.placeholder}
      </ul>
    )}
  </Droppable>

  {removedItems.length > 0 && (
    <div className="
      mt-5 w-[100%]
      rounded-xl
      border border-plumb-mint/30
      bg-plumb-surface
      dark:bg-base-bg
      p-4 space-y-3
    ">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-plumb-ink dark:text-cream">
            {removedItems.length === 1
              ? "1 item removed"
              : `${removedItems.length} items removed`}
          </p>

          <p className="mt-1 text-xs text-text-secondary">
            Changes haven't been saved yet.
          </p>
        </div>

        <button
          type="button"
          onClick={onUndoAll}
          className="
            shrink-0 rounded-full
            border border-plumb-mint
            px-4 py-2 text-sm font-medium
            text-plumb-mint
            hover:bg-plumb-mint/10
          "
        >
          Undo all
        </button>
      </div>

      {removedItems.length > 1 && (
        <div className="
          border-t border-card-border
          dark:border-white/10
          pt-2 space-y-2
        ">
          {removedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="truncate text-text-secondary">
                {item.kind === "room"
                  ? item.childCollection?.title
                  : item.story?.title}
              </span>

              <button
                type="button"
                onClick={() => onUndoRemove(item)}
                className="shrink-0 font-medium text-plumb-mint"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</DragDropContext>)

}