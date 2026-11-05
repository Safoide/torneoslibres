import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/organizadores';

const getOrganizadores = () => apiGET(API_BASEURL + '/');
const getOrganizadorById = (orgId) => apiGET(API_BASEURL + '/' + orgId);
const getMiOrganizacion = () => apiGET(API_BASEURL + '/mia');
const crearOrganizador = (body) => apiPOST(API_BASEURL + '/', body);
const editarOrganizador = (orgId, body) => apiPUT(API_BASEURL + '/' + orgId, body);
const eliminarOrganizador = (orgId) => apiDELETE(API_BASEURL + '/' + orgId);

export { getOrganizadores, getOrganizadorById, getMiOrganizacion, crearOrganizador, editarOrganizador, eliminarOrganizador };