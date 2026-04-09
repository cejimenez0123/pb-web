import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifcations } from "../../actions/ProfileActions";
import NotificationItem from "../../components/profile/NotificationItem";
import { IonList, IonContent } from "@ionic/react";
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