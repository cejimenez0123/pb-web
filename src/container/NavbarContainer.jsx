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
import BrowserMobileNavbar from '../components/nav/BrowserMobileNavbar';

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
  
        <BrowserMobileNavbar  showSearch={!isSearchPage} currentProfile={currentProfile}/>
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





