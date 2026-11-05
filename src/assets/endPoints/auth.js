import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/auth';

const login = (body) => apiPOST(API_BASEURL + '/login', body);
const registro = (body) => apiPOST(API_BASEURL + '/register', body);
const getMe = () => apiGET(API_BASEURL + '/me');

const editarMisDatos = (body) => apiPUT(API_BASEURL + '/me', body);
const cambiarPassword = (body) => apiPUT(API_BASEURL + '/password', body);

const cerrarTodasLasSesiones = () => apiPOST(API_BASEURL + '/logout-all', {});
const eliminarCuenta = (password) => apiDELETE(API_BASEURL + '/me', { password });

export { login, registro, getMe, editarMisDatos, cambiarPassword, cerrarTodasLasSesiones, eliminarCuenta };
