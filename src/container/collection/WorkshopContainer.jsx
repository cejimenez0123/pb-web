
import { useContext, useRef, useEffect, useState } from "react";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import {
  registerUser,
  findWorkshopGroup,
  findWorkshopGroups,
} from "../../actions/WorkshopActions";
import { useSelector, useDispatch } from "react-redux";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import Context from "../../context";
import check from "../../images/icons/check.svg";
import { Geolocation } from "@capacitor/geolocation";
import DeviceCheck from "../../components/DeviceCheck";
import { IonContent, IonLoading, useIonRouter } from "@ionic/react";
import { setCurrentPage, setPagesInView } from "../../actions/PageActions";
import { getProfileRecommendations, setCollections } from "../../actions/CollectionActions";
import { useParams } from "react-router";
import GoogleMapSearch from "../collection/GoogleMapSearch";
import ExploreList from "../../components/collection/ExploreList";
import fetchCity from "../../core/fetchCity";
import { getStory } from "../../actions/StoryActions";
import usePaginatedResource from "../../core/usePaginatedResource";

const DEFAULT_LOCATION = {
  latitude: 40.818622458906425,
  longitude: -73.8890363605602,
};

const PAGE_Y = "pt-14 pb-20";
const WRAP = "mx-auto w-full max-w-[52em] px-5";
const STACK = "space-y-10";

const CARD =
  "rounded-[1.75rem] border border-earth/70 bg-base-bg shadow-sm dark:border-earth/40 dark:bg-base-bgDark";

const INNER = "p-6 sm:p-8";

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

  const { currentProfile } = useSelector((state) => state.users);
  const page = useSelector((state) => state.pages.pageInView);

  const { showAlert } = useAlert();

  /*
   * --------------------------------------------------------------------------
   * Libraries
   * --------------------------------------------------------------------------
   */

  const {
    items: communities,
    page: communityPage,
    setPage: setCommunityPage,
    totalPages: communityTotalPages,
    totalCount: communityTotal,
  } = usePaginatedResource({
    cacheKey: "profile:recommendations",
    fetcher: getProfileRecommendations,
    pageSize: 10,
    enabled: !!currentProfile?.id,
    select: (res) => ({
      items: res.groups,
      totalCount: res.totalCount,
    }),
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
        const { coords } = await Geolocation.getCurrentPosition();

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
              Paths.collection.createRoute(payload.collection.id)
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
   * Keep this for other parts of the app that may still consume PageActions.
   * The visible pagination itself is handled by usePaginatedResource.
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
    isGlobal || (location?.latitude && location?.longitude);

  return (
    <IonContent className="page-content" fullscreen>
      <div className={`page-content dark:bg-base-bgDark ${PAGE_Y}`}>
        <div className={WRAP}>
          <div className={STACK}>

            {/* ----------------------------------------------------------------
                Intro
            ---------------------------------------------------------------- */}

            <section className="px-1 pt-2">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                  Workshop
                </span>
              </div>

              <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.025em] text-text-primary dark:text-cream sm:text-4xl">
                Make space for the work.
              </h1>

              <p className="mt-3 max-w-lg text-base leading-7 text-text-secondary dark:text-emerald-100/70">
                Find a room of writers, bring something unfinished, and see
                what happens when you let other people into the process.
              </p>
            </section>

            {/* ----------------------------------------------------------------
                Workshop entry card
            ---------------------------------------------------------------- */}

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
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                      Your room
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-text-primary dark:text-cream">
                      {currentProfile?.username
                        ? currentProfile.username.toLowerCase()
                        : "Writer"}
                    </h2>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isLocationReady
                        ? "bg-emerald-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    <img
                      src={check}
                      alt="Ready"
                      className="h-5 w-5"
                    />
                  </div>
                </div>

                {/* Divider */}

                <div className="my-7 h-px bg-earth/60 dark:bg-earth/30" />

                {/* Global / Local */}

                <div>
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <p className="text-base font-medium text-text-primary dark:text-cream">
                        Where should we look?
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-secondary dark:text-emerald-100/60">
                        {isGlobal
                          ? "Anywhere writers are gathering."
                          : "Writers near the place you choose."}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      className="toggle toggle-success shrink-0"
                      checked={isGlobal}
                      onChange={clickGlobal}
                      aria-label="Toggle global or local workshops"
                    />
                  </div>

                  <div className="mt-4 inline-flex items-center rounded-full border border-earth/70 bg-base-soft px-3 py-1.5 text-xs font-medium text-text-secondary dark:border-earth/40">
                    {isGlobal ? "Global" : "Local"}
                  </div>
                </div>

                {/* Local controls */}

                {!isGlobal && (
                  <div className="mt-7 rounded-2xl border border-earth/60 bg-base-soft/50 p-5 dark:border-earth/30 dark:bg-base-bgDark/50">
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-text-primary dark:text-cream">
                        Choose your area
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-secondary dark:text-emerald-100/60">
                        Set a place and decide how far you're willing to go.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <GoogleMapSearch
                        onLocationSelected={setLocation}
                      />

                      <div className="flex items-center justify-between rounded-xl border border-earth/60 bg-base-bg px-4 py-3 dark:border-earth/30 dark:bg-base-bgDark">
                        <span className="text-sm text-text-secondary dark:text-cream/70">
                          Radius
                        </span>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={radius}
                            onChange={(e) =>
                              setRadius(e.target.value)
                            }
                            className="w-16 bg-transparent text-right text-sm font-medium text-text-primary outline-none dark:text-cream"
                          />

                          <span className="text-sm text-text-secondary">
                            mi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Join */}

                <button
                  onClick={handleGroupClick}
                  disabled={!isLocationReady || loading}
                  className="mt-7 w-full rounded-full bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                  Join a Workshop
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-text-secondary dark:text-emerald-100/50">
                  You don't need a finished piece. Bring whatever you're
                  working on.
                </p>
              </div>
            </section>

            {/* ----------------------------------------------------------------
                Discovery
            ---------------------------------------------------------------- */}

            <section>
              <div className="mb-5 px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Explore
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-text-primary dark:text-cream">
                  Find your people.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary dark:text-emerald-100/60">
                  Browse libraries and workshops created by writers in the
                  community.
                </p>
              </div>

              <div className="space-y-10">
                <ExploreList
                  label="Libraries"
                  items={communities}
                  page={communityPage}
                  totalPages={communityTotalPages}
                  setPage={setCommunityPage}
                  totalCount={communityTotal}
                  pageSize={10}
                />

                <ExploreList
                  label="Workshops"
                  items={workshops}
                  totalPages={workshopTotalPages}
                  page={workshopPage}
                  setPage={setWorkshopPage}
                  totalCount={workshopTotal}
                  pageSize={10}
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
| Workshop Context
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
    <div className="relative overflow-hidden rounded-2xl border border-earth/60 bg-base-soft/60 p-5 dark:border-earth/30 dark:bg-base-bgDark/60">
      <div className="absolute left-0 top-0 h-full w-1 bg-emerald-600" />

      <div className="pl-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-text-secondary">
            Workshop context
          </span>

          <span className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-text-brand">
            Active
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug text-text-primary dark:text-cream">
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-text-secondary dark:text-emerald-100/50">
          Bring this piece into the room and let your voice meet other voices.
        </p>
      </div>
    </div>
  );
};
