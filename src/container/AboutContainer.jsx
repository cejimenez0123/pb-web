import { useContext, useLayoutEffect } from "react";
import { IonContent, useIonRouter } from "@ionic/react";
import Paths from "../core/paths";
import Context from "../context";
import { initGA, sendGAEvent } from "../core/ga4";
import useScrollTracking from "../core/useScrollTracking";
import ScrollDown from "../components/ScrollDownButton";
// import FeatureBlock from "../components/about/FeatureBlock";
// import AboutCTA from "../components/about/AboutCTA";

export default function AboutContainer() {
  const { currentProfile } = useContext(Context);
  const router = useIonRouter();

  useScrollTracking({ name: "About" });
  useLayoutEffect(() => {
    initGA();
    sendGAEvent("Page View", "View About Page");
  }, []);

  return (
    <IonContent color="light" fullscreen className="ion-padding page-content">
      <div className="bg-[#f4f4e0] max-w-3xl mx-auto py-10 px-2">
        <p className="open-sans-medium text-xs tracking-widest uppercase text-[#6b6f63] mb-4">
          About
        </p>

        <h1 className="lora-bold text-4xl sm:text-5xl leading-tight text-[#12261f] mb-6">
          The physical experience gets someone into a room. Plumbum gives that
          relationship somewhere to continue.
        </h1>

        <p className="open-sans-medium text-[#6b6f63] max-w-xl mb-12">
          Plumbum is a small creative community for people who write. No
          follower counts, no algorithmic feed, no streaks. Just work, the
          people you trust with it, and the rooms you show up in.
        </p>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 mb-12">
          <FeatureBlock title="Collections, not feeds">
            A collection holds work and other collections. It can be a book, a
            library, a workshop table, or a place you keep things while you
            decide. It changes shape as you fill it — you never have to name
            it correctly on day one.
          </FeatureBlock>

          <FeatureBlock title="Writing has states">
            A piece can be a draft nobody sees, a fragment shared on purpose,
            a finished thing, or work open to a small room. The state is a
            decision you make when you're ready, not a publish button you're
            pushed toward.
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
          <ScrollDown text="↓ See what's on" visible={true} />
        )}
      </div>
    </IonContent>
  );
}
 function FeatureBlock({ title, children }) {
  return (
    <div className="border-t border-[#ddd8c4] pt-6">
      <h3 className="lora-bold text-lg text-[#12261f] mb-2">{title}</h3>
      <p className="open-sans-medium text-sm leading-relaxed text-[#6b6f63]">
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
    <div className="border border-[#ddd8c4] rounded-2xl p-8">
      <h3 className="lora-bold text-xl text-[#12261f] mb-2">
        Anyone can look before joining
      </h3>
      <p className="open-sans-medium text-sm text-[#6b6f63] mb-6 max-w-md">
        Events and public collections are readable without an account. You only
        need one when you want to keep something, write, or be in a room.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onPrimary}
          className="open-sans-medium text-sm rounded-full px-5 py-3 bg-[#12261f] text-[#f4f4e0] min-h-11"
        >
          {primaryLabel}
        </button>
        <button
          onClick={onSecondary}
          className="open-sans-medium text-sm rounded-full px-5 py-3 border border-[#ddd8c4] text-[#12261f] min-h-11"
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}