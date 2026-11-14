
import { useMemo, useState } from "react";

import styles from "../../styles/style";
import StoryCard from "./StoryCard";
import SectionHeader from "../pieces/SectionHeader";
import { useDialog } from "../../domain/usecases/useDialog";

function getCollectionId(relationship) {
  return (
    relationship?.collectionId ||
    relationship?.collection?.id ||
    null
  );
}

function formatProfileCollectionType(type) {
  const labels = {
    home: "Home",
    events: "Events",
    portfolio: "Portfolio",
    archive: "Archive",
    library: "Library",
    feedback: "Feedback",
    book: "Book",
  };

  return labels[type] || type || "Collection";
}

function matchesSearch(item, query) {
  if (!query) return true;

  const searchableText = [
    item?.title,
    item?.description,
    item?.purpose,
    item?.type,
    item?.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

/* -------------------------------------------------------
   Dialog content
------------------------------------------------------- */

function AllItemsDialog({
  items = [],
  type,
  onSelect,
  onClose,
}) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => matchesSearch(item, query));
  }, [items, search]);

  const isStories = type === "stories";

  return (
    <div className="bg-cream dark:bg-plumb-dark-surface">
      <div className="mb-5">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${type}...`}
          aria-label={`Search ${type}`}
          className={styles.profile.mine.search}
        />
      </div>

      <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pb-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div key={item.id || `${type}-${index}`}>
              {isStories ? (
                <StoryCard
                  story={item}
                  onSelect={(story) => {
                    onClose?.();
                    onSelect?.(story);
                  }}
                />
              ) : (
                <RoomCard
                  room={item}
                  onSelect={(room) => {
                    onClose?.();
                    onSelect?.(room);
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p className="py-8 text-center font-serif text-base text-soft/55 dark:text-cream/50">
            No {type} found.
          </p>
        )}
      </div>

      <p className="mt-3 border-t border-soft/10 pt-3 text-xs text-soft/45 dark:border-cream/10 dark:text-cream/40">
        {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   Profile collection pill
------------------------------------------------------- */

function ProfileCollectionPill({
  relationship,
  collection,
  onSelect,
}) {
  const collectionId = getCollectionId(relationship);

  if (!collectionId) return null;

  const title =
    relationship?.collection?.title ||
    collection?.title ||
    formatProfileCollectionType(relationship?.type);

  return (
    <button
      type="button"
      onClick={() =>
        onSelect?.({
          id: collectionId,
          title,
        })
      }
      className="
        inline-flex
        max-w-full
        items-center
        gap-2
        rounded-full
        border
        border-soft/15
        px-3
        py-1.5
        text-left
        text-xs
        text-soft/70
        transition-colors
        hover:bg-soft/5
        dark:border-cream/10
        dark:text-cream/65
        dark:hover:bg-cream/5
      "
    >
      <span className="truncate">{title}</span>
    </button>
  );
}

/* -------------------------------------------------------
   Room card
------------------------------------------------------- */

function RoomCard({ room, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(room)}
      className="
        group
        flex
        w-[100%]
        min-w-0
        items-center
        gap-4
        rounded-2xl
        border
        border-soft/15
              bg-plumb-canvas
        p-5
        text-left
        transition-colors
        hover:bg-soft/5
        dark:border-cream/10
        dark:hover:bg-cream/5
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-soft/10
          text-soft
          dark:bg-cream/10
          dark:text-cream
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-serif text-lg font-bold text-soft dark:text-cream">
          {room.title || "Untitled room"}
        </h3>

        <p className="mt-1 truncate text-sm text-soft/55 dark:text-cream/50">
          {room.purpose || "Writing space"}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="
          shrink-0
          text-xl
          text-soft/40
          transition-transform
          group-hover:translate-x-1
          dark:text-cream/40
        "
      >
        →
      </span>
    </button>
  );
}

/* -------------------------------------------------------
   Loading state
------------------------------------------------------- */

function LoadingState() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
            h-24
            w-[100%]
            animate-pulse
            rounded-2xl
            border
            border-soft/10
            bg-soft/5
          "
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------
   Writer landing
------------------------------------------------------- */

export default function WriteLanding({
  stories = [],
  rooms = [],
  profileCollections = [],
  storiesLoading = false,
  roomsLoading = false,
  search = "",
  onSearch,
  onBegin,
  onSelectStory,
  onSelectRoom,
}) {
  const { openDialog, closeDialog } = useDialog();

  const storyList = Array.isArray(stories) ? stories : [];
  const allRooms = Array.isArray(rooms) ? rooms : [];

  const relationships = Array.isArray(profileCollections)
    ? profileCollections
    : [];

  const normalizedSearch = search.trim().toLowerCase();

  // Profile-specific collections should not also appear as Rooms.
  const profileCollectionIds = new Set(
    relationships
      .map(getCollectionId)
      .filter(Boolean)
      .map(String)
  );

  const roomList = allRooms.filter(
    (room) => !profileCollectionIds.has(String(room.id))
  );

  // Resolve profile collection titles from either the relationship
  // itself or the rooms already loaded in the workspace.
  const visibleProfileCollections = relationships
    .filter((relationship) => getCollectionId(relationship))
    .map((relationship) => {
      const collectionId = getCollectionId(relationship);

      const matchingRoom = allRooms.find(
        (room) => String(room.id) === String(collectionId)
      );

      return {
        relationship,
        collection: relationship.collection || matchingRoom || null,
      };
    });

  // Main page search.
  const visibleStories = useMemo(
    () => storyList.filter((story) => matchesSearch(story, normalizedSearch)),
    [storyList, normalizedSearch]
  );

  const visibleRooms = useMemo(
    () => roomList.filter((room) => matchesSearch(room, normalizedSearch)),
    [roomList, normalizedSearch]
  );

  const visibleCollections = useMemo(
    () =>
      visibleProfileCollections.filter(({ relationship, collection }) =>
        matchesSearch(
          {
            title:
              relationship?.collection?.title ||
              collection?.title ||
              formatProfileCollectionType(relationship?.type),
            type: relationship?.type,
          },
          normalizedSearch
        )
      ),
    [visibleProfileCollections, normalizedSearch]
  );

  const hasSearch = normalizedSearch.length > 0;

  const hasResults =
    visibleStories.length > 0 ||
    visibleRooms.length > 0 ||
    visibleCollections.length > 0;

  // Show a short preview on the landing page.
  const previewStories = visibleStories.slice(0, 8);
  const previewRooms = visibleRooms.slice(0, 8);

  /* -----------------------------------------------------
     Dialog actions
  ----------------------------------------------------- */

  const handleShowAllStories = () => {
    openDialog({
      title: "All your stories",
      text: (
        <AllItemsDialog
          items={storyList}
          type="stories"
          onSelect={onSelectStory}
          onClose={closeDialog}
        />
      ),

      disagreeText: "Close",
    });
  };

  const handleShowAllRooms = () => {
    openDialog({
      title: "All your rooms",
      text: (
        <AllItemsDialog
          items={roomList}
          type="rooms"
          onSelect={onSelectRoom}
          onClose={closeDialog}
        />
      ),

      disagreeText: "Close",
    });
  };

  return (
    <div className="w-[100%]">
      <div
        className="
          mx-auto
          w-[100%]
          max-w-5xl
          px-6
          py-16
          sm:px-10
          sm:py-20
          lg:px-12
          lg:py-24
        "
      >
        {/* Introduction */}
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.12em] text-soft/75 dark:text-cream/65">
            Write
          </p>

          <h1 className="mt-5 max-w-2xl font-serif text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-[4rem] lg:text-[4.5rem]">
            What are you working on?
          </h1>

          <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-soft/65 dark:text-cream/65 sm:text-xl">
            Start something new, or return to something already taking shape.
          </p>
        </header>

        {/* New writing */}
        <div className="mt-8">
          <button
            type="button"
            onClick={onBegin}
            className={[
              styles.button.base,
              styles.button.primary,
            ].join(" ")}
          >
            Begin something new
          </button>
        </div>

        {/* Workspace */}
        <section className="mt-24 sm:mt-28">
          <div className="flex flex-col gap-5 border-b border-soft/15 pb-7 dark:border-cream/10">
            <SectionHeader
              eyebrow="Your workspace"
              title="Pick up where you left off"
            />

            <label className="block w-[100%] sm:max-w-md">
              <span className="sr-only">
                Search rooms and writing
              </span>

              <input
                id="story-search"
                type="search"
                value={search}
                onChange={(event) => onSearch?.(event.target.value)}
                placeholder="Search rooms and writing..."
                className={styles.profile.mine.search}
              />
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-14">
            {/* Profile collections */}
            {visibleCollections.length > 0 && (
              <section>
                <div className="mb-4">
                  <SectionHeader
                    eyebrow="Your profile"
                    title="Collections"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {visibleCollections.map(({ relationship, collection }, index) => (
                    <ProfileCollectionPill
                      key={
                        relationship.id ||
                        `${getCollectionId(relationship)}-${index}`
                      }
                      relationship={relationship}
                      collection={collection}
                      onSelect={onSelectRoom}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Rooms */}
            <section>
              <div className="mb-5">
                <SectionHeader
                  eyebrow="Your spaces"
                  title="Rooms"
                />
              </div>

              {roomsLoading && roomList.length === 0 ? (
                <LoadingState />
              ) : previewRooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {previewRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={onSelectRoom}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-4 font-serif text-base text-soft/55 dark:text-cream/50">
                  {hasSearch
                    ? "No rooms match your search."
                    : "Your rooms will appear here."}
                </p>
              )}

              {visibleRooms.length > 8 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleShowAllRooms}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-soft/15
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-soft
                      transition-colors
                      hover:bg-soft/5
                      dark:border-cream/15
                      dark:text-cream
                      dark:hover:bg-cream/5
                    "
                  >
                    See all rooms
                    <span className="text-soft/50 dark:text-cream/50">
                      ({visibleRooms.length})
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </section>

            {/* Stories */}
            <section>
              <div className="mb-5">
                <SectionHeader
                  eyebrow="Your writing"
                  title="Stories and drafts"
                />
              </div>

              {storiesLoading && storyList.length === 0 ? (
                <LoadingState />
              ) : previewStories.length > 0 ? (
                <div className="flex w-[100%] flex-col gap-4">
                  {previewStories.map((story, index) => (
                    <StoryCard
                      key={story.id || `story-${index}`}
                      story={story}
                      onSelect={onSelectStory}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-4">
                  <p className="font-serif text-base text-soft/55 dark:text-cream/50">
                    {hasSearch
                      ? "No writing matches your search."
                      : "Your writing will appear here."}
                  </p>

                  {!hasSearch && (
                    <button
                      type="button"
                      onClick={onBegin}
                      className="mt-4 text-sm text-soft underline underline-offset-4 dark:text-cream"
                    >
                      Start a new piece
                    </button>
                  )}
                </div>
              )}

              {visibleStories.length > 8 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleShowAllStories}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-soft/15
                      px-5
                      py-3
                      text-sm
                      font-medium
                      text-soft
                      transition-colors
                      hover:bg-soft/5
                      dark:border-cream/15
                      dark:text-cream
                      dark:hover:bg-cream/5
                    "
                  >
                    See all stories
                    <span className="text-soft/50 dark:text-cream/50">
                      ({visibleStories.length})
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </section>
          </div>

          {!hasResults &&
            !storiesLoading &&
            !roomsLoading &&
            hasSearch && (
              <div className="mt-8 border-t border-soft/10 pt-6">
                <p className="font-serif text-lg text-soft/65 dark:text-cream/65">
                  Nothing found for “{search}”.
                </p>

                <button
                  type="button"
                  onClick={() => onSearch?.("")}
                  className="mt-4 text-sm text-soft underline underline-offset-4 dark:text-cream"
                >
                  Clear search
                </button>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
