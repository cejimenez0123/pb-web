import { IonApp, IonPage } from '@ionic/react';
import Context from './context';
import CalendarContainer from "./container/CalendarContainer"
import '@ionic/react/css/core.css';
import { useState } from 'react';
import userSlice from './reducers/UserReducer';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import Enviroment from './core/Enviroment';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

const reducer = combineReducers({
  users: userSlice.reducer,
})
const store = configureStore({reducer:reducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(

    { serializableCheck: false
    }
  )
 

})
const AppClipApp = () => {
    const [seo,setSeo]=useState({title:"Plumbum",heading:"Plumbum" ,image:Enviroment.logoChem,description:"Your writing, Your community", name:"Plumbum", type:"website",url:"https://plumbum.app"})
  
     return (
      <Provider store={store} >
    <Context.Provider  value={{seo,setSeo}}>
    <IonApp>
      <IonPage>
        <div className='pt-24'>
        <CalendarContainer/>
        </div>
      </IonPage>
    </IonApp>
      </Context.Provider>
      </Provider>
  );
};

export default AppClipApp;
