// import { useState } from "react";
// import styles from "../../styles/style";

// const FollowButton = ({isSelf,currentProfile,following,onClick}) => {

  
//     if(isSelf){
//       return    <div
    
//       className={styles.button.base+styles.button.accent+" mx-4 "}
     
        
       
  
//     >
//       {"Self"}
//     </div>
//     }
//   return (
//     <button
//       onClick={onClick}
//       className={styles.button.base+" "+(following?styles.button.primary:styles.button.secondary)}
    
//     >
//       {following? "Following" : "Follow"}
//     </button>
//   );
// };
// export default FollowButton

import styles from "../../styles/style";

const PlumbButton = ({
  isSelf,
  label,
  following,
  onClick,
  disabled = false,
}) => {

  if (isSelf) {
    return (
      <div
        className={
          styles.button.base +
          styles.button.accent +
          " mx-4"
        }
      >
        Self
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={following}
      className={
        styles.button.base +
        " " +
        (following
          ? styles.button.primary
          : styles.button.secondary)
      }
    >
      {label}
      {/* {following ? "Following" : "Follow"} */}
    </button>
  );
};

export default PlumbButton
