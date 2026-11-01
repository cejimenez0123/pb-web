import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import React, { useState } from 'react';
import { signOutAction } from '../actions/UserActions';
import SearchButton from '../components/nav/SearchButton';
import styles from '../styles/style';
import SignOutButton from '../components/buttons/SignOutButton';
import useNavbarNavigation from '../core/useNavbarNavigation';
import MobileNavbar from '../components/nav/MobileNavbar';
import SignInButton from '../components/nav/SignInButton';

function NavbarContainer({ isDesktop,currentProfile }) {
  // const currentProfile = useSelector(
  //   (state) => state.users.currentProfile
  // );

  const location = useLocation();
  const isLoggedIn = !!currentProfile;
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
       isNative?isLoggedIn && <MobileNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />:
     <MobileNavbar
          currentProfile={currentProfile}
          showSearch={!isSearchPage}
        />
        // <BrowserMobileNavbar  showSearch={!isSearchPage} currentProfile={currentProfile}/>
      )}
    </>
  );
}

export default NavbarContainer;


/* =========================================================
   SHARED
========================================================= */



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
      className={`
        text-[1.2em]
        leading-none
        bg-transparent
        text-white
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
   AUTH
========================================================= */



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
    handleLogin
  } = useNavbarNavigation();

  const isLoggedIn = !!currentProfile;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navigateAndClose = (handler) => {
    closeMenu();
    handler();
  };
  const dispatch = useDispatch()
  const handleSignOut = async () => {
    try{
         dispatch(
      signOutAction({
        profile: currentProfile,
      }))
         if (Capacitor.isNativePlatform()) {
        await SocialLogin.logout({
          provider: 'google',
        });
      }
    
    }
catch (error) {
      console.error(
        'Social login logout failed:',
        error
      );
    
    }


    

  };
  return (
    <div    >


      <header

   className={styles.navbar.mobileBrowser}

      >
<div className='flex-1 my-auto'>
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
</div>
<div className='flex-2 my-auto text-center'>
      
        <button
          type="button"
          onClick={() =>
            navigateAndClose(handleHome)
          }
          className={styles.navbar.wordmark+" my-auto py-4"}
     
          aria-label="Go to Plumbum home"
        >
          <h2 className='text-[1.3em]'>Plumbum</h2>
        </button>

</div>
    
    <div className='flex-1   text-right'>
      
            <SearchButton
              onClick={handleSearch}
            />
          
     
</div>
        
  
      </header>


      {/* -----------------------------------------------
          Hamburger navigation
      ------------------------------------------------ */}

      {menuOpen && (
        <nav
          // id="mobile-browser-navigation"
        className='w-[100%]   '
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

          {!isLoggedIn && (
            
            <MobileBrowserNavItem
              label="Sign in"
              onClick={() =>
                navigateAndClose(handleLogin)
              }
            />
        
          )}
       {isLoggedIn &&  <MobileBrowserNavItem label={"Sign Out"} onClick={handleSignOut}/>}
     
        </nav>
      )}

    </div>
  );
}


function MobileBrowserNavItem({
  label,
  onClick,
  active = true,
}) {
  return (
    <div className='    "hover:bg-white/10 dark:hover:bg-plumb-mint/15 bg-plumb-mint w-[100%] hover:bg-plumb-mintHover'>
    <button
      type="button"
      onClick={onClick}
            // text-base
      className={`
 
        flex
        items-center
        px-2
        py-1
        text-white
 bg-transparent
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
      <h6 className='text-[1rem]'>{label}</h6>
    </button>
    </div>
  );
}
