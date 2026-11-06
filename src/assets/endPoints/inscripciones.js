import { apiPOST } from '../fetchMethods.js';

import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/inscripciones';

const crearInscripcion = (body) => apiPOST(API_BASEURL + '/', body);
const pagarInscripcion = (id, body) => apiPOST(`${API_BASEURL}/${id}/pagar`, body);

export { crearInscripcion, pagarInscripcion };
