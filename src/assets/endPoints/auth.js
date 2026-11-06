import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/auth';

const login = (body) => apiPOST(API_BASEURL + '/login', body);
const registro = (body) => apiPOST(API_BASEURL + '/register', body);
const getMe = () => apiGET(API_BASEURL + '/me');

// Entrar o registrarse con Google. body: { credential, rol? }
// Si la cuenta no existe y no va rol, responde { necesitaRol, email, nombre } (hay que preguntar el tipo de cuenta)
const loginGoogle = (body) => apiPOST(API_BASEURL + '/google', body);

const editarMisDatos = (body) => apiPUT(API_BASEURL + '/me', body);
// Sin `actual` crea la contraseña (solo cuentas de Google que todavía no tienen)
const cambiarPassword = (body) => apiPUT(API_BASEURL + '/password', body);

const cerrarTodasLasSesiones = () => apiPOST(API_BASEURL + '/logout-all', {});
// confirmacion: { password } o, si la cuenta entra solo con Google, { credential }
const eliminarCuenta = (confirmacion) => apiDELETE(API_BASEURL + '/me', confirmacion);

export { login, registro, getMe, loginGoogle, editarMisDatos, cambiarPassword, cerrarTodasLasSesiones, eliminarCuenta };
