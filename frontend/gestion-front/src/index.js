import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Crea el root usando la API de React 18
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

