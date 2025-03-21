import ReactDOM from 'react-dom/client';

import { App } from './app';
import './style.css';

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(<App />);
