import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = (process.env.REACT_APP_API_URL || 'http://localhost:4000') + '/torneos';

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


// DELETE

const deleteTor = (torId) => apiDELETE(API_BASEURL + '/' + torId);


export { getTorneos, getFiltros, getTorneoById, addTor, editTor, deleteTor };
