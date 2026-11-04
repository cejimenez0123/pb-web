import { useState } from "react";
import styles from "../../styles/style";

const FollowButton = ({ prof,isSelf,current,follow,onClick}) => {

  
    if(isSelf){
      return    <div
      // onClick={onClick}
      className={styles.button.base+styles.button.accent+" mx-4 "}
     
        
       
  
    >
      {"Self"}
    </div>
    }
  return (
    <button
      onClick={onClick}
      className={styles.button.base+" "+styles.button.primary}
      // className={`
      //   px-4 h-10 text-sm   rounded-full mx-4 transition
        
      //   ${follow ? "bg-button-secondary-bg text-white" : " bg-button-primary-bg text-white"}
      // `}
    >
      {follow? "Following" : "Follow"}
    </button>
  );
};
export default FollowButton