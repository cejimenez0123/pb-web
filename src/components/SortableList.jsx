
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
const DRAG_HANDLE=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M9,20q-0.82,0-1.41-0.59T7,18t0.59-1.41T9,16q0.83,0 1.41,0.59Q11,17.18 11,18t-0.59,1.41T9,20Zm6,0q-0.82,0-1.41-0.59T13,18t0.59-1.41T15,16t1.41,0.59Q17,17.18 17,18t-0.59,1.41T15,20ZM9,14q-0.82,0-1.41-0.59T7,12t0.59-1.41T9,10q0.83,0 1.41,0.59Q11,11.18 11,12t-0.59,1.41T9,14Zm6,0q-0.82,0-1.41-0.59T13,12t0.59-1.41T15,10t1.41,0.59Q17,11.18 17,12t-0.59,1.41T15,14ZM9,8Q8.18,8 7.59,7.41T7,6T7.59,4.59T9,4q0.83,0 1.41,0.59Q11,5.18 11,6T10.41,7.41T9,8Zm6,0q-0.82,0-1.41-0.59T13,6t0.59-1.41T15,4t1.41,0.59Q17,5.18 17,6T16.41,7.41T15,8Z"/></svg>
export default function SortableList({
  items,
  onOrderChange,
  onDelete,
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


  // =======================================================
  // LIST
  // =======================================================

  return (
    <div className="py-4 mx-auto max-w-lg">

      <DragDropContext
        onDragEnd={
          handleOnDragEnd
        }
      >

        <Droppable
          droppableId="sortableList"
        >
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={
                provided.innerRef
              }
              className="space-y-[1.618rem]"
            >

          {listItems.map(
  (entry, index) => {
    const isRoom =
      Boolean(entry.childCollection);

    console.log("entrycc:", entry);

    const title =
      isRoom
        ? entry.childCollection?.title
        : entry.story?.title;

    const purpose =
      isRoom
        ? entry.childCollection?.purpose
        : null;

    return (
      <Draggable
        key={entry.id}
        draggableId={String(entry.id)}
        index={index}
       isDragDisabled={
  disableDrag || isFiltered
}
      >
                      {(
                        provided,
                        snapshot
                      ) => (
                        <li
                          ref={
                            provided.innerRef
                          }
                          {...provided.draggableProps}
                          className={[
                            "group",
                            "rounded-2xl",
                            "border",
                            "border-card-border",
                            "dark:bg-transparent",
                            "bg-card-background",
                            "dark:border-plumb-darkText/80",
                            "dark:bg-plumb-surface Dark",
                            "transition-all",
                            snapshot.isDragging
                              ? "shadow-xl"
                              : "",
                          ].join(" ")}
                        >

                          <div className="flex items-center gap-3 p-4">

                            {/* -------------------------------- */}
                            {/* DRAG HANDLE */}
                            {/* -------------------------------- */}

                            {!disableDrag ? (
                              <div
                                {...provided.dragHandleProps}
                                className="
                                  flex
                                  h-9
                                  w-8
                                  shrink-0
                                  cursor-grab
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-white
                                  text-text-secondary
                                  hover:bg-plumb-surface 
                                  active:cursor-grabbing
                                "
                              >
                                {DRAG_HANDLE}
                                {/* <img
                                  src={
                                    dragHandle
                                  }
                                  alt=""
                                  className="
                                    h-5
                                    w-5
                                    opacity-60
                                  "
                                /> */}
                              </div>
                            ) : (
                              <div className="h-9 w-8 shrink-0" />
                            )}


                            {/* -------------------------------- */}
                            {/* ITEM */}
                            {/* -------------------------------- */}

                            <button
                              type="button"
                              onClick={() =>
                                handleNavigate(
                                  entry
                                )
                              }
                              className="
                                min-w-0
                                flex-1
                                text-left
                              "
                            >

                              <div className="flex items-center gap-2">

                                <span
                                  className="
                                    text-[10px]
                                    uppercase
                                    tracking-[0.14em]
                                    text-text-secondary
                                  "
                                >
                                  {isRoom
                                    ? "Room"
                                    : "Page"}
                                </span>

                              </div>


                              <h6
                                className="
                                  mt-1
                                  truncate
                                  font-serif
                                  text-lg
                                  text-text-primary
                                  dark:text-cream
                                "
                              >
                                {title ||
                                  "Untitled"}
                              </h6>


                              {purpose && (
                                <p
                                  className="
                                    mt-1
                                    line-clamp-2
                                    text-sm
                                    leading-5
                                    text-text-secondary
                                  "
                                >
                                  {purpose}
                                </p>
                              )}

                            </button>


                            {/* -------------------------------- */}
                            {/* DELETE */}
                            {/* -------------------------------- */}

                            <button
                              type="button"
                              onClick={(
                                event
                              ) =>
                                handleDelete(
                                  event,
                                  entry
                                )
                              }
                              className="
                                  dark:border-plumb-darkText/80
                                shrink-0
                                rounded-full
                                px-3
                                py-2
                                text-md
                                text-text-secondary
                                transition-colors
                                hover:bg-red-50
                                hover:text-red-600
                                dark:hover:bg-red-400/10
                              "
                            >
                              Delete
                            </button>

                          </div>

                        </li>
                      )}
                    </Draggable>
                  );
                }
              )}

              {
                provided.placeholder
              }

            </ul>
          )}
        </Droppable>

      </DragDropContext>

    </div>
  );
}