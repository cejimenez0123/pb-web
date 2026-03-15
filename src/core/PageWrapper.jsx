import { IonPage } from '@ionic/react';
import { useEffect, useRef, useContext } from 'react';
import Context from '../context';
import { useMediaQuery } from 'react-responsive';
import { Capacitor } from '@capacitor/core';

const PageWrapper = ({ children }) => {
  const pageRef = useRef(null);
  const { setPresentingEl } = useContext(Context);
  const isNative = Capacitor.isNativePlatform()
const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })
const isMobileOrTablet = useMediaQuery({ query: '(max-width: 768px)' })


  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);
  }, []);

  return <IonPage ref={pageRef} style={{ height: '100%',paddingTop:isDesktop?"5em":"0"}}>{children}</IonPage>;
};

export default PageWrapper;
 