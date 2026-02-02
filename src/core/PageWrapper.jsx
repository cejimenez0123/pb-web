import { IonPage } from '@ionic/react';
import { useEffect, useRef, useContext } from 'react';
import Context from '../context';

const PageWrapper = ({ children }) => {
  const pageRef = useRef(null);
  const { setPresentingEl } = useContext(Context);

  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);
  }, []);

  return <IonPage ref={pageRef} style={{ height: '100%' }}>{children}</IonPage>;
};

export default PageWrapper;
 