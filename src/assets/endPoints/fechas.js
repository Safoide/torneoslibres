import { apiGET, apiPOST, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/fechas';

// Fechas de un torneo (publico)
const getFechasByTorneo = (torId) => apiGET(API_BASEURL + '/torneo/' + torId);

// "Tu proxima fecha" del capitan
const getMisFechas = () => apiGET(API_BASEURL + '/mias');

// body: { torId, dia: '2026-11-07', inicio: '16:00', fin: '20:00', canchas: 2 }
const crearFecha = (body) => apiPOST(API_BASEURL + '/', body);

const cancelarFecha = (fechaId) => apiDELETE(API_BASEURL + '/' + fechaId);

export { getFechasByTorneo, getMisFechas, crearFecha, cancelarFecha };
