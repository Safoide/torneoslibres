import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { aplicarAjustes } from './ajustes';

aplicarAjustes(); // tema, tamaño de texto y animaciones guardados en este navegador

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
