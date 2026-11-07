
import { useMemo } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";

import Paths from "../core/paths.js";
import { PageType } from "../core/constants.js";
import { useDialog } from "../domain/usecases/useDialog.jsx";

import CreateCollectionForm from "../components/collection/CreateCollectionForm.jsx";
import UpcomingEventsSection from "../components/events/UpcomingEventsSection.jsx";

import styles from "../styles/style.js";
import ErrorBoundary from "../ErrorBoundary.jsx";
import RoomsPreviewSection from "../components/collection/RoomsPreviewSection.jsx";
import OpenWorkSection from "../components/OpenWorkSection.jsx";

// Keep fallback references stable.
// Do not use `|| []` or `|| {}` directly inside a selector.
const EMPTY_ARRAY = [];

/*
|--------------------------------------------------------------------------
| CONTENT HUB
|--------------------------------------------------------------------------
*/

function ContentHubContainer() {
  return (
    <IonContent fullscreen={true} scrollY={true}>
      <ErrorBoundary>
 <main className={[styles.pageShell.base].join(" ")}>
        <ContentHubContent />
     </main>
      </ErrorBoundary>
    </IonContent>
  );
}

/*
|--------------------------------------------------------------------------
| HOME DATA
|--------------------------------------------------------------------------
|
| Keep Redux selection separate from presentation.
| These selectors return existing Redux references rather than creating
| new objects or arrays.
|
*/

function useHomeData() {
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const recommendedStories = useSelector(
    (state) => state.pages.recommendedStories
  );

  const stories = Array.isArray(recommendedStories)
    ? recommendedStories
    : EMPTY_ARRAY;

  const profileCollections = Array.isArray(
    currentProfile?.profileToCollections
  )
    ? currentProfile.profileToCollections
    : EMPTY_ARRAY;

  const openStories = useMemo(() => {
    return stories
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

  const homeRooms = useMemo(() => {
    return profileCollections
      .filter((item) => item?.collection?.id)
      .slice(0, 4);
  }, [profileCollections]);

  return {
    currentProfile,
    stories,
    openStories,
    homeRooms,
  };
}

/*
|--------------------------------------------------------------------------
| HOME CONTENT
|--------------------------------------------------------------------------
*/

function ContentHubContent() {
  const router = useIonRouter();

  const {
    currentProfile,
    openStories,
    homeRooms,
  } = useHomeData();

  const { openDialog, closeDialog } = useDialog();

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const goToWrite = () => {
    router.push(Paths.write);
  };

  const goToWorkshop = () => {
    if (Paths.workshop?.reader) {
      router.push(Paths.workshop.reader());
      return;
    }

    router.push("/workshop");
  };

  const goToEvents = () => {
    router.push(Paths.calendar());
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

  const goToRoom = (profileToCollection) => {
    const collection = profileToCollection?.collection;

    if (!collection?.id) return;

    router.push(
      Paths.collection.createRoute(collection.id)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Dialogs
  |--------------------------------------------------------------------------
  */

  const goToRooms = () => {
    openDialog({
      title: "Make a room",
      scrollY: false,
      text: (
        <CreateCollectionForm
          onClose={closeDialog}
        />
      ),
      // disagree: closeDialog,
     
      breakpoint: 1,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div
   

    >
      <div className="mx-auto w-full px-4 pt-14 max-w-5xl">
        <HomeHeader
          profile={currentProfile}
          onWrite={goToWrite}
          onRooms={goToRooms}
          onWorkshop={goToWorkshop}
        />

      <UpcomingEventsSection events={[]} onViewEvents={()=>{goToEvents()}}/>

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
    </div>
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
        <div
          type="button"
          onClick={onWrite}
          className={`
    
            ${styles.button.base}
            ${styles.button.primary}
            ${styles.button.large}
          `}
        >
          Start writing
        </div>

        <div
          type="button"
          onClick={onRooms}
          className={`
            ${styles.button.base}
            ${styles.button.secondary}
            ${styles.button.large}
          `}
        >
          Make a room
        </div>

        <div
          type="button"
          onClick={onWorkshop}
          className={`
            ${styles.button.base}
            ${styles.button.secondary}
            ${styles.button.large}
          `}
        >
          Read with the community
        </div>
      </div>
    </header>
  );
}

/*
|--------------------------------------------------------------------------
| UPCOMING EVENTS
|--------------------------------------------------------------------------
*/



/*
|--------------------------------------------------------------------------
| STILL OPEN
|--------------------------------------------------------------------------
*/




/*
|--------------------------------------------------------------------------
| WORK LIST
|--------------------------------------------------------------------------
*/


function WorkRow({ story, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${story?.title || "untitled story"}`}
      className="
        group flex min-h-16 w-[100%] min-w-0
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
        motion-reduce:transition-none
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
          motion-reduce:transform-none
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


/*
|--------------------------------------------------------------------------
| ROOM GRID
|--------------------------------------------------------------------------
*/


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

export default ContentHubContainer;