import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifcations } from "../../actions/ProfileActions";
import NotificationItem from "../../components/profile/NotificationItem";
import { IonList, IonContent, IonItem } from "@ionic/react";
import Paths from "../../core/paths";
import Context from "../../context";

export default function NotificationContainer({ currentProfile }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.users.notifications ?? []);
const {isDesktop}=useContext(Context)
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
         const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
       router.goBack()
    } else {
     router.push(Paths.myProfile, "root", "replace");
    }
  };
  return (
    <IonContent className="bg-cream p-4">
     
      <div className="mx-auto w-[96vw] md:w-page">

        {/* Today Section */}
        {todayItems.length > 0 && (
          <div className="mb-8">
            <h2 className="lora-bold text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
              Today
            </h2>
            <IonList className="space-y-2">
              {todayItems.map((item, i) => (
                <IonItem
                  key={i}
                  className="rounded-lg bg-white shadow-sm hover:bg-emerald-50 transition p-2"
                >
                  <NotificationItem item={item} />
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {/* Older Notifications */}
        {olderItems.length > 0 && (
          <div className="mb-8 pt-8">
            <h2 className="lora-bold text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1">
              Earlier
            </h2>
            <IonList className="space-y-2">
              {olderItems.map((item, i) => (
                <IonItem
                  key={i}
                  className="rounded-lg bg-white shadow-sm hover:bg-emerald-50 transition p-2"
                >
                  <NotificationItem item={item} />
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center text-emerald-700 mt-12">
            No notifications yet.
          </div>
        )}
      </div>
    </IonContent>
  );
}
