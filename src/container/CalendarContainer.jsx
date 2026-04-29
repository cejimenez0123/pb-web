import { useEffect } from "react";
import { initGA } from "../core/ga4";
import Enviroment from "../core/Enviroment";
import Context from "../context";
import { useContext } from "react";
import Paths from "../core/paths";
import { useLayoutEffect } from "react";
import { IonContent, IonText, useIonRouter } from "@ionic/react";
import "../App.css";
import CalendarEmbed from "../components/CalendarEmbed";
import { Capacitor } from "@capacitor/core";
import { useSelector } from "react-redux";
import SectionHeader from "../components/SectionHeader";

const WRAP = "max-w-[42rem] mx-auto px-4";
const PAGE_Y = "pt-16 pb-10";
const STACK_LG = "space-y-8";
const STACK_SM = "space-y-2";

const SectionLabel = ({ children }) => (
  <p className="text-xs text-soft opacity-50 uppercase tracking-wide">{children}</p>
);

export default function CalendarContainer() {
  const { seo, setSeo } = useContext(Context);
  const isClip = import.meta.env.MODE == "clip";
  const currentProfile = isClip ? null : useSelector(state => state.users.currentProfile);
  const router = useIonRouter();
  const isNative = Capacitor.isNativePlatform();

  useLayoutEffect(() => {
    setSeo({
      title: "Plumbum — Events & Writing Calendar",
      description: "Browse writing events, workshops, and meetups on the Plumbum calendar.",
      name: "Plumbum",
      type: "website",
    });
  }, []);

  useEffect(() => {
    initGA();
  }, []);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (

<IonContent
  style={{ "--background": prefersDark ? Enviroment.palette.base.backgroundDark ?? Enviroment.palette.base.bg : Enviroment.palette.base.background }}
  fullscreen={true}
>
   
    
      <div className={`${WRAP} ${PAGE_Y} ${STACK_LG} text-center`}>
        <div className={STACK_SM}>
          <SectionHeader title={"Plumbum Calendar"}/>

          {!currentProfile && (
            <div className={STACK_SM}>
              <p className="text-sm text-soft dark:text-cream opacity-70 max-w-md mx-auto">
                Get weekly writing events in your inbox, or go deeper:
                apply to become a user and share your writing and feedback.
              </p>
              <div className="flex flex-col items-center gap-2">
                <IonText
                  onClick={() => router.push("/onboard")}
                  className="text-lg text-soft dark:text-cream cursor-pointer hover:opacity-70 transition-opacity"
                >
                  Apply to be a user
                </IonText>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-fit pb-36 mx-auto">
        <CalendarEmbed variant={isNative ? "ios" : ""} />
      </div>
    </IonContent>
  );
}
