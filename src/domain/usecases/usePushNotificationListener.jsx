
// import { FirebaseMessaging } from "@capacitor-firebase/messaging";
// import { Capacitor } from "@capacitor/core";
// import { PushNotifications } from "@capacitor/push-notifications";
// import { Preferences } from "@capacitor/preferences";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { addNotification } from '../../actions/ProfileActions';
// import Environment from '../../core/Enviroment';

// export default function usePushNotificationListener() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!Capacitor.isNativePlatform()) return;
//     let receivedListenerHandle;

//     async function setup() {
//       const { receive } = await PushNotifications.requestPermissions();
//       if (receive !== 'granted') return;
//       await PushNotifications.register();
//       const { token } = await FirebaseMessaging.getToken();

//       try {
//         const authToken = (await Preferences.get({ key: 'token' })).value;
//         await fetch(`${Environment.url}/profile/device-token`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
//           body: JSON.stringify({ token }),
//         });
//       } catch (err) {
//         console.error('Failed to save device token:', err);
//       }

//       receivedListenerHandle = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
//         dispatch(addNotification({
//           id: notification.id,
//           title: notification.title,
//           body: notification.body,
//           data: notification.data,
//           createdAt: new Date().toISOString(),
//         }));
//       });
//     }

//     setup();
//     return () => {
//       receivedListenerHandle?.remove();
//     };
//   }, []);
// }

import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { addNotification } from "../../actions/ProfileActions";
import Environment from "../../core/Enviroment";

export default function usePushNotificationListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let isActive = true;
    let receivedListenerHandle;
    let actionListenerHandle;
    let tokenListenerHandle;
    let lastSavedToken = null;

    async function saveDeviceToken(token) {
      if (!token || token === lastSavedToken) return;

      try {
        const authToken = (
          await Preferences.get({ key: "token" })
        ).value;

        if (!authToken || !isActive) return;

        const response = await fetch(
          `${Environment.url}/profile/device-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Device token registration failed: ${response.status}`
          );
        }

        lastSavedToken = token;
      } catch (err) {
        console.error("Failed to save device token:", err);
      }
    }

    async function setup() {
      try {
        // Check and request notification permissions.
        const permission =
          await FirebaseMessaging.requestPermissions();

        if (!isActive || permission.receive !== "granted") {
          return;
        }

        // Listen for token changes.
        tokenListenerHandle =
          await FirebaseMessaging.addListener(
            "tokenReceived",
            (event) => {
              saveDeviceToken(event.token);
            }
          );

        // Listen for notifications received while the app is active.
        receivedListenerHandle =
          await FirebaseMessaging.addListener(
            "notificationReceived",
            (event) => {
              if (!isActive) return;

              const notification = event.notification;

              dispatch(
                addNotification({
                  id: notification.id,
                  title: notification.title,
                  body: notification.body,
                  data: notification.data,
                  createdAt: new Date().toISOString(),
                })
              );
            }
          );

        // Listen when a user taps a notification.
        actionListenerHandle =
          await FirebaseMessaging.addListener(
            "notificationActionPerformed",
            (event) => {
              if (!isActive) return;

              console.log(
                "Notification opened:",
                event.notification
              );

              // Add navigation or deep-link handling here if needed.
            }
          );

        // Register the device and retrieve its FCM token.
        const { token } = await FirebaseMessaging.getToken();

        if (isActive) {
          await saveDeviceToken(token);
        }
      } catch (err) {
        console.error(
          "Push notification setup failed:",
          err
        );
      }
    }

    setup();

    return () => {
      isActive = false;

      receivedListenerHandle?.remove();
      actionListenerHandle?.remove();
      tokenListenerHandle?.remove();
    };
  }, [dispatch]);
}
