import { useDispatch, useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';
import { useLocation } from 'react-router';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import React, { useEffect, useRef, useState } from 'react';
import { signOutAction } from '../actions/UserActions';
import Paths from '../core/paths';
import SearchButton from '../components/SearchButton';
import styles from '../styles/style';
import SignOutButton from '../components/buttons/SignOutButton';

function NavbarContainer({ isDesktop }) {
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const location = useLocation();

  const isSearchPage =
    location?.pathname === '/search';
    const isNative = Capacitor.isNativePlatform()
  return (
    <>
      {isDesktop ? (
        <DesktopNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />
      ) : (
        isNative?<MobileNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />:<BrowserMobileNavbar  showSearch={!isSearchPage} currentProfile={currentProfile}/>
      )}
    </>
  );
}

export default NavbarContainer;


/* =========================================================
   SHARED
========================================================= */

function useNavbarNavigation() {
  const router = useIonRouter();
  const dispatch = useDispatch();

  const navigate = (path, direction = 'forward') => {
    router.push(path, direction);
  };

  const handleSearch = () => {
    navigate('/search', 'forward');
  };

  const handleWrite = () => {
    navigate(Paths.write, 'forward');
  };

  const handleHome = () => {
    navigate(Paths.home, 'root');
  };

  const handleDiscover = () => {
    navigate(Paths.discovery, 'forward');
  };

  const handleEvents = () => {
    navigate(Paths.calendar(), 'forward');
  };

  const handleProfile = () => {
    navigate(Paths.myProfile, 'root');
  };

  const handleAbout = () => {
    navigate(Paths.about(), 'forward');
  };

  return {
    router,
    dispatch,
    navigate,
    handleSearch,
    handleWrite,
    handleHome,
    handleDiscover,
    handleEvents,
    handleProfile,
    handleAbout,
  };
}


/* =========================================================
   DESKTOP NAVBAR
========================================================= */

function DesktopNavbar({
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
  } = useNavbarNavigation();

  const isLoggedIn = !!currentProfile;

  return (
    <header

  
    >
      <div
     className={styles.navbar.desktop}
      >

        {/* Wordmark */}
        <button
        cl
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
          <DesktopNavItem onClick={handleHome}>
            Home
          </DesktopNavItem>

          <DesktopNavItem onClick={handleDiscover}>
            Discover
          </DesktopNavItem>

          {isLoggedIn && (
            <DesktopNavItem
              onClick={handleWrite}
              active
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

          <DesktopNavItem onClick={handleAbout}>
            About
          </DesktopNavItem>
        </nav>


        {/* Utility actions */}
        <div
          className="
            ml-auto
            flex
            items-center
            gap-5
          "
        >
          {showSearch && (
            <SearchButton
              onClick={handleSearch}
            />
          )}

          {isLoggedIn ? (
            <SignOutButton />
          ) : (
            <SignInButton />
          )}
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
      className={`
        text-[1.2em]
        leading-none
        tracking-[-0.02em]
        transition-colors
        duration-150
        ${
          active
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }
      `}
    >
      {children}
    </button>
  );
}


/* =========================================================
   MOBILE NAVBAR
========================================================= */
function useMobileViewportInset() {
  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return undefined;

    const updateViewportInset = () => {
      const bottomInset = Math.max(
        0,
        window.innerHeight -
          (viewport.offsetTop + viewport.height)
      );

      document.documentElement.style.setProperty(
        '--plumbum-visual-bottom-inset',
        `${bottomInset}px`
      );
    };

    updateViewportInset();

    viewport.addEventListener('resize', updateViewportInset);
    viewport.addEventListener('scroll', updateViewportInset);
    window.addEventListener('resize', updateViewportInset);

    return () => {
      viewport.removeEventListener('resize', updateViewportInset);
      viewport.removeEventListener('scroll', updateViewportInset);
      window.removeEventListener('resize', updateViewportInset);

      document.documentElement.style.removeProperty(
        '--plumbum-visual-bottom-inset'
      );
    };
  }, []);
}
function MobileNavbar({
  currentProfile,
  showSearch = true,
}) {
   useMobileViewportInset();

  const {
    handleHome,
    handleDiscover,
    handleWrite,
    handleEvents,
    handleProfile,
    handleAbout,
    handleSearch,
  } = useNavbarNavigation();

  const isLoggedIn = !!currentProfile;

  return (
    <div 
    
    className="md:hidden w-full"
    >

      {/* -----------------------------------------------
          Mobile top bar
      ------------------------------------------------ */}

      <header
      className={styles.navbar.mobileNative}
        // className="
        //   w-full
        //   border-b
        //   border-border-default
        //   flex
        //   items-center
        //   justify-between
        //   px-4
        //   py-3
        // "
      >
        <button
          type="button"
          onClick={handleHome}
          className={styles.navbar.mobileNativeItem}
          // className="
          //   font-serif
          //   text-md
          //   leading-none
          //   font-semibold
          //   text-text-primary
          //   tracking-[-0.025em]
          // "
          aria-label="Go to Plumbum home"
        >
          Plumbum
        </button>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {showSearch && (
            <SearchButton
              onClick={handleSearch}
            />
          )}

          {isLoggedIn ? (
            <SignOutButton mobile />
          ) : (
            <SignInButton mobile />
          )}
        </div>
      </header>


      {/* -----------------------------------------------
          Mobile bottom navigation
      ------------------------------------------------ */}

<nav
  className="
    md:hidden
    fixed
    left-0
    right-0
    z-50
    min-h-14
    bg-plumb-surface
    dark:bg-base-bgDark
    border-t
    border-border-default
    flex
    items-center
    justify-around
    pb-[env(safe-area-inset-bottom)]
  "
  style={{
    bottom:
      'var(--plumbum-visual-bottom-inset, env(safe-area-inset-bottom, 0px))',
  }}
  aria-label="Mobile navigation"
>
  <MobileNavItem
    label="Home"
    onClick={handleHome}
  />

  <MobileNavItem
    label="Discover"
    onClick={handleDiscover}
  />

  {isLoggedIn && (
    <MobileNavItem
      label="Write"
      onClick={handleWrite}
      active
    />
  )}

  <MobileNavItem
    label="Events"
    onClick={handleEvents}
  />

  {isLoggedIn && (
    <MobileNavItem
      label="You"
      onClick={handleProfile}
    />
  )}

  {!isLoggedIn && (
    <MobileNavItem
      label="About"
      onClick={handleAbout}
    />
  )}
</nav>

    </div>
  );
}

function MobileNavItem({
  label,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`
        flex
        flex-1
        min-w-0
        min-h-14
        items-center
        justify-center
        px-1
        py-3
        text-sm
        sm:text-base
        leading-none
        tracking-[-0.02em]
        transition-colors
        ${
          active
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }
      `}
    >
      {label}
    </button>
  );
}





/* =========================================================
   AUTH
========================================================= */




function SignInButton({ mobile = false }) {
  const router = useIonRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(Paths.login, 'forward')
      }
      className="
        text-text-secondary
        hover:text-text-primary
        transition-colors
        whitespace-nowrap
        tracking-[-0.02em]
        text-md
      "
    >
      Sign in
    </button>
  );
}


/* =========================================================
   MOBILE BROWSER NAVBAR
========================================================= */

function BrowserMobileNavbar({
  currentProfile,
  showSearch = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    handleHome,
    handleDiscover,
    handleWrite,
    handleEvents,
    handleProfile,
    handleAbout,
    handleSearch,
  } = useNavbarNavigation();

  const isLoggedIn = !!currentProfile;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navigateAndClose = (handler) => {
    closeMenu();
    handler();
  };

  return (
    <div    >

      {/* -----------------------------------------------
          Mobile browser top bar
      ------------------------------------------------ */}

      <header
   className={styles.navbar.mobileBrowser}

      >

<button
  type="button"
  onClick={() => setMenuOpen((open) => !open)}
  className={styles.navbar.mobileBrowserMenu}
  aria-label={
    menuOpen
      ? 'Close navigation menu'
      : 'Open navigation menu'
  }
  aria-expanded={menuOpen}
  aria-controls="mobile-browser-navigation"
>
  <div className={styles.navbar.menuBrowserIconLine}/>
  <div className={styles.navbar.menuBrowserIconLine}/>
      <div className={styles.navbar.menuBrowserIconLine}/>
     <div className={styles.navbar.menuBrowserIconLine}/>
  {/* </span> */}
</button>

        {/* Hamburger */}
      


        {/* Wordmark */}
        <button
          type="button"
          onClick={() =>
            navigateAndClose(handleHome)
          }
          className={styles.navbar.wordmark}
     
          aria-label="Go to Plumbum home"
        >
          Plumbum
        </button>


        {/* Utility actions */}
        <div
        className='flex flex-row  justify-between w-[80%] '
   
        >
          {showSearch && (
            <SearchButton
              onClick={handleSearch}
            />
          )}

          {isLoggedIn ? (
            <SignOutButton mobile />
          ) : (
            <SignInButton mobile />
          )}
        </div>

      </header>


      {/* -----------------------------------------------
          Hamburger navigation
      ------------------------------------------------ */}

      {menuOpen && (
        <nav
          id="mobile-browser-navigation"
     
          aria-label="Mobile navigation"
        >
          <MobileBrowserNavItem
            label="Home"
            onClick={() =>
              navigateAndClose(handleHome)
            }
          />

          <MobileBrowserNavItem
            label="Discover"
            onClick={() =>
              navigateAndClose(handleDiscover)
            }
          />

          {isLoggedIn && (
            <MobileBrowserNavItem
              label="Write"
              onClick={() =>
                navigateAndClose(handleWrite)
              }
              active
            />
          )}

          <MobileBrowserNavItem
            label="Events"
            onClick={() =>
              navigateAndClose(handleEvents)
            }
          />

          {isLoggedIn && (
            <MobileBrowserNavItem
              label="You"
              onClick={() =>
                navigateAndClose(handleProfile)
              }
            />
          )}

          {!isLoggedIn && (
            <MobileBrowserNavItem
              label="About"
              onClick={() =>
                navigateAndClose(handleAbout)
              }
            />
          )}
        </nav>
      )}

    </div>
  );
}


function MobileBrowserNavItem({
  label,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full
        flex
        items-center
        px-2
        py-3
        text-base
        leading-none
        text-left
        tracking-[-0.02em]
        transition-colors
        ${
          active
            ? 'text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }
      `}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </button>
  );
}
