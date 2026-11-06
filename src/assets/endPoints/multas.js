import { apiGET, apiPOST } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/multas';

// Multas pendientes de mi equipo (capitan): { total, multas: [...] }
export const getMisMultas = () => apiGET(API_BASEURL + '/mias');

// Paga todas las pendientes de una vez. body: { metodo, simular? }
export const pagarMultas = (body) => apiPOST(API_BASEURL + '/pagar', body);
