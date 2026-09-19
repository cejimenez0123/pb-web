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
