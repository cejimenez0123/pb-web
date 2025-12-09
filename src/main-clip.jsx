import ReactDOM from 'react-dom/client';
import './index.css';  // Minimal CSS only
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppClipApp from './AppClipApp.jsx';  // Only AppClipApp!
import '@ionic/react/css/core.css'
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';



const isClip = import.meta.env.MODE === "clip";
const basename = isClip ? "/clip" : "/";

const app = (
 
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<AppClipApp />} />
        <Route path="/clip/*" element={<AppClipApp />} />
      </Routes>
    </Router>

);

ReactDOM.createRoot(document.getElementById('root')).render(app);
