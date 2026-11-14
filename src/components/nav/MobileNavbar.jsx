
// import useNavbarNavigation from "../../core/useNavbarNavigation";
// import styles from "../../styles/style";
// import SearchButton from "./SearchButton";
// import SignInButton from "./SignInButton";
// import MobileNavItem from "./MobileNavItem";
// import SignOutButton from "../buttons/SignOutButton";

// export default function MobileNavbar({
//   currentProfile,

// }) {
// const {
//   handleHome,
//   handleDiscover,
//   handleWrite,
//   handleEvents,
//   handleProfile,
//   handleAbout,
//   handleSearch,
// handleNotifications
// } = useNavbarNavigation(currentProfile);

//   const isLoggedIn = !!currentProfile;

//   return (
//     <div className="md:hidden w-[100%]">

//       {/* Mobile top bar */}
//       <header 
//       className={styles.navbar.header}
//       // className={styles.navbar.head}

//       >
   
          
//           <button
//             type="button"
//             onClick={()=>isLoggedIn?handleNotifications():handleHome()}
//             // className={styles.navbar.mobileNativeWordmark}
//                  className="text-plumb-surface font-open-sans text-base bg-transparent"
//             aria-label="Go to Plumbum home"
//           >
//             {isLoggedIn?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M4,19V17H6V10Q6,7.93 7.25,6.31T10.5,4.2V3.5q0-0.63 0.44-1.06T12,2t1.06,0.44T13.5,3.5V4.2q2,0.5 3.25,2.11T18,10v7h2v2H4Zm8-7.5ZM12,22q-0.82,0-1.41-0.59T10,20h4q0,0.82-0.59,1.41T12,22ZM8,17h8V10q0-1.65-1.17-2.82T12,6T9.18,7.18T8,10v7Z"/></svg>
//          :<h6 className="my-auto  font-serif ">{"Plumbum"}</h6>}
//           </button>

          
          
    
//             <SearchButton onClick={handleSearch} />


//           {isLoggedIn ? (
//             <SignOutButton mobile />
//           ) : (
//             <SignInButton onClick={()=>{
              
//             }} mobile />
//           )}
//         {/* </div> */}
//       </header>

//       {/* Mobile bottom navigation */}
//       <nav
//         className="
//           fixed
//           inset-x-0
//           bottom-0
//           z-[9999]
//           w-[100%]
//           box-border
//           border-t
//           border-border-default
//           bg-plumb-surface
//           dark:bg-plumb-dark-surface
//           shadow-[0_-4px_16px_rgba(0,0,0,0.05)]
//           dark:shadow-[0_-4px_16px_rgba(0,0,0,0.18)]
//           pointer-events-auto
//           pb-[env(safe-area-inset-bottom,0px)]
//         "
//         aria-label="Mobile navigation"
//       >
//         <div
//           className="
//             flex
//             min-h-[76px]
//             w-[100%]
//             items-center
//             justify-around
//             gap-1
//             px-2
//             pt-1
//             pb-2
//             pointer-events-auto
//           "
//         >
//           <MobileNavItem label="Home" onClick={handleHome} />

//           <MobileNavItem
//             label="Discover"
//             onClick={handleDiscover}
//           />

       
//             <MobileNavItem
//            willRender={isLoggedIn}
//               label="Write"
//               onClick={handleWrite}
//               active={true}
//             />
        

//           <MobileNavItem
//             label="Events"
//             onClick={handleEvents}
//           />
   
//           {/* {isLoggedIn ? ( */}
//             <MobileNavItem
//                  willRender={isLoggedIn}
//               label="You"
//               onClick={handleProfile}
//             />
//           {/* ) : ( */}
//             <MobileNavItem
//               label="About"
//                    willRender={!isLoggedIn}
//               onClick={handleAbout}
//             />
//           {/* )} */}
//         </div>
//       </nav>
//     </div>
//   );
// }


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
      <header 
      className={styles.navbar.header}
      // className={styles.navbar.head}

      >
   
          
          <button
            type="button"
            onClick={()=>isLoggedIn?handleNotifications():handleHome()}
            // className={styles.navbar.mobileNativeWordmark}
                 className="text-plumb-surface font-open-sans text-base bg-transparent"
            aria-label="Go to Plumbum home"
          >
            {isLoggedIn?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#FFFFFF"><path d="M4,19V17H6V10Q6,7.93 7.25,6.31T10.5,4.2V3.5q0-0.63 0.44-1.06T12,2t1.06,0.44T13.5,3.5V4.2q2,0.5 3.25,2.11T18,10v7h2v2H4Zm8-7.5ZM12,22q-0.82,0-1.41-0.59T10,20h4q0,0.82-0.59,1.41T12,22ZM8,17h8V10q0-1.65-1.17-2.82T12,6T9.18,7.18T8,10v7Z"/></svg>
         :<h6 className="my-auto  font-serif ">{"Plumbum"}</h6>}
          </button>

          
          
    
            <SearchButton onClick={handleSearch} />


          {isLoggedIn ? (
            <SignOutButton mobile />
          ) : (
            <SignInButton onClick={()=>{
              
            }} mobile />
          )}
        {/* </div> */}
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
