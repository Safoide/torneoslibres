import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Después de App (y de todos los CSS de los componentes) para que sus transiciones no queden pisadas
import './assets/styles/animaciones.css';
import { aplicarAjustes } from './ajustes';

aplicarAjustes(); // tema, tamaño de texto y animaciones guardados en este navegador

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
