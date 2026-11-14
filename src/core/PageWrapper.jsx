
import { IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import styles from "../styles/style";
import { Capacitor } from "@capacitor/core";

const PageWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === "undefined" || navigator.onLine
  );
  const isNative = Capacitor.isNativePlatform()
  useEffect(() => {
    const updateConnection = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);


  if(!isOnline){
    return(<IonPage> (
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
        ) </IonPage>)
  }

  return (
    <IonPage>
<div className={[styles.pageShell.base,isNative?"pb-40  pt-20":""].join(" ")}>
        {  children
   }
  </div>
    </IonPage>
  );
};

export default PageWrapper;
