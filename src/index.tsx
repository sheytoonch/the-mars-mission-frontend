import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { AppProps } from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const backendUrl: AppProps['backendUrl'] = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';

root.render(
  <React.StrictMode>
    <App backendUrl={backendUrl} />
  </React.StrictMode>
);
