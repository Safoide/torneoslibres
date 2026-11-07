import { apiPOST } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

// Formulario de contacto. body: { nombre, email, motivo, mensaje, sitioWeb } → { ok } | { error }
// (si hay sesión va el token, y la API suma la cuenta al mensaje)
const enviarContacto = (body) => apiPOST(API_URL + '/contacto', body);

export { enviarContacto };
