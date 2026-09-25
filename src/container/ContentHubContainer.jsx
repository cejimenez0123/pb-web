import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import useProfileDependentEffects from "../core/useProfileDependentEffects.jsx";
import Paths from "../core/paths.js";
import { PageType } from "../core/constants.js";
import { IonContent, useIonRouter } from "@ionic/react";


/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
|
| Home is the user's personal front door to Plumbum.
|
| It answers:
|
|   "What should I do or encounter right now?"
|
| It is intentionally different from:
|
|   Write    -> active writing practice
|   Discover -> things beyond the user's own work
|   Events   -> complete event/calendar experience
|   You      -> complete body of work, rooms, portfolio, etc.
|
| Dashboard has been removed from this architecture.
|
*/


export default function ContentHubContainer() {


  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );
  const router = useIonRouter()
  /*
   * Keep the existing data hook for now.
   *
   * This avoids rewriting the existing data layer while the UI is
   * being redesigned.
   */
  const isTablet = useMediaQuery("(min-width: 768px)");

  const {
    workshops = [],
    stories = [],
    prompts = [],
  } = useProfileDependentEffects(
    currentProfile,
    true,
    isTablet ? 3 : 1
  );

  const homeRoom = useMemo(() => {
    return currentProfile?.profileToCollections?.find(
      (item) => item?.type === "home"
    )?.collection;
  }, [currentProfile?.profileToCollections]);

  /*
   * Until the event/calendar data source is connected to Home,
   * this remains empty rather than fabricating event data.
   *
   * The UI is already structured for:
   *
   *   featuredEvent
   *   upcomingEvents
   *
   * so the data source can be connected without redesigning the page.
   */
  const featuredEvent = null;
  const upcomingEvents = [];

  /*
   * The existing hook gives us stories. Home only wants active/open work,
   * not the writer's complete body of work.
   */
  const openStories = useMemo(() => {
    return [...stories]
      .filter((story) => {
        if (!story) return false;

        /*
         * Home should emphasize things that are still in process.
         * If status is unavailable, retain the story rather than hiding it.
         */
        if (!story.status) return true;

        return [
          "draft",
          "fragment",
          "workshop",
        ].includes(String(story.status).toLowerCase());
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
   * Home rooms are a preview of the user's rooms.
   *
   * The complete room management experience belongs on the Rooms page.
   */
  const homeRooms = useMemo(() => {
    const rooms = [];

    /*
     * Home is a known system room.
     */
    if (homeRoom) {
      rooms.push(homeRoom);
    }

    /*
     * The profile's other profile-to-collection relationships can be
     * surfaced here without assuming a particular backend collection
     * shape beyond the existing profile relationship.
     */
    const relatedRooms =
      currentProfile?.profileToCollections
        ?.map((item) => item?.collection)
        ?.filter(Boolean)
        ?.filter((room) => {
          if (!room?.id) return false;

          return !rooms.some(
            (existing) => existing?.id === room.id
          );
        }) || [];

    return [...rooms, ...relatedRooms].slice(0, 4);
  }, [
    currentProfile?.profileToCollections,
    homeRoom,
  ]);

  if (!currentProfile) {
    return null;
  }

  const goToWrite = () => {
    router.push(Paths.write)
  };

  const goToRooms = () => {
    /*
     * The complete Rooms route should be wired here when the new
     * collection/room route is established.
     *
     * For now we intentionally do not invent a Paths property that
     * has not been established in the existing application.
     */
    router.push("/collections");
  };

  const goToWorkshop = () => {
    /*
     * Existing application code uses collection routes for workshops.
     * The dedicated Workshop reader route is already present in the
     * older implementation, so prefer it when available.
     */
    if (Paths.workshop?.reader) {
      router.push(Paths.workshop.reader());
      return;
    }

    router.push("/workshop");
  };

  const goToEvents = () => {
    router.push("/events");
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
      router.push(
        Paths.page.createRoute(story.id)
      );
    }
  };

  return (
        <IonContent
          scrollY={true}
          className="page-content"
          fullscreen
        >
    <main className="h-[100%] overflow-scroll bg-base-bg text-text-primary">
      <div
        className="
          mx-auto
          w-full
          max-w-[50em]
          px-4
          pb-24
          pt-12
          sm:px-6
          sm:pt-16
          lg:px-8
          lg:pt-20
        "
      >

        <HomeHeader
          profile={currentProfile}
          onWrite={goToWrite}
          onRooms={goToRooms}
          onWorkshop={goToWorkshop}
        />


        <FeaturedEventSection
          event={featuredEvent}
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
        />


        <UpcomingEventsSection
          events={upcomingEvents}
          onViewEvents={goToEvents}
        />


        {/*
         * Prompts remain a first-class Plumbum feature.
         *
         * They are intentionally not turned into another large Home
         * section here. Discover can own the broader prompt experience,
         * while Home can later surface one prompt as a small daily
         * interruption.
         *
         * Keeping prompts in the data layer means this decision does
         * not require another architectural rewrite.
         */}
      </div>
    </main>
    </IonContent>
  );
}


/*
|--------------------------------------------------------------------------
| HEADER
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
    <header>
      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.14em]
          text-text-secondary
        "
      >
        Home
      </p>

      <h1
        className="
          mt-3
          max-w-3xl
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
        Back again, {name}.
      </h1>

      <div
        className="
          mt-7
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:flex-wrap
        "
      >
        <HomeAction
          variant="primary"
          onClick={onWrite}
        >
          Write something
        </HomeAction>

        <HomeAction
          variant="secondary"
          onClick={onRooms}
        >
          Your rooms
        </HomeAction>

        <HomeAction
          variant="secondary"
          onClick={onWorkshop}
        >
          Read someone else
        </HomeAction>
      </div>
    </header>
  );
}


/*
|--------------------------------------------------------------------------
| FEATURED EVENT
|--------------------------------------------------------------------------
|
| This is intentionally first on Home after the personal greeting.
|
| It is the primary place where Plumbum can eventually promote:
|
|   - workshops
|   - readings
|   - mixers
|   - community events
|   - partner events
|
| The user can click through into the full Events experience.
|
*/

function FeaturedEventSection({
  event,
  onViewEvents,
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        eyebrow="For you"
        title="Something happening"
        actionLabel="See all events"
        onAction={onViewEvents}
      />

      {event ? (
        <FeaturedEventCard
          event={event}
          onClick={onViewEvents}
        />
      ) : (
        <EmptyState
          title="Find something to enter."
          description="See what's happening around Plumbum."
          action="Browse events"
          onAction={onViewEvents}
        />
      )}
    </section>
  );
}


function FeaturedEventCard({
  event,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        block
        w-full
        border
        border-border-soft
        bg-base-surface
        p-6
        text-left
        transition-all
        duration-200
        hover:border-base-soft
        hover:shadow-sm
        sm:p-7
      "
    >
      <p
        className="
          text-xs
          font-medium
          uppercase
          tracking-[0.12em]
          text-text-secondary
        "
      >
        {formatEventDate(event)}
      </p>

      <h3
        className="
          mt-3
          max-w-2xl
          font-serif
          text-2xl
          font-semibold
          leading-tight
          text-text-primary
          sm:text-3xl
        "
      >
        {event?.title || "Something happening"}
      </h3>

      {event?.description && (
        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {event.description}
        </p>
      )}

      <span
        className="
          mt-5
          inline-flex
          text-sm
          font-medium
          text-text-brand
        "
      >
        See event
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
        description="Drafts and fragments you haven't decided about."
        actionLabel={
          stories.length > 0
            ? "See all work"
            : undefined
        }
        onAction={
          stories.length > 0
            ? onWrite
            : undefined
        }
      />

      {stories.length > 0 ? (
        <WorkList
          stories={stories}
          onSelectStory={onSelectStory}
        />
      ) : (
        <EmptyState
          title="Nothing half-written."
          description="Begin anywhere — nobody sees a draft but you."
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

function WorkList({
  stories,
  onSelectStory,
}) {
  return (
    <div className="border-y space-y-4 border-border-soft">
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


function WorkRow({
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
        min-h-16
        w-[100%]
        items-center
        justify-between
        gap-5
        border-b
        border-border-soft
        py-4
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
          "
        >
          {story?.title || "Untitled"}
        </h3>

        {story?.status && (
          <p
            className="
              mt-1
              text-xs
              uppercase
              tracking-[0.08em]
              text-text-secondary
            "
          >
            {formatStatus(story.status)}
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
| ROOMS PREVIEW
|--------------------------------------------------------------------------
|
| This is deliberately NOT the full Rooms page.
|
| Home gives a glimpse of the rooms the user regularly keeps.
|
| "Your rooms" / "See all" takes them to the full Rooms experience.
|
*/

function RoomsPreviewSection({
  rooms,
  onViewRooms,
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        title="Your rooms"
        actionLabel="See all"
        onAction={onViewRooms}
      />

      {rooms.length > 0 ? (
        <RoomGrid rooms={rooms} />
      ) : (
        <EmptyState
          title="No rooms yet."
          description="Make a room for things you want to keep together."
          action="Make a room"
          onAction={onViewRooms}
        />
      )}
    </section>
  );
}


function RoomGrid({
  rooms,
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
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
        />
      ))}
    </div>
  );
}


function RoomCard({
  room,
}) {
  const pieceCount =
    room?.storyCount ??
    room?.stories?.length ??
    room?.storyIdList?.length ??
    null;

  return (
    <article
      className="
        min-h-36
        border
        border-border-soft
        bg-base-surface
        p-5
        transition-colors
        hover:border-base-soft
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
        {room?.title ||
          room?.name ||
          "Untitled room"}
      </h3>

      {room?.description && (
        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {room.description}
        </p>
      )}

      {pieceCount !== null && (
        <p
          className="
            mt-4
            text-xs
            text-text-secondary
          "
        >
          {pieceCount}{" "}
          {pieceCount === 1 ? "piece" : "pieces"}
        </p>
      )}
    </article>
  );
}


/*
|--------------------------------------------------------------------------
| COMING UP
|--------------------------------------------------------------------------
*/

function UpcomingEventsSection({
  events,
  onViewEvents,
}) {
  return (
    <section className="mt-14">
      <SectionHeader
        title="Coming up"
        actionLabel="All events"
        onAction={onViewEvents}
      />

      {events.length > 0 ? (
        <EventList
          events={events}
          onSelect={onViewEvents}
        />
      ) : (
        <EmptyState
          title="Quiet calendar."
          description="Nothing scheduled right now."
        />
      )}
    </section>
  );
}


function EventList({
  events,
  onSelect,
}) {
  return (
    <div className="border-y border-border-soft">
      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={onSelect}
          className="
            group
            flex
            w-full
            items-center
            justify-between
            gap-5
            border-b
            border-border-soft
            py-4
            text-left
            last:border-b-0
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs
                uppercase
                tracking-[0.08em]
                text-text-secondary
              "
            >
              {formatEventDate(event)}
            </p>

            <h3
              className="
                mt-1
                truncate
                font-serif
                text-lg
                text-text-primary
              "
            >
              {event?.title || "Untitled event"}
            </h3>
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
      ))}
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| SHARED SECTION HEADER
|--------------------------------------------------------------------------
*/

function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="
        mb-4
        border-b
        border-border-soft
        pb-3
      "
    >
      <div
        className="
          flex
          items-end
          justify-between
          gap-4
        "
      >
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="
                mb-1
                text-xs
                font-medium
                uppercase
                tracking-[0.12em]
                text-text-secondary
              "
            >
              {eyebrow}
            </p>
          )}

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
                max-w-xl
                text-sm
                leading-relaxed
                text-text-secondary
              "
            >
              {description}
            </p>
          )}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="
              shrink-0
              text-sm
              font-medium
              text-text-brand
              transition-opacity
              hover:opacity-70
            "
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
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
  const base = `
    inline-flex
    min-h-11
    items-center
    justify-center
    rounded-full
    px-5
    py-2.5
    text-sm
    font-medium
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-base-soft
    focus:ring-offset-2
    focus:ring-offset-base-bg
  `;

  const variants = {
    primary: `
      bg-base-soft
      text-white
      hover:bg-button-primary-hover
    `,

    secondary: `
      border
      border-border-soft
      bg-transparent
      text-text-primary
      hover:border-base-soft
      hover:text-text-brand
    `,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}


/*
|--------------------------------------------------------------------------
| EMPTY STATE
|--------------------------------------------------------------------------
*/

function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div
      className="
        flex
        min-h-44
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
        sm:min-h-48
      "
    >
      <h3
        className="
          font-serif
          text-xl
          font-semibold
          text-text-primary
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

      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-5
            inline-flex
            min-h-10
            items-center
            justify-center
            rounded-full
            border
            border-border-soft
            px-5
            py-2
            text-sm
            font-medium
            text-text-primary
            transition-colors
            hover:border-base-soft
            hover:text-text-brand
            focus:outline-none
            focus:ring-2
            focus:ring-base-soft
          "
        >
          {action}
        </button>
      )}
    </div>
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

  return (
    labels[String(status).toLowerCase()] ||
    status
  );
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
| SMALL RESPONSIVE MEDIA QUERY HOOK
|--------------------------------------------------------------------------
|
| Keeps this page independent from Ionic and react-responsive.
|
*/

function useMediaQuery(query) {
  const [matches, setMatches] =
    React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery =
      window.matchMedia(query);

    const update = () => {
      setMatches(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener?.(
      "change",
      update
    );

    return () => {
      mediaQuery.removeEventListener?.(
        "change",
        update
      );
    };
  }, [query]);

  return matches;
}