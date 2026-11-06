import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/organizadores';

const getOrganizadores = () => apiGET(API_BASEURL + '/');
const getOrganizadorById = (orgId) => apiGET(API_BASEURL + '/' + orgId);
const getMiOrganizacion = () => apiGET(API_BASEURL + '/mia');
const crearOrganizador = (body) => apiPOST(API_BASEURL + '/', body);
const editarOrganizador = (orgId, body) => apiPUT(API_BASEURL + '/' + orgId, body);
const eliminarOrganizador = (orgId) => apiDELETE(API_BASEURL + '/' + orgId);

export { getOrganizadores, getOrganizadorById, getMiOrganizacion, crearOrganizador, editarOrganizador, eliminarOrganizador };
// Panel de mi organizacion: estadisticas, plata y torneos
export const getMiDashboard = () => apiGET(API_BASEURL + '/mia/dashboard');
