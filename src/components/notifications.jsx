import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
  } from '@capacitor/push-notifications';


  export default function Notifications({notify}){
    useEffect(() => {
        // Request permission on mount
        PushNotifications.requestPermissions().then(result => {
          if (result.receive === 'granted') {
            PushNotifications.register();
          } else {
            // Permission not granted
            alert('Push notification permission denied');
          }
        });
    
        // On device token registration
        PushNotifications.addListener('registration', (token) => {
          alert('Push registration success, token: ' + token.value);
          // Send this token to your backend to send notifications later
        });
    
        // On registration error
        PushNotifications.addListener('registrationError', (error) => {
          alert('Registration error: ' + JSON.stringify(error));
        });
    
        // When a push notification is received (foreground)
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          alert('Push received: ' + JSON.stringify(notification));
        });
    
        // When user taps a notification
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          alert('Push action performed: ' + JSON.stringify(notification));
        });
      }, []);
  }