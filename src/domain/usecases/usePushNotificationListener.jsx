import { PushNotifications } from '@capacitor/push-notifications'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../actions/ProfileActions'


export function usePushNotificationListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        const payload = {
          id: notification.id,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          createdAt: new Date().toISOString()
        }

        dispatch(addNotification(payload))
      }
    )

    return () => {
      PushNotifications.removeAllListeners()
    }
  }, [])
}
