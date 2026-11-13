
import { useEffect, useMemo, useState } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import { useSelector } from "react-redux";

import Paths from "../core/paths.js";
import { PageType } from "../core/constants.js";
import { useDialog } from "../domain/usecases/useDialog.jsx";

import CreateCollectionForm from "../components/collection/CreateCollectionForm.jsx";
import styles from "../styles/style.js";
import ErrorBoundary from "../ErrorBoundary.jsx";
import RoomsPreviewSection from "../components/collection/RoomsPreviewSection.jsx";
import OpenWorkSection from "../components/OpenWorkSection.jsx";
import FeaturedEventSection from "../components/events/FeaturedEventSection.jsx";
import { useDispatch } from "react-redux";
import { getMyStories } from "../actions/StoryActions.jsx";
import storyRepo from "../data/storyRepo.js";
import { useAlert } from "../core/useAlert.jsx";
import AlertType from "../core/AlertType.js";
import { Preferences } from "@capacitor/preferences";

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
  const dispatch = useDispatch();
const [publicEvents, setPublicEvents] = useState([]);
const [loadingEvents, setLoadingEvents] = useState(false);
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const [stories, setStories] = useState(EMPTY_ARRAY);
  const [loadingStories, setLoadingStories] = useState(false);

  const profileCollections = Array.isArray(
    currentProfile?.profileToCollections
  )
    ? currentProfile.profileToCollections
    : EMPTY_ARRAY;
useEffect(() => {
  let cancelled = false;

  const loadEvents = async () => {
    setLoadingEvents(true);

    try {
      const res = await storyRepo.fetchEvents({
        days: 21,
      });

      if (cancelled) return;

      const rawEvents = (res?.events || []).flatMap(
        (group) => group.events || []
      );

      const normalizedEvents = rawEvents.map((event) => {
        const description = event.description || "";

        // Extract hashtags from the public event description.
        const hashtags = (
          description.match(/#[\w-]+/g) || []
        ).map((tag) => tag.toLowerCase());

        const startDate =
          event.start?.dateTime || event.start?.date;

        return {
          id: event.id,
          title: event.summary || "Untitled event",
          description,
          hashtags,
          startDate,
          googleLink: event.htmlLink || "",
          location: event.location || "",
        };
      });

      setPublicEvents(normalizedEvents);
    } catch (error) {
      if (!cancelled) {
        console.error("Unable to load public events:", error);
        setPublicEvents([]);
      }
    } finally {
      if (!cancelled) {
        setLoadingEvents(false);
      }
    }
  };

  loadEvents();

  return () => {
    cancelled = true;
  };
}, []);
  // Fetch the user's stories
  useEffect(() => {
    if (!currentProfile?.id) {
      setStories([]);
      return;
    }

    let cancelled = false;

    const loadStories = async () => {
      setLoadingStories(true);

      try {
        const result = await dispatch(
          getMyStories({
            skip: 0,
            take: 100,
          })
        );

        if (cancelled) return;

        if (getMyStories.fulfilled.match(result)) {
          setStories(result.payload?.pageList ?? []);
        } else {
          console.error(
            "Unable to load home stories:",
            result.payload
          );
          setStories([]);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Unable to load home stories:", error);
        setStories([]);
      } finally {
        if (!cancelled) {
          setLoadingStories(false);
        }
      }
    };

    loadStories();

    return () => {
      cancelled = true;
    };
  }, [currentProfile?.id, dispatch]);

  // Only drafts and fragments, newest first
  const openStories = useMemo(() => {
    return stories
      .filter((story) =>
        ["draft", "fragment"].includes(
          String(story?.status ?? "").toLowerCase()
        )
      )
      .sort((a, b) => {
        const aDate = new Date(
          a?.updated || a?.updatedAt ||
          a?.created || a?.createdAt || 0
        ).getTime();

        const bDate = new Date(
          b?.updated || b?.updatedAt ||
          b?.created || b?.createdAt || 0
        ).getTime();

        return bDate - aDate;
      })
      .slice(0, 7);
  }, [stories]);

  // Is there anything the user has worked on in the last week?
  const hasRecentOpenStory = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return openStories.some((story) => {
      const date = new Date(
        story?.updated ||
        story?.updatedAt ||
        story?.created ||
        story?.createdAt ||
        0
      ).getTime();

      return date >= oneWeekAgo;
    });
  }, [openStories]);
const suggestedEvent = useMemo(() => {
  // Recent writing takes priority over event suggestions.
  if (hasRecentOpenStory) return null;

  const now = Date.now();

  return publicEvents
    .map((event) => {
      const matchingHashtag = event.hashtags.find((tag) =>
        ["#openmic", "#workshop"].includes(tag)
      );

      if (!matchingHashtag) return null;

      const timestamp = new Date(event.startDate).getTime();

      if (!Number.isFinite(timestamp) || timestamp < now) {
        return null;
      }

      const date = new Date(timestamp);

      return {
        ...event,
        hashtag: matchingHashtag,
        timestamp,
        dateLabel: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.timestamp - b.timestamp)[0] ?? null;
}, [publicEvents, hasRecentOpenStory]);
  const homeRooms = useMemo(() => {
    return profileCollections
      .filter((item) => item?.collection?.id)
      .slice(0, 4);
  }, [profileCollections]);

return {
  currentProfile,
  stories,
  openStories,
  loadingStories,
  hasRecentOpenStory,
  homeRooms,
  suggestedEvent,
  loadingEvents,
};
}

function ContentHubContent() {
  const router = useIonRouter();

  const {
    currentProfile,
    openStories,
    homeRooms,
suggestedEvent
  
  } = useHomeData();
  const eventCol = useMemo(() => {
    const profileCollections =
      currentProfile?.profileToCollections;

    if (!profileCollections) return null;

    return (
      profileCollections.find(
        (item) => item.type === "events"
      )?.collection || null
    );
  }, [currentProfile?.profileToCollections]);
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
const goToEvent =(id)=>{
  router.push(Paths.page.createRoute(id))
}
  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */
 const {showAlert,showPrompt}=useAlert()
const handleSelectSuggestedEvent = async (event) => {
  if (!event) return;

  const eidMatch = event.googleLink?.match(/[?&]eid=([^&]+)/);

  const gid =
    event.googleCalendarId ||
    (eidMatch ? eidMatch[1] : "");

  try {
    const { value: token } = await Preferences.get({
      key: "token",
    });

    if (!token || !gid) {
      showAlert({
        message: "Sign in to save this event to your Events.",
        type: AlertType.info,
      });
      return;
    }

    const data = await storyRepo.saveEvent({
      event: {
        ...event,
        summary: event.title || event.summary,
        googleCalendarId: gid,
      },
    });

showPrompt({
  message: "Added to your Events! Want to take a look?",
  agreeText: "View event",
  disagreeText: "Maybe later",
  agree: () => {
    if (data?.story?.id) {
      router.push(Paths.page.createRoute(data.story.id));
    }
  },
});


  } catch (err) {
    showAlert({
      message: err?.message || "Couldn't save this event.",
      type: AlertType.error,
    });
  }
};
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
<FeaturedEventSection  currentProfile={currentProfile} onViewEvents={goToEvents}/>


     <OpenWorkSection
  stories={openStories}
  suggestedEvent={suggestedEvent}
  onWrite={goToWrite}
  onSelectStory={goToStory}
  onSelectEvent={handleSelectSuggestedEvent}
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



export default ContentHubContainer;