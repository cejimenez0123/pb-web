import { IonPage } from '@ionic/react';
import { useEffect, useRef, useContext } from 'react';
import Context from '../context';

const PageWrapper = ({ children }) => {
  const pageRef = useRef(null);
  const { setPresentingEl } = useContext(Context); // use your Context or pass setter

  useEffect(() => {
    if (pageRef.current) {
      setPresentingEl(pageRef.current);
    }
  }, [pageRef, setPresentingEl]);

  return <IonPage ref={pageRef}>{children}</IonPage>;
};

export default PageWrapper;
