import useNavbarNavigation from "../../core/useNavbarNavigation";
import styles from "../../styles/style";
import SignOutButton from "../buttons/SignOutButton";
import SearchButton from "./SearchButton";
import SignInButton from "./SignInButton";


function DesktopNavbar({
  currentProfile,

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
    <header

  
    >
      <div
     className={styles.navbar.desktop}
      >

        {/* Wordmark */}
        <button
   
          type="button"
          onClick={handleHome}
          className={styles.navbar.wordmark}
     
          aria-label="Go to Plumbum home"
        >
          Plumbum
        </button>


        {/* Main navigation */}
        <nav
        className={styles.navbar.desktopNav}
     
          aria-label="Main navigation"
        >
          {/* <DesktopNavItem onClick={handleHome}>
            Home
          </DesktopNavItem> */}

          <DesktopNavItem onClick={handleDiscover}>
            Discover
          </DesktopNavItem>

          {isLoggedIn && (
            <DesktopNavItem
              onClick={handleWrite}
              
            >
              Write
            </DesktopNavItem>
          )}

          <DesktopNavItem onClick={handleEvents}>
            Events
          </DesktopNavItem>
 
          {isLoggedIn && (
            <DesktopNavItem onClick={handleProfile}>
              You
            </DesktopNavItem>
          )}
        {isLoggedIn && (
            <DesktopNavItem
              onClick={handleNotifications}
          
            >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M4,19V17H6V10Q6,7.93 7.25,6.31T10.5,4.2V3.5q0-0.63 0.44-1.06T12,2t1.06,0.44T13.5,3.5V4.2q2,0.5 3.25,2.11T18,10v7h2v2H4Zm8-7.5ZM12,22q-0.82,0-1.41-0.59T10,20h4q0,0.82-0.59,1.41T12,22ZM8,17h8V10q0-1.65-1.17-2.82T12,6T9.18,7.18T8,10v7Z"/></svg>
            </DesktopNavItem>
          )}
          {!currentProfile && <DesktopNavItem onClick={handleAbout}>
            About
          </DesktopNavItem>}
              {/* {showSearch && ( */}
            <SearchButton
              onClick={handleSearch}
            />
          {/* )} */}
        </nav>


        {/* Utility actions */}
        <div
          className="
            ml-auto
            flex
            items-center
            gap-5
            flex-col
          "
        >
      
<div className='mr-4'>
          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <SignInButton />
          )}
        </div>
</div>
      </div>
    </header>
  );
}




function DesktopNavItem({
  children,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`
        text-[1.2em]
        leading-none
        bg-transparent
        tracking-[-0.02em]
        transition-colors duration-150
        ${
          active
            ? "text-white font-semibold"
            : "text-white/70 hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}


export default DesktopNavbar