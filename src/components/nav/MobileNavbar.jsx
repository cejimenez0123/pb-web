
import useNavbarNavigation from "../../core/useNavbarNavigation";
import styles from "../../styles/style";
import SearchButton from "./SearchButton";
import SignInButton from "./SignInButton";
import MobileNavItem from "./MobileNavItem";
import SignOutButton from "../buttons/SignOutButton";

export default function MobileNavbar({
  currentProfile,
  showSearch = true,
}) {
const {
  handleHome,
  handleDiscover,
  handleWrite,
  handleEvents,
  handleProfile,
  handleAbout,
  handleSearch,
handleNotifications
} = useNavbarNavigation(currentProfile);

  const isLoggedIn = !!currentProfile;

  return (
    <div className="md:hidden w-[100%]">

      {/* Mobile top bar */}
      <header className={styles.navbar.mobileNative}>
        <div className={styles.navbar.mobileNativeInner}>
          <button
            type="button"
            onClick={handleHome}
            className={styles.navbar.mobileNativeWordmark}
            aria-label="Go to Plumbum home"
          >
            Plumbum
          </button>

          {showSearch && (
            <SearchButton onClick={handleSearch} />
          )}

          {isLoggedIn ? (
            <SignOutButton mobile />
          ) : (
            <SignInButton onClick={()=>{
              
            }} mobile />
          )}
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="
          fixed
          inset-x-0
          bottom-0
          z-[9999]
          w-[100%]
          box-border
          border-t
          border-border-default
          bg-plumb-surface
          dark:bg-plumb-dark-surface
          shadow-[0_-4px_16px_rgba(0,0,0,0.05)]
          dark:shadow-[0_-4px_16px_rgba(0,0,0,0.18)]
          pointer-events-auto
          pb-[env(safe-area-inset-bottom,0px)]
        "
        aria-label="Mobile navigation"
      >
        <div
          className="
            flex
            min-h-[76px]
            w-[100%]
            items-center
            justify-around
            gap-1
            px-2
            pt-1
            pb-2
            pointer-events-auto
          "
        >
          <MobileNavItem label="Home" onClick={handleHome} />

          <MobileNavItem
            label="Discover"
            onClick={handleDiscover}
          />

          {isLoggedIn && (
            <MobileNavItem
              label="Write"
              onClick={handleWrite}
              active={true}
            />
          )}

          <MobileNavItem
            label="Events"
            onClick={handleEvents}
          />
    {isLoggedIn && <MobileNavItem
            label="Notifications"
            onClick={handleNotifications}
          />}
          {isLoggedIn ? (
            <MobileNavItem
              label="You"
              onClick={handleProfile}
            />
          ) : (
            <MobileNavItem
              label="About"
              onClick={handleAbout}
            />
          )}
        </div>
      </nav>
    </div>
  );
}
