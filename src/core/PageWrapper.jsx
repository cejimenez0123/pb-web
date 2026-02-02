import { IonPage } from '@ionic/react';
import { useEffect, useRef, useContext } from 'react';
import Context from './context';

const PageWrapper = ({ children }) => {
  const pageRef = useRef(null);
  const { setPresentingEl } = useContext(Context);

  useEffect(() => {
    // When this page mounts, it becomes the presentingEl
    if (pageRef.current) {
      setPresentingEl(pageRef.current);
    }
  }, [setPresentingEl]);

  return <IonPage ref={pageRef}>{children}</IonPage>;
};

export default PageWrapper;
 