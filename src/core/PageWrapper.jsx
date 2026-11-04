import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";

const PageWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine
  );

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  return (
    <IonPage>
 
        {!isOnline ? (
          <div className="flex min-h-full flex-col items-center justify-center p-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full">
              <span role="img" aria-label="No internet connection" className="text-2xl">
                📡
              </span>
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              No Internet Connection
            </h2>

            <p className="max-w-sm text-sm leading-relaxed">
              You’re offline. Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full px-6 py-3 text-sm font-medium transition active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : (
          children
        )}
  
    </IonPage>
  );
};

export default PageWrapper