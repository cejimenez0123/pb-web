

import { useSelector } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";
import CalendarEmbed from "../components/CalendarEmbed";
import Paths from "../core/paths";

const WRAP = "max-w-3xl mx-auto px-5";
const PAGE_Y = "pt-12 pb-16";

export default function CalendarContainer() {
  const isClip = import.meta.env.MODE === "clip";
  const currentProfile = isClip
    ? null
    : useSelector((state) => state.users.currentProfile);

  const router = useIonRouter();

  return (
    <IonContent
      className="
        page-content
        bg-plumb-surface
        dark:bg-plumb-dark-canvas
      "
      fullscreen={true}
    >
      <div className={`${WRAP} ${PAGE_Y}`}>
        <p
          className="
            open-sans-medium
            text-xs
            tracking-widest
            uppercase
            mb-4
            text-plumb-muted
            dark:text-plumb-darkMuted
          "
        >
          Events
        </p>

        <h1
          className="
            lora-bold
            text-4xl
            sm:text-5xl
            leading-tight
            mb-6
            text-plumb-ink
            dark:text-plumb-darkText
          "
        >
          Rooms worth showing up for.
        </h1>

        <p
          className="
            lora-medium
            max-w-xl
            mb-8
            text-plumb-muted
            dark:text-plumb-darkMuted
          "
        >
          Plumbum readings and workshops, plus the neighbourhood things we
          think are worth your evening. Anyone can browse.
        </p>

        {!currentProfile && (
          <p
            className="
              open-sans-medium
              text-sm
              mb-10
              max-w-md
              text-plumb-muted
              dark:text-plumb-darkMuted
            "
          >
            Get weekly writing events in your inbox, or go deeper — apply to
            become a user and share your writing and feedback.{" "}
            <button
              type="button"
              onClick={() => router.push(Paths.onboard)}
              className="
                underline
                underline-offset-2
                text-plumb-ink
                dark:text-plumb-darkText
                rounded
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-plumb-focus
                focus-visible:ring-offset-2
                dark:focus-visible:ring-offset-plumb-dark-canvas
              "
            >
              Apply to be a user
            </button>
          </p>
        )}

        <CalendarEmbed />
      </div>
    </IonContent>
  );
}
