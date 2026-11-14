
import { useLocation } from "react-router";
import NavbarContainer from "../container/NavbarContainer";
import Paths from "../core/paths";
import { useDialog } from "../domain/usecases/useDialog";
import ErrorBoundary from "../ErrorBoundary";

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
 const {dialog}=useDialog()
  return (
    <>
    <ErrorBoundary>
      {/* Desktop */}
      {showTopNavbar && (

          <NavbarContainer
            isDesktop={isDesktop}
            currentProfile={currentProfile}
          />
    
      )}

      {/* Mobile / Tablet */}
      {showBottomNavbar && !dialog.isOpen && (
        <div >
          <NavbarContainer
            isDesktop={false}
            currentProfile={currentProfile}
          />
       </div>
      )}
      </ErrorBoundary>
    </>
  );
}

export default AppNavigationChrome;