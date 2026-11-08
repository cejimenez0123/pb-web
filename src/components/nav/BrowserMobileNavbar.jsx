import { useState } from "react";
import useNavbarNavigation from "../../core/useNavbarNavigation";
import SearchButton from "./SearchButton";
import { useDispatch } from "react-redux";
import styles from "../../styles/style";
import { SocialLogin } from "@capgo/capacitor-social-login";
import { signOutAction } from "../../actions/UserActions";
import { Capacitor } from "@capacitor/core";
import SignOutButton from "../buttons/SignOutButton";
import SignInButton from "./SignInButton";
import BrowserNavItem from "./BroswerNavItem";

function BrowserMobileNavbar({
  currentProfile,

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
  const dispatch = useDispatch()
  const isLoggedIn = !!currentProfile;



  const navigateAndClose = (handler) => {
    setMenuOpen(false);
    handler();
  };

  const handleSignOut = async () => {
  setMenuOpen(false);
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
          <BrowserNavItem
            label="Home"
            onClick={() =>
              navigateAndClose(handleHome)
            }
          />

          <BrowserNavItem
            label="Discover"
            onClick={() =>
              navigateAndClose(handleDiscover)
            }
          />

          {isLoggedIn && (
            <BrowserNavItem
              label="Write"
              onClick={() =>
                navigateAndClose(handleWrite)
              }
              active
            />
          )}

          <BrowserNavItem
            label="Events"
            onClick={() =>
              navigateAndClose(handleEvents)
            }
          />

          {isLoggedIn && (
            <BrowserNavItem
              label="You"
              onClick={() =>
                navigateAndClose(handleProfile)
              }
            />
          )}


           <div className='  hover:bg-white/10 dark:hover:bg-plumb-mint/15 dark:bg-plumb-dark-surface bg-emerald-800 border-b border-1 border-plumb-darkText/30 py-2 text-plumb-ink w-[100%] hover:bg-plumb-mintHover'>
   
{isLoggedIn?<SignOutButton onClick={()=>setMenuOpen(false)} mobile={true} />:<SignInButton mobile={true} onClick={()=>setMenuOpen(false)} />}
</div>

        </nav>
      )}

    </div>
  );
}
export default BrowserMobileNavbar
