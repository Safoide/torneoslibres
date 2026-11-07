import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/auth';

const login = (body) => apiPOST(API_BASEURL + '/login', body);
const registro = (body) => apiPOST(API_BASEURL + '/register', body);
const getMe = () => apiGET(API_BASEURL + '/me');

// Entrar o registrarse con Google. body: { credential, rol? }
// Si la cuenta no existe y no va rol, responde { necesitaRol, email, nombre } (hay que preguntar el tipo de cuenta)
const loginGoogle = (body) => apiPOST(API_BASEURL + '/google', body);

// Recuperar contraseña: pedir el link por mail (responde { ok } exista o no la cuenta),
// revisar el link ({ ok, email, tienePassword } | { error }) y poner la nueva ({ user, token }: deja la sesión iniciada)
const olvidePassword = (email) => apiPOST(API_BASEURL + '/olvide', { email });
const revisarLink = (token) => apiPOST(API_BASEURL + '/restablecer/revisar', { token });
const restablecerPassword = (token, nueva) => apiPOST(API_BASEURL + '/restablecer', { token, nueva });

// Notificaciones por email: { avisos: [{ id, titulo, texto, activa }], novedades: { ..., activa } }
// Guardar: { avisos: { id: bool }, novedades: bool }; responde las preferencias como quedaron
const getNotificaciones = () => apiGET(API_BASEURL + '/notificaciones');
const guardarNotificaciones = (body) => apiPUT(API_BASEURL + '/notificaciones', body);

// Verificar el email: reenviar el link (con sesión; { ok, email } | { yaVerificado }) y usarlo (desde el mail: { ok, email } | { error })
const enviarVerificacion = () => apiPOST(API_BASEURL + '/verificar/enviar', {});
const verificarEmail = (token) => apiPOST(API_BASEURL + '/verificar', { token });

// Darse de baja de un aviso desde el link del mail (sin sesión). datos: { u, a, f } (los parámetros del link)
const revisarBaja = (datos) => apiPOST(API_BASEURL + '/baja/revisar', datos);
const confirmarBaja = (datos) => apiPOST(API_BASEURL + '/baja', datos);

// Aceptar los términos y la privacidad vigentes (cuentas con `terminosPendientes`). Responde la cuenta actualizada
const aceptarTerminos = (version) => apiPOST(API_BASEURL + '/terminos', { version });

const editarMisDatos = (body) => apiPUT(API_BASEURL + '/me', body);
// Sin `actual` crea la contraseña (solo cuentas de Google que todavía no tienen)
const cambiarPassword = (body) => apiPUT(API_BASEURL + '/password', body);

const cerrarTodasLasSesiones = () => apiPOST(API_BASEURL + '/logout-all', {});
// Cuenta sin contraseña: verifica que la cuenta de Google elegida sea la vinculada (antes de eliminar). { ok, email } | { error }
const confirmarGoogle = (credential) => apiPOST(API_BASEURL + '/confirmar-google', { credential });
// confirmacion: { password } o, si la cuenta entra solo con Google, { credential }
const eliminarCuenta = (confirmacion) => apiDELETE(API_BASEURL + '/me', confirmacion);

export { login, registro, getMe, loginGoogle, olvidePassword, revisarLink, restablecerPassword, getNotificaciones, guardarNotificaciones, revisarBaja, confirmarBaja, enviarVerificacion, verificarEmail, aceptarTerminos, editarMisDatos, cambiarPassword, cerrarTodasLasSesiones, confirmarGoogle, eliminarCuenta };
