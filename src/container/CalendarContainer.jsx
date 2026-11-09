

import { useSelector } from "react-redux";
import { IonContent, useIonRouter } from "@ionic/react";
import CalendarEmbed from "../components/CalendarEmbed";
import Paths from "../core/paths";
import styles from "../styles/style";
import ErrorBoundary from "../ErrorBoundary";

const WRAP = "max-w-3xl mx-auto px-5";
const PAGE_Y = "pt-12 pb-16";

export default function CalendarContainer() {

  const currentProfile = isClip
    ? null
    : useSelector((state) => state.users.currentProfile);

  const router = useIonRouter();

  return (
    <IonContent
   
      fullscreen={true}
    >
      <ErrorBoundary>
       <main className={[styles.pageShell.base].join(" ")}>
  
      <div className={styles.pageShell.head}>
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
            <br/>
            <button
              type="button"
              onClick={() => router.push(Paths.onboard)}
              className={styles.button.agree + "mx-auto mt-8"}
        
            >
              Apply to be a user
            </button>
          </p>
        )}
        </div>
<div className={styles.pageShell.body}>
        <CalendarEmbed />
        </div>
      {/* </div> */}
      </main>
      </ErrorBoundary>
    </IonContent>
  );
}
