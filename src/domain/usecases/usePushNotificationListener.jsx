import { PushNotifications } from '@capacitor/push-notifications'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../actions/ProfileActions'
import { useEffect } from 'react'
import { Preferences } from '@capacitor/preferences'
import Environment from '../../core/Enviroment'

export default function usePushNotificationListener() {
    const dispatch = useDispatch()

    useEffect(() => {
        // 1. Request permissions + register
        PushNotifications.requestPermissions().then((permission) => {
            if (permission.receive === 'granted') {
                PushNotifications.register();
            }
        });

        // 2. Save device token to backend
        PushNotifications.addListener('registration', async (deviceToken) => {
            try {
                const authToken = (await Preferences.get({ key: "token" })).value;
                await fetch(`${Environment.url}/profile/device-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ token: deviceToken.value })
                });
            } catch (err) {
                
                console.error('Failed to save device token:', err);
            }
        });

        // 3. Handle foreground notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
            const payload = {
                id: notification.id,
                title: notification.title,
                body: notification.body,
                data: notification.data,
                createdAt: new Date().toISOString()
            };
            dispatch(addNotification(payload));
        });

        // 4. Handle notification tap
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            const data = action.notification.data;
            if (data?.route) {
                window.location.href = data.route;
            }
        });

        return () => {
            PushNotifications.removeAllListeners();
        };
    }, []);
}