
import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonToolbar,
  IonHeader,
  useIonRouter,
  IonTitle,
  IonImg,
  IonText,
  IonButton,
  IonContent,
} from '@ionic/react';
import { useEffect, useRef, useContext, useState } from 'react';
import Context from '../context';
import { useMediaQuery } from 'react-responsive';
import Paths from './paths';
import SearchButton from '../components/SearchButton';
import menu from "../images/icons/menu.svg";
import { Capacitor } from '@capacitor/core';

const PageWrapper = ({
  children,
  showHeader = true,
  showBackbutton = true,
  showSearchButton = true,
  showMenubutton = true,
  title = ''
}) => {
  const pageRef = useRef(null);
  const router = useIonRouter();
  const { setPresentingEl } = useContext(Context);

  const isDesktop = useMediaQuery({ query: '(min-width: 60.1em)' });
  const isMobileOrTablet = useMediaQuery({ query: '(max-width: 60em)' });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.goBack();
    } else {
      router.push(Paths.discovery);
    }
  };

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      // Optional: force reload content or trigger a data fetch
      window.location.reload();
    }
  };

  if (!isOnline) {
    // Offline UI
    return (
      <IonPage >
       <IonContent >
        <div className='h-[100%] w-[100%] flex'> 
        <div className="my-auto mx-auto text-center">
          <IonText color="medium">
            <h2>No Internet Connection</h2>
            <p>Please check your connection and try again.</p>
          </IonText>
          <IonButton onClick={handleRetry} style={{ marginTop: '1em' }}>
            Retry
          </IonButton>
          </div>
        </div>
        {/* </div> */}
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage ref={pageRef} style={{ height: '100%', paddingTop: isDesktop ? '5em' : '0' }}>
      {showHeader && Capacitor.isNativePlatform() ? (
        <IonHeader translucent>
          <IonToolbar>
            {showBackbutton ? (
              <IonButtons slot="start">
                <IonBackButton defaultHref={Paths.discovery} onClick={handleBack} />
              </IonButtons>
            ) : (
              <IonButtons slot="start">
                <IonText>Pb</IonText>
              </IonButtons>
            )}
            {showSearchButton && <SearchButton onClick={() => router.push("/search")} />}
            {showMenubutton && (
              <IonButtons slot="end">
                <IonImg
                  src={menu}
                  style={{
                    width: "2.5em",
                    height: "2.5em",
                    filter: "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)"
                  }}
                />
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
      ) : (
        <div className='bg-cream'>
          <IonHeader translucent>
            <IonToolbar>
              <IonButtons slot="start">
                <IonText>
                  <h3 className='text-[1rem]'>Pb</h3>
                </IonText>
              </IonButtons>
              {showSearchButton && <SearchButton onClick={() => router.push("/search")} />}
            </IonToolbar>
          </IonHeader>
        </div>
      )}
      {children}
    </IonPage>
  );
};

export default PageWrapper;