
import { useState } from "react";
import useNavbarNavigation from "../../core/useNavbarNavigation";
import SearchButton from "./SearchButton";
import { useDispatch } from "react-redux";
import styles from "../../styles/style";

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

  handleSearch,

  handleNotifications
} = useNavbarNavigation(currentProfile);
 
  const isLoggedIn = !!currentProfile;



  const navigateAndClose = (handler) => {
    setMenuOpen(false);
    handler();
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
         {isLoggedIn && <BrowserNavItem
            label={(<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M4,19V17H6V10Q6,7.93 7.25,6.31T10.5,4.2V3.5q0-0.63 0.44-1.06T12,2t1.06,0.44T13.5,3.5V4.2q2,0.5 3.25,2.11T18,10v7h2v2H4Zm8-7.5ZM12,22q-0.82,0-1.41-0.59T10,20h4q0,0.82-0.59,1.41T12,22ZM8,17h8V10q0-1.65-1.17-2.82T12,6T9.18,7.18T8,10v7Z"/></svg>)}
            onClick={() =>
              navigateAndClose(handleNotifications)
            }
          />}
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