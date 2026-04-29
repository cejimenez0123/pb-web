// import { IonText, useIonRouter } from '@ionic/react';
// import Paths from '../../core/paths';
// import { Capacitor } from '@capacitor/core';

// export default function ThankYou({ user }) {
//   const router = useIonRouter()

//   const buttonClassNames = "bg-emerald-600 rounded-full px-6 py-2 cursor-pointer select-none";

//   return (
//     <div
//       id="welcome"
//       className="p-8 text-left leading-[1.5em] text-emerald-600 overflow-scroll max-w-xl mx-auto"
//     >
//       <div
//   id="welcome"
//   className="p-8 text-left leading-relaxed text-emerald-700 max-w-xl mx-auto rounded-2xl shadow-md bg-base-bg/70 backdrop-blur-sm"
// >
//   <p className="text-2xl font-semibold mb-4">
//     Welcome aboard, {user.preferredName}! 🌿
//   </p>

//   <p className="text-lg mb-6">
//     You’re officially part of the <span className="font-medium text-emerald-800">Plumbum beta</span> — a growing community of writers who believe in creating with honesty, sharing with courage, and growing together.
//   </p>

//   <p className="text-lg mb-6">
//     Plumbum isn’t just an app — it’s a shared space for discovery. Here, you’ll help us shape what writing can feel like when connection, curiosity, and care come first.
//   </p>

  




 
//   <p className="text-lg font-medium mb-8">
//     Let’s take our time, build something lasting, and make our story — together.
//   </p>

//   <div className="text-right mt-8 border-t border-emerald-200 pt-4">
//     <p className="font-semibold text-emerald-800">— Sol Emilio Christian</p>
//     <p className="text-sm text-emerald-600">Founder, Plumbum</p>
//   </div>
// </div>
//       <div className="flex flex-row justify-between mt-6 gap-4">
//         {!Capacitor.isNativePlatform()? <IonText
//           onClick={() => router.push(Paths.about())}
//           className={buttonClassNames}
//           style={{ width: '8em', margin:"auto",textAlign:"center", color: 'white', userSelect: 'none' }}
//         >
//           Go to About
//         </IonText>:null}
//         <IonText
//           onClick={() => router.push(Paths.discovery)}
//           className={buttonClassNames}
//           style={{ width: '8em', textAlign: 'center', color: 'white', userSelect: 'none' }}
//         >
//           Go to Discover
//         </IonText>
//       </div>
//     </div>
//   );
// }

import { IonText, useIonRouter } from '@ionic/react';
import Paths from '../../core/paths';
import { Capacitor } from '@capacitor/core';

export default function ThankYou({ user }) {
  const router = useIonRouter();

  const buttonClass = "bg-emerald-600 hover:bg-emerald-700 rounded-full px-6 py-2 cursor-pointer select-none text-white text-center transition";

  return (
    <div className="p-6 max-w-xl mx-auto">

      <div className="p-8 text-left leading-relaxed rounded-2xl shadow-md
        bg-white/80 dark:bg-white/5
        border border-emerald-100 dark:border-emerald-800
        backdrop-blur-sm">

        <p className="text-2xl font-semibold mb-4 text-emerald-700 dark:text-cream">
          Welcome aboard, {user.preferredName}! 🌿
        </p>

        <p className="text-lg mb-6 text-emerald-900 dark:text-cream">
          You're officially part of the{' '}
          <span className="font-medium text-emerald-700 dark:text-cream">Plumbum beta</span>
          {' '}— a growing community of writers who believe in creating with honesty, sharing with courage, and growing together.
        </p>

        <p className="text-lg mb-6 text-emerald-900 dark:text-cream">
          Plumbum isn't just an app — it's a shared space for discovery. Here, you'll help us shape what writing can feel like when connection, curiosity, and care come first.
        </p>

        <p className="text-lg font-medium mb-8 text-emerald-900 dark:text-cream">
          Let's take our time, build something lasting, and make our story — together.
        </p>

        <div className="text-right mt-8 border-t border-emerald-200 dark:border-emerald-800 pt-4">
          <p className="font-semibold text-emerald-800 dark:text-cream">— Sol Emilio Christian</p>
          <p className="text-sm text-emerald-600 dark:text-cream">Founder, Plumbum</p>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 gap-4">
        {!Capacitor.isNativePlatform() && (
          <IonText
            onClick={() => router.push(Paths.about())}
            className={buttonClass}
            style={{ flex: 1, display: 'block' }}
          >
            Go to About
          </IonText>
        )}
        <IonText
          onClick={() => router.push(Paths.discovery)}
          className={buttonClass}
          style={{ flex: 1, display: 'block' }}
        >
          Go to Discover
        </IonText>
      </div>

    </div>
  );
}