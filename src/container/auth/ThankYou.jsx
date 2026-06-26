import { IonText, useIonRouter } from '@ionic/react';
import Paths from '../../core/paths';
import { Capacitor } from '@capacitor/core';

export default function ThankYou({ user }) {
  const router = useIonRouter();

  const buttonClassNames =
    "bg-emerald-600 text-white rounded-full px-6 py-3 font-medium active:scale-[0.98] transition select-none";

  return (
    <div className="min-h-screen oveflow-y-scroll flex items-center justify-center bg-cream px-4 py-10">

      <div
        className="
          w-full max-w-2xl
          bg-white/70 backdrop-blur-sm
          rounded-3xl shadow-lg
          border border-emerald-100
          p-6 sm:p-8 md:p-10
          text-emerald-700
          
        "
      >

        {/* HEADER */}
        <p className="text-2xl sm:text-3xl font-semibold text-emerald-800 mb-4">
          Welcome, {user?.preferredName || "friend"} 🌿
        </p>

        {/* CORE MESSAGE */}
        <p className="text-base sm:text-lg leading-relaxed mb-5">
          You’re in.
         </p>

        <p className="text-base sm:text-lg leading-relaxed mb-5">
          We’re creating for creatives to thrive in community.
          <span className="font-medium text-emerald-800"> trust each other with it</span>.
          Where expression is handle with care, seen as clarity, and the needed honesty to be our full selves.
</p>
        {/* HEALING + TRUST CORE */}
  

        {/* COMMUNITY ROLE */}
        <p className="text-base sm:text-lg leading-relaxed mb-5">
          We’re building a space for creatives to thrive in community. A place where we can
          show up honestly, share when you can, and help shape what this becomes.
          Nothing here is finished — and that’s intentional.
        </p>

        {/* CONNECTION */}
        <p className="text-base sm:text-lg leading-relaxed mb-6">
          We’re listening closely through workshops, writing spaces, and conversations —
          especially through
          {' '}
          <a
            href="https://www.instagram.com/plumbumapp"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-emerald-700 hover:text-emerald-600"
          >
            @plumbumapp
          </a>
         
  
        </p>

        {/* CLOSING */}
        <p className="text-base sm:text-lg font-medium mb-8 text-emerald-800">
          We’re not rushing this, we're building that can last.
        </p>

        {/* SIGNATURE */}
        <div className="border-t border-emerald-200 pt-4 mb-6 text-right">
          <p className="font-semibold text-emerald-800">
            — Sol Emilio Christian
          </p>
          <p className="text-sm text-emerald-600">
            Founder, Plumbum
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">

  
          <IonText
            onClick={() => router.push(Paths.discovery)}
            className={buttonClassNames}
            style={{ textAlign: "center" }}
          >
            Explore Writing
          </IonText>

        </div>

      </div>
    </div>
  );
}