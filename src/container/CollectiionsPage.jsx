import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
  fetchCollectionFeedStories,
  fetchCollectionFeedSubCollections,
} from "../../actions/CollectionActions.js";

import Paths from "../../core/paths.js";
import checkResult from "../../core/checkResult.js";


/*
|--------------------------------------------------------------------------
| Collection / Room
|--------------------------------------------------------------------------
|
| A Collection is not simply a folder.
|
| It can contain:
|
|   - Stories
|   - other Collections / Rooms
|
| A Collection can gradually become a book, library, workshop,
| archive, or another kind of creative space depending on how
| the person uses it.
|
*/


export default function CollectionPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const [collection, setCollection] =
    useState(null);

  const [stories, setStories] =
    useState([]);

  const [childCollections, setChildCollections] =
    useState([]);

  const [loadingCollection, setLoadingCollection] =
    useState(true);

  const [loadingStories, setLoadingStories] =
    useState(true);

  const [loadingChildren, setLoadingChildren] =
    useState(true);

  const [error, setError] =
    useState(null);


  /*
   * ----------------------------------------------------------------------
   * LOAD COLLECTION
   * ----------------------------------------------------------------------
   *
   * IMPORTANT:
   *
   * The exact existing single-collection action was not present in the
   * retrieved source, so this function is intentionally isolated.
   *
   * Replace `fetchCollection` below with your actual existing action.
   *
   * Do NOT create a second API implementation if the action already
   * exists elsewhere in the application.
   */

  const loadCollection = useCallback(async () => {
    if (!id) return;

    setLoadingCollection(true);
    setError(null);

    try {
      /*
       * TODO:
       *
       * Replace this with the existing single collection action.
       *
       * Example:
       *
       * dispatch(getCollection(id))
       *
       * The current source confirms the collection feed actions,
       * but does not expose the exact single-collection action name.
       */

      setLoadingCollection(false);
    } catch (err) {
      console.error(
        "Failed loading collection:",
        err
      );

      setError(
        err?.message ||
        "Couldn't load this room."
      );

      setLoadingCollection(false);
    }
  }, [id]);


  /*
   * ----------------------------------------------------------------------
   * LOAD STORIES
   * ----------------------------------------------------------------------
   */

  const loadStories = useCallback(async () => {
    if (!id) return;

    setLoadingStories(true);

    try {
      const result = await dispatch(
        fetchCollectionFeedStories(id)
      );

      checkResult(
        result,
        (payload) => {
          const nextStories =
            payload?.stories ||
            payload?.pages ||
            payload?.pageList ||
            [];

          setStories(
            Array.isArray(nextStories)
              ? nextStories
              : []
          );
        },
        (err) => {
          console.error(
            "Failed loading collection stories:",
            err
          );

          setStories([]);
        }
      );
    } catch (err) {
      console.error(
        "Failed loading collection stories:",
        err
      );

      setStories([]);
    } finally {
      setLoadingStories(false);
    }
  }, [dispatch, id]);


  /*
   * ----------------------------------------------------------------------
   * LOAD CHILD COLLECTIONS
   * ----------------------------------------------------------------------
   */

  const loadChildCollections =
    useCallback(async () => {
      if (!id) return;

      setLoadingChildren(true);

      try {
        const result = await dispatch(
          fetchCollectionFeedSubCollections(id)
        );

        checkResult(
          result,
          (payload) => {
            const nextCollections =
              payload?.collections ||
              payload?.subCollections ||
              [];

            setChildCollections(
              Array.isArray(nextCollections)
                ? nextCollections
                : []
            );
          },
          (err) => {
            console.error(
              "Failed loading child collections:",
              err
            );

            setChildCollections([]);
          }
        );
      } catch (err) {
        console.error(
          "Failed loading child collections:",
          err
        );

        setChildCollections([]);
      } finally {
        setLoadingChildren(false);
      }
    }, [dispatch, id]);


  /*
   * ----------------------------------------------------------------------
   * INITIAL LOAD
   * ----------------------------------------------------------------------
   */

  useEffect(() => {
    loadCollection();
    loadStories();
    loadChildCollections();
  }, [
    loadCollection,
    loadStories,
    loadChildCollections,
  ]);


  /*
   * ----------------------------------------------------------------------
   * DERIVED DATA
   * ----------------------------------------------------------------------
   */

  const isOwner =
    Boolean(
      currentProfile?.id &&
      collection?.profileId &&
      String(currentProfile.id) ===
        String(collection.profileId)
    );


  const roomType =
    getRoomType(collection);


  const purpose =
    collection?.purpose?.trim();


  const totalPieces =
    stories.length +
    childCollections.length;


  /*
   * ----------------------------------------------------------------------
   * NAVIGATION
   * ----------------------------------------------------------------------
 */

  const handleBack = () => {
    history.goBack();
  };


  const handleStoryClick = (
    story
  ) => {
    if (!story?.id) return;

    if (
      Paths.page?.createRoute
    ) {
      history.push(
        Paths.page.createRoute(
          story.id
        )
      );

      return;
    }

    if (
      Paths.editPage?.createRoute
    ) {
      history.push(
        Paths.editPage.createRoute(
          story.id,
          story.type || "text"
        )
      );
    }
  };


  const handleCollectionClick =
    (childCollection) => {
      if (!childCollection?.id) return;

      history.push(
        Paths.collection.createRoute(
          childCollection.id
        )
      );
    };


  const handleEdit = () => {
    /*
     * Editing the collection should eventually open the existing
     * collection editing UI/form.
     *
     * Keep this handler isolated until the exact existing route/action
     * is confirmed.
     */
    console.log(
      "Edit collection:",
      collection?.id
    );
  };


  /*
   * ----------------------------------------------------------------------
   * LOADING
   * ----------------------------------------------------------------------
 */

  if (
    loadingCollection &&
    !collection
  ) {
    return (
      <CollectionShell>
        <CollectionSkeleton />
      </CollectionShell>
    );
  }


  /*
   * ----------------------------------------------------------------------
   * ERROR
   * ----------------------------------------------------------------------
 */

  if (
    error &&
    !collection
  ) {
    return (
      <CollectionShell>
        <CollectionError
          message={error}
          onBack={handleBack}
        />
      </CollectionShell>
    );
  }


  /*
   * ----------------------------------------------------------------------
   * MISSING COLLECTION
   * ----------------------------------------------------------------------
 */

  if (!collection) {
    return (
      <CollectionShell>
        <CollectionError
          message="This room couldn't be found."
          onBack={handleBack}
        />
      </CollectionShell>
    );
  }


  /*
   * ----------------------------------------------------------------------
   * PAGE
   * ----------------------------------------------------------------------
 */

  return (
    <CollectionShell>

      {/* --------------------------------------------------------------- */}
      {/* TOP NAV                                                        */}
      {/* --------------------------------------------------------------- */}

      <div className="mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="
            text-sm
            text-text-secondary
            transition-colors
            hover:text-text-brand
          "
        >
          ← Back
        </button>
      </div>


      {/* --------------------------------------------------------------- */}
      {/* ROOM HEADER                                                     */}
      {/* --------------------------------------------------------------- */}

      <header>

        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >

          <div className="min-w-0">

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.14em]
                text-text-secondary
              "
            >
              {roomType}
            </p>


            <h1
              className="
                mt-3
                max-w-3xl
                break-words
                font-serif
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-tight
                text-text-primary
                sm:text-5xl
                lg:text-6xl
              "
            >
              {collection.title ||
                "Untitled room"}
            </h1>


            {purpose && (
              <p
                className="
                  mt-5
                  max-w-2xl
                  font-serif
                  text-lg
                  leading-relaxed
                  text-text-secondary
                  sm:text-xl
                "
              >
                {purpose}
              </p>
            )}

          </div>


          {isOwner && (
            <button
              type="button"
              onClick={handleEdit}
              className="
                shrink-0
                self-start
                rounded-full
                border
                border-border-soft
                px-5
                py-2.5
                text-sm
                font-medium
                text-text-primary
                transition-colors
                hover:border-base-soft
                hover:text-text-brand
              "
            >
              Edit room
            </button>
          )}

        </div>


        {/* ------------------------------------------------------------- */}
        {/* META                                                           */}
        {/* ------------------------------------------------------------- */}

        <div
          className="
            mt-6
            flex
            flex-wrap
            gap-x-5
            gap-y-2
            text-xs
            text-text-secondary
          "
        >

          <span>
            {stories.length}{" "}
            {stories.length === 1
              ? "piece"
              : "pieces"}
          </span>


          {childCollections.length >
            0 && (
            <span>
              {childCollections.length}{" "}
              {childCollections.length === 1
                ? "room"
                : "rooms"}
            </span>
          )}


          {collection.isPrivate && (
            <span>
              Private
            </span>
          )}

        </div>

      </header>


      {/* --------------------------------------------------------------- */}
      {/* CONTENT                                                         */}
      {/* --------------------------------------------------------------- */}

      <div className="mt-14 space-y-14">

        {/* STORIES */}

        <CollectionSection
          title="Pieces"
          description={
            stories.length === 0
              ? "Nothing has been placed here yet."
              : undefined
          }
        >

          {loadingStories ? (
            <StorySkeletonList />
          ) : stories.length > 0 ? (
            <StoryList
              stories={stories}
              onSelect={
                handleStoryClick
              }
            />
          ) : (
            <EmptyCollectionState
              title="Nothing here yet."
              description="Pieces you add to this room will appear here."
            />
          )}

        </CollectionSection>


        {/* CHILD ROOMS */}

        <CollectionSection
          title="Rooms inside"
          description={
            childCollections.length === 0
              ? "A room can contain other rooms."
              : undefined
          }
        >

          {loadingChildren ? (
            <RoomSkeletonList />
          ) : childCollections.length >
            0 ? (
            <ChildCollectionList
              collections={
                childCollections
              }
              onSelect={
                handleCollectionClick
              }
            />
          ) : (
            <EmptyCollectionState
              title="No rooms inside."
              description="Collections can grow into other collections."
            />
          )}

        </CollectionSection>


        {/* ABOUT */}

        <CollectionSection
          title="About this room"
        >

          <div
            className="
              border-y
              border-border-soft
              py-5
            "
          >

            <dl
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
              "
            >

              <MetaItem
                label="Type"
                value={
                  roomType
                }
              />

              <MetaItem
                label="Visibility"
                value={
                  collection.isPrivate
                    ? "Private"
                    : "Public"
                }
              />

              <MetaItem
                label="Pieces"
                value={
                  stories.length
                }
              />

              <MetaItem
                label="Rooms"
                value={
                  childCollections.length
                }
              />

            </dl>

          </div>

        </CollectionSection>

      </div>

    </CollectionShell>
  );
}


/*
|--------------------------------------------------------------------------
| SHELL
|--------------------------------------------------------------------------
*/

function CollectionShell({
  children,
}) {
  return (
    <main
      className="
        min-h-[100dvh]
        bg-base-bg
        text-text-primary
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[50em]
          px-4
          pb-24
          pt-10
          sm:px-6
          sm:pt-14
          lg:px-8
          lg:pt-16
        "
      >
        {children}
      </div>
    </main>
  );
}


/*
|--------------------------------------------------------------------------
| SECTION
|--------------------------------------------------------------------------
*/

function CollectionSection({
  title,
  description,
  children,
}) {
  return (
    <section>

      <div
        className="
          mb-4
          border-b
          border-border-soft
          pb-3
        "
      >

        <h2
          className="
            font-serif
            text-2xl
            font-semibold
            leading-tight
            text-text-primary
            sm:text-3xl
          "
        >
          {title}
        </h2>


        {description && (
          <p
            className="
              mt-1
              text-sm
              leading-relaxed
              text-text-secondary
            "
          >
            {description}
          </p>
        )}

      </div>


      {children}

    </section>
  );
}


/*
|--------------------------------------------------------------------------
| STORIES
|--------------------------------------------------------------------------
*/

function StoryList({
  stories,
  onSelect,
}) {
  return (
    <div
      className="
        border-y
        border-border-soft
      "
    >
      {stories.map(
        (item) => {

          const story =
            item?.story ||
            item;

          if (!story?.id) {
            return null;
          }

          return (
            <StoryRow
              key={story.id}
              story={story}
              onClick={() =>
                onSelect(story)
              }
            />
          );
        }
      )}
    </div>
  );
}


function StoryRow({
  story,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-h-20
        w-full
        items-center
        justify-between
        gap-6
        border-b
        border-border-soft
        py-5
        text-left
        last:border-b-0
        hover:opacity-75
      "
    >

      <div className="min-w-0">

        <h3
          className="
            truncate
            font-serif
            text-lg
            text-text-primary
            sm:text-xl
          "
        >
          {story.title ||
            "Untitled"}
        </h3>


        {story.description && (
          <p
            className="
              mt-1
              line-clamp-2
              text-sm
              leading-relaxed
              text-text-secondary
            "
          >
            {story.description}
          </p>
        )}


        {story.status && (
          <p
            className="
              mt-2
              text-xs
              uppercase
              tracking-[0.08em]
              text-text-secondary
            "
          >
            {formatStatus(
              story.status
            )}
          </p>
        )}

      </div>


      <span
        aria-hidden="true"
        className="
          shrink-0
          text-xl
          text-text-secondary
          transition-transform
          group-hover:translate-x-1
        "
      >
        →
      </span>

    </button>
  );
}


/*
|--------------------------------------------------------------------------
| CHILD COLLECTIONS
|--------------------------------------------------------------------------
*/

function ChildCollectionList({
  collections,
  onSelect,
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
      "
    >
      {collections.map(
        (collection) => (
          <ChildCollectionCard
            key={
              collection.id
            }
            collection={
              collection
            }
            onClick={() =>
              onSelect(
                collection
              )
            }
          />
        )
      )}
    </div>
  );
}


function ChildCollectionCard({
  collection,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        min-h-36
        border
        border-border-soft
        bg-base-surface
        p-5
        text-left
        transition-all
        hover:border-base-soft
        hover:shadow-sm
      "
    >

      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.1em]
          text-text-secondary
        "
      >
        Room
      </p>


      <h3
        className="
          mt-2
          font-serif
          text-xl
          font-semibold
          text-text-primary
        "
      >
        {collection.title ||
          "Untitled room"}
      </h3>


      {collection.purpose && (
        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {collection.purpose}
        </p>
      )}


      <span
        className="
          mt-4
          inline-flex
          text-sm
          font-medium
          text-text-brand
        "
      >
        Enter
        <span
          aria-hidden="true"
          className="
            ml-2
            transition-transform
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </span>

    </button>
  );
}


/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

function EmptyCollectionState({
  title,
  description,
}) {
  return (
    <div
      className="
        flex
        min-h-40
        flex-col
        items-center
        justify-center
        border
        border-dashed
        border-border-soft
        bg-base-surface
        px-6
        py-10
        text-center
      "
    >

      <h3
        className="
          font-serif
          text-xl
          font-semibold
        "
      >
        {title}
      </h3>


      {description && (
        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {description}
        </p>
      )}

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| META
|--------------------------------------------------------------------------
*/

function MetaItem({
  label,
  value,
}) {
  return (
    <div>

      <dt
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.1em]
          text-text-secondary
        "
      >
        {label}
      </dt>

      <dd
        className="
          mt-1
          font-serif
          text-lg
          text-text-primary
        "
      >
        {value}
      </dd>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| LOADING
|--------------------------------------------------------------------------
*/

function CollectionSkeleton() {
  return (
    <div className="animate-pulse">

      <div
        className="
          h-3
          w-16
          rounded
          bg-border-soft
        "
      />

      <div
        className="
          mt-5
          h-12
          max-w-xl
          rounded
          bg-border-soft
        "
      />

      <div
        className="
          mt-5
          h-5
          max-w-lg
          rounded
          bg-border-soft
        "
      />

      <div className="mt-14 space-y-4">

        <div
          className="
            h-8
            w-32
            rounded
            bg-border-soft
          "
        />

        <div
          className="
            h-20
            rounded
            bg-border-soft
          "
        />

        <div
          className="
            h-20
            rounded
            bg-border-soft
          "
        />

      </div>

    </div>
  );
}


function StorySkeletonList() {
  return (
    <div
      className="
        animate-pulse
        divide-y
        divide-border-soft
        border-y
        border-border-soft
      "
    >
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="py-5"
          >
            <div
              className="
                h-5
                w-2/3
                rounded
                bg-border-soft
              "
            />

            <div
              className="
                mt-3
                h-3
                w-1/3
                rounded
                bg-border-soft
              "
            />
          </div>
        )
      )}
    </div>
  );
}


function RoomSkeletonList() {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
      "
    >
      {[1, 2].map(
        (item) => (
          <div
            key={item}
            className="
              h-36
              animate-pulse
              border
              border-border-soft
              bg-base-surface
            "
          />
        )
      )}
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| ERROR
|--------------------------------------------------------------------------
*/

function CollectionError({
  message,
  onBack,
}) {
  return (
    <div
      className="
        flex
        min-h-[50vh]
        flex-col
        items-center
        justify-center
        text-center
      "
    >

      <h1
        className="
          font-serif
          text-2xl
          font-semibold
        "
      >
        Something went wrong.
      </h1>


      <p
        className="
          mt-2
          max-w-md
          text-sm
          text-text-secondary
        "
      >
        {message}
      </p>


      <button
        type="button"
        onClick={onBack}
        className="
          mt-5
          rounded-full
          border
          border-border-soft
          px-5
          py-2.5
          text-sm
          font-medium
          hover:border-base-soft
          hover:text-text-brand
        "
      >
        Go back
      </button>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function getRoomType(
  collection
) {
  if (!collection) {
    return "Room";
  }

  if (
    collection.type ===
    "feedback"
  ) {
    return "Workshop";
  }

  if (
    collection.type ===
    "library"
  ) {
    return "Library";
  }

  if (
    collection.type ===
    "archive"
  ) {
    return "Archive";
  }

  if (
    collection.type ===
    "home"
  ) {
    return "Home";
  }

  if (
    collection.type ===
    "book"
  ) {
    return "Collection";
  }

  return "Room";
}


function formatStatus(
  status
) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Finished",
  };

  return (
    labels[
      String(status).toLowerCase()
    ] ||
    status
  );
}