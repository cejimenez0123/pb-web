

// import { useEffect, useState } from "react";
// import "../../App.css";
// import isValidUrl from "../../core/isValidUrl";
// import Enviroment from "../../core/Enviroment";

// const ProfileInfo = ({ profile }) => {
//   const [pictureUrl, setPictureUrl] = useState(
//     Enviroment.blankProfile
//   );

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchImage() {
//       if (!profile?.profilePic) {
//         if (isMounted) {
//           setPictureUrl(Enviroment.blankProfile);
//         }
//         return;
//       }

//       if (isValidUrl(profile.profilePic)) {
//         if (isMounted) {
//           setPictureUrl(profile.profilePic);
//         }
//         return;
//       }

//       const src = Enviroment.imageProxy(profile.profilePic);

//       if (isMounted) {
//         setPictureUrl(src);
//       }
//     }

//     fetchImage();

//     return () => {
//       isMounted = false;
//     };
//   }, [profile]);

//   if (!profile) {
//     return (
//       <div
//         className="
//           h-[6rem]
//           w-[6rem]
//           shrink-0
//           rounded-full
//           bg-gray-200
//         "
//       />
//     );
//   }

//   return (
//     <div
//       className="
//         h-[6rem]
//         w-[6rem]
//         shrink-0
//         overflow-hidden
//         rounded-full
//         sm:h-[7rem]
//         sm:w-[7rem]
//       "
//     >
//       <img
//         src={pictureUrl}
//         alt=""
//         className="h-full w-full object-cover"
//       />
//     </div>
//   );
// };

// export default ProfileInfo;

import "../../App.css";
import isValidUrl from "../../core/isValidUrl";
import Enviroment from "../../core/Enviroment";

const getProfilePictureUrl = (profile) => {
  if (profile?.profilePictureId) {
    return `${Enviroment.url}/api/photos/${profile.profilePictureId}`;
  }

  if (profile?.profilePic) {
    return isValidUrl(profile.profilePic)
      ? profile.profilePic
      : Enviroment.blankProfile;
  }

  return Enviroment.blankProfile;
};

const ProfileInfo = ({ profile }) => {
  if (!profile) {
    return (
      <div
        className="
          h-[6rem] w-[6rem] shrink-0 rounded-full bg-gray-200
        "
      />
    );
  }

  return (
    <div
      className="
        h-[6rem] w-[6rem] shrink-0 overflow-hidden rounded-full
        sm:h-[7rem] sm:w-[7rem]
      "
    >
      <img
        src={getProfilePictureUrl(profile)}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = Enviroment.blankProfile;
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default ProfileInfo;
