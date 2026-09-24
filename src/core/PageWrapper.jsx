import { IonPage } from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';

import Context from '../context';
import NavbarContainer from '../container/NavbarContainer';


const PageWrapper = ({
  children,

  // Kept for backwards compatibility with existing pages.
  // The new navbar controls the application chrome.
  showHeader = true,
  presentHeader = true,

  // These are no longer used by the new navigation,
  // but keeping them prevents existing page calls from breaking.
  showBackbutton = true,
  showSearchButton = true,
  showMenubutton = true,

  title = '',
}) => {

  const pageRef = useRef(null);
  const { setPresentingEl } = useContext(Context);

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined'
      ? navigator.onLine
      : true
  );

  const isNative = Capacitor.isNativePlatform();


  /* =========================================================
     ONLINE / OFFLINE
  ========================================================= */

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  /* =========================================================
     PRESENTING ELEMENT
  ========================================================= */

  useEffect(() => {
    if (pageRef.current && setPresentingEl) {
      setPresentingEl(pageRef.current);
    }
  }, [setPresentingEl]);


  /* =========================================================
     RELOAD
  ========================================================= */

  const handleReload = () => {
    window.location.reload();
  };


  /* =========================================================
     OFFLINE STATE
  ========================================================= */

  if (!isOnline) {
    return (
      <IonPage
        ref={pageRef}
        className="bg-paper"
      >
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-center px-6">

          <div className="w-16 h-16 rounded-full bg-card-background flex items-center justify-center mb-5">
            <span
              className="text-2xl"
              role="img"
              aria-label="No internet connection"
            >
              📡
            </span>
          </div>

          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No Internet Connection
          </h2>

          <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
            You’re offline. Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={handleReload}
            className="
              mt-6
              px-6
              py-3
              rounded-full
              bg-text-primary
              text-text-inverse
              text-sm
              font-medium
              active:scale-95
              transition
              shadow-sm
            "
          >
            Try Again
          </button>

        </div>
      </IonPage>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <IonPage
      ref={pageRef}
      className="bg-paper"
    >

      {/* =====================================================
          APPLICATION CHROME
      ===================================================== */}

      {presentHeader && showHeader && (
        <NavbarContainer />
      )}




      <main
        className="
          relative
          flex-1
          min-h-0
          w-full
          bg-paper
        "
      >
        {children}
      </main>

    </IonPage>
  );
};


export default PageWrapper;