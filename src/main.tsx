import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {SiteContentProvider} from './context/SiteContentContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <SiteContentProvider>
    <App />
  </SiteContentProvider>
);
