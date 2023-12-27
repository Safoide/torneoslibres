import { apiGET, apiPOST, apiPUT, apiDELETE } from '../fetchMethods.js';

const API_BASEURL = 'http://localhost:4000/equipos';

// GET

const getEquipos = () => apiGET(API_BASEURL + '/');

const getEquipoById = (teamId) => apiGET(API_BASEURL + '/equipo/' + teamId);

const getEquiposByTournament = (torId) => apiGET(API_BASEURL + '/torneo/' + torId);


// POST

const addTeam = (newTeam) => apiPOST(API_BASEURL + '/', newTeam);


// PUT

const editTeam = (teamId, modifiedTeam) => apiPUT(API_BASEURL + '/' + teamId, modifiedTeam);


// DELETE

const deleteTeam = (teamId) => apiDELETE(API_BASEURL + '/' + teamId);


export { getEquipos, getEquiposByTournament, getEquipoById, addTeam, editTeam, deleteTeam };