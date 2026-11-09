import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifcations, markNotificationsRead } from "../../actions/ProfileActions";
import NotificationItem from "../../components/profile/NotificationItem";
import { IonList, IonContent } from "@ionic/react";
import SectionHeader from "../../components/pieces/SectionHeader";
import styles from "../../styles/style";


const SECTION = styles.pageShell.body

export default function NotificationContainer({ currentProfile }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => {
    const n = state.users.notifications;
    return Array.isArray(n) ? n : [];
  });

  useEffect(() => {
    if (currentProfile) {
      dispatch(fetchNotifcations({ profile: currentProfile, seen: true }));
      dispatch(markNotificationsRead());
    }
  }, [currentProfile]);

  const todayItems = items.filter(
    (item) => new Date(item.date).toDateString() === new Date().toDateString()
  );
  const olderItems = items.filter(
    (item) => new Date(item.date).toDateString() !== new Date().toDateString()
  );

  return (
    <IonContent  fullscreen={true}
    scrollY={true}>
      <main className={styles.pageShell.base+" "+styles.pageShell.scroll}>
        {/* Today */}
        {todayItems.length > 0 && (
          <section className={`${SECTION}  `}>
            <SectionHeader title="Today" />
            <div className="space-y-2 ">
              {todayItems.map((item, i) => (
                <div className=" " key={i}>
                  <NotificationItem
                    item={item}
                    lastNotified={currentProfile.lastNotified}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Earlier */}
        {olderItems.length > 0 && (
          <section className={`${SECTION}`}>
            <SectionHeader title="Earlier" />
        <div className="flex flex-col">
              {olderItems.map((item, i) => (
                <div className="py-2 " key={i}>
                  <NotificationItem
                    item={item}
                    lastNotified={currentProfile.lastNotified}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center   mt-12 text-lg">
            No notifications yet. Relax, nothing new today!
          </div>
        )}
  </main>
    </IonContent>
  );
}