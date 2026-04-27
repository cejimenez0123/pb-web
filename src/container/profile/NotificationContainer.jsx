
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifcations } from "../../actions/ProfileActions";
import NotificationItem from "../../components/profile/NotificationItem";
import { IonList, IonContent } from "@ionic/react";
import SectionHeader from "../../components/SectionHeader";
import getBackground from "../../core/getbackground";

const WRAP = "max-w-2xl mx-auto ";
const SECTION = "space-y-4 pt-10 ";

export default function NotificationContainer({ currentProfile }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.users.notifications ?? []);

  useEffect(() => {
    if (currentProfile) {
      dispatch(fetchNotifcations({ profile: currentProfile, seen: true }));
    }
  }, [currentProfile]);

  const todayItems = items.filter(
    (item) => new Date(item.date).toDateString() === new Date().toDateString()
  );
  const olderItems = items.filter(
    (item) => new Date(item.date).toDateString() !== new Date().toDateString()
  );

  return (
    <IonContent style={{ ...getBackground(),width:"100%"}}>
   
<div className=" px-4 bg-cream dark:bg-base-bgDark">
        {/* Today */}
        {todayItems.length > 0 && (
          <section className={`${SECTION} bg-cream dark:bg-base-bgDark`}>
            <SectionHeader title="Today" />
            <div className="space-y-2 bg-cream dark:bg-base-bgDark">
              {todayItems.map((item, i) => (
                <div className="py-2  bg-cream dark:bg-base-bgDark" key={i}>
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
          <section className={`${SECTION} bg-cream dark:bg-base-bgDark`}>
            <SectionHeader title="Earlier" />
            <IonList style={{...getBackground()}}>
              {olderItems.map((item, i) => (
                <div className="py-2 bg-cream dark:bg-base-bgDark " key={i}>
                  <NotificationItem
                    item={item}
                    lastNotified={currentProfile.lastNotified}
                  />
                </div>
              ))}
            </IonList>
          </section>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center bg-cream dark:bg-base-bgDark dark:text-cream text-text-secondary mt-12 text-lg">
            No notifications yet. Relax, nothing new today!
          </div>
        )}
</div>
      {/* </div> */}
    </IonContent>
  );
}