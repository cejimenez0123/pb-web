import { useLocation } from "react-router";
import NavbarContainer from "../container/NavbarContainer";
import { IonFooter } from "@ionic/react";

function AppNavigationChrome({
  isDesktop,
  isMobileOrTablet,
  currentProfile,
}) {
  const location = useLocation();

  const hiddenPaths = [
    "/onboard",
    "/apply",
    "/login",
    "/signup",
    "/register",
    "/reset-password",
    "/oauth2callback",
  ];

  const pathname = location?.pathname || "";

  const shouldHideBottomNavbar = hiddenPaths.some((path) =>
    pathname.startsWith(path)
  );

  const showTopNavbar = isDesktop;

  const showBottomNavbar =
    isMobileOrTablet && !shouldHideBottomNavbar;

  return (
    <>
      {showTopNavbar && (
        <div className="z-50 flex w-full shrink-0">
          <NavbarContainer
            isDesktop={isDesktop}
            currentProfile={currentProfile}
          />
        </div>
      )}

      {showBottomNavbar && (
        <IonFooter>
          <div className="bg-base-surface dark:bg-base-bgDark">
            <NavbarContainer
              isDesktop={isDesktop}
              currentProfile={currentProfile}
            />
          </div>
        </IonFooter>
      )}
    </>
  );
}

export default AppNavigationChrome;