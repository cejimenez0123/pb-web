// import { useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchNotifcations } from "../../actions/ProfileActions";
// import NotificationItem from "../../components/profile/NotificationItem";
// import { IonList, IonContent, IonItem } from "@ionic/react";
// import Paths from "../../core/paths";
// import Context from "../../context";



// import { PushNotifications } from '@capacitor/push-notifications';
// import { Capacitor } from "@capacitor/core";
// // import { useEffect } from 'react';

// export default function NotificationContainer({ currentProfile }) {
//   const dispatch = useDispatch();
//   const items = useSelector((state) => state.users.notifications ?? []);
// const {isDesktop}=useContext(Context)
//   useEffect(() => {
//     // Request permission
//    if(Capacitor.isNativePlatform()&&currentProfile){
//     PushNotifications.requestPermissions().then(result => {
//       if (result.receive === 'granted') {
//         // Register with Apple / Firebase
//         PushNotifications.register();
//       }
//     });

//     // On registration, get the device token
//     PushNotifications.addListener('registration', token => {
//       console.log('Device token:', token.value);
//       // Send token to your backend to store with profile
//       fetch('/api/save-token', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ profileId: currentProfile.id, token: token.value })
//       });
//     });

//     // Handle incoming push notifications
//     PushNotifications.addListener('pushNotificationReceived', notification => {
//       console.log('Push received:', notification);
//       // Optionally update Redux state or UI
//     });

//     // Handle push notification action when tapped
//     PushNotifications.addListener('pushNotificationActionPerformed', action => {
//       console.log('Push action performed', action.notification);
//     });
//   }
//   }, [currentProfile]);


//   useEffect(() => {
//     if (currentProfile) {
//       dispatch(fetchNotifcations({ profile: currentProfile }));
//     }
//   }, [currentProfile]);

//   const todayItems = items.filter(
//     (item) => new Date(item.date).toDateString() === new Date().toDateString()
//   );
//   const olderItems = items.filter(
//     (item) => new Date(item.date).toDateString() !== new Date().toDateString()
//   );
//          const handleBack = (e) => {
//     e.preventDefault();
//     if (window.history.length > 1) {
//        router.goBack()
//     } else {
//      router.push(Paths.myProfile, "root", "replace");
//     }
//   };
//   return (
//     <IonContent className="bg-cream p-4">
     
//       <div className="mx-auto w-[96vw] md:w-page">

//         {/* Today Section */}
//         {todayItems.length > 0 && (
//           <div className="mb-8">
//             <h2 className="lora-bold text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
//               Today
//             </h2>
//             <IonList className="space-y-2">
//               {todayItems.map((item, i) => (
//                 <IonItem
//                   key={i}
//                   className="rounded-lg bg-white shadow-sm hover:bg-emerald-50 transition p-2"
//                 >
//                   <NotificationItem item={item} />
//                 </IonItem>
//               ))}
//             </IonList>
//           </div>
//         )}

//         {/* Older Notifications */}
//         {olderItems.length > 0 && (
//           <div className="mb-8 pt-8">
//             <h2 className="lora-bold text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
//               Earlier
//             </h2>
//             <IonList className="space-y-2">
//               {olderItems.map((item, i) => (
//                 <IonItem
//                   key={i}
//                   className="rounded-lg bg-white shadow-sm hover:bg-emerald-50 transition p-2"
//                 >
//                   <NotificationItem item={item} />
//                 </IonItem>
//               ))}
//             </IonList>
//           </div>
//         )}

//         {/* Empty state */}
//         {items.length === 0 && (
//           <div className="text-center text-emerald-700 mt-12">
//             No notifications yet.
//           </div>
//         )}
//       </div>
//     </IonContent>
//   );
// }

import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifcations } from "../../actions/ProfileActions";
import NotificationItem from "../../components/profile/NotificationItem";
import { IonList, IonContent } from "@ionic/react";
import Paths from "../../core/paths";
import Context from "../../context";

export default function NotificationContainer({ currentProfile }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.users.notifications ?? []);
  const { isDesktop } = useContext(Context);

  useEffect(() => {
    if (currentProfile) {
      dispatch(fetchNotifcations({ profile: currentProfile }));
    }
  }, [currentProfile]);

  const todayItems = items.filter(
    (item) => new Date(item.date).toDateString() === new Date().toDateString()
  );
  const olderItems = items.filter(
    (item) => new Date(item.date).toDateString() !== new Date().toDateString()
  );

  return (
    <IonContent className="bg-cream p-4">
      <div className="mx-auto w-[96vw] md:w-page">

        {/* Today Section */}
        {todayItems.length > 0 && (
          <section className="mb-8">
            <h2 className=" text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
              Today
            </h2>
            <IonList className="space-y-2">
              {todayItems.map((item, i) => (
                <NotificationItem
                  key={i}
                  item={item}
                  lastNotified={currentProfile.lastNotified}
                />
              ))}
            </IonList>
          </section>
        )}

        {/* Older Notifications */}
        {olderItems.length > 0 && (
          <section className="mb-8 px-4 pt-8">
            <h2 className=" text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
              Earlier
            </h2>
            <IonList className="space-y-2">
              {olderItems.map((item, i) => (
                <NotificationItem
                  key={i}
                  item={item}
                  lastNotified={currentProfile.lastNotified}
                />
              ))}
            </IonList>
          </section>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center text-emerald-700 mt-12 text-lg">
            No notifications yet. Relax, nothing new today!
          </div>
        )}
      </div>
    </IonContent>
  );
}