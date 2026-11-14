
import React, { useCallback } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";

import { useIonRouter } from "@ionic/react";
import Paths from "../core/paths";

const DRAG_HANDLE = (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM9 16a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);

const getId = (entry) =>
  String(
    entry?.id ??
    entry?.item?.id ??
    ""
  );

const getTitle = (entry) =>
  entry?.childCollection?.title ||
  entry?.story?.title ||
  "Untitled";

const isRoom = (entry) =>
  entry?.kind === "room" ||
  Boolean(entry?.childCollection);

export default function SortableList({
  items = [],
  onOrderChange,
  onDelete,
  removedItems = [],
  onUndoAll,
  onUndoRemove,
  disableDrag = false,
  isFiltered = false,
}) {
  const router = useIonRouter();

  const listItems = Array.isArray(items) ? items : [];

  const handleNavigate = useCallback((entry) => {
    if (entry?.childCollection?.id) {
      router.push(
        Paths.collection.createRoute(entry.childCollection.id)
      );
      return;
    }

    if (entry?.story?.id) {
      router.push(
        Paths.page.createRoute(entry.story.id)
      );
    }
  }, [router]);

  const handleDragEnd = (result) => {
    if (
      disableDrag ||
      isFiltered ||
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const reordered = [...listItems];

    const [moved] = reordered.splice(
      result.source.index,
      1
    );

    reordered.splice(
      result.destination.index,
      0,
      moved
    );

    const normalized = reordered.map((entry, index) => ({
      ...entry,
      index,
      ...(entry.item
        ? {
            item: {
              ...entry.item,
              index,
            },
          }
        : {}),
    }));

    onOrderChange?.(normalized);
  };

  const handleDelete = (event, entry) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete?.(entry);
  };

  if (!listItems.length) {
    return (
      <div className="
        my-5 min-h-[18rem]
        flex flex-col items-center justify-center
        rounded-3xl border-2 border-dashed
        border-blue-200 dark:border-blue-400/20
        bg-blue-50/50 dark:bg-blue-400/[0.04]
        px-6 text-center
      ">
        <span className="
          mb-4 flex h-14 w-14 items-center justify-center
          rounded-2xl bg-blue-100 dark:bg-blue-400/10
          text-blue-500 dark:text-blue-400
          text-2xl
        ">
          ✳
        </span>

        <p className="
          font-serif text-xl
          text-plumb-ink dark:text-cream
        ">
          A little room to grow.
        </p>

        <p className="
          mt-2 max-w-xs text-sm
          text-text-secondary
        ">
          Add a page or room and start building your collection.
        </p>
      </div>
    );
  }

  return (
    <div className="w-[100%] space-y-4">

      <div className="
        flex items-center justify-between
        gap-3 px-1
      ">
        <div>
          <p className="
            text-sm font-semibold
            text-plumb-ink dark:text-cream
          ">
            Your collection
          </p>

          <p className="
            mt-0.5 text-xs
            text-text-secondary
          ">
            Drag to arrange your pages and rooms.
          </p>
        </div>

        <span className="
          shrink-0 rounded-full
          bg-blue-100 dark:bg-blue-400/10
          px-3 py-1.5
          text-xs font-semibold
          text-blue-600 dark:text-blue-400
        ">
          {listItems.length} {listItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="collection-sortable-list"
          isDropDisabled={disableDrag || isFiltered}
        >
          {(provided, snapshot) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
                flex flex-col gap-3
                w-[100%] min-w-0
                rounded-2xl
                transition-colors duration-150
                ${snapshot.isDraggingOver
                  ? "bg-blue-400/[0.06] ring-2 ring-blue-400/20 p-2"
                  : ""}
              `}
            >
              {listItems.map((entry, index) => {
                const id = getId(entry);

                if (!id) return null;

                const room = isRoom(entry);

                return (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}
                    isDragDisabled={disableDrag || isFiltered}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                        className={`
                          group relative
                          flex items-center gap-3
                          min-w-0 w-[100%]
                          rounded-2xl
                          border
                          p-3 sm:p-4
                          transition-all duration-150

                          ${snapshot.isDragging
                            ? `
                              bg-plumb-canvas dark:bg-[#202923]
                              border-blue-400
                              shadow-xl shadow-blue-400/15
                              rotate-[1deg]
                              z-50
                            `
                            : `
                           bg-plumb-canvas dark:bg-base-bg
                              border-gray-200 dark:border-white/10
                              shadow-sm
                              hover:border-blue-300
                              dark:hover:border-blue-400/40
                              hover:shadow-md
                            `
                          }
                        `}
                      >

                        {/* Drag handle */}
                        <button
                          type="button"
                          {...provided.dragHandleProps}
                          disabled={disableDrag || isFiltered}
                          aria-label={`Drag to reorder ${getTitle(entry)}`}
                          className="
                            shrink-0
                            flex items-center justify-center
                            h-11 w-9
                            rounded-xl
                            text-gray-400
                            dark:text-gray-500
                            hover:text-blue-500
                            dark:hover:text-blue-400
                            hover:bg-blue-50
                            dark:hover:bg-blue-400/10
                            active:cursor-grabbing
                            cursor-grab
                            touch-none
                            transition-colors
                            disabled:cursor-default
                            disabled:opacity-30
                          "
                        >
                          {DRAG_HANDLE}
                        </button>

                        {/* Number */}
                        <span className="
                          shrink-0
                          flex items-center justify-center
                          h-8 w-8
                          rounded-lg
                          bg-gray-100 dark:bg-white/[0.06]
                          text-xs font-semibold
                          tabular-nums
                          text-gray-500 dark:text-gray-400
                        ">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Content */}
                        <button
                          type="button"
                          onClick={() => handleNavigate(entry)}
                          className="
                            flex-1 min-w-0
                            flex flex-col items-start
                            gap-1 text-left
                          "
                        >
                          <span className="
                            block w-[100%] truncate
                            text-sm sm:text-base
                            font-semibold
                            text-plumb-ink dark:text-cream
                            group-hover:text-blue-600
                            dark:group-hover:text-blue-400
                            transition-colors
                          ">
                            {getTitle(entry)}
                          </span>

                          <span className="
                            flex items-center gap-1.5
                            text-[11px] font-medium
                            text-text-secondary
                          ">
                            <span className={`
                              h-1.5 w-1.5 rounded-full
                              ${room
                                ? "bg-amber-400"
                                : "bg-blue-400"}
                            `} />

                            {room ? "Room" : "Page"}
                          </span>
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={(event) => handleDelete(event, entry)}
                          aria-label={`Remove ${getTitle(entry)}`}
                          className="
                            shrink-0
                            flex items-center justify-center
                            h-10 w-10
                            rounded-xl
                            text-gray-400
                            dark:text-gray-500
                            hover:text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                            transition-colors
                          "
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="19"
                            height="19"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3" />
                          </svg>
                        </button>

                      </li>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Removed items */}
      {removedItems.length > 0 && (
        <div className="
          rounded-2xl
          border border-blue-200 dark:border-blue-400/20
          bg-blue-50/70 dark:bg-blue-400/[0.05]
          p-4 space-y-3
        ">
          <div className="
            flex items-center justify-between gap-3
          ">
            <div>
              <p className="
                text-sm font-semibold
                text-plumb-ink dark:text-cream
              ">
                {removedItems.length} {removedItems.length === 1
                  ? "item removed"
                  : "items removed"}
              </p>

              <p className="
                mt-1 text-xs text-text-secondary
              ">
                Your changes haven't been saved yet.
              </p>
            </div>

            <button
              type="button"
              onClick={onUndoAll}
              className="
                shrink-0 rounded-full
                bg-blue-400 px-4 py-2
                text-xs font-semibold text-white
                hover:bg-blue-500
                transition-colors
              "
            >
              Undo all
            </button>
          </div>

          <div className="space-y-2">
            {removedItems.map((item) => (
              <div
                key={getId(item)}
                className="
                  flex items-center justify-between
                  gap-3 border-t
                  border-blue-200/70
                  dark:border-white/10
                  pt-2
                "
              >
                <span className="
                  min-w-0 truncate text-sm
                  text-text-secondary
                ">
                  {getTitle(item)}
                </span>

                <button
                  type="button"
                  onClick={() => onUndoRemove?.(item)}
                  className="
                    shrink-0 text-xs font-semibold
                    text-blue-600 dark:text-blue-400
                    hover:underline
                  "
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

