import { useState } from "react";

const FollowButton = ({ prof,isSelf,current,follow,onClick}) => {

  
    


     



// {Enviroment.palette.button.secondary.}
  // if (isSelf) return null;
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 text-sm  rounded-full mx-4 transition
        
        ${follow ? "bg-button-secondary-bg text-white" : " bg-button-primary-bg text-white"}
      `}
    >
      {follow? "Following" : "Follow"}
    </button>
  );
};
export default FollowButton