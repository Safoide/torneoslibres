import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = 'http://localhost:4000/torneos';

// GET

const getTorneos = () => apiGET(API_BASEURL + '/');

const getTorneoById = (torId) => apiGET(API_BASEURL + '/torneo/' + torId);


// POST

const addTor = (newTor) => apiPOST(API_BASEURL + '/', newTor);


// PUT

const editTor = (torId, modifiedTor) => apiPUT(API_BASEURL + '/' + torId, modifiedTor);


// DELETE

const deleteTor = (torId) => apiDELETE(API_BASEURL + '/' + torId);


export { getTorneos, getTorneoById, addTor, editTor, deleteTor };