
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { Preferences } from "@capacitor/preferences";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from '../../actions/ProfileActions';
import Environment from '../../core/Enviroment';

export default function usePushNotificationListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let receivedListenerHandle;

    async function setup() {
      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== 'granted') return;
      await PushNotifications.register();
      const { token } = await FirebaseMessaging.getToken();

      try {
        const authToken = (await Preferences.get({ key: 'token' })).value;
        await fetch(`${Environment.url}/profile/device-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        console.error('Failed to save device token:', err);
      }

      receivedListenerHandle = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        dispatch(addNotification({
          id: notification.id,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          createdAt: new Date().toISOString(),
        }));
      });
    }

    setup();
    return () => {
      receivedListenerHandle?.remove();
    };
  }, []);
}