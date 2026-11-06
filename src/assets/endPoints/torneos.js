import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';
import { API_URL } from '../torneosUtils.js';

const API_BASEURL = API_URL + '/torneos';

// GET

// filters: { q, modalidad: ['f5','f7'], zona: ['Palermo'], categoria, estado, precioMax, desde, hasta, orden }
const getTorneos = (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length) params.set(key, value.join(','));
        } else if (value !== undefined && value !== null && value !== '') {
            params.set(key, value);
        }
    });

    const query = params.toString();

    return apiGET(API_BASEURL + '/' + (query ? '?' + query : ''));
};

const getFiltros = () => apiGET(API_BASEURL + '/filtros');

const getTorneoById = (torId) => apiGET(API_BASEURL + '/' + torId);


// POST

const addTor = (newTor) => apiPOST(API_BASEURL + '/', newTor);


// PUT

const editTor = (torId, modifiedTor) => apiPUT(API_BASEURL + '/' + torId, modifiedTor);

// estado: 'inscripcion-abierta' | 'proximamente' | 'inscripcion-cerrada' | 'finalizado' (en curso es automático)
const cambiarEstado = (torId, estado) => apiPUT(API_BASEURL + '/' + torId + '/estado', { estado });


// DELETE

const deleteTor = (torId) => apiDELETE(API_BASEURL + '/' + torId);


export { getTorneos, getFiltros, getTorneoById, addTor, editTor, cambiarEstado, deleteTor };
