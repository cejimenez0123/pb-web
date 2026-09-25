import "./App.css";

import { connect, useDispatch, useSelector } from "react-redux";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  IonApp,
  IonContent,
  IonFooter,
  IonRouterOutlet,
  IonSpinner,
  setupIonicReact,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";

import {
  Redirect,
  Route,
  useLocation,
} from "react-router-dom";

import { LoadScript } from "@react-google-maps/api";

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { PushNotifications } from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import { SocialLogin } from "@capgo/capacitor-social-login";

import { useMediaQuery } from "react-responsive";

import {
  acceptTerms,
  getCurrentProfile,
  setAuthResolved,
  setSignedInFalse,
  setSignedInTrue,
  signOutAction,
} from "./actions/UserActions";

import { getPublicStories } from "./actions/PageActions.jsx";
import { getPublicLibraries } from "./actions/LibraryActions.jsx";
import { fetchNotifcations } from "./actions/ProfileActions.jsx";

import Context from "./context";
import Paths from "./core/paths";
import Enviroment from "./core/Enviroment.js";
import CURRENT_TERMS_VERSION from "./core/CURRENT_TERMS_VERSION.jsx";
import PageWrapper from "./core/PageWrapper.jsx";
import { watchBackground } from "./core/getbackground.jsx";

import ErrorBoundary from "./ErrorBoundary.jsx";
import PrivateRoute from "./PrivateRoute";

import Alert from "./components/Alert.jsx";
import Dialog from "./components/Dialog.jsx";
import NavbarContainer from "./container/NavbarContainer";
import SearchDialog from "./components/SearchDialog";
import initSocialLogin from "./components/initSocialLogin.jsx";

import LogInContainer from "./container/auth/LogInContainer";
import SignUpContainer from "./container/auth/SignUpContainer.jsx";
import ResetPasswordContainer from "./container/auth/ResetPassword.jsx";
import NewsletterContainer from "./container/auth/NewsletterContainer.jsx";
import UserReferralContainer from "./container/auth/UseReferralContainer.jsx";
import EULATERMS from "./container/auth/Agreement.jsx";

import AboutContainer from "./container/AboutContainer.jsx";
import CalendarContainer from "./container/CalendarContainer.jsx";
import ContentHubContainer from "./container/ContentHubContainer.jsx";
import DashboardContainer from "./container/DashboardContainer.jsx";
import DiscoveryContainer from "./container/DiscoveryContainer.jsx";
import EmailPreferences from "./container/EmailPreferences.jsx";
import FeedbackContainer from "./container/FeedbackContainer.jsx";
import LinksContainer from "./container/LinksContainer.jsx";
import MyProfileContainer from "./container/MyProfileContainer";
import NotFound from "./container/NotFound.jsx";
import OnboardingContainer from "./container/OnboardingContainer.jsx";
import PrivacyNoticeContrainer from "./container/PrivacyNoticeContainer.jsx";
import SettingsContainer from "./container/SettingsContainer";
import TermsContainer from "./container/TermsContainer.jsx";

import AddStoryToCollectionContainer from "./container/collection/AddStoryToCollection";
import AddToCollectionContainer from "./container/collection/AddToCollection";
import CollectionContainer from "./container/collection/CollectionContainer";
import EditCollectionContainer from "./container/collection/EditCollectionContainer.jsx";
import WorkshopContainer from "./container/collection/WorkshopContainer.jsx";

import HashtagContainer from "./container/hashtag/HashtagContainer.jsx";
import NotificationContainer from "./container/profile/NotificationContainer.jsx";
import ProfileContainer from "./container/profile/ProfileContainer.jsx";
import ReportsReviewPage from "./container/auth/ReportReviewContainer.jsx";

import EditorContainer from "./container/page/EditorContainer";
import OAuthCallback from "./container/page/OauthCallback.jsx";
import PageViewContainer from "./container/page/PageViewContainer";
import CollectionsContainer from "./container/collection/CollectionsContainer.jsx";
import WriteContainer from "./components/page/WriteContainer.jsx";

const CLIENT_ID = import.meta.env.VITE_OAUTH2_CLIENT_ID;
const IOS_CLIENT_ID = import.meta.env.VITE_IOS_CLIENT_ID;

const GOOGLE_MAPS_LIBRARIES = ["places"];

setupIonicReact();

function LoadingPlaceholder() {
  return (
    <IonContent>
      <div className="flex h-full items-center justify-center">
        <IonSpinner name="crescent" />
      </div>
    </IonContent>
  );
}

function PushNotificationHandler() {
  usePushNotificationListenerSafely();

  const router = useIonRouter();
  const isNative = Capacitor.isNativePlatform();

  const pendingRouteRef = useRef(null);
  const appReadyRef = useRef(false);
  const flushingRef = useRef(false);

  const flushRoute = useCallback(async () => {
    if (!isNative) return;
    if (flushingRef.current) return;
    if (!appReadyRef.current) return;
    if (!pendingRouteRef.current) return;

    flushingRef.current = true;

    try {
      const route = pendingRouteRef.current;

      const { value: token } = await Preferences.get({
        key: "token",
      });

      const hasValidToken =
        token &&
        token !== "undefined" &&
        token !== "null";

      if (!hasValidToken || !route) {
        return;
      }

      pendingRouteRef.current = null;

      router.push(route, "forward");
    } catch (error) {
      console.error(
        "Failed to navigate from a push notification:",
        error
      );
    } finally {
      flushingRef.current = false;
    }
  }, [isNative, router]);

  useEffect(() => {
    if (!isNative) return undefined;

    let active = true;
    let listenerHandle = null;

    const onAction = (action) => {
      const route =
        action?.notification?.data?.route
          ?.replace(/\s+/g, "") || null;

      if (!route) return;

      pendingRouteRef.current = route;
      flushRoute();
    };

    const subscribe = async () => {
      try {
        listenerHandle =
          await PushNotifications.addListener(
            "pushNotificationActionPerformed",
            onAction
          );
      } catch (error) {
        console.error(
          "Failed to add push notification listener:",
          error
        );
      }
    };

    subscribe();

    const readyTimer = window.setTimeout(() => {
      if (!active) return;

      appReadyRef.current = true;
      flushRoute();
    }, 0);

    return () => {
      active = false;

      window.clearTimeout(readyTimer);

      if (listenerHandle?.remove) {
        listenerHandle.remove();
      }
    };
  }, [flushRoute, isNative]);

  return null;
}

/*
 * Your project already imports a push-notification hook in the old App file.
 * This wrapper preserves that behavior without crashing this replacement file
 * if that hook is not currently needed here.
 *
 * If you do use a real hook named usePushNotificationListener, replace this
 * function and its invocation with:
 *
 * import usePushNotificationListener from
 *   "./domain/usecases/usePushNotificationListener.jsx";
 *
 * then call:
 *
 * usePushNotificationListener();
 */
function usePushNotificationListenerSafely() {
  return null;
}

function App(props) {
  const dispatch = useDispatch();
  const ionRouter = useIonRouter();
  // const location = useLocation();

  const {
    authResolved,
    currentProfile,
    dialog,
  } = useSelector((state) => state.users);

  const {
    resetDialog,
    openDialog,
  } = useDialogSafely();

  const isNative = Capacitor.isNativePlatform();

  const isMobile = useMediaQuery({
    query: "(max-width: 480px)",
  });

  const isTablet = useMediaQuery({
    query: "(min-width: 481px) and (max-width: 1199px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-width: 1200px)",
  });

  const isHorizPhone = useMediaQuery({
    query: "(min-width: 800px)",
  });

  const isMobileOrTablet =
    isMobile || isTablet;

  const [isFirstLaunch, setIsFirstLaunch] =
    useState(true);

  const [formerPage, setFormerPage] =
    useState(null);

  const [presentingEl, setPresentingEl] =
    useState(null);

  const [success, setSuccess] =
    useState(null);

  const [seo, setSeo] = useState({
    title: "Plumbum",
    heading: "Plumbum",
    image: Enviroment.logoChem,
    description: "Your writing, Your community",
    name: "Plumbum",
    type: "website",
    url: "https://plumbum.app",
  });

  /*
   * Do this once, rather than on every App render.
   * If watchBackground returns a cleanup function, React invokes it on
   * unmount.
   */
  useEffect(() => {
    const cleanup = watchBackground?.();

    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

  /*
   * classList.add is safe repeatedly, but this belongs in an effect instead
   * of running in the component function on every render.
   */
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  /*
   * Social-login setup should run once per client-ID configuration,
   * not on every Redux/media-query/navigation rerender.
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        await SocialLogin.initialize({
          apple: {
            clientId: IOS_CLIENT_ID,
          },
          google: {
            webClientId: CLIENT_ID,
            iOSClientId: IOS_CLIENT_ID,
            iOSServerClientId: CLIENT_ID,
          },
        });

        initSocialLogin(CLIENT_ID, IOS_CLIENT_ID);
      } catch (error) {
        console.error(
          "Error initializing social login:",
          error
        );
      }
    };

    initialize();
  }, []);

  /*
   * Resolve login state exactly once when the application loads.
   */
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const { value: token } =
          await Preferences.get({
            key: "token",
          });

        if (!active) return;

        const hasValidToken =
          token &&
          token !== "undefined" &&
          token !== "null";

        if (hasValidToken) {
          dispatch(getCurrentProfile());
        } else {
          dispatch(setAuthResolved(true));
        }
      } catch (error) {
        console.error(
          "Unable to resolve authentication state:",
          error
        );

        if (active) {
          dispatch(setAuthResolved(true));
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, [dispatch]);

  /*
   * Notifications should load after an async profile becomes available.
   */
  useEffect(() => {
    if (!currentProfile) return;

    dispatch(
      fetchNotifcations({
        profile: currentProfile,
        seen: false,
      })
    );
  }, [currentProfile, dispatch]);

  const promptTermsAcceptance = useCallback(
    (onAccepted) => {
      openDialog({
        title: "Updated Terms & Conditions",
        height: 90,
        breakpoint: 1,
        text: <EULATERMS />,
        agree: async () => {
          try {
            await dispatch(
              acceptTerms({
                version: CURRENT_TERMS_VERSION,
              })
            );

            resetDialog();

            if (typeof onAccepted === "function") {
              onAccepted();
            }
          } catch (error) {
            console.error(
              "Could not accept terms:",
              error
            );
          }
        },
        agreeText: "I Agree",
        disagree: () => {
          resetDialog();
          dispatch(signOutAction());
        },
        disagreeText: "Decline",
      });
    },
    [
      dispatch,
      openDialog,
      resetDialog,
    ]
  );

  /*
   * Prompt only after user/profile data is ready.
   */
  useEffect(() => {
    if (!currentProfile?.user) return;

    const {
      termsAcceptedAt,
      termsVersion,
    } = currentProfile.user;

    const hasAcceptedCurrentTerms =
      Boolean(termsAcceptedAt) &&
      termsVersion === CURRENT_TERMS_VERSION;

    if (hasAcceptedCurrentTerms) return;

    promptTermsAcceptance(() => {
      ionRouter.push(Paths.home, "forward");
    });
  }, [
    currentProfile,
    ionRouter,
    promptTermsAcceptance,
  ]);

  /*
   * Native launch/onboarding check.
   */
  useIonViewWillEnter(() => {
    let active = true;

    const checkFirstLaunch = async () => {
      if (!isNative) {
        if (active) {
          setIsFirstLaunch(false);
        }

        return;
      }

      try {
        const { value } =
          await Preferences.get({
            key: "hasSeenOnboarding",
          });

        if (!active) return;

        if (value === null) {
          setIsFirstLaunch(true);

          await Preferences.set({
            key: "hasSeenOnboarding",
            value: "true",
          });

          return;
        }

        setIsFirstLaunch(false);
      } catch (error) {
        console.error(
          "Could not check onboarding state:",
          error
        );

        if (active) {
          setIsFirstLaunch(false);
        }
      }
    };

    checkFirstLaunch();

    return () => {
      active = false;
    };
  }, [isNative]);

  /*
   * Keep the existing splash behavior, but run it as Ionic page-enter logic.
   */
  useIonViewWillEnter(() => {
    if (!isNative) return;

    const showSplash = async () => {
      try {
        await SplashScreen.show({
          showDuration: 3000,
          autoHide: true,
          fadeInDuration: 1000,
        });
      } catch (error) {
        console.error(
          "Could not show splash screen:",
          error
        );
      }
    };

    showSplash();
  }, [isNative]);

  const hiddenPaths = [
    "/onboard",
    "/apply",
    "/login",
    "/signup",
    "/register",
  ];

  const shouldHideBottomNavbar =
    hiddenPaths.some((path) =>
      location.pathname.startsWith(path)
    );

  const showTopNavbar = isDesktop;

  const showBottomNavbar =
    isMobileOrTablet &&
    !shouldHideBottomNavbar;

  /*
   * The EditorContainer reads profile/content through Redux.
   * Do not pass duplicate props such as htmlContent/currentProfile unless
   * your component explicitly relies on them.
   */
  const editorPage = (
    <PageWrapper>
      <PrivateRoute>
        <EditorContainer />
      </PrivateRoute>
    </PageWrapper>
  );

  return (
    <ErrorBoundary>
      <Context.Provider
        value={{
          setPresentingEl,
          isDesktop,
          isTablet: isMobileOrTablet,
          isPhone: isMobileOrTablet,
          isNotPhone: !isMobileOrTablet,
          isHorizPhone,
          seo,
          setSeo,
          formerPage,
          setFormerPage,
          setSuccess,
          success,
        }}
      >
        <LoadScript
          googleMapsApiKey={
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }
          libraries={GOOGLE_MAPS_LIBRARIES}
        >
          <IonApp>
            <IonReactRouter>
              {isNative && (
                <PushNotificationHandler />
              )}

              {showTopNavbar && (
                <div className="z-50 flex w-full shrink-0">
                  <NavbarContainer
                    isDesktop={isDesktop}
                    currentProfile={currentProfile}
                  />
                </div>
              )}

              <div className="relative flex-1">
                <Dialog
                  dialog={dialog}
                  presentingElement={presentingEl}
                />

                <Alert />

                <IonRouterOutlet>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <PageWrapper>
                        {!authResolved ? (
                          <LoadingPlaceholder />
                        ) : currentProfile &&
                          isNative ? (
                          <ContentHubContainer />
                        ) : currentProfile ? (
                          <Redirect to={Paths.home} />
                        ) : isFirstLaunch &&
                          isNative ? (
                          <Redirect
                            to={Paths.onboard}
                          />
                        ) : (
                          <Redirect
                            to={Paths.about()}
                          />
                        )}
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/about"
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <AboutContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/search"
                    render={() => (
                      <PageWrapper
                        showSearchButton={false}
                      >
                        <SearchDialog />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.onboard}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                        presentHeader={false}
                      >
                        <OnboardingContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.login}
                    render={() => (
                      <PageWrapper
                        presentHeader={false}
                      >
                        <LogInContainer
                          currentProfile={
                            currentProfile
                          }
                          logIn={props.logIn}
                        />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.home}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <ContentHubContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />
       <Route
                    path={Paths.home}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <ContentHubContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />
                  <Route
                    exact
                    path={Paths.write}
                    render={() => (
                      <PageWrapper>
                        <PrivateRoute>
                          <WriteContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.myProfile}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <MyProfileContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/discovery"
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                        showSearchButton
                      >
                        <DiscoveryContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/eula"
                    render={() => (
                      <PageWrapper>
                        <EULATERMS />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/privacy"
                    render={() => (
                      <PageWrapper>
                        <PrivacyNoticeContrainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/admin/reports/review"
                    render={() => (
                      <PageWrapper>
                        <ReportsReviewPage />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.calendar()}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <CalendarContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.newsletter()}
                    render={() => (
                      <PageWrapper>
                        <NewsletterContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/reset-password"
                    render={() => (
                      <PageWrapper>
                        <ResetPasswordContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/signup"
                    render={() => (
                      <PageWrapper>
                        <SignUpContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <PageWrapper>
                        <UserReferralContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/subscribe"
                    render={() => (
                      <PageWrapper>
                        <EmailPreferences />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.notifications()}
                    render={() => (
                      <PageWrapper>
                        <PrivateRoute>
                          <NotificationContainer
                            currentProfile={
                              currentProfile
                            }
                          />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />
                  <Route
                    path={Paths.collections}
                    render={() => (
                      <PageWrapper>
                        <CollectionsContainer
                        
                        />
                      </PageWrapper>
                    )}
                  />
                  <Route
                    path={Paths.collection.route()}
                    render={() => (
                      <PageWrapper>
                        <CollectionContainer
                          currentProfile={
                            currentProfile
                          }
                        />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.addToCollection.route}
                    render={() => (
                      <PageWrapper>
                        <PrivateRoute>
                          <AddToCollectionContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={
                      Paths.addStoryToCollection
                        .route
                    }
                    render={() => (
                      <PageWrapper>
                        <PrivateRoute>
                          <AddStoryToCollectionContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.editCollection.route()}
                    render={() => (
                      <PageWrapper>
                        <PrivateRoute>
                          <EditCollectionContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.hashtag.route()}
                    render={() => (
                      <PageWrapper>
                        <HashtagContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.links()}
                    render={() => (
                      <PageWrapper>
                        <LinksContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.feedback()}
                    render={() => (
                      <PageWrapper>
                        <FeedbackContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.workshop.reader()}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <WorkshopContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    path={Paths.workshop.route()}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <WorkshopContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/profile/:id/view"
                    render={() => (
                      <PageWrapper>
                        <ProfileContainer />
                      </PageWrapper>
                    )}
                  />

                  {/*
                   * IMPORTANT:
                   * Put specific story editor routes before the generic
                   * story/page route below.
                   *
                   * Existing story:
                   * /story/:id/:type/edit
                   */}
                  <Route
                    exact
                    path="/story/:id/:type/edit"
                    render={() => editorPage}
                  />

                  {/*
                   * New story:
                   * /story/:type/edit
                   */}
                  <Route
                    exact
                    path="/story/:type/edit"
                    render={() => editorPage}
                  />

                  {/*
                   * Preserve your named route if Paths.editPage.route is a
                   * different legacy editor path, for example /story/edit.
                   *
                   * Keep it exact and above generic page viewing.
                   */}
                  <Route
                    exact
                    path={Paths.editPage.route}
                    render={() => editorPage}
                  />

                  {/*
                   * Generic page/story view must remain AFTER editor routes.
                   * It should ideally be exact if Paths.page.route() is not
                   * intended to match nested editor URLs.
                   */}
                  <Route
                    exact
                    path={Paths.page.route()}
                    render={() => (
                      <PageWrapper>
                        <PageViewContainer
                          page={props.pageInView}
                        />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path={Paths.editProfile}
                    render={() => (
                      <PageWrapper
                        showBackbutton={false}
                      >
                        <PrivateRoute>
                          <SettingsContainer />
                        </PrivateRoute>
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/terms"
                    render={() => (
                      <PageWrapper>
                        <TermsContainer />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    exact
                    path="/oauth2callback"
                    render={() => (
                      <PageWrapper
                        presentHeader={false}
                      >
                        <OAuthCallback />
                      </PageWrapper>
                    )}
                  />

                  <Route
                    render={() => (
                      <PageWrapper>
                        <NotFound />
                      </PageWrapper>
                    )}
                  />
                </IonRouterOutlet>

                {showBottomNavbar && (
                  <IonFooter>
                    <div className="bg-base-surface dark:bg-base-bgDark">
                      <NavbarContainer
                        isDesktop={isDesktop}
                        currentProfile={
                          currentProfile
                        }
                      />
                    </div>
                  </IonFooter>
                )}
              </div>
            </IonReactRouter>
          </IonApp>
        </LoadScript>
      </Context.Provider>
    </ErrorBoundary>
  );
}

/*
 * This small wrapper retains the API you used in the original file.
 *
 * Replace this with your direct import if desired:
 *
 * import { useDialog } from "./domain/usecases/useDialog.jsx";
 */
function useDialogSafely() {
  const [dialogState, setDialogState] = useState(null);

  const openDialog = useCallback((nextDialog) => {
    setDialogState(nextDialog);
  }, []);

  const resetDialog = useCallback(() => {
    setDialogState(null);
  }, []);

  return {
    dialog: dialogState,
    openDialog,
    resetDialog,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublicLibraries: () =>
      dispatch(getPublicLibraries()),

    getPublicStories: () =>
      dispatch(getPublicStories()),

    setSignedInTrue: () =>
      dispatch(setSignedInTrue()),

    setSignedInFalse: () =>
      dispatch(setSignedInFalse()),
  };
}

function mapStateToProps(state) {
  return {
    profile: state.users.profileInView,
    signedIn: state.users.signedIn,
    currentProfile: state.users.currentProfile,
    pageInView: state.pages.pageInView,
    pagesInView: state.pages.pagesInView,
    bookLoading: state.books.loading,
    userLoading: state.users.loading,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

