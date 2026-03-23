import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonToolbar,
  IonHeader,
  useIonRouter,
  IonTitle,
  IonImg,
  IonText
} from '@ionic/react';
import { useEffect, useRef, useContext } from 'react';
import Context from '../context';
import { useMediaQuery } from 'react-responsive';
import Paths from './paths';
import SearchButton from '../components/SearchButton'; // import memoized component
import menu from "../images/icons/menu.svg"
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
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  useEffect(() => {
    if (pageRef.current) setPresentingEl(pageRef.current);
  }, []);

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.goBack();
    } else {
      router.push(Paths.discovery);
    }
  };

  return (
    <IonPage
      ref={pageRef}
      style={{ height: '100%', paddingTop: isDesktop ? '5em' : '0' }}
    >
      {showHeader && (
        <IonHeader translucent>
          <IonToolbar>
            {showBackbutton ? (
              <IonButtons slot="start">
                <IonBackButton defaultHref={Paths.discovery} onClick={handleBack} />
              </IonButtons>):(<IonButtons slot="start">
                <IonText>Pb</IonText>
              </IonButtons>)}
              {showSearchButton && (<SearchButton onClick={() => router.push("/search")} />)}
    
         
         
                    {showMenubutton && (
    <IonButtons slot="end">
      <IonImg src={menu}  
      style={{
        width: "2.5em",
        height: "2.5em",
        filter:
          "invert(33%) sepia(86%) saturate(749%) hue-rotate(111deg) brightness(92%) contrast(91%)"
      }}/>
 
    </IonButtons>
  )}
          </IonToolbar>
        </IonHeader>
      )}
      {children}
    </IonPage>
  );
};

export default PageWrapper;
// // import { IonPage, IonTitle, useIonRouter } from '@ionic/react';
// // import { useEffect, useRef, useContext } from 'react';
// // import Context from '../context';
// // import { useMediaQuery } from 'react-responsive';
// // import { Capacitor } from '@capacitor/core';
// // import Paths from './paths';

// // const PageWrapper = ({ children }) => {
// //   const pageRef = useRef(null);
// //   const router = useIonRouter()
// //   const { setPresentingEl } = useContext(Context);
// //   const isNative = Capacitor.isNativePlatform()
// // const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })
// // const isMobileOrTablet = useMediaQuery({ query: '(max-width: 768px)' })
// //           const handleBack = (e) => {
// //     e.preventDefault();
// //     if (window.history.length > 1) {
// //           router.goBack()
// //     } else {
// //       router.push(Paths.discovery);
// //     }
// //   };

// //   useEffect(() => {
// //     if (pageRef.current) setPresentingEl(pageRef.current);
// //   }, []);

// //   return <IonPage ref={pageRef} style={{ height: '100%',paddingTop:isDesktop?"5em":"0"}}>
    
// //      {children}</IonPage>;
// // };

// // export default PageWrapper;
// import { IonBackButton, IonButtons, IonPage, IonTitle, IonToolbar, IonHeader, useIonRouter, IonImg } from '@ionic/react';
// import { useEffect, useRef, useContext, memo } from 'react';
// import Context from '../context';
// import { useMediaQuery } from 'react-responsive';
// import { Capacitor } from '@capacitor/core';
// import search from "../images/icons/search.svg"
// import Paths from './paths';
// import SearchButton from '../components/SearchButton';
// const PageWrapper = ({ children, showHeader = true, showBackbutton=true, showSearchButton=true,title = '' }) => {
//   const pageRef = useRef(null);
//   const router = useIonRouter();
//   const { setPresentingEl } = useContext(Context);
//   const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });


//   useEffect(() => {
//     if (pageRef.current) setPresentingEl(pageRef.current);
//   }, []);

//   const handleBack = (e) => {
//     e.preventDefault();
//     if (window.history.length > 1) {
//       router.goBack();
//     } else {
//       router.push(Paths.discovery);
//     }
//   };

//   return (
//     <IonPage ref={pageRef} style={{ height: '100%', paddingTop: isDesktop ? '5em' : '0' }}>
//       {showHeader && (
//         <IonHeader translucent>
//           <IonToolbar>
//             {showBackbutton?<IonButtons slot="start">
//               <IonBackButton defaultHref={Paths.discovery} onClick={handleBack} />
//             </IonButtons>:null}
//              {showSearchButton?<IonButtons slot="center">
//               <SearchButton onClick={() => router.push("/search")} />
//             </IonButtons>:null}
//                   </IonToolbar>
//         </IonHeader>
//       )}
//       {children}
//     </IonPage>
//   );
// };

// export default PageWrapper;