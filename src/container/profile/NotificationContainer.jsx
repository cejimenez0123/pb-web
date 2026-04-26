// import {  useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchNotifcations } from "../../actions/ProfileActions";
// import NotificationItem from "../../components/profile/NotificationItem";
// import { IonList, IonContent } from "@ionic/react";
// import SectionHeader from "../../components/SectionHeader";
// import Enviroment from "../../core/Enviroment";
// const WRAP = "max-w-2xl mx-auto px-4";
// const SECTION = "space-y-4 pt-10 bg-base-surface";
// const SECTION_TITLE = "text-xl font-semibold text-emerald-800 border-b border-emerald-600 pb-1";
// export default function NotificationContainer({ currentProfile }) {
//   const dispatch = useDispatch();
//   const items = useSelector((state) => state.users.notifications ?? []);
//   // const { isDesktop } = useContext(Context);

//   useEffect(() => {
//     if (currentProfile) {
//       dispatch(fetchNotifcations({ profile: currentProfile, seen:true}));
//     }
//   }, [currentProfile]);

//   const todayItems = items.filter(
//     (item) => new Date(item.date).toDateString() === new Date().toDateString()
//   );
//   const olderItems = items.filter(
//     (item) => new Date(item.date).toDateString() !== new Date().toDateString()
//   );

//   return (
//     <IonContent 
//     style={{"--background":Enviroment.palette.base.background}}
//     >
    
// <div  className={WRAP}>
//         {/* Today Section */}
//         {todayItems.length > 0 && (
//           <section className={SECTION}>
//             {/* <h2 className=" text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1"> */}
//               <SectionHeader title={"Today"}/>
//             {/* </h2> */}
//             <div className="space-y-2" style={{"--background":Enviroment.palette.base.surface}}>
//               {todayItems.map((item, i) => (
//                 <div className="py-2">
//                 <NotificationItem
//                   key={i}
//                   item={item}
//                   lastNotified={currentProfile.lastNotified}
//                 />
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Older Notifications */}
//         {olderItems.length > 0 && (
//           <section className={SECTION+" bg-cream"}>
//             {/* <h2 className=" text-2xl text-emerald-800 mb-4 border-b-2 border-emerald-600 pb-1"> */}
//               <SectionHeader title={"Earlier"} />
//             {/* </h2> */}
//             <IonList >
//                  {/* <div className="flex flex-col gap-2 w-[100%]"> */}
//               {olderItems.map((item, i) => (
//                   <div className="py-2 bg-base-surface">
//                 <NotificationItem
//                   key={i}
//                   item={item}
//                   lastNotified={currentProfile.lastNotified}
//                 />
// </div>
//               ))}
//               {/* </div> */}
//             </IonList>
//           </section>
//         )}

//         {/* Empty state */}
//         {items.length === 0 && (
//           <div className="text-center text-emerald-700 mt-12 text-lg">
//             No notifications yet. Relax, nothing new today!
//           </div>
//         )}
//       </div>
//     </IonContent>
//   );
// }
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
      {/* <div className={WRAP}> */}
<div className=" px-4 bg-cream dark:bg-base-bgDark">
        {/* Today */}
        {todayItems.length > 0 && (
          <section className={`${SECTION} bg-base-surface`}>
            <SectionHeader title="Today" />
            <div className="space-y-2">
              {todayItems.map((item, i) => (
                <div className="py-2 bg-base-surface" key={i}>
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
            <IonList style={{ background: "transparent" }}>
              {olderItems.map((item, i) => (
                <div className="py-2 bg-base-surface" key={i}>
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
          <div className="text-center text-text-secondary mt-12 text-lg">
            No notifications yet. Relax, nothing new today!
          </div>
        )}
</div>
      {/* </div> */}
    </IonContent>
  );
}