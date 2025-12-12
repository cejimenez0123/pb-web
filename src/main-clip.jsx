
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppClipApp from './AppClipApp.jsx';
import './index.css';


const app = (
  <Router basename="/">
    <Routes>
      <Route path="/*" element={<AppClipApp />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById('root')).render(app);

