import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useHistory } from "react-router-dom";

import {
  getMyCollections,
} from "../../actions/CollectionActions.js";

import Paths from "../../core/paths.js";
import { IonContent, useIonRouter } from "@ionic/react";


const PAGE =
  "mx-auto w-full max-w-[52rem] px-4 sm:px-6 lg:px-8";

const SECTION =
  "mt-12 sm:mt-16";

const EYEBROW =
  "text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary";


export default function CollectionsContainer() {
  const dispatch = useDispatch();
  const history = useHistory();
const router = useIonRouter()
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const [createdRooms, setCreatedRooms] =
    useState([]);

  const [memberRooms, setMemberRooms] =
    useState([]);

  const [loadingCreated, setLoadingCreated] =
    useState(true);

  const [loadingMember, setLoadingMember] =
    useState(true);

  const [error, setError] =
    useState(null);


  // ----------------------------------------------------------
  // Load Rooms
  // ----------------------------------------------------------

  const loadRooms = useCallback(async () => {
    if (!currentProfile?.id) {
      setCreatedRooms([]);
      setMemberRooms([]);
      setLoadingCreated(false);
      setLoadingMember(false);
      return;
    }

    setError(null);
    setLoadingCreated(true);
    setLoadingMember(true);

    try {
      const [
        createdResult,
        memberResult,
      ] = await Promise.all([
        dispatch(
          getMyCollections({
            skip: 0,
            take: 100,
            scope: "created",
          })
        ).unwrap(),

        dispatch(
          getMyCollections({
            skip: 0,
            take: 100,
            scope: "member",
          })
        ).unwrap(),
      ]);

      setCreatedRooms(
        createdResult?.collections ?? []
      );

      setMemberRooms(
        memberResult?.collections ?? []
      );
    } catch (err) {
      console.error(
        "Failed to load Rooms:",
        err
      );

      setError(
        err?.message ||
          err?.error ||
          "We couldn't load your Rooms."
      );
    } finally {
      setLoadingCreated(false);
      setLoadingMember(false);
    }
  }, [
    currentProfile?.id,
    dispatch,
  ]);


  useEffect(() => {
    loadRooms();
  }, [loadRooms]);


  // ----------------------------------------------------------
  // System spaces
  // ----------------------------------------------------------

  const systemRooms = useMemo(() => {
    const profileCollections =
      currentProfile?.profileToCollections ?? [];

    const allCollections = [
      ...createdRooms,
      ...profileCollections
        .map(
          (item) => item?.collection
        )
        .filter(Boolean),
    ];

    const byId = new Map();

    allCollections.forEach((collection) => {
      if (collection?.id) {
        byId.set(
          collection.id,
          collection
        );
      }
    });

    const findByType = (type) =>
      [...byId.values()].find(
        (collection) =>
          collection?.type === type
      ) || null;

    return {
      archive: findByType("archive"),
      home: findByType("home"),
      events: null,
      portfolio: null,
    };
  }, [
    createdRooms,
    currentProfile,
  ]);


  // ----------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------

  const handleCreate = () => {
    if (Paths?.collections?.createRoute) {
      alert("ADD the CReate form thigns")
      // history.push(
      //   Paths.collections.createRoute()
      // );
      return;
    }

    // if (Paths?.collection?.createRoute) {
    //   history.push(
    //     Paths.collection.createRoute()
    //   );
    // }
  };


  const handleOpenRoom = (room) => {
    if (!room?.id) return;
router.push(
      Paths.collection.createRoute(
        room.id
      ),
    
    );

  };


  const handleOpenSystemRoom = (room) => {
    if (room?.id) {
      handleOpenRoom(room);
    }
  };


  return (
        <IonContent
          scrollY={true}
          className="page-content"
          fullscreen
     >
    <main
      className="
        h-[100%]
        min-h-0
        overflow-y-auto
        overscroll-contain
        bg-base-surface
        text-text-primary
        dark:bg-base-bgDark
        dark:text-cream
      "
    >
      <div
        className={`${PAGE} pb-24 pt-10 sm:pt-14`}
      >

        {/* Intro */}

        <header>
          <p className={EYEBROW}>
            Your Rooms
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Places for your work to live.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary dark:text-gray-300 sm:text-lg">
            Keep the things you return to, make
            spaces for other people, and decide
            what belongs together.
          </p>
        </header>


        {/* Error */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
            <p>{error}</p>

            <button
              type="button"
              onClick={loadRooms}
              className="mt-3 rounded-full border border-red-300 px-4 py-2 font-medium transition hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-950"
            >
              Try again
            </button>
          </div>
        )}


        {/* Four spaces */}

        <section className={SECTION}>
          <div className="mb-5">
            <p className={EYEBROW}>
              Your four spaces
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <SystemRoomCard
              title="Archive"
              description="Kept, but not in the way."
              room={systemRooms.archive}
              onClick={() =>
                handleOpenSystemRoom(
                  systemRooms.archive
                )
              }
              disabled={
                !systemRooms.archive
              }
            />

            <SystemRoomCard
              title="Events"
              description="Rooms I have been in, and rooms I am going to."
              onClick={() => {
                if (Paths?.calendar) {
                  alert("THIS NEEDS TO BE THE PERSONAL")
                  // router.push(Paths.calendar())
              
                }
              }}
            />

            <SystemRoomCard
              title="Home"
              description="What I want to encounter when I open Plumbum."
              room={systemRooms.home}
              onClick={() =>
                handleOpenSystemRoom(
                  systemRooms.home
                )
              }
              disabled={!systemRooms.home}
            />

            <SystemRoomCard
              title="Portfolio"
              description="What I want other people to read first."
              onClick={() => {
                if (Paths?.write?.path) {
           
                  history.push(
                    Paths.write.path
                  );
                }
              }}
            />

          </div>
        </section>


        {/* Created Rooms */}

        <section className={SECTION}>

          <div className="flex items-end justify-between gap-4">

            <div>
              <p className={EYEBROW}>
                Collections you keep
              </p>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                Rooms you've made
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary dark:text-gray-400">
                A Room can start with a few Stories
                and become something else over time.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="
                hidden
                shrink-0
                rounded-full
                bg-button-primary-bg
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-button-primary-hover
                sm:block
              "
            >
              + New Room
            </button>

          </div>


          <div className="mt-6">

            {loadingCreated ? (
              <RoomGridSkeleton count={4} />
            ) : createdRooms.length > 0 ? (
              <RoomGrid
                rooms={createdRooms}
                onOpen={handleOpenRoom}
              />
            ) : (
              <EmptyRooms
                message="No collections yet. Start one before you know what it is. It can change shape later."
                actionLabel="Start a Room"
                onAction={handleCreate}
              />
            )}

          </div>


          <button
            type="button"
            onClick={handleCreate}
            className="
              mt-4
              flex
              w-full
              items-center
              justify-center
              rounded-full
              border
              border-base-soft
              bg-transparent
              px-5
              py-3
              text-sm
              font-semibold
              text-text-brand
              transition
              hover:bg-base-soft/10
              sm:hidden
            "
          >
            + New Room
          </button>

        </section>


        {/* Member Rooms */}

        <section className={SECTION}>

          <div>
            <p className={EYEBROW}>
              Rooms you were invited into
            </p>

            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
              Rooms with other people
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary dark:text-gray-400">
              Someone gave you a role here.
            </p>
          </div>


          <div className="mt-6">

            {loadingMember ? (
              <RoomGridSkeleton count={3} />
            ) : memberRooms.length > 0 ? (
              <RoomGrid
                rooms={memberRooms}
                onOpen={handleOpenRoom}
                showRole
                currentProfileId={
                  currentProfile?.id
                }
              />
            ) : (
              <EmptyRooms
                message="No invitations yet. Workshops and shared collections you're added to will show up here."
              />
            )}

          </div>

        </section>

      </div>
    </main>
    </IonContent>
  );
}


// ============================================================
// Room Grid
// ============================================================

function RoomGrid({
  rooms,
  onOpen,
  showRole = false,
  currentProfileId,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={() => onOpen(room)}
          showRole={showRole}
          currentProfileId={
            currentProfileId
          }
        />
      ))}
    </div>
  );
}


// ============================================================
// Room Card
// ============================================================

function RoomCard({
  room,
  onClick,
  showRole,
  currentProfileId,
}) {
  const role = useMemo(() => {
    if (
      !showRole ||
      !currentProfileId
    ) {
      return null;
    }

    return (
      room?.roles?.find(
        (item) =>
          item?.profileId ===
            currentProfileId ||
          item?.profile?.id ===
            currentProfileId
      )?.role || null
    );
  }, [
    room,
    showRole,
    currentProfileId,
  ]);

  const storyCount =
    room?.storyIdList?.length ?? 0;

  const childCount =
    room?.childCollections?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left"
    >
      <article
        className="
          relative
          flex
          min-h-[12rem]
          flex-col
          justify-between
          overflow-hidden
          rounded-2xl
          border
          border-card-border
          bg-card-background
          p-5
          shadow-sm
          transition
          duration-200
          hover:-translate-y-0.5
          hover:border-base-soft
          hover:shadow-md
          dark:border-gray-700
          dark:bg-base-surfaceDark
        "
      >

        <div>

          <div className="flex items-start justify-between gap-4">

            <span className="rounded-full bg-base-surface px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-text-secondary dark:bg-base-bgDark dark:text-gray-300">
              {getRoomTypeLabel(room?.type)}
            </span>

            {room?.isWorkshop && (
              <span className="rounded-full bg-softBlue px-3 py-1 text-[0.68rem] font-semibold text-teal dark:bg-teal/20 dark:text-softBlue">
                Workshop
              </span>
            )}

          </div>


          <h3 className="mt-5 font-serif text-xl leading-tight text-text-primary transition group-hover:text-text-brand dark:text-cream">
            {room?.title || "Untitled"}
          </h3>


          {room?.purpose && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary dark:text-gray-400">
              {room.purpose}
            </p>
          )}

        </div>


        <div className="mt-8 flex items-end justify-between gap-3">

          <div className="flex flex-wrap gap-2 text-xs text-text-secondary dark:text-gray-400">

            {storyCount > 0 && (
              <span>
                {storyCount}{" "}
                {storyCount === 1
                  ? "Story"
                  : "Stories"}
              </span>
            )}

            {childCount > 0 && (
              <span>
                {childCount}{" "}
                {childCount === 1
                  ? "Room"
                  : "Rooms"}
              </span>
            )}

            {storyCount === 0 &&
              childCount === 0 && (
                <span>
                  Empty for now
                </span>
              )}

          </div>


          {role && (
            <span className="shrink-0 text-xs font-semibold capitalize text-text-brand">
              {role}
            </span>
          )}

        </div>


        <span className="absolute bottom-5 right-5 translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>

      </article>
    </button>
  );
}


// ============================================================
// System Room Card
// ============================================================

function SystemRoomCard({
  title,
  collecitonId,
  description,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group w-full text-left ${
        disabled
          ? "cursor-default"
          : "cursor-pointer"
      }`}
    >
      <article
        className={`
          min-h-[8.5rem]
          rounded-2xl
          border
          p-5
          transition
          ${
            disabled
              ? "border-card-border bg-card-background/60 dark:border-gray-800 dark:bg-base-surfaceDark/60"
              : "border-card-border bg-card-background hover:-translate-y-0.5 hover:border-base-soft hover:shadow-md dark:border-gray-700 dark:bg-base-surfaceDark"
          }
        `}
      >

        <div className="flex items-center justify-between">

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            Space
          </span>

          {!disabled && (
            <span className="text-sm text-text-secondary opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
              →
            </span>
          )}

        </div>


        <h3 className="mt-4 font-serif text-xl text-text-primary dark:text-cream">
          {title}
        </h3>


        <p className="mt-1 max-w-sm text-sm leading-5 text-text-secondary dark:text-gray-400">
          {description}
        </p>

      </article>
    </button>
  );
}


// ============================================================
// Empty
// ============================================================

function EmptyRooms({
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-card-border bg-base-bg/40 px-6 py-10 text-center dark:border-gray-700 dark:bg-base-surfaceDark/40">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-base-surface text-xl dark:bg-base-bgDark">
        +
      </div>

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-text-secondary dark:text-gray-400">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-button-primary-bg px-5 py-3 text-sm font-semibold text-white transition hover:bg-button-primary-hover"
        >
          {actionLabel}
        </button>
      )}

    </div>
  );
}


// ============================================================
// Skeleton
// ============================================================

function RoomGridSkeleton({
  count = 4,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">

      {Array.from({
        length: count,
      }).map((_, index) => (
        <div
          key={index}
          className="
            min-h-[12rem]
            animate-pulse
            rounded-2xl
            border
            border-card-border
            bg-card-background
            p-5
            dark:border-gray-700
            dark:bg-base-surfaceDark
          "
        >
          <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />

          <div className="mt-6 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-3 h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-2 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="mt-8 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}

    </div>
  );
}


// ============================================================
// Helpers
// ============================================================

function getRoomTypeLabel(type) {
  switch (type) {
    case "library":
      return "Library";

    case "book":
      return "Collection";

    case "feedback":
      return "Feedback";

    case "home":
      return "Home";

    case "archive":
      return "Archive";

    default:
      return "Room";
  }
}