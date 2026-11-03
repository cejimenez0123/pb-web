
import { useLocation } from "react-router";
import NavbarContainer from "../container/NavbarContainer";
import Paths from "../core/paths";

function AppNavigationChrome({
  isDesktop,
  isMobileOrTablet,
  currentProfile,
}) {
  const location = useLocation();

  const hiddenPaths = [
   Paths.onboard,
    // "/apply",
    Paths.onboard,
    Paths.signup,
    Paths.register,
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

          <NavbarContainer
            isDesktop={isDesktop}
            currentProfile={currentProfile}
          />
    
      )}

      {/* Mobile / Tablet */}
      {showBottomNavbar && (
        <div >
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