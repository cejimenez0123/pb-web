import { IonApp, IonPage } from '@ionic/react';
import Context from './context';
import Enviroment from './core/Enviroment';
import AboutContainer from './container/AboutContainer';
const AppClipApp = () => {
    const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})
  
  // ✅ Remove clipStr wrapper - basename already adds /clip
  return (
    <Context.Provider  value={{seo,setSeo}}>
    <IonApp>
      <IonPage>
        <div className='pt-24'>
        <AboutContainer/>
        </div>
      </IonPage>
    </IonApp>
      </Context.Provider>
  );
};

export default AppClipApp;
