import { useState } from "react";
import useNavbarNavigation from "../../core/useNavbarNavigation";
import SearchButton from "./SearchButton";
import { useDispatch } from "react-redux";
import styles from "../../styles/style";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { signOutAction } from "../../actions/UserActions";

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
  handleLogin,
} = useNavbarNavigation(currentProfile);

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
     closeMenu();
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

   className={styles.navbar.mobileBrowser+" px-4"}

      >
<div className='flex-1 my-auto '>
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
          className={styles.navbar.wordmark+" my-auto -translate-y-1.5"}
     
          aria-label="Go to Plumbum home"
        >
          <h2 className='text-[1.3em]'>Plumbum</h2>
        </button>

</div>
    
    <div className='flex-1  
         
       my-auto
         
             text-right'>
        
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
   
        className='w-[100%] dark:bg-plumb-dark-surface   '
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
export default BrowserMobileNavbar

function MobileBrowserNavItem({
  label,
  onClick,
  active = true,
}) {
  return (
    <div className='    "hover:bg-white/10 dark:hover:bg-plumb-mint/15 dark:bg-plumb-dark-surface bg-emerald-800 border-b border-1 border-plumb-darkText/30 py-2 text-plumb-ink w-[100%] hover:bg-plumb-mintHover'>
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