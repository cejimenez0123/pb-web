
// import { PushNotifications } from '@capacitor/push-notifications';
// import { FirebaseMessaging } from '@capacitor-firebase/messaging';
// import { Capacitor } from '@capacitor/core';
// import { useDispatch } from 'react-redux';
// import { addNotification } from '../../actions/ProfileActions';
// import { useEffect } from 'react';
// import { Preferences } from '@capacitor/preferences';
// import Environment from '../../core/Enviroment';
// import { useIonRouter } from '@ionic/react';
// import { useHistory } from 'react-router';

// export default function usePushNotificationListener() {
//   const dispatch = useDispatch();
// const router =useIonRouter()
//   const history = useHistory()
//   useEffect(() => {
//     if (!Capacitor.isNativePlatform()) return;

//     async function setup() {
//       const { receive } = await PushNotifications.requestPermissions();
//       if (receive !== 'granted') return;

//       await PushNotifications.register();

//       // ← use FirebaseMessaging to get real FCM token
//       const { token } = await FirebaseMessaging.getToken();
//       console.log('FCM token:', token);

//       try {
//         const authToken = (await Preferences.get({ key: 'token' })).value;
//         await fetch(`${Environment.url}/profile/device-token`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${authToken}`,
//           },
//           body: JSON.stringify({ token }), // ← real FCM token
//         });
//       } catch (err) {
//         console.error('Failed to save device token:', err);
//       }
//     }

//     setup();

//     PushNotifications.addListener('pushNotificationReceived', (notification) => {
//       dispatch(addNotification({
//         id: notification.id,
//         title: notification.title,
//         body: notification.body,
//         data: notification.data,
//         createdAt: new Date().toISOString(),
//       }));
//     });

// // PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
// //   const data = action.notification.data;
// //   if (data?.route) {
// //     const route = data.route.replace(/\s+/g, '');
// //     setTimeout(() => {
// //       router.push(route);
// //     }, 500); // ← wait for router to be ready
// //   }
// // });
//  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
//     const data = action.notification.data;
//     if (data?.route) {
//       const route = data.route.replace(/\s+/g, '');
//       setTimeout(() => {
//         history.push(route); // ← useHistory instead
//       }, 500);
//     }
//   });
// // PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
// //       const data = action.notification.data;
     
// //        const route = data.route.replace(/\s+/g, ''); // strip any spaces
// //    window.alert('Navigating to:' + route);
// //       data?.route &&  router.push(route);

// //     });
//     return () => {
//       PushNotifications.removeAllListeners();
//     };
//   }, []);
// }
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../actions/ProfileActions';
import { useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import Environment from '../../core/Enviroment';

export default function usePushNotificationListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    async function setup() {
      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== 'granted') return;

      await PushNotifications.register();

      const { token } = await FirebaseMessaging.getToken();
      console.log('FCM token:', token);

      try {
        const authToken = (await Preferences.get({ key: 'token' })).value;
        await fetch(`${Environment.url}/profile/device-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        console.error('Failed to save device token:', err);
      }
    }

    setup();

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      dispatch(addNotification({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        data: notification.data,
        createdAt: new Date().toISOString(),
      }));
    });

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, []);
}