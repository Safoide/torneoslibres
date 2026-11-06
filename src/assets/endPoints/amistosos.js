import { apiGET, apiPOST } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/amistosos';

// Amistosos express publicados (publico)
export const getAmistosos = () => apiGET(API_BASEURL + '/');

// Uno solo: es el link que comparte el capitan
export const getAmistoso = (id) => apiGET(API_BASEURL + '/' + id);

// Los que tomo mi equipo (capitan)
export const getMisAmistosos = () => apiGET(API_BASEURL + '/mios');

// body: { metodo: 'tarjeta' | 'mercadopago', simular?: 'rechazado' }
export const tomarAmistoso = (id, body) => apiPOST(API_BASEURL + '/' + id + '/tomar', body);
