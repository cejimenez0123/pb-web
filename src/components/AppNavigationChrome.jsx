
import { useLocation } from "react-router";
import NavbarContainer from "../container/NavbarContainer";

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
      {/* Desktop */}
      {showTopNavbar && (
        <div className="z-50 flex w-full shrink-0">
          <NavbarContainer
            isDesktop={isDesktop}
            currentProfile={currentProfile}
          />
        </div>
      )}

      {/* Mobile / Tablet */}
      {showBottomNavbar && (
        <div className="z-50 w-full">
          <NavbarContainer
            isDesktop={false}
            currentProfile={currentProfile}
          />
        </div>
      )}
    </>
  );
}

export default AppNavigationChrome;