

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";

import useProfileDependentEffects from "../core/useProfileDependentEffects.jsx";
import Paths from "../core/paths.js";
import { PageType } from "../core/constants.js";
import { useDialog } from "../domain/usecases/useDialog.jsx";

import CreateCollectionForm from "../components/collection/CreateCollectionForm.jsx";
import UpcomingEventsSection from "../components/events/UpcomingEventsSection.jsx";
import SectionHeader from "../components/pieces/SectionHeader.jsx";
import EmptyState from "../components/general/EmptyState.jsx";

import styles from "../styles/style.js";

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
|
| Home is the user's personal front door to Plumbum.
|
| Write    -> active writing practice
| Discover -> things beyond the user's own work
| Events   -> complete event/calendar experience
| You      -> complete body of work and rooms
|
*/

export default function ContentHubContainer() {
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const router = useIonRouter();
  const isTablet = useMediaQuery("(min-width: 768px)");

  const { stories = [] } = useProfileDependentEffects(
    currentProfile,
    true,
    isTablet ? 3 : 1
  );

  const { openDialog, closeDialog } = useDialog();

  /*
   * Home only surfaces work that is still in progress.
   * Stories without a status remain visible.
   */
  const openStories = useMemo(() => {
    return [...stories]
      .filter((story) => {
        if (!story) return false;
        if (!story.status) return true;

        return ["draft", "fragment", "workshop"].includes(
          String(story.status).toLowerCase()
        );
      })
      .sort((a, b) => {
        const aDate = new Date(
          a?.updated ||
            a?.updatedAt ||
            a?.created ||
            a?.createdAt ||
            0
        ).getTime();

        const bDate = new Date(
          b?.updated ||
            b?.updatedAt ||
            b?.created ||
            b?.createdAt ||
            0
        ).getTime();

        return bDate - aDate;
      })
      .slice(0, 4);
  }, [stories]);

  /*
   * Home shows a preview of the user's rooms.
   * Full room management stays on the Rooms experience.
   */
  const homeRooms = useMemo(() => {
    const relationships =
      currentProfile?.profileToCollections || [];

    return relationships
      .filter((item) => item?.collection?.id)
      .slice(0, 4);
  }, [currentProfile?.profileToCollections]);

  if (!currentProfile) {
    return null;
  }

  const goToWrite = () => {
    router.push(Paths.write);
  };

  const goToRoom = (profileToCollection) => {
    const collection = profileToCollection?.collection;

    if (!collection?.id) return;

    router.push(
      Paths.collection.createRoute(collection.id)
    );
  };

  const goToRooms = () => {
    openDialog({
      title: "Make a room",
      scrollY: false,
      text: (
        <CreateCollectionForm
          onClose={() => closeDialog()}
        />
      ),
      disagree: () => closeDialog(),
      disagreeText: "Close",
      breakpoint: 1,
    });
  };

  const goToWorkshop = () => {
    if (Paths.workshop?.reader) {
      router.push(Paths.workshop.reader());
      return;
    }

    router.push("/workshop");
  };

  const goToStory = (story) => {
    if (!story?.id) return;

    const type = story.type || PageType.text;

    if (Paths.editPage?.createRoute) {
      router.push(
        Paths.editPage.createRoute(story.id, type)
      );
      return;
    }

    if (Paths.page?.createRoute) {
      router.push(Paths.page.createRoute(story.id));
    }
  };

  const goToEvents = () => {
    router.push(Paths.calendar());
  };

  return (
    <IonContent
      scrollY={true}
      className="page-content"
      fullscreen
    >
      <main
        className="
          min-h-full
          bg-plumb-canvas
          text-plumb-ink
          dark:bg-plumb-dark-canvas
          dark:text-plumb-darkText
        "
      >
        <div
          className="
            mx-auto w-full max-w-[50em]
            px-4 pb-24 pt-12
            sm:px-6 sm:pt-16
            lg:px-8 lg:pt-20
          "
        >
          <HomeHeader
            profile={currentProfile}
            onWrite={goToWrite}
            onRooms={goToRooms}
            onWorkshop={goToWorkshop}
          />

          <FeaturedEventSection
            currentProfile={currentProfile}
            onViewEvents={goToEvents}
          />

          <OpenWorkSection
            stories={openStories}
            onWrite={goToWrite}
            onSelectStory={goToStory}
          />

          <RoomsPreviewSection
            rooms={homeRooms}
            onViewRooms={goToRooms}
            onSelectRoom={goToRoom}
          />
        </div>
      </main>
    </IonContent>
  );
}

/*
|--------------------------------------------------------------------------
| HOME HEADER
|--------------------------------------------------------------------------
*/

function HomeHeader({
  profile,
  onWrite,
  onRooms,
  onWorkshop,
}) {
  const name =
    profile?.firstName ||
    profile?.first_name ||
    profile?.username ||
    "there";

  return (
    <header className="pb-2">
      <p
        className={`
          ${styles.text.metadata}
          uppercase tracking-[0.14em]
        `}
      >
        YOUR SPACE
      </p>

      <h1
        className={`
          ${styles.text.display}
          mt-3 max-w-3xl
        `}
      >
        Good to have you back, {name}.
      </h1>

      <p className={`${styles.text.readable} mt-4 max-w-2xl`}>
        Pick up where you left off, make something new,
        or find a little inspiration from another writer.
      </p>

      <div
        className="
          mt-7 flex flex-col gap-3
          sm:flex-row sm:flex-wrap
        "
      >
        <HomeAction
          variant="primary"
          onClick={onWrite}
        >
          Start writing
        </HomeAction>

        <HomeAction
          variant="secondary"
          onClick={onRooms}
        >
          Make a room
        </HomeAction>

        <HomeAction
          variant="secondary"
          onClick={onWorkshop}
        >
          Read with the community
        </HomeAction>
      </div>
    </header>
  );
}

/*
|--------------------------------------------------------------------------
| UPCOMING EVENTS
|--------------------------------------------------------------------------
|
| The existing event component remains responsible for its own display.
| Keep the list empty until the Home event data source is connected.
|
*/

function FeaturedEventSection({
  onViewEvents,
  currentProfile,
}) {
  const upcomingEvents = [];

  return (
    <section className="mt-14">
      <UpcomingEventsSection
        profile={currentProfile}
        events={upcomingEvents}
        onViewEvents={onViewEvents}
      />
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| OPTIONAL FEATURED EVENT CARD
|--------------------------------------------------------------------------
|
| Retained for use if Home later surfaces a single featured event.
|
*/

function FeaturedEventCard({ event, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group block w-full rounded-2xl
        border border-plumb-border
        bg-plumb-elevated p-6 text-left
        transition-all duration-200
        hover:border-plumb-mintHover hover:shadow-sm
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-plumb-focus
        focus-visible:ring-offset-2
        focus-visible:ring-offset-plumb-canvas
        dark:border-plumb-darkBorder
        dark:bg-plumb-dark-surface
        dark:hover:border-plumb-mintLight
        dark:focus-visible:ring-offset-plumb-dark-canvas
        sm:p-7
      "
    >
      <p className={styles.text.metadata}>
        {formatEventDate(event)}
      </p>

      <h3
        className={`
          ${styles.text.heading}
          mt-3 max-w-2xl
        `}
      >
        {event?.title || "Something happening"}
      </h3>

      {event?.description && (
        <p className={`${styles.text.body} mt-3 max-w-2xl`}>
          {event.description}
        </p>
      )}

      <span
        className="
          mt-5 inline-flex items-center
          text-sm font-medium
          text-plumb-mintHover
          dark:text-plumb-mintLight
        "
      >
        See event details
        <span
          aria-hidden="true"
          className="
            ml-2 transition-transform
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
| STILL OPEN
|--------------------------------------------------------------------------
*/

function OpenWorkSection({
  stories,
  onWrite,
  onSelectStory,
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        title="Still open"
        description="Drafts and fragments you're still finding your way through."
        actionLabel={
          stories.length > 0 ? "See all work" : undefined
        }
        onAction={
          stories.length > 0 ? onWrite : undefined
        }
      />

      {stories.length > 0 ? (
        <WorkList
          stories={stories}
          onSelectStory={onSelectStory}
        />
      ) : (
        <EmptyState
          title="Nothing in progress just yet."
          description="Start with a line, a fragment, or whatever is on your mind."
          action="Start writing"
          onAction={onWrite}
        />
      )}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| WORK LIST
|--------------------------------------------------------------------------
*/

function WorkList({ stories, onSelectStory }) {
  return (
    <div
      className="
        mt-4 space-y-1
        border-y border-plumb-border
        dark:border-plumb-darkBorder
      "
    >
      {stories.map((story) => (
        <WorkRow
          key={story.id}
          story={story}
          onClick={() => onSelectStory(story)}
        />
      ))}
    </div>
  );
}

function WorkRow({ story, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex min-h-16 w-[100%]
        items-center justify-between gap-5
        border-b border-plumb-border
        py-4 text-left transition-colors
        last:border-b-0
        hover:bg-plumb-surface/70
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-inset
        focus-visible:ring-plumb-focus
        dark:border-plumb-darkBorder
        dark:hover:bg-plumb-dark-surface
      "
    >
      <div className="min-w-0">
        <h3
          className={`
            ${styles.text.subheading}
            truncate font-serif
          `}
        >
          {story?.title || "Untitled"}
        </h3>

        {story?.status && (
          <p
            className={`
              ${styles.text.metadata}
              mt-1 uppercase tracking-[0.08em]
            `}
          >
            {formatStatus(story.status)}
          </p>
        )}
      </div>

      <span
        aria-hidden="true"
        className="
          shrink-0 text-xl
          text-plumb-muted transition-transform
          group-hover:translate-x-1
          dark:text-plumb-darkMuted
        "
      >
        →
      </span>
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| ROOMS PREVIEW
|--------------------------------------------------------------------------
*/

function RoomsPreviewSection({
  rooms,
  onViewRooms,
  onSelectRoom,
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        title="Your rooms"
        description="Places to gather the stories, ideas, and things you want to keep close."
        actionLabel="+ Make a room"
        onAction={onViewRooms}
      />

      {rooms.length > 0 ? (
        <RoomGrid
          rooms={rooms}
          onSelectRoom={onSelectRoom}
        />
      ) : (
        <EmptyState
          title="No rooms yet."
          description="Create a room to keep stories and ideas together."
          action="Make a room"
          onAction={onViewRooms}
        />
      )}
    </section>
  );
}

function RoomGrid({ rooms, onSelectRoom }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {rooms.map((profileToCollection) => (
        <RoomCard
          key={profileToCollection.id}
          profileToCollection={profileToCollection}
          onClick={() => onSelectRoom(profileToCollection)}
        />
      ))}
    </div>
  );
}

function RoomCard({ profileToCollection, onClick }) {
  const room = profileToCollection?.collection;

  if (!room?.id) {
    return null;
  }

  const pieceCount =
    room?.storyCount ??
    room?.stories?.length ??
    room?.storyIdList?.length ??
    null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group flex min-h-36 w-full flex-col
        rounded-2xl border border-plumb-border
        bg-plumb-surface p-5 text-left
        transition-all duration-200
        hover:border-plumb-mintHover hover:shadow-sm
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-plumb-focus
        focus-visible:ring-offset-2
        focus-visible:ring-offset-plumb-canvas
        dark:border-plumb-darkBorder
        dark:bg-plumb-dark-surface
        dark:hover:border-plumb-mintLight
        dark:focus-visible:ring-offset-plumb-dark-canvas
      "
    >
      <p
        className={`
          ${styles.text.metadata}
          uppercase tracking-[0.1em]
        `}
      >
        Room
      </p>

      <div className="flex items-start justify-between gap-4">
        <h3
          className={`
            ${styles.text.subheading}
            mt-2 font-serif
          `}
        >
          {room.title || room.name || "Untitled room"}
        </h3>

        <span
          aria-hidden="true"
          className="
            mt-2 shrink-0 text-xl
            text-plumb-muted transition-transform
            group-hover:translate-x-1
            dark:text-plumb-darkMuted
          "
        >
          →
        </span>
      </div>

      {room.description && (
        <p
          className={`
            ${styles.text.body}
            mt-2 line-clamp-2
          `}
        >
          {room.description}
        </p>
      )}

      {pieceCount !== null && (
        <p className={`${styles.text.metadata} mt-auto pt-4`}>
          {pieceCount} {pieceCount === 1 ? "piece" : "pieces"}
        </p>
      )}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| HOME ACTION
|--------------------------------------------------------------------------
*/

function HomeAction({
  children,
  onClick,
  variant = "secondary",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        ${styles.button.base}
        ${variant === "primary"
          ? styles.button.primary
          : styles.button.secondary}
        ${styles.button.medium}
        min-h-11 w-full
        sm:w-auto
      `}
    >
      {children}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Finished",
    published: "Finished",
  };

  return labels[String(status).toLowerCase()] || status;
}

function formatEventDate(event) {
  if (!event) return "";

  const rawDate =
    event?.startDate ||
    event?.start_date ||
    event?.date ||
    event?.start;

  if (!rawDate) return "";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

/*
|--------------------------------------------------------------------------
| RESPONSIVE MEDIA QUERY
|--------------------------------------------------------------------------
*/

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);

    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
    } else {
      // Compatibility fallback for older WebViews.
      mediaQuery.addListener(update);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", update);
      } else {
        mediaQuery.removeListener(update);
      }
    };
  }, [query]);

  return matches;
}
