import { useContext, useLayoutEffect } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import Paths from "../core/paths";
import Context from "../context";
import useScrollTracking from "../core/useScrollTracking";
import ScrollDownButton from "../components/ScrollDownButton";
import styles from "../styles/style";


export default function AboutContainer() {
  const { currentProfile } = useContext(Context);
  const router = useIonRouter();

  useScrollTracking({ name: "About" });

  return (
    <IonContent

>
  <main className={styles.about.page +" "}>
    <div className={styles.about.inner+""}>
      <p className={styles.about.eyebrow}>
        About
      </p>

      <h1 className={styles.about.welcome}>
        Find a room. Meet people. Keep the connection going.
      </h1>
<p className="open-sans-medium text-[#6b6f63] max-w-xl mb-12">
  You might find Plumbum at a reading, a workshop, a mixer, or through
  someone you know. Come as you are. The <a 
  
  href={Paths.calendar()}>event calendar</a> is free to browse,
  and you don't need an account to see what's happening.
</p>
{/* BOOGIE*/}
   <section className={styles.about.start}>
        <div className={styles.about.section}>
          <p className={styles.about.sectionLabel}>
            Start here
          </p>

          <h2 className={styles.about.sectionTitle}>
            See what's happening.
          </h2>

          <p className={styles.about.sectionBody}>
            Browse readings, workshops, mixers, and other creative events.
            The calendar is free to browse, so you can look around before you
            decide to join.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push(Paths.calendar())}
              className={[
                styles.button.base,
                styles.button.primary,
                "min-h-11 px-5 py-3 text-sm",
              ].join(" ")}
            >
              See what's on
            </button>
          </div>
        </div>
      </section>

{/* BOOGIE*/}
        <div className="grid sm:grid-cols-2 pb-12 gap-x-10 gap-y-8 ">
          <FeatureBlock title="Collections, not feeds">
            A collection holds work and other collections. It can be a book, a
            library, a workshop table, or a place you keep things while you
            decide. It changes shape as you fill it — you never have to name
            it correctly on day one.
          </FeatureBlock>

          <FeatureBlock title="Writing has states">
            A piece can be a draft nobody sees. A fragment is a draft shared on purpose,
            a finished thing, or work open to a small room. The state is a
            decision you make when you're ready to share, no pressure for public or private.
            You choose.
          </FeatureBlock>

          <FeatureBlock title="Roles, not followers">
            People are invited into a collection as editors, writers,
            commenters, or readers. There are no counts to grow. Access is
            something someone gave you, which is why feedback here is usually
            worth reading.
          </FeatureBlock>

          <FeatureBlock title="Rooms that continue">
            Plumbum readings and neighbourhood events both live here. What
            matters is the week after: the piece you finally finished, the
            person you kept talking to, the collection that came out of it.
          </FeatureBlock>
        </div>

        <AboutCTA
          primaryLabel="See what's on"
          secondaryLabel="Make an account"
          onPrimary={() => router.push(Paths.calendar())}
          onSecondary={() => router.push(Paths.onboard)}
        />

        {!currentProfile && (
          <ScrollDownButton text="↓ See what's on" visible={true} />
        )}
      </div>
     
      </main>
    </IonContent>
  );
}
function FeatureBlock({ title, children }) {
  return (
    <div className={styles.about.section

    }>
      <h3 className={styles.about.featureTitle}>
        {title}
      </h3>

      <p className={styles.about.featureBody}>
        {children}
      </p>
    </div>
  );
}

function AboutCTA({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  return (
    <div className={styles.about.cta}>
      <h3 className={styles.about.ctaTitle}>
        Anyone can look before joining
      </h3>

      <p className={styles.about.ctaBody}>
        Events and public collections are readable without an account. You only
        need one when you want to keep something, write, or be in a room.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPrimary}
          className={[
            styles.button.base,
            styles.button.primary,
            "min-h-11 px-5 py-3 text-sm",
          ].join(" ")}
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          onClick={onSecondary}
          className={[
            styles.button.base,
            styles.button.cancel,
            "min-h-11 px-5 py-3 text-sm",
          ].join(" ")}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

