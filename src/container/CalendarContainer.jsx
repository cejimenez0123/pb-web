import { useEffect } from "react";
import { initGA } from "../core/ga4";
import { IonContent, useIonRouter } from "@ionic/react";
import CalendarEmbed from "../components/CalendarEmbed";
import { useSelector } from "react-redux";

const INK = "#12261f";
const MUTED = "#6b6f63";
const PAGE_BG = "#f4f4e0";
const WRAP = "max-w-3xl mx-auto px-5";
const PAGE_Y = "pt-12 pb-16";

export default function CalendarContainer() {
  const isClip = import.meta.env.MODE === "clip";
  const currentProfile = isClip ? null : useSelector((state) => state.users.currentProfile);
  const router = useIonRouter();

  useEffect(() => {
    initGA();
  }, []);

  return (
    <IonContent className="page-content" fullscreen={true}>
      <div style={{ backgroundColor: PAGE_BG }} className={`${WRAP} ${PAGE_Y}`}>
        <p
          className="open-sans-medium text-xs tracking-widest uppercase mb-4"
          style={{ color: MUTED }}
        >
          Events
        </p>

        <h1
          className="lora-bold text-4xl sm:text-5xl leading-tight mb-6"
          style={{ color: INK }}
        >
          Rooms worth showing up for.
        </h1>

        <p className="lora-medium max-w-xl mb-8" style={{ color: MUTED }}>
          Plumbum readings and workshops, plus the neighbourhood things we
          think are worth your evening. Anyone can browse.
        </p>

        {!currentProfile && (
          <p className="open-sans-medium text-sm mb-10 max-w-md" style={{ color: MUTED }}>
            Get weekly writing events in your inbox, or go deeper — apply to
            become a user and share your writing and feedback.{" "}
            <span
              onClick={() => router.push("/onboard")}
              className="underline cursor-pointer"
              style={{ color: INK }}
            >
              Apply to be a user
            </span>
          </p>
        )}

        <CalendarEmbed />
      </div>
    </IonContent>
  );
}

// import { useEffect } from "react";
// import { initGA } from "../core/ga4";

// import { IonContent, IonText, useIonRouter } from "@ionic/react";
// import "../App.css";
// import CalendarEmbed from "../components/CalendarEmbed";
// import { Capacitor } from "@capacitor/core";
// import { useSelector } from "react-redux";
// import SectionHeader from "../components/SectionHeader";

// const WRAP = "max-w-[42rem] mx-auto px-4";
// const PAGE_Y = "pt-16 pb-10";
// const STACK_LG = "space-y-8";
// const STACK_SM = "space-y-2";

// const SectionLabel = ({ children }) => (
//   <p className="text-xs text-soft opacity-50 uppercase tracking-wide">{children}</p>
// );

// export default function CalendarContainer() {
//   // const { seo, setSeo } = useContext(Context);
//   const isClip = import.meta.env.MODE == "clip";
//   const currentProfile = isClip ? null : useSelector(state => state.users.currentProfile);
//   const router = useIonRouter();
//   const isNative = Capacitor.isNativePlatform();

  

//   useEffect(() => {
//     initGA();
//   }, []);
  

//   return (

// <IonContent
//   className="page-content"
//   fullscreen={true}
// >
   
    
//       <div className={`${WRAP} ${PAGE_Y} ${STACK_LG} text-center`}>
//         <div className={STACK_SM}>
//           <SectionHeader title={"Plumbum Calendar"}/>

//           {!currentProfile && (
//             <div className={STACK_SM}>
//               <p className="text-sm text-soft dark:text-cream opacity-70 max-w-md mx-auto">
//                 Get weekly writing events in your inbox, or go deeper:
//                 apply to become a user and share your writing and feedback.
//               </p>
//               <div className="flex flex-col items-center gap-2">
//                 <IonText
//                   onClick={() => router.push("/onboard")}
//                   className="text-lg text-soft dark:text-cream cursor-pointer hover:opacity-70 transition-opacity"
//                 >
//                   Apply to be a user
//                 </IonText>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-fit pb-36 mx-auto">
//         <CalendarEmbed variant={isNative ? "ios" : ""} />
//       </div>
//     </IonContent>
//   );
// }
