
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
  // const handleOnDragEnd = (
  //   result
  // ) => {
  //   if (disableDrag) {
  //     return;
  //   }

  //   if (!result.destination) {
  //     return;
  //   }

  //   const newList =
  //     Array.from(listItems);

  //   const [movedItem] =
  //     newList.splice(
  //       result.source.index,
  //       1
  //     );

  //   newList.splice(
  //     result.destination.index,
  //     0,
  //     movedItem
  //   );

  //   /*
  //    * Re-index the COMPLETE list.
  //    *
  //    * This is important because the list can contain both
  //    * Rooms and Pages.
  //    */
  //   const normalized =
  //     newList.map(
  //       (entry, index) => ({
  //         ...entry,

  //         index,

  //         item: {
  //           ...entry.item,
  //           index,
  //         },
  //       })
  //     );

  //   setListItems(
  //     normalized
  //   );

  //   onOrderChange(
  //     normalized
  //   );
  // };


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
                            "bg-card-background",
                            "dark:border-white/10",
                            "dark:bg-base-surfaceDark",
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
                                  text-text-secondary
                                  hover:bg-base-surface
                                  active:cursor-grabbing
                                "
                              >
                                <img
                                  src={
                                    dragHandle
                                  }
                                  alt=""
                                  className="
                                    h-5
                                    w-5
                                    opacity-60
                                  "
                                />
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
                                shrink-0
                                rounded-full
                                px-3
                                py-2
                                text-xs
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