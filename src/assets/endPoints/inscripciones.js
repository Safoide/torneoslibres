import { apiPOST } from '../fetchMethods.js';

const API_BASEURL = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/inscripciones';

const crearInscripcion = (body) => apiPOST(API_BASEURL + '/', body);
const pagarInscripcion = (id, body) => apiPOST(`${API_BASEURL}/${id}/pagar`, body);

export { crearInscripcion, pagarInscripcion };
