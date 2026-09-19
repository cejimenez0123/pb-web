import { useDispatch, useSelector } from 'react-redux';
import { useIonRouter } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

import { signOutAction } from '../actions/UserActions';
import { setPageInView } from '../actions/PageActions.jsx';
import Paths from '../core/paths';


function NavbarContainer({ isDesktop }) {
  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  return (
    <>
      {isDesktop ? (
        <DesktopNavbar currentProfile={currentProfile} />
      ) : (
        <MobileNavbar currentProfile={currentProfile} />
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

function DesktopNavbar({ currentProfile }) {
  const {
    handleHome,
    handleDiscover,
    handleWrite,
    handleEvents,
    handleProfile,
    handleAbout,
  } = useNavbarNavigation();

  return (
    <header className="hidden md:flex w-full  h-36 bg-paper border-b border-border-default items-center">
      <div className="w-full px-[6.5%] flex items-center justify-between">

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

          <DesktopNavItem
            onClick={handleWrite}
            active
          >
            Write
          </DesktopNavItem>

          <DesktopNavItem onClick={handleEvents}>
            Events
          </DesktopNavItem>

          <DesktopNavItem onClick={handleProfile}>
            You
          </DesktopNavItem>

          <DesktopNavItem onClick={handleAbout}>
            About
          </DesktopNavItem>
               {currentProfile ? (
          <SignOutButton />
        ) : (
          <SignInButton />
        )}
        </nav>

        {/* Authentication */}
   

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

function MobileNavbar({ currentProfile }) {
  const {
    handleHome,
    handleDiscover,
    handleWrite,
    handleEvents,
    handleProfile,
  } = useNavbarNavigation();

  return (
    <div className="md:hidden w-full">

      {/* -----------------------------------------------
          Mobile top bar
      ------------------------------------------------ */}

      <header
        className="
          w-[100%]
       
          border-b
          border-border-default
          flex
          items-center
          justify-between
          px-2
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

        {currentProfile ? (
          <SignOutButton mobile />
        ) : (
          <SignInButton mobile />
        )}
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
`         min-h-[2.4rem]
       
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

        <MobileNavItem
          label="Write"
          onClick={handleWrite}
          active
        />

        <MobileNavItem
          label="Events"
          onClick={handleEvents}
        />

        <MobileNavItem
          label="You"
          onClick={handleProfile}
        />
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

       text-lg
        leading-none
        tracking-[-0.02em]
        transition-colors
        duration-150
        ${
          active
            ? 'text-text-primary'
            : 'text-text-secondary'
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
      console.error('Social login logout failed:', error);
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
      className={`
        text-text-secondary
        hover:text-text-primary
        transition-colors
        duration-150
        tracking-[-0.02em]
      text-md
      `}
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
      onClick={() => router.push(Paths.login, 'forward')}
      className={`
        text-text-secondary
        hover:text-text-primary
        transition-colors
        duration-150
        tracking-[-0.02em]
        ${mobile ? '     text-lg' : '     text-lg'}
      `}
    >
      Sign in
    </button>
  );
}