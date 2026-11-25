
import NavbarContainer from "../container/NavbarContainer";
import Paths from "../core/paths";
import { useDialog } from "../domain/usecases/useDialog";
import ErrorBoundary from "../ErrorBoundary";
import { Capacitor } from "@capacitor/core";
import { useMediaQuery } from "react-responsive";
import { useIonRouter } from "@ionic/react";

function AppNavigationChrome({

  currentProfile,
}) {
const pathname = useIonRouter().routeInfo.pathname
const isDesktop = useMediaQuery({
  query: "(min-width: 1200px)",
});


const isUsersPublicProfile = pathname == Paths.profile.createRoute(currentProfile?.id)
const showBackPath = [Paths.editor.pre,Paths.page.pre,Paths.collection.pre,Paths.editCollection.pre
  ,Paths.feedback(),Paths.editProfile,Paths.editor,Paths.workshop.pre
]

  const hiddenLoggedOut = [
   Paths.onboard,
    Paths.login,
    Paths.onboard,
    
    Paths.signup,
    Paths.register,
    "/reset-password",
    "/oauth2callback",
  ];


 const {dialog}=useDialog()

 const hideNavbar =hiddenLoggedOut.some((path) =>
    pathname.includes(path)
  );
  const showBack  = isUsersPublicProfile || showBackPath.some(path=>{
    return pathname.includes(path)
  })
 
   

  if (hideNavbar || dialog?.isOpen) return null;

  return (
    <>
    <ErrorBoundary>

  
          <NavbarContainer
          isDesktop={isDesktop}
          showBack={showBack}
          hideNavbar={hideNavbar}
          pathname={pathname}
        
            currentProfile={currentProfile}
          />
  
      </ErrorBoundary>
    </>
  );
}

export default AppNavigationChrome;