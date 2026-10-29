
import { useContext, useRef, useEffect, useState, useCallback } from "react";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import {
  registerUser,
  findWorkshopGroup,
  findWorkshopGroups,
} from "../../actions/WorkshopActions";
import {
  getProfileCollections,
  getRoomRecommendations,
  getProfileRecommendations,
  setCollections,
} from "../../actions/CollectionActions";
import { useSelector, useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import Context from "../../context";
import check from "../../images/icons/check.svg";
import DeviceCheck from "../../components/DeviceCheck";
import {
  IonContent,
  IonLoading,
  useIonRouter,
} from "@ionic/react";
import {
  setCurrentPage,
  setPagesInView,
} from "../../actions/PageActions";

import { useParams } from "react-router";
import GoogleMapSearch from "../collection/GoogleMapSearch";
import ExploreList from "../../components/collection/ExploreList";
import fetchCity from "../../core/fetchCity";
import { getStory } from "../../actions/StoryActions";
import usePaginatedResource from "../../core/usePaginatedResource";
import styles from "../../styles/style.js";

const DEFAULT_LOCATION = {
  latitude: 40.818622458906425,
  longitude: -73.8890363605602,
};

const PAGE_Y = "pt-14 pb-20";
const WRAP = "mx-auto w-full max-w-[52em] px-5";
const STACK = "space-y-10";

const CARD = `
  rounded-[1.75rem]
  border border-plumb-border
  bg-plumb-elevated shadow-sm
  dark:border-plumb-darkBorder
  dark:bg-plumb-dark-surface
`;

const INNER = "p-6 sm:p-8";

const MUTED_SURFACE = `
  border border-plumb-border
  bg-plumb-surface/70
  dark:border-plumb-darkBorder
  dark:bg-plumb-dark-paper/70
`;

const FIELD_SURFACE = `
  border border-plumb-border
  bg-plumb-elevated
  dark:border-plumb-darkBorder
  dark:bg-plumb-dark-surface
`;

const EYEBROW = `
  ${styles.text.metadata}
  font-semibold uppercase tracking-[0.14em]
`;

const WorkshopContainer = () => {
  const dispatch = useDispatch();
  const router = useIonRouter();
  const { storyId } = useParams();

  const isNative = DeviceCheck();
  const isMounted = useRef(true);

  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(50);
  const [isGlobal, setIsGlobal] = useState(true);
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  const { currentProfile } = useSelector(
    (state) => state.users
  );

  const page = useSelector(
    (state) => state.pages.pageInView
  );

  const { showAlert } = useAlert();

  /*
   * --------------------------------------------------------------------------
   * Libraries
   * --------------------------------------------------------------------------
   */

const selectCollections = useCallback(
  (res) => ({
    items: res?.collections ?? [],
    totalCount: res?.totalCount ?? 0,
  }),
  []
);
const {
  items: roomItems,
  isLoading: roomsLoading,
} = usePaginatedResource({
  cacheKey: "profile-room-recommendations",
  fetcher: getRoomRecommendations,
  pageSize: 10,
  enabled: !!currentProfile?.id,
  select: (res) => ({
    items: res?.collections ?? [],
    totalCount: res?.totalCount ?? 0,
  }),
});
// const {
//   items: roomItems,
//   isLoading: roomsLoading,
// } = usePaginatedResource({
//   cacheKey: "profile-rooms",
//   fetcher: getProfileCollections,
//   params: {
//     isWorkshop: false,
//   },
//   pageSize: 10,
//   select: selectCollections,
// });

const {
  items: workshopItems,
  isLoading: workshopsLoading,
} = usePaginatedResource({
  cacheKey: "profile-workshops",
  fetcher: getProfileCollections,
  params: {
    isWorkshop: true,
  },
  pageSize: 10,
  select: selectCollections,
});





  /*
   * --------------------------------------------------------------------------
   * Workshops
   * --------------------------------------------------------------------------
   */

  const {
    items: workshops,
    page: workshopPage,
    setPage: setWorkshopPage,
    totalPages: workshopTotalPages,
    totalCount: workshopTotal,
  } = usePaginatedResource({
    cacheKey: "collections:workshops",
    fetcher: findWorkshopGroups,
    pageSize: 10,
    enabled: !!currentProfile?.id,
    params: {
      type: "feedback",
      location: isGlobal ? null : location,
      global: isGlobal,
      radius,
    },
    select: (res) => ({
      items: res.groups,
      totalCount: res.totalCount,
    }),
  });

  /*
   * --------------------------------------------------------------------------
   * Lifecycle
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /*
   * Load story context when entering from a story.
   */

  useEffect(() => {
    if (!storyId) return;

    dispatch(getStory({ id: storyId })).then((res) =>
      checkResult(
        res,
        (payload) => {
          dispatch(
            setPagesInView({
              page: payload.story,
            })
          );
        },
        (err) => {
          showAlert({
            message: err.message,
            type: AlertType.error,
          });
        }
      )
    );
  }, [storyId, dispatch]);

  /*
   * Reset location when switching between global/local.
   */

  useEffect(() => {
    setLocation(DEFAULT_LOCATION);
  }, [isGlobal]);

  /*
   * Request location when switching to local.
   */

  useEffect(() => {
    if (!isGlobal) {
      if (isNative) {
        requestLocation();
      } else {
        webRequestLocation();
      }
    }
  }, [isGlobal]);

  /*
   * Register the user's current location.
   */

  useEffect(() => {
    if (!currentProfile?.id) return;

    const register = async () => {
      const city = await fetchCity(location);

      registerUser(currentProfile.id, {
        longitude: location.longitude,
        latitude: location.latitude,
        city,
      });
    };

    register();
  }, [location, currentProfile?.id]);

  /*
   * --------------------------------------------------------------------------
   * Location
   * --------------------------------------------------------------------------
   */

  const applyLocation = (coords) => {
    setLocation(coords);

    if (currentProfile?.id) {
      registerUser(currentProfile.id, coords);
    }

    setLoading(false);
  };

  const webRequestLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const name = await fetchCity({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        applyLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: name,
        });
      },
      () => {
        showAlert({
          message:
            "We use location to connect you with nearby writers. Reload to try again.",
          type: AlertType.error,
        });

        setLoading(false);
      }
    );
  };

  const requestLocation = async () => {
    setLoading(true);

    try {
      let permStatus = await Geolocation.checkPermissions();

      if (
        permStatus.location === "prompt" ||
        permStatus.location === "denied"
      ) {
        permStatus = await Geolocation.requestPermissions();
      }

      if (permStatus.location === "granted") {
        const { coords } =
          await Geolocation.getCurrentPosition();

        const name = await fetchCity({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        applyLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: name,
        });
      } else {
        showAlert({
          message:
            "Location permission is off. Enable it in your device settings to find nearby writers.",
          type: AlertType.error,
        });

        setLoading(false);
      }
    } catch (err) {
      console.error("Error requesting location:", err);

      showAlert({
        message: "We couldn't get your location. Please try again.",
        type: AlertType.error,
      });

      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------------------------------
   * Workshop actions
   * --------------------------------------------------------------------------
   */

  const clickGlobal = () => {
    setIsGlobal((prev) => !prev);
  };

  const handleGroupClick = () => {
    if (!location?.latitude || !location?.longitude) return;

    setLoading(true);

    dispatch(
      setPagesInView({
        pages: [],
      })
    );

    dispatch(
      setCollections({
        collections: [],
      })
    );

    dispatch(
      findWorkshopGroup({
        profile: currentProfile,
        story: page ?? null,
        isGlobal,
        location,
        radius,
      })
    ).then((res) => {
      checkResult(
        res,
        (payload) => {
          if (payload?.collection) {
            router.push(
              Paths.collection.createRoute(
                payload.collection.id
              )
            );
          }
        },
        (err) => {
          showAlert({
            message: err.message,
            type: AlertType.error,
          });
        }
      );

      setLoading(false);
    });
  };

  /*
   * Legacy page state reset.
   *
   * Retained for other parts of the app that consume PageActions.
   */

  useEffect(() => {
    dispatch(
      setCurrentPage({
        key: "workshops",
        page: 1,
      })
    );

    dispatch(
      setCurrentPage({
        key: "communities",
        page: 1,
      })
    );
  }, [isGlobal, location, radius, dispatch]);

  const isLocationReady =
    isGlobal ||
    (location?.latitude && location?.longitude);

  return (
      <IonContent

fullscreen
>
  <div className={styles.about.page+" pb-20"}>

        <div className={WRAP}>
          <div className={STACK}>
            {/* Intro */}

            <section className="px-1 pt-2">
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-plumb-mint"
                />

                <span className={EYEBROW}>
                  Workshop
                </span>
              </div>

              <h1
                className={`
                  ${styles.text.display}
                  max-w-xl
                  text-3xl sm:text-4xl
                  leading-tight tracking-[-0.025em]
                `}
              >
                Make space for the work.
              </h1>

              <p
                className={`
                  ${styles.text.readable}
                  mt-3 max-w-lg
                  text-base leading-7
                `}
              >
                Find a room of writers, bring something unfinished, and see
                what happens when you let other people into the process.
              </p>
            </section>

            {/* Workshop entry card */}

            <section className={CARD}>
              <div className={INNER}>
                {/* Context from story */}

                {page?.id && (
                  <div className="mb-7">
                    <WorkshopContextCard page={page} />
                  </div>
                )}

                {/* User */}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className={EYEBROW}>
                      Your room
                    </p>

                    <h2
                      className={`
                        ${styles.text.title}
                        mt-1 text-xl
                      `}
                    >
                      {currentProfile?.username
                        ? currentProfile.username.toLowerCase()
                        : "Writer"}
                    </h2>
                  </div>

                  <div
                    className={`
                      flex h-10 w-10 shrink-0
                      items-center justify-center rounded-full
                      ${
                        isLocationReady
                          ? "bg-plumb-mint"
                          : "bg-amber-500 dark:bg-amber-600"
                      }
                    `}
                  >
                    <img
                      src={check}
                      alt={isLocationReady ? "Ready" : "Location needed"}
                      className="h-5 w-5"
                    />
                  </div>
                </div>

                {/* Divider */}

                <div className="my-7 h-px bg-plumb-border dark:bg-plumb-darkBorder" />

                {/* Global / Local */}

                <div>
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className={`${styles.text.body} font-medium`}>
                        Where should we look?
                      </p>

                      <p className={`${styles.text.muted} mt-1 leading-6`}>
                        {isGlobal
                          ? "Anywhere writers are gathering."
                          : "Writers near the place you choose."}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      className="
                        toggle toggle-success shrink-0
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-plumb-focus
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-plumb-elevated
                        dark:focus-visible:ring-offset-plumb-dark-surface
                      "
                      checked={isGlobal}
                      onChange={clickGlobal}
                      aria-label="Toggle global or local workshops"
                    />
                  </div>

                  <div
                    className={`
                      mt-4 inline-flex items-center
                      rounded-full px-3 py-1.5
                      text-xs font-medium
                      ${MUTED_SURFACE}
                      ${styles.text.muted}
                    `}
                  >
                    {isGlobal ? "Global" : "Local"}
                  </div>
                </div>

                {/* Local controls */}

                {!isGlobal && (
                  <div
                    className={`
                      ${MUTED_SURFACE}
                      mt-7 rounded-2xl p-5
                    `}
                  >
                    <div className="mb-5">
                      <p
                        className={`
                          ${styles.text.body}
                          font-semibold
                        `}
                      >
                        Choose your area
                      </p>

                      <p className={`${styles.text.muted} mt-1 leading-6`}>
                        Set a place and decide how far you're willing to go.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <GoogleMapSearch
                        onLocationSelected={setLocation}
                      />

                      <div
                        className={`
                          ${FIELD_SURFACE}
                          flex items-center justify-between
                          rounded-xl px-4 py-3
                        `}
                      >
                        <label
                          htmlFor="workshop-radius"
                          className={styles.text.muted}
                        >
                          Radius
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            id="workshop-radius"
                            type="number"
                            min="1"
                            value={radius}
                            onChange={(e) =>
                              setRadius(e.target.value)
                            }
                            className="
                              w-16 rounded-lg
                              border border-plumb-border
                              bg-plumb-canvas
                              px-2 py-1 text-right text-sm
                              text-plumb-ink
                              focus:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-plumb-focus
                              dark:border-plumb-darkBorder
                              dark:bg-plumb-dark-canvas
                              dark:text-plumb-darkText
                            "
                          />

                          <span className={styles.text.muted}>
                            mi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Join */}

                <button
                  type="button"
                  onClick={handleGroupClick}
                  disabled={!isLocationReady || loading}
                  className={`
                    ${styles.button.base}
                    ${styles.button.primary}
                    ${styles.button.large}
                    mt-7 w-full
                  `}
                >
                  Join a Workshop
                </button>

                <p
                  className={`
                    ${styles.text.metadata}
                    mt-3 text-center leading-5
                  `}
                >
                  You don't need a finished piece. Bring whatever you're
                  working on.
                </p>
              </div>
            </section>

            {/* Discovery */}

            <section>
              <div className="mb-5 px-1">
                <p className={EYEBROW}>
                  Explore
                </p>

                <h2
                  className={`
                    ${styles.text.heading}
                    mt-1 text-2xl
                    tracking-[-0.02em]
                  `}
                >
                  Find your people.
                </h2>

                <p className={`${styles.text.muted} mt-2 max-w-xl leading-6`}>
                  Browse libraries and workshops created by writers in the
                  community.
                </p>
              </div>

              <div className="space-y-10">
                <ExploreList
                label="Room"
  items={roomItems}
  isLoading={roomsLoading}
/>

<ExploreList
label="Workshops"
  items={workshopItems}
  isLoading={workshopsLoading}
/>
  
              </div>
            </section>
          </div>
        </div>

        <IonLoading
          isOpen={loading}
          message="Finding your space..."
          spinner="crescent"
        />
      </div>
    </IonContent>
  );
};

export default WorkshopContainer;

/*
|--------------------------------------------------------------------------
| WORKSHOP CONTEXT
|--------------------------------------------------------------------------
*/

const WorkshopContextCard = ({ page }) => {
  if (!page) return null;

  const title =
    page.title?.length > 40
      ? `${page.title.slice(0, 47)}...`
      : page.title?.length > 0
        ? page.title
        : "Untitled Story";

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        ${MUTED_SURFACE}
        p-5
      `}
    >
      <div
        aria-hidden="true"
        className="
          absolute left-0 top-0 h-full w-1
          bg-plumb-mint
        "
      />

      <div className="pl-3">
        <div className="flex items-center justify-between gap-4">
          <span className={EYEBROW}>
            Workshop context
          </span>

          <span
            className="
              text-[0.65rem] font-medium uppercase
              tracking-[0.1em]
              text-plumb-mintHover
              dark:text-plumb-mintLight
            "
          >
            Active
          </span>
        </div>

        <h3
          className={`
            ${styles.text.subheading}
            mt-3 text-lg leading-snug
          `}
        >
          {title}
        </h3>

        <p className={`${styles.text.muted} mt-2 text-xs leading-5`}>
          Bring this piece into the room and let your voice meet other voices.
        </p>
      </div>
    </div>
  );
};
