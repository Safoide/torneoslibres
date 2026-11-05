import { apiGET, apiPOST, apiPUT, apiDELETE, apiUpload } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/clubes';

const getMiEquipo = () => apiGET(API_BASEURL + '/mio');
const crearEquipo = (body) => apiPOST(API_BASEURL + '/', body);
const editarEquipo = (clubId, body) => apiPUT(API_BASEURL + '/' + clubId, body);
const eliminarEquipo = (clubId) => apiDELETE(API_BASEURL + '/' + clubId);
const subirLogo = (archivo) => apiUpload(API_URL + '/uploads/logo', 'logo', archivo);

export { getMiEquipo, crearEquipo, editarEquipo, eliminarEquipo, subirLogo };