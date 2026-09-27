import { useDispatch, useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';
import { useLocation } from 'react-router';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

import { signOutAction } from '../actions/UserActions';
import Paths from '../core/paths';
import SearchButton from '../components/SearchButton';

function NavbarContainer({ isDesktop }) {
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const location = useLocation();

  const isSearchPage =
    location?.pathname === '/search';

  return (
    <>
      {isDesktop ? (
        <DesktopNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />
      ) : (
        <MobileNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />
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
      className="
        hidden
        md:flex
        w-full
        h-36
        bg-paper
        border-b
        border-border-default
        items-center
      "
    >
      <div
        className="
          w-full
          px-[6.5%]
          flex
          items-center
          justify-between
        "
      >

        {/* Wordmark */}
        <button
          type="button"
          onClick={handleHome}
          className="
            font-serif
            text-lg
            leading-none
            font-semibold
            text-text-primary
            tracking-[-0.02em]
            hover:opacity-75
            transition-opacity
          "
          aria-label="Go to Plumbum home"
        >
          Plumbum
        </button>


        {/* Main navigation */}
        <nav
          className="
            absolute
            left-1/2
            -translate-x-1/2
            flex
            items-center
            gap-[42px]
          "
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

function MobileNavbar({
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
    <div className="md:hidden w-full">

      {/* -----------------------------------------------
          Mobile top bar
      ------------------------------------------------ */}

      <header
        className="
          w-full
          border-b
          border-border-default
          flex
          items-center
          justify-between
          px-4
          py-3
        "
      >
        <button
          type="button"
          onClick={handleHome}
          className="
            font-serif
            text-md
            leading-none
            font-semibold
            text-text-primary
            tracking-[-0.025em]
          "
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
          fixed
          bottom-0
          left-0
          right-0
          z-50
          min-h-[2.4rem]
          bg-base-surface
          dark:bg-base-bgDark
          border-t
          border-border-default
          flex
          items-center
          justify-around
        "
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
      className={`
        flex
        items-center
        justify-center
        min-w-[72px]
        py-3
        text-lg
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

function SignOutButton({ mobile = false }) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const handleSignOut = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await SocialLogin.logout({
          provider: 'google',
        });
      }
    } catch (error) {
      console.error(
        'Social login logout failed:',
        error
      );
    }

    dispatch(
      signOutAction({
        profile: currentProfile,
      })
    ).then(() => {
      router.push(Paths.login, 'root');
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="
        text-text-secondary
        hover:text-text-primary
        transition-colors
        tracking-[-0.02em]
        text-md
        whitespace-nowrap
      "
    >
      Sign out
    </button>
  );
}


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
