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
    
    >
      {follow? "Following" : "Follow"}
    </button>
  );
};
export default FollowButton