import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './app';

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
