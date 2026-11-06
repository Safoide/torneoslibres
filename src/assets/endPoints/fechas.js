import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
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

// El capitan paga la parte de su equipo. body: { metodo: 'tarjeta' | 'mercadopago', simular?: 'rechazado' }
export const pagarFecha = (fechaId, body) => apiPOST(API_BASEURL + '/' + fechaId + '/pagar', body);

// Quien pago cada fecha de un torneo (solo el organizador dueño): { [fechaId]: [{ equipoId, equipo, estado, monto }] }
export const getPagosTorneo = (torId) => apiGET(API_BASEURL + '/torneo/' + torId + '/pagos');

// Cargar o corregir resultados de una fecha terminada (organizador dueño). resultados: [{ id, home_goals, away_goals }]
export const cargarResultados = (fechaId, resultados) => apiPUT(API_BASEURL + '/' + fechaId + '/resultados', { resultados });
